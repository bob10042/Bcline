#!/usr/bin/env python3
"""
OpenRouter Sherlock Model Diff/Edit Testing Agent

Tests the sherlock-think-alpha model's ability to handle file editing
operations to identify if diff/truncation issues are model-specific.

Usage:
    python test_sherlock_diff_agent.py --api-key YOUR_KEY
"""

import os
import sys
import json
import time
import argparse
import requests
from datetime import datetime
from typing import Dict, List, Optional, Tuple


class SherlockDiffTester:
    """Tests OpenRouter Sherlock model for diff/edit reliability."""

    def __init__(self, api_key: str, model: str = "openrouter/sherlock-think-alpha"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.test_file = "sherlock_test_file.cpp"
        self.results = []

    def call_model(self, prompt: str, max_tokens: int = 4000) -> Optional[str]:
        """Call OpenRouter API with Sherlock model."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/anthropics/claude-code",
            "X-Title": "Sherlock Diff Test"
        }

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": max_tokens,
            "temperature": 0.7
        }

        try:
            print(f"  -> Calling {self.model}...")
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=120)
            response.raise_for_status()

            data = response.json()
            content = data['choices'][0]['message']['content']

            # Track token usage
            usage = data.get('usage', {})
            print(f"  [OK] Response received (tokens: {usage.get('total_tokens', 'unknown')})")

            return content

        except requests.exceptions.RequestException as e:
            print(f"  [ERROR] API Error: {e}")
            return None
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            print(f"  [ERROR] Parse Error: {e}")
            return None

    def extract_code_block(self, response: str, language: str = "cpp") -> Optional[str]:
        """Extract code from markdown code blocks."""
        marker = f"```{language}"
        if marker in response:
            parts = response.split(marker)
            if len(parts) >= 2:
                code = parts[1].split("```")[0].strip()
                return code

        # Try generic code block
        if "```" in response:
            parts = response.split("```")
            if len(parts) >= 2:
                code = parts[1].strip()
                # Remove language identifier if present
                lines = code.split('\n')
                if lines and lines[0].strip().lower() in ['cpp', 'c++', 'c']:
                    code = '\n'.join(lines[1:])
                return code

        return None

    def test_1_create_initial_file(self) -> bool:
        """Test 1: Create initial C++ file."""
        print("\n" + "="*60)
        print("TEST 1: Create Initial C++ File")
        print("="*60)

        prompt = """Create a simple C++ program (about 50 lines) with:
1. A fibonacci function (iterative)
2. A prime checker function
3. A main() that tests both functions

Return ONLY the C++ code in a ```cpp code block, no explanations."""

        response = self.call_model(prompt, max_tokens=2000)
        if not response:
            self.results.append(("Test 1", "FAIL", "No response from API"))
            return False

        code = self.extract_code_block(response)
        if not code:
            self.results.append(("Test 1", "FAIL", "Could not extract code block"))
            return False

        # Write to file
        try:
            with open(self.test_file, 'w', encoding='utf-8') as f:
                f.write(code)

            initial_lines = len(code.split('\n'))
            print(f"  [OK] File created: {initial_lines} lines")
            self.results.append(("Test 1", "PASS", f"{initial_lines} lines created"))
            return True

        except Exception as e:
            self.results.append(("Test 1", "FAIL", f"Write error: {e}"))
            return False

    def test_2_add_function(self) -> bool:
        """Test 2: Add a new function to existing file."""
        print("\n" + "="*60)
        print("TEST 2: Add New Function")
        print("="*60)

        if not os.path.exists(self.test_file):
            self.results.append(("Test 2", "SKIP", "Test file doesn't exist"))
            return False

        with open(self.test_file, 'r', encoding='utf-8') as f:
            original_content = f.read()
        original_lines = len(original_content.split('\n'))

        prompt = f"""Here is the current C++ file content:

```cpp
{original_content}
```

Add a new function called `factorial(int n)` that calculates factorial recursively.
Add it BEFORE the main() function.

Return the COMPLETE modified file with the new function added.
Return ONLY the C++ code in a ```cpp code block."""

        response = self.call_model(prompt, max_tokens=3000)
        if not response:
            self.results.append(("Test 2", "FAIL", "No response from API"))
            return False

        code = self.extract_code_block(response)
        if not code:
            self.results.append(("Test 2", "FAIL", "Could not extract code"))
            return False

        new_lines = len(code.split('\n'))

        # Check for truncation
        if new_lines < original_lines:
            self.results.append(("Test 2", "FAIL", f"TRUNCATION: {original_lines} -> {new_lines} lines"))
            print(f"  [FAIL] TRUNCATION DETECTED: {original_lines} -> {new_lines} lines")
            return False

        # Write updated file
        with open(self.test_file, 'w', encoding='utf-8') as f:
            f.write(code)

        print(f"  [OK] Function added: {original_lines} -> {new_lines} lines")
        self.results.append(("Test 2", "PASS", f"Lines: {original_lines} -> {new_lines}"))
        return True

    def test_3_modify_existing_function(self) -> bool:
        """Test 3: Modify an existing function."""
        print("\n" + "="*60)
        print("TEST 3: Modify Existing Function")
        print("="*60)

        if not os.path.exists(self.test_file):
            self.results.append(("Test 3", "SKIP", "Test file doesn't exist"))
            return False

        with open(self.test_file, 'r', encoding='utf-8') as f:
            original_content = f.read()
        original_lines = len(original_content.split('\n'))

        prompt = f"""Here is the current C++ file:

```cpp
{original_content}
```

Modify the fibonacci function to add a comment at the top explaining what it does.
Add a 3-line comment block: /* ... */

Return the COMPLETE modified file.
Return ONLY the C++ code in a ```cpp code block."""

        response = self.call_model(prompt, max_tokens=3000)
        if not response:
            self.results.append(("Test 3", "FAIL", "No response"))
            return False

        code = self.extract_code_block(response)
        if not code:
            self.results.append(("Test 3", "FAIL", "Could not extract code"))
            return False

        new_lines = len(code.split('\n'))

        # Check for truncation
        if new_lines < original_lines - 5:  # Allow small variance
            self.results.append(("Test 3", "FAIL", f"TRUNCATION: {original_lines} -> {new_lines}"))
            print(f"  [FAIL] TRUNCATION: {original_lines} -> {new_lines} lines")
            return False

        with open(self.test_file, 'w', encoding='utf-8') as f:
            f.write(code)

        print(f"  [OK] Modified: {original_lines} -> {new_lines} lines")
        self.results.append(("Test 3", "PASS", f"Lines: {original_lines} -> {new_lines}"))
        return True

    def test_4_single_line_edit(self) -> bool:
        """Test 4: Precise single-line edit."""
        print("\n" + "="*60)
        print("TEST 4: Single Line Precision Edit")
        print("="*60)

        if not os.path.exists(self.test_file):
            self.results.append(("Test 4", "SKIP", "Test file doesn't exist"))
            return False

        with open(self.test_file, 'r', encoding='utf-8') as f:
            original_content = f.read()
        original_lines = len(original_content.split('\n'))

        prompt = f"""Here is the current C++ file:

```cpp
{original_content}
```

Change ONLY the main() function's first line to print "Testing Sherlock model" instead of whatever it currently prints.
Change ONLY that one line. Everything else stays the same.

Return the COMPLETE file with only that one line changed.
Return ONLY the C++ code in a ```cpp code block."""

        response = self.call_model(prompt, max_tokens=3000)
        if not response:
            self.results.append(("Test 4", "FAIL", "No response"))
            return False

        code = self.extract_code_block(response)
        if not code:
            self.results.append(("Test 4", "FAIL", "Could not extract code"))
            return False

        new_lines = len(code.split('\n'))

        # Line count should be nearly identical
        if abs(new_lines - original_lines) > 3:
            self.results.append(("Test 4", "FAIL", f"Line count mismatch: {original_lines} -> {new_lines}"))
            print(f"  [FAIL] Line count changed significantly: {original_lines} -> {new_lines}")
            return False

        with open(self.test_file, 'w', encoding='utf-8') as f:
            f.write(code)

        print(f"  [OK] Single line edit successful: {original_lines} -> {new_lines} lines")
        self.results.append(("Test 4", "PASS", f"Lines stable: {original_lines} -> {new_lines}"))
        return True

    def test_5_multiple_small_edits(self) -> bool:
        """Test 5: Multiple small edits across file."""
        print("\n" + "="*60)
        print("TEST 5: Multiple Small Edits")
        print("="*60)

        if not os.path.exists(self.test_file):
            self.results.append(("Test 5", "SKIP", "Test file doesn't exist"))
            return False

        with open(self.test_file, 'r', encoding='utf-8') as f:
            original_content = f.read()
        original_lines = len(original_content.split('\n'))

        prompt = f"""Here is the current C++ file:

```cpp
{original_content}
```

Add a single-line comment above EACH function definition explaining what it does.
For example: // Calculates fibonacci number

Do this for ALL functions in the file.

Return the COMPLETE modified file.
Return ONLY the C++ code in a ```cpp code block."""

        response = self.call_model(prompt, max_tokens=3500)
        if not response:
            self.results.append(("Test 5", "FAIL", "No response"))
            return False

        code = self.extract_code_block(response)
        if not code:
            self.results.append(("Test 5", "FAIL", "Could not extract code"))
            return False

        new_lines = len(code.split('\n'))

        # Should add a few lines
        if new_lines < original_lines:
            self.results.append(("Test 5", "FAIL", f"TRUNCATION: {original_lines} -> {new_lines}"))
            print(f"  [FAIL] TRUNCATION: {original_lines} -> {new_lines} lines")
            return False

        with open(self.test_file, 'w', encoding='utf-8') as f:
            f.write(code)

        added = new_lines - original_lines
        print(f"  [OK] Comments added: {original_lines} -> {new_lines} (+{added})")
        self.results.append(("Test 5", "PASS", f"+{added} lines of comments"))
        return True

    def generate_report(self) -> str:
        """Generate final test report."""
        report = []
        report.append("\n" + "="*60)
        report.append("SHERLOCK MODEL DIFF/EDIT TEST REPORT")
        report.append("="*60)
        report.append(f"Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Model: {self.model}")
        report.append("")

        passed = sum(1 for _, status, _ in self.results if status == "PASS")
        failed = sum(1 for _, status, _ in self.results if status == "FAIL")
        skipped = sum(1 for _, status, _ in self.results if status == "SKIP")
        total = len(self.results)

        report.append("TEST RESULTS:")
        report.append("-" * 60)

        for test_name, status, details in self.results:
            icon = "[OK]" if status == "PASS" else "[FAIL]" if status == "FAIL" else "[SKIP]"
            report.append(f"{icon} {test_name}: {status} - {details}")

        report.append("")
        report.append("-" * 60)
        report.append(f"Total Tests: {total}")
        report.append(f"Passed: {passed}")
        report.append(f"Failed: {failed}")
        report.append(f"Skipped: {skipped}")
        report.append(f"Success Rate: {(passed/total*100) if total > 0 else 0:.1f}%")
        report.append("")

        # Truncation analysis
        truncation_events = [r for r in self.results if "TRUNCATION" in r[2]]
        report.append("TRUNCATION ANALYSIS:")
        report.append("-" * 60)
        if truncation_events:
            report.append(f"[WARNING] TRUNCATION DETECTED: {len(truncation_events)} event(s)")
            for test_name, _, details in truncation_events:
                report.append(f"  - {test_name}: {details}")
        else:
            report.append("[OK] No truncation events detected")

        report.append("")
        report.append("VERDICT:")
        report.append("-" * 60)
        if failed == 0 and passed > 0:
            report.append("[PASS] Sherlock model handles diff/edits reliably")
        elif truncation_events:
            report.append("[FAIL] Truncation issues detected with Sherlock model")
            report.append("  This indicates the issue is MODEL-SPECIFIC")
        else:
            report.append("[INCONCLUSIVE] Tests did not complete successfully")

        report.append("")
        report.append("COMPARISON TO CLAUDE:")
        report.append("-" * 60)
        report.append("Claude Sonnet 4.5 achieved 100% success rate (11/11 tests)")
        report.append(f"Sherlock achieved {(passed/total*100) if total > 0 else 0:.1f}% success rate ({passed}/{total} tests)")

        if truncation_events and not failed:
            report.append("\nCONCLUSION: Issue appears to be with Cline integration,")
            report.append("not the Sherlock model itself.")
        elif truncation_events:
            report.append("\nCONCLUSION: Sherlock model has diff/truncation issues.")
            report.append("Recommendation: Use Claude or other models for file editing.")

        report.append("\n" + "="*60)

        return "\n".join(report)

    def run_all_tests(self):
        """Run complete test suite."""
        print("\n" + "="*60)
        print("SHERLOCK MODEL DIFF/EDIT TEST SUITE")
        print("="*60)
        print(f"Model: {self.model}")
        print(f"Test file: {self.test_file}")
        print("")

        # Clean start
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

        # Run tests in sequence
        tests = [
            self.test_1_create_initial_file,
            self.test_2_add_function,
            self.test_3_modify_existing_function,
            self.test_4_single_line_edit,
            self.test_5_multiple_small_edits
        ]

        for test_func in tests:
            try:
                test_func()
                time.sleep(1)  # Rate limiting
            except Exception as e:
                test_name = test_func.__name__.replace('_', ' ').title()
                self.results.append((test_name, "FAIL", f"Exception: {e}"))
                print(f"  [ERROR] Exception in {test_name}: {e}")

        # Generate and save report
        report = self.generate_report()
        print(report)

        report_file = f"sherlock_diff_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)

        print(f"\n[OK] Report saved to: {report_file}")

        return report


def main():
    parser = argparse.ArgumentParser(description="Test Sherlock model diff/edit capabilities")
    parser.add_argument("--api-key", required=True, help="OpenRouter API key")
    parser.add_argument("--model", default="openrouter/sherlock-think-alpha",
                       help="Model to test (default: sherlock-think-alpha)")

    args = parser.parse_args()

    print("="*60)
    print("SHERLOCK MODEL DIFF/EDIT TESTER")
    print("="*60)
    print(f"API Key: {args.api_key[:20]}...")
    print(f"Model: {args.model}")
    print("")

    tester = SherlockDiffTester(args.api_key, args.model)
    tester.run_all_tests()


if __name__ == "__main__":
    main()
