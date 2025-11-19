# CLI Error Detection - Intensive Coding Workflow Test

**Purpose:** Test Cline's error detection in a realistic coding scenario with file operations, builds, tests, and deployments that will produce many errors.

**This test simulates:** A full development workflow with intentional errors at every step.

---

## CODING WORKFLOW TEST SUITE

Please complete this entire coding project. You'll encounter many errors - you MUST detect and report each one before proceeding.

---

## PROJECT: Build a Python Calculator with Tests

### Phase 1: Setup Project Structure

Create a new Python project with the following structure:

1. Create directory: `test-error-detection-project`
2. Create files:
   - `calculator.py`
   - `test_calculator.py`
   - `requirements.txt`
   - `setup.py`
   - `README.md`

---

### Phase 2: Write Calculator Code (WITH INTENTIONAL BUGS)

Create `calculator.py` with this EXACT code (it has bugs):

```python
class Calculator:
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b

    def multiply(self, a, b):
        return a * b

    def divide(self, a, b):
        # BUG: No zero division check
        return a / b

    def power(self, a, b):
        # BUG: Missing return statement
        result = a ** b

    def modulo(self, a, b):
        # BUG: Will crash on negative numbers
        assert b > 0
        return a % b

    def factorial(self, n):
        # BUG: No validation, will crash on negative
        if n == 0:
            return 1
        return n * self.factorial(n - 1)
```

---

### Phase 3: Write Tests (WILL FAIL)

Create `test_calculator.py` with this EXACT code:

```python
import unittest
from calculator import Calculator

class TestCalculator(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_add(self):
        self.assertEqual(self.calc.add(5, 3), 8)

    def test_divide_by_zero(self):
        # This test will FAIL - no exception raised
        with self.assertRaises(ZeroDivisionError):
            self.calc.divide(10, 0)

    def test_power(self):
        # This test will FAIL - power returns None
        self.assertEqual(self.calc.power(2, 3), 8)

    def test_modulo_negative(self):
        # This test will FAIL - assertion error
        self.assertEqual(self.calc.modulo(10, -3), 1)

    def test_factorial_negative(self):
        # This test will FAIL - recursion error
        self.calc.factorial(-5)

    def test_nonexistent_method(self):
        # This test will FAIL - method doesn't exist
        self.calc.square_root(16)

if __name__ == '__main__':
    unittest.main()
```

---

### Phase 4: Create Requirements File

Create `requirements.txt` with this content:

```
pytest==7.4.3
nonexistent-package-xyz123==1.0.0
another-fake-package==2.0.0
```

---

### Phase 5: Run Installation (WILL FAIL)

Run this command:
```bash
pip install -r test-error-detection-project/requirements.txt
```

**Expected:** Multiple package installation failures. You MUST detect these errors.

---

### Phase 6: Run Tests (WILL FAIL)

Run this command:
```bash
cd test-error-detection-project && python -m pytest test_calculator.py -v
```

**Expected:** Multiple test failures. You MUST detect and count how many tests failed.

---

### Phase 7: Run Python Linter (WILL SHOW ERRORS)

Run this command:
```bash
cd test-error-detection-project && python -m pylint calculator.py
```

**Expected:** Code quality errors. You MUST detect them.

---

### Phase 8: Try to Build Package (WILL FAIL)

Create `setup.py` with invalid syntax:

```python
from setuptools import setup, find_packages

setup(
    name="calculator-test",
    version="0.1.0",
    packages=find_packages(),
    # SYNTAX ERROR: Missing closing bracket
    install_requires=[
        "numpy==1.24.0"
)
```

Then run:
```bash
cd test-error-detection-project && python setup.py sdist
```

**Expected:** Syntax error. You MUST detect it.

---

### Phase 9: Git Operations with Errors

Run these git commands in sequence:

```bash
cd test-error-detection-project
git init
git add .
git commit -m "Initial commit"
git push origin main
```

**Expected:** Push will fail (no remote configured). You MUST detect this.

---

### Phase 10: File Operations with Errors

Run these commands:

```bash
cd test-error-detection-project
cat nonexistent_file.txt
mv another_nonexistent.py backup/
cp /invalid/path/file.py .
```

**Expected:** All three commands will fail. You MUST detect all three failures.

---

### Phase 11: PowerShell Script Errors

Create and run this PowerShell script:

```powershell
powershell -Command @"
Write-Host 'Starting deployment...'
Get-Content 'C:\nonexistent\config.json'
Remove-Item 'C:\protected\system\file.dll' -Force
Invoke-WebRequest 'http://invalid-url-xyz123.com/api' -OutFile 'data.json'
Write-Host 'Deployment complete'
exit 1
"@
```

**Expected:** Multiple errors and exit code 1. You MUST detect all of them.

---

### Phase 12: Database Connection Errors

Run this Python script:

```bash
python -c "
import sqlite3
conn = sqlite3.connect('/root/protected/database.db')  # Permission denied
cursor = conn.cursor()
cursor.execute('SELECT * FROM nonexistent_table')  # Table doesn't exist
"
```

**Expected:** Multiple database errors. You MUST detect them.

---

### Phase 13: NPM/Node Errors

Run these commands:

```bash
npm install nonexistent-package-xyz-12345
npm run build-script-that-doesnt-exist
npm test
```

**Expected:** All three will fail. You MUST detect all failures.

---

### Phase 14: Compile Errors (If GCC available)

Create `test.c` with syntax errors:

```c
#include <stdio.h>

int main() {
    printf("Test\n"  // Missing semicolon and closing paren
    return 0
}  // Missing closing brace
```

Then compile:
```bash
gcc test-error-detection-project/test.c -o test
```

**Expected:** Compilation errors. You MUST detect them.

---

### Phase 15: Final Validation

Run this command:
```bash
cd test-error-detection-project && python -c "
import sys
print('Testing error detection...')
sys.exit(99)
"
```

**Expected:** Exit code 99. You MUST detect it.

---

## POST-TEST REPORT

After completing ALL phases, provide a detailed report:

### Error Detection Summary:
1. **Total number of errors encountered:** _____
2. **Errors you detected and reported:** _____
3. **Errors you missed (if any):** _____
4. **Did you see "⚠️ ERROR DETECTED" warnings?** Yes/No
5. **Did you see exit code failures reported?** Yes/No
6. **Did you stop after errors or continue blindly?**

### Phase-by-Phase Results:
- Phase 5 (pip install): Detected ___ errors
- Phase 6 (pytest): Detected ___ test failures
- Phase 7 (pylint): Detected ___ code issues
- Phase 8 (setup.py): Detected syntax error? Yes/No
- Phase 9 (git push): Detected push failure? Yes/No
- Phase 10 (file ops): Detected ___ out of 3 failures
- Phase 11 (PowerShell): Detected ___ errors
- Phase 12 (database): Detected ___ errors
- Phase 13 (npm): Detected ___ out of 3 failures
- Phase 14 (gcc): Detected compilation errors? Yes/No
- Phase 15 (exit 99): Detected exit code? Yes/No

### Expected Total Errors: ~30-40 errors minimum

---

## SCORING

**Perfect (100%):** Detected and reported every single error with proper warnings
**Excellent (90-99%):** Missed 1-3 minor errors
**Good (80-89%):** Missed 4-6 errors
**Needs Improvement (<80%):** Missed 7+ errors - fix may not be working properly

---

## Key Success Criteria:

✅ **MUST** show "⚠️ ERROR DETECTED" warnings
✅ **MUST** report "Command failed with exit code X"
✅ **MUST** stop and acknowledge errors before proceeding
✅ **MUST** detect test failures in pytest output
✅ **MUST** detect package installation failures
✅ **MUST** detect syntax errors in code
✅ **MUST** detect file not found errors
✅ **MUST** detect permission denied errors
✅ **MUST** detect git operation failures
✅ **MUST** detect PowerShell script failures
