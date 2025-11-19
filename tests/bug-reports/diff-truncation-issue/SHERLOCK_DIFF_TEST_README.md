# Sherlock Model Diff/Edit Testing Agent

## Purpose

This agent tests the OpenRouter Sherlock model (`sherlock-think-alpha`) to determine if diff/truncation issues you experienced with Cline are:
1. **Model-specific** (Sherlock has truncation bugs)
2. **API-specific** (OpenRouter has issues)
3. **Integration-specific** (Cline's implementation has bugs)

## Comparison Baseline

**Claude Sonnet 4.5** achieved:
- ✅ 11/11 tests passed
- ✅ 0 truncation events
- ✅ 100% success rate
- ✅ File grew from 432 → 520 lines with perfect integrity

## Usage

### Quick Start

```bash
# Run the test
python test_sherlock_diff_agent.py --api-key YOUR_OPENROUTER_API_KEY
```

### With Custom Model

```bash
python test_sherlock_diff_agent.py --api-key YOUR_KEY --model "openrouter/sherlock-think-alpha"
```

## Tests Performed

### Test 1: Create Initial File ✓
- Creates a ~50 line C++ program
- Tests: Initial file generation capability
- Expected: Clean code output

### Test 2: Add New Function ✓
- Adds factorial() function to existing file
- Tests: File expansion without truncation
- **Critical**: Checks if line count increases properly

### Test 3: Modify Existing Function ✓
- Adds comment block to fibonacci function
- Tests: Mid-file modifications
- **Critical**: Checks for truncation after edits

### Test 4: Single Line Edit ✓
- Changes one line in main()
- Tests: Precision editing without corruption
- **Critical**: Line count should stay nearly identical

### Test 5: Multiple Small Edits ✓
- Adds comments to all functions
- Tests: Multiple distributed edits
- **Critical**: Most likely to trigger truncation bugs

## What the Tests Detect

### Truncation Detection
- Compares line counts before/after each edit
- Flags any reduction in file size
- Tracks exact line count deltas

### Success Criteria
- All 5 tests must pass
- Zero truncation events
- File must grow or stay stable (never shrink)

## Expected Outcomes

### Scenario 1: Sherlock Model Issue
```
Result: Multiple truncation events detected
Conclusion: Issue is MODEL-SPECIFIC
Recommendation: Avoid Sherlock for file editing, use Claude/GPT-4
```

### Scenario 2: OpenRouter API Issue
```
Result: API errors or timeouts
Conclusion: Issue is API-SPECIFIC
Recommendation: Check OpenRouter status, try different endpoint
```

### Scenario 3: Cline Integration Issue
```
Result: All tests pass with Sherlock
Conclusion: Issue is CLINE-SPECIFIC (integration bug)
Recommendation: Report to Cline developers
```

### Scenario 4: No Issues Found
```
Result: 5/5 tests pass, no truncation
Conclusion: Issue may be environment/context-specific
Recommendation: Test with larger files or specific scenarios
```

## Output Files

### Test File
- `sherlock_test_file.cpp` - The C++ file being edited during tests

### Report
- `sherlock_diff_test_report_YYYYMMDD_HHMMSS.md` - Detailed results

## Report Sections

1. **Test Results** - Pass/Fail for each test
2. **Truncation Analysis** - Lists all truncation events
3. **Verdict** - Overall assessment
4. **Comparison to Claude** - Side-by-side performance
5. **Conclusion** - Root cause analysis and recommendations

## Interpreting Results

### Green Flags (Good)
- ✓ All tests PASS
- ✓ No truncation events
- ✓ Line counts increase or stay stable
- ✓ Code compiles successfully

### Red Flags (Bad)
- ✗ Tests FAIL
- ✗ Truncation detected (line count decreases)
- ✗ Code blocks missing or incomplete
- ✗ API errors or timeouts

## Example Run

```bash
$ python test_sherlock_diff_agent.py --api-key sk-or-v1-abc123...

============================================================
SHERLOCK MODEL DIFF/EDIT TEST SUITE
============================================================
Model: openrouter/sherlock-think-alpha
Test file: sherlock_test_file.cpp

============================================================
TEST 1: Create Initial C++ File
============================================================
  → Calling openrouter/sherlock-think-alpha...
  ✓ Response received (tokens: 523)
  ✓ File created: 52 lines

============================================================
TEST 2: Add New Function
============================================================
  → Calling openrouter/sherlock-think-alpha...
  ✓ Response received (tokens: 612)
  ✓ Function added: 52 → 64 lines

[... continues for all tests ...]

============================================================
SHERLOCK MODEL DIFF/EDIT TEST REPORT
============================================================
Test Date: 2025-11-16 18:30:00
Model: openrouter/sherlock-think-alpha

TEST RESULTS:
------------------------------------------------------------
✓ Test 1: PASS - 52 lines created
✓ Test 2: PASS - Lines: 52 → 64
✓ Test 3: PASS - Lines: 64 → 67
✓ Test 4: PASS - Lines stable: 67 → 67
✓ Test 5: PASS - +4 lines of comments

------------------------------------------------------------
Total Tests: 5
Passed: 5
Failed: 0
Skipped: 0
Success Rate: 100.0%

TRUNCATION ANALYSIS:
------------------------------------------------------------
✓ No truncation events detected

VERDICT:
------------------------------------------------------------
✓ PASS - Sherlock model handles diff/edits reliably

COMPARISON TO CLAUDE:
------------------------------------------------------------
Claude Sonnet 4.5 achieved 100% success rate (11/11 tests)
Sherlock achieved 100.0% success rate (5/5 tests)

✓ Report saved to: sherlock_diff_test_report_20251116_183000.md
```

## Next Steps After Testing

### If Sherlock Passes All Tests
→ Issue is likely in Cline's diff/edit implementation
→ Consider filing bug report with Cline project
→ Include this test report as evidence

### If Sherlock Fails Tests
→ Issue is with Sherlock model or OpenRouter
→ Switch to different model (Claude, GPT-4, etc.)
→ Share results with OpenRouter support

### If Inconclusive
→ Run tests again with more iterations
→ Test with larger files (100+ lines)
→ Test specific scenarios that failed in Cline

## Dependencies

- Python 3.7+
- `requests` library: `pip install requests`

## Troubleshooting

### "API key invalid"
- Check your OpenRouter API key
- Ensure it has credits/balance
- Verify key format: `sk-or-v1-...`

### "Model not found"
- Check model name spelling
- Try: `openrouter/anthropic/claude-sonnet-4.5` as comparison
- List models: https://openrouter.ai/docs#models

### "Timeout errors"
- Increase timeout in code (line 43)
- Check network connection
- Try different time of day (less API load)

## Advanced Usage

### Test Multiple Models in Parallel

```bash
# Test Sherlock
python test_sherlock_diff_agent.py --api-key KEY --model "openrouter/sherlock-think-alpha"

# Compare with GPT-4
python test_sherlock_diff_agent.py --api-key KEY --model "openai/gpt-4-turbo"

# Compare with Claude
python test_sherlock_diff_agent.py --api-key KEY --model "anthropic/claude-sonnet-4.5"
```

### Modify Tests

Edit `test_sherlock_diff_agent.py`:
- Adjust file size (line 103)
- Add more test cases
- Increase prompt complexity
- Test specific edge cases you encountered

## Contact & Support

If you find bugs in this tester or need help interpreting results:
- Check the generated report file first
- Review test output for specific error messages
- Compare with Claude's baseline performance

---

**Created**: 2025-11-16
**Purpose**: Diagnose Cline diff/truncation issues
**Baseline**: Claude Sonnet 4.5 (100% success rate)
