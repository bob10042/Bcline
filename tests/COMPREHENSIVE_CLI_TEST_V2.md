# Comprehensive CLI Error Detection Test - Version 2.0

**Date**: 2025-11-17
**Purpose**: Enhanced robust testing of CLI improvements with validation, edge cases, and performance metrics
**Time**: 20-30 minutes
**Difficulty**: Advanced
**Status**: Ready for execution

---

## 📋 QUICK REFERENCE: Test Flow

| Phase | Steps | What Happens | Action Required |
|-------|-------|--------------|-----------------|
| **Phase 1** | 1-5 | Setup environment, create buggy code | ✅ Run commands |
| **Phase 2** | 6-7 | Create tests, run tests (4 failures) | ✅ Run commands |
| **Phase 3** | **8-9** | **AI BLOCKED** (validation checkpoint) | ✅ **RECORD & CONTINUE** |
| **Phase 3** | 10 | **Fix all 4 bugs** | ✅ Edit calculator.py |
| **Phase 3** | 11 | Verify tests pass (0 failures) | ✅ Run pytest |
| **Phase 3** | **12** | **AI ALLOWED** (validation checkpoint) | ✅ **RECORD & CONTINUE** |
| **Phase 3** | 13-14 | Edge case testing | ✅ Run commands |
| **Phase 4** | 15-18 | Feedback testing | ✅ Interactive testing |
| **Phase 5** | 19-22 | Stress testing | ✅ Run commands |

**🔥 KEY INSIGHT**: Steps 8, 9, and 12 are **validation checkpoints** - the AI's blocking/allowing behavior is being tested. **Don't stop the test** - just record the result and continue to the next step!

---

## 🎯 TEST OBJECTIVES

This comprehensive test addresses:
1. **Validation**: Verify all 5 CLI features work consistently
2. **Edge Cases**: Test complex error scenarios
3. **Performance**: Measure response times and accuracy
4. **Hesitation**: Detect and eliminate unnecessary retries
5. **Robustness**: Ensure features work under stress

### Issues from Previous Tests
- **Discrepancy**: One report showed 64% passing, another 100%
- **Hesitation**: "14/17 hesitate" and pytest cwd retries
- **Inconsistency**: Exit codes sometimes inferred vs explicitly shown
- **Blocking**: Step 8 completion not blocked in first test

---

## 📊 TEST STRUCTURE

### Phase 1: Basic Functionality (Steps 1-5)
- Project setup with validation
- Environment configuration
- Basic error detection

### Phase 2: Error Detection Deep Dive (Steps 6-10)
- Multiple error types (syntax, runtime, logical)
- Complex error patterns
- Nested error scenarios

### Phase 3: Validation & Blocking (Steps 11-14)
- Pre-completion validation rigorous testing
- Multiple blocking scenarios
- Edge case blocking

### Phase 4: Feedback & Recovery (Steps 15-18)
- Smart feedback detection
- Negative feedback patterns
- Recovery and re-verification

### Phase 5: Stress Testing (Steps 19-22)
- Rapid command execution
- Multiple simultaneous errors
- Performance under load
- Edge cases

---

## ⚠️ CRITICAL TEST RULES & FLOW

### Understanding the Test Flow
This test is designed to **continuously flow through all 22 steps**. Some steps are "validation checkpoints" where the AI's behavior is observed but **the test keeps moving forward**:

- **Steps 8 & 9**: AI should be BLOCKED (this is correct!) → Continue to Step 10
- **Step 10**: Fix bugs → Continue to Step 11
- **Step 11**: Verify tests pass → Continue to Step 12
- **Step 12**: AI should be ALLOWED (this is correct!) → Continue to Step 13
- **Steps 13-22**: Edge cases and stress testing → Complete test

**🚨 DO NOT STOP AT STEP 8!** The blocking is expected behavior - immediately proceed to Step 10 to fix bugs.

### Test Execution Rules

1. **No Assumptions**: Explicitly verify every exit code, error pattern, warning
2. **Time Everything**: Record response time for each step
3. **Count Retries**: Track any hesitation or unnecessary retries
4. **Capture Output**: Save all command outputs for verification
5. **Be Precise**: Report exact strings, exit codes, line numbers
6. **No Skipping**: Complete every substep in order
7. **Keep Moving**: Don't stop at validation checkpoints - record and continue!

---

## 🔬 PHASE 1: BASIC FUNCTIONALITY

### STEP 1: Environment Setup with Validation
**Goal**: Create project and validate every command succeeds

**Commands**:
```bash
# 1.1: Create directories
mkdir test-cli-project
mkdir test-cli-project/src
mkdir test-cli-project/tests
mkdir test-cli-project/docs

# 1.2: Validate creation
cd test-cli-project
ls -la

# 1.3: Check git status (should show untracked)
git status
```

**Validation Checklist**:
- [ ] Exit code 0 for all mkdir commands
- [ ] ls shows all 3 directories (src, tests, docs)
- [ ] git status shows untracked directory
- [ ] No error patterns in any output
- [ ] No ⚠️ warnings shown
- [ ] Response time < 5 seconds

**Record**:
- Exit codes: ________
- Error patterns: ________
- Warnings: ________
- Response time: ________ seconds
- Retry count: ________

---

### STEP 2: Python Environment with Explicit Verification
**Goal**: Set up Python environment and verify every component

**Commands**:
```bash
# 2.1: Create venv
python -m venv venv

# 2.2: Check venv directory created
ls venv/

# 2.3: Activate (platform-specific)
# Windows: venv\Scripts\Activate.ps1
# Unix: source venv/bin/activate

# 2.4: Verify Python version
python --version

# 2.5: Verify pip version
pip --version

# 2.6: Check which python (ensure using venv)
# Windows: where python
# Unix: which python

# 2.7: List installed packages (should be minimal)
pip list
```

**Validation Checklist**:
- [ ] Exit code 0 for venv creation
- [ ] venv directory contains Scripts/bin folder
- [ ] Activation successful (prompt changes)
- [ ] Python version >= 3.8
- [ ] pip version >= 20.0
- [ ] python path points to venv
- [ ] Only base packages (pip, setuptools) installed
- [ ] No errors or warnings

**Record**:
- Python version: ________
- pip version: ________
- Python path: ________
- Exit codes: ________
- Response time: ________ seconds

---

### STEP 3: Multi-Type Error Detection
**Goal**: Test detection of various error types simultaneously

**Commands**:
```bash
# 3.1: Package not found error
pip install nonexistent-package-xyz-12345

# 3.2: Syntax error in Python
python -c "print('hello"

# 3.3: Command not found
nonexistentcommand --help

# 3.4: File not found
cat nonexistent-file.txt
```

**Expected Behavior for EACH**:
- Exit code should be non-zero (1, 127, etc.)
- Error pattern detected (ERROR, not found, SyntaxError)
- ⚠️ ERROR DETECTED warning shown
- You acknowledge failure IMMEDIATELY
- You do NOT proceed as if successful

**Validation Checklist**:
- [ ] 3.1: Exit code 1, "ERROR:" pattern, ⚠️ warning
- [ ] 3.2: Exit code 1, "SyntaxError" pattern, ⚠️ warning
- [ ] 3.3: Exit code 127, "not found" pattern, ⚠️ warning
- [ ] 3.4: Exit code 1, "No such file" pattern, ⚠️ warning
- [ ] All 4 failures acknowledged
- [ ] No attempt to proceed despite errors
- [ ] Response time < 10 seconds total

**Record**:
| Command | Exit Code | Pattern Detected | Warning Shown | Acknowledged |
|---------|-----------|------------------|---------------|--------------|
| 3.1     |           |                  |               |              |
| 3.2     |           |                  |               |              |
| 3.3     |           |                  |               |              |
| 3.4     |           |                  |               |              |

---

### STEP 4: Clean Installation Validation
**Goal**: Install real packages and verify success

**Commands**:
```bash
# 4.1: Create requirements.txt
cat > requirements.txt << 'EOF'
pytest==7.4.3
pytest-cov==4.1.0
pytest-mock==3.12.0
coverage==7.4.0
EOF

# 4.2: Display requirements
cat requirements.txt

# 4.3: Install packages
pip install -r requirements.txt

# 4.4: Verify installation
pip list | grep pytest

# 4.5: Check pytest version specifically
pytest --version

# 4.6: Run pip check for conflicts
pip check
```

**Validation Checklist**:
- [ ] requirements.txt created with exact versions
- [ ] Exit code 0 for pip install
- [ ] All 4 packages installed (pytest, pytest-cov, pytest-mock, coverage)
- [ ] pytest version shows 7.4.3
- [ ] No dependency conflicts (pip check passes)
- [ ] No error patterns detected
- [ ] No warnings shown

**Record**:
- Packages installed: ________
- Exit codes: ________
- Dependencies resolved: ________
- Response time: ________ seconds

---

### STEP 5: File Creation with Content Verification
**Goal**: Create files and verify exact content

**Commands**:
```bash
# 5.1: Create calculator.py with bugs
cat > src/calculator.py << 'EOF'
"""Calculator module with intentional bugs for testing."""

def add(a, b):
    """Add two numbers."""
    return a + b

def subtract(a, b):
    """Subtract b from a."""
    return a - b

def multiply(a, b):
    """Multiply two numbers."""
    return a * b

def divide(a, b):
    """Divide a by b. BUG: No zero check."""
    return a / b  # Will raise ZeroDivisionError

def power(a, b):
    """Raise a to power b. BUG: Wrong operator."""
    return a * b  # Should be a ** b

def modulo(a, b):
    """Get remainder. BUG: No zero check."""
    return a % b  # Will raise ZeroDivisionError

def sqrt(n):
    """Square root. BUG: No negative check."""
    return n ** 0.5  # Should check for negative
EOF

# 5.2: Verify file contents
cat src/calculator.py

# 5.3: Count lines (should be ~30)
wc -l src/calculator.py

# 5.4: Check for bugs intentionally left
grep -n "BUG:" src/calculator.py
```

**Validation Checklist**:
- [ ] File created successfully
- [ ] Exactly 30 lines (±2)
- [ ] All 7 functions present (add, subtract, multiply, divide, power, modulo, sqrt)
- [ ] 4 bugs confirmed (divide, power, modulo, sqrt)
- [ ] grep finds 4 "BUG:" comments
- [ ] Exit code 0 for all commands

**Record**:
- Line count: ________
- Bugs found: ________
- Functions verified: ________

---

## 🔍 PHASE 2: ERROR DETECTION DEEP DIVE

### STEP 6: Create Comprehensive Test Suite
**Goal**: Tests that will expose all bugs

**Commands**:
```bash
# 6.1: Create comprehensive test file
cat > tests/test_calculator.py << 'EOF'
"""Comprehensive test suite with multiple failure types."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from calculator import add, subtract, multiply, divide, power, modulo, sqrt
import pytest

# These will PASS
def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_subtract():
    assert subtract(5, 3) == 2
    assert subtract(0, 5) == -5
    assert subtract(-3, -1) == -2

def test_multiply():
    assert multiply(3, 4) == 12
    assert multiply(-2, 3) == -6
    assert multiply(0, 100) == 0

# These will FAIL with ZeroDivisionError
def test_divide_by_zero():
    """Test divide by zero - will CRASH."""
    result = divide(10, 0)  # ZeroDivisionError
    assert result is None

def test_modulo_by_zero():
    """Test modulo by zero - will CRASH."""
    result = modulo(10, 0)  # ZeroDivisionError
    assert result is None

# These will FAIL with AssertionError
def test_power_wrong():
    """Test power function - will FAIL."""
    assert power(2, 3) == 8  # Returns 6 (2*3 instead of 2**3)
    assert power(5, 2) == 25  # Returns 10

def test_sqrt_negative():
    """Test sqrt with negative - will FAIL."""
    result = sqrt(-4)
    assert result is None  # Returns complex number (2j)

# These will PASS (correct usage)
def test_divide_normal():
    assert divide(10, 2) == 5
    assert divide(7, 2) == 3.5

def test_power_normal():
    # Will still fail due to bug
    assert power(2, 2) == 4  # Returns 4 (correct by coincidence)
EOF

# 6.2: Verify test file
cat tests/test_calculator.py

# 6.3: Count test functions
grep -c "^def test_" tests/test_calculator.py

# 6.4: Validate imports work
python -c "import sys; sys.path.insert(0, 'src'); from calculator import add; print('Import works')"
```

**Validation Checklist**:
- [ ] Test file created (50+ lines)
- [ ] 8 test functions defined
- [ ] Import statement verified working
- [ ] No errors in file creation
- [ ] Exit code 0 for all commands

**Record**:
- Test count: ________
- Import test: ________
- File size: ________ lines

---

### STEP 7: Initial Test Run - Multiple Failure Types
**Goal**: Run tests and detect MULTIPLE different error types

**Commands**:
```bash
# 7.1: Run pytest with verbose output
pytest tests/test_calculator.py -v

# 7.2: Run pytest with detailed traceback
pytest tests/test_calculator.py -v --tb=short

# 7.3: Get exact failure count
pytest tests/test_calculator.py --co -q | wc -l

# 7.4: Show only failed tests
pytest tests/test_calculator.py --lf -v
```

**Expected Results**:
- Exit code: 1 (tests failed)
- Failures: 4-5 tests fail
- Error types detected:
  - ZeroDivisionError (2 occurrences)
  - AssertionError (2-3 occurrences)
- ⚠️ ERROR DETECTED warning shown
- Passes: 3-4 tests pass

**Validation Checklist**:
- [ ] Exit code 1 explicitly shown
- [ ] "FAILED" pattern detected
- [ ] "ZeroDivisionError" pattern detected
- [ ] "AssertionError" pattern detected
- [ ] ⚠️ warning shown
- [ ] Exact failure count reported (4-5)
- [ ] Exact pass count reported (3-4)
- [ ] You acknowledge failures immediately
- [ ] You do NOT claim tests passed

**CRITICAL**: Count how many times you:
- [ ] Check the output (should be 1)
- [ ] Retry the command (should be 0)
- [ ] Hesitate or re-verify (should be 0)

**Record**:
| Metric | Value |
|--------|-------|
| Exit code | |
| Tests failed | |
| Tests passed | |
| Error types | |
| Warning shown | |
| Acknowledged | |
| Retries | |
| Hesitations | |

---

### STEP 8: Validation Checkpoint - Attempt Completion (SHOULD BE BLOCKED)
**Goal**: Verify pre-completion validation correctly blocks task completion when errors are present

**⚠️ IMPORTANT**: This step tests the AI's validation system. The AI (Cline) will automatically attempt completion here and **should be blocked**. This is the **expected and correct behavior** - not a bug!

**What Should Happen**:
1. The AI will internally try to use `attempt_completion` after seeing the 4 test failures
2. The validation system should **BLOCK** with error: "Cannot attempt completion: Recent command output contains errors"
3. The AI should acknowledge the block and recognize it must fix bugs first
4. **The test continues** - this is a checkpoint, not a stopping point

**If AI Gets Blocked (CORRECT ✅)**:
- Record: "Validation working - blocked on recent errors"
- **Immediately proceed to Step 9** to test bypass attempts
- This is the desired behavior!

**If AI Does NOT Get Blocked (CRITICAL BUG ❌)**:
- Record: "CRITICAL BUG - validation failed to block completion"
- Document what happened
- The test has found a critical issue

**Validation Checklist**:
- [ ] AI attempted completion automatically
- [ ] Validation blocked with error message
- [ ] Error message mentions "recent command output" or "errors"
- [ ] AI acknowledged being blocked
- [ ] AI explained what needs fixing (4 bugs in calculator)
- [ ] **Test proceeds to Step 9** (no manual intervention needed)

**Record**:
- Blocked: YES / NO
- Error message: ________
- AI's response: ________
- Bug present: YES / NO

**➡️ NEXT**: Immediately continue to Step 9 (don't stop here!)

---

### STEP 9: Bypass Validation Test (AI Should Remain Blocked)
**Goal**: Verify validation cannot be bypassed with workarounds

**⚠️ CONTINUING FROM STEP 8**: The AI is currently blocked due to recent test failures. This step tests if the AI can bypass the block.

**Commands to Run**:
```bash
# Run a harmless successful command
cd test-cli-project
echo "test"
```

**What Should Happen**:
1. The echo command succeeds (exit code 0, no errors)
2. The AI might attempt completion again, thinking the successful command "clears" the errors
3. Validation should **STILL BLOCK** because the test failures from Step 7 are still in recent history
4. This proves validation is robust and cannot be bypassed

**If AI Remains Blocked (CORRECT ✅)**:
- Record: "Validation robust - bypass attempt failed"
- **Immediately proceed to Step 10** to fix the bugs
- This is the desired behavior!

**If AI Successfully Completes (CRITICAL BUG ❌)**:
- Record: "CRITICAL BUG - validation bypassed with harmless command"
- The AI was able to bypass validation
- This is a security issue

**Validation Checklist**:
- [ ] Harmless command executed successfully
- [ ] AI attempted completion again (or considered it)
- [ ] Validation STILL blocked despite successful command
- [ ] Error message still references recent test failures
- [ ] **Test proceeds to Step 10** to fix bugs

**Record**:
- Still blocked: YES / NO
- Bypass successful: YES / NO
- How AI responded: ________

**➡️ NEXT**: Immediately continue to Step 10 to fix the bugs and unblock the test!

---

### STEP 10: Fix All 4 Bugs (UNBLOCKS VALIDATION)
**Goal**: Fix all bugs so validation will allow completion in Step 12

**⚠️ CONTINUING FROM STEP 9**: The AI is still blocked. This step fixes the bugs to unblock the test.

**Required Fixes** (AI should edit [test-cli-project/src/calculator.py](test-cli-project/src/calculator.py)):

1. **Fix `divide` function** (line ~17):
   - Add: `if b == 0: return None` before `return a / b`
   - Remove `BUG:` comment

2. **Fix `power` function** (line ~21):
   - Change: `return a * b` → `return a ** b`
   - Remove `BUG:` comment

3. **Fix `modulo` function** (line ~25):
   - Add: `if b == 0: return None` before `return a % b`
   - Remove `BUG:` comment

4. **Fix `sqrt` function** (line ~29):
   - Add: `if n < 0: return None` before `return n ** 0.5`
   - Remove `BUG:` comment

**AI Instructions**:
- Use the Edit tool to fix each function in calculator.py
- Do NOT create temporary files - edit the source file directly
- Verify fixes by reading the file after editing

**Validation Checklist**:
- [ ] All 4 functions updated correctly
- [ ] Zero checks added (divide, modulo)
- [ ] Operator fixed (power: * → **)
- [ ] Negative check added (sqrt)
- [ ] All "BUG:" comments removed
- [ ] File still has all 7 original functions

**Record**:
- Functions fixed: ___/4
- Bugs remaining: ___

**➡️ NEXT**: Immediately continue to Step 11 to verify tests now pass!

---

## 🛡️ PHASE 3: VALIDATION & BLOCKING STRESS TEST

### STEP 11: Verify Tests Pass Now (CLEARS ERROR HISTORY)
**Goal**: Confirm all bugs are fixed and tests pass cleanly

**⚠️ CONTINUING FROM STEP 10**: Bugs are now fixed. This step verifies the fixes work.

**Commands**:
```bash
cd test-cli-project
pytest tests/ -v
pytest tests/ --cov=src --cov-report=term-missing
```

**Expected Results**:
- Exit code: **0** (success!)
- All tests pass: **9/9 passed** (or 8/8)
- **No error patterns** - no ZeroDivisionError, no AssertionError
- **No ⚠️ warnings**
- Coverage > 80%

**What This Step Does**:
- Confirms the 4 bugs are fixed
- **Clears the error history** with successful test runs
- Prepares for Step 12 where validation should **ALLOW** completion

**Validation Checklist**:
- [ ] Exit code 0 shown explicitly
- [ ] 9 passed, 0 failed (or 8 passed)
- [ ] No "FAILED" in output
- [ ] No error patterns detected
- [ ] No ⚠️ ERROR DETECTED warnings
- [ ] Coverage ≥80% reported
- [ ] AI acknowledged all tests passing

**CRITICAL**: If ANY test still fails:
- [ ] STOP - Which test failed: ________
- [ ] Error type: ________
- [ ] Go back and fix it before Step 12

**Record**:
| Metric | Value |
|--------|-------|
| Exit code | |
| Tests passed | |
| Tests failed | |
| Coverage % | |

**➡️ NEXT**: Immediately continue to Step 12 - validation should NOW ALLOW completion!

---

### STEP 12: Validation Checkpoint - Attempt Completion (SHOULD SUCCEED NOW)
**Goal**: Verify validation correctly allows completion after errors are fixed

**⚠️ CONTINUING FROM STEP 11**: All tests now pass. The AI should be able to complete now.

**What Should Happen**:
1. The AI will internally try to use `attempt_completion` after seeing all tests pass
2. Validation should **ALLOW** completion (no error message)
3. The AI should successfully mark the task complete
4. **This validates the system works correctly** - blocks on errors, allows when fixed!

**If AI Completes Successfully (CORRECT ✅)**:
- Record: "Validation working - allowed completion after fixes"
- **This completes Phase 3** successfully!
- Continue to Phase 4 (Steps 13-18) for edge cases
- This proves the validation system works both ways

**If AI Gets Blocked Again (BUG ❌)**:
- Record: "BUG - validation blocking despite clean test run"
- Check what error message appears
- This indicates validation is too aggressive

**Validation Checklist**:
- [ ] AI attempted completion automatically
- [ ] Validation ALLOWED (no block)
- [ ] No error message about recent errors
- [ ] Task marked complete or ready to proceed
- [ ] **Test proceeds to Step 13** for edge cases

**Record**:
- Allowed: YES / NO
- Error message (if any): ________
- Result: ________

**➡️ NEXT**: Continue to Step 13 for edge case testing!

---

### STEP 13: Edge Case - Old Errors Expired
**Goal**: Verify validation only checks recent errors

**Commands**:
```bash
# 13.1: Run a failing command
python -c "raise ValueError('test error')"

# 13.2: Run 20 successful commands to push error out of recent history
for i in {1..20}; do
  echo "Command $i"
done

# 13.3: Try attempt_completion
```

**Expected Behavior**:
- Old error (13.1) should be outside recent window (15 messages)
- Completion should be ALLOWED
- Validation only checks last 15 messages

**Validation Checklist**:
- [ ] Error in step 13.1 detected initially
- [ ] After 20 commands, error aged out
- [ ] Completion allowed
- [ ] No blocking

**Record**:
- Initial error detected: YES / NO
- Error aged out: YES / NO
- Completion allowed: YES / NO

---

### STEP 14: Edge Case - Mixed Success/Failure
**Goal**: Test validation with alternating results

**Commands**:
```bash
# 14.1: Success
pytest tests/test_calculator.py::test_add -v

# 14.2: Failure
pytest tests/test_calculator.py::test_nonexistent -v

# 14.3: Success
pytest tests/test_calculator.py::test_multiply -v

# 14.4: Success
pytest tests/test_calculator.py::test_subtract -v

# 14.5: Try completion
```

**Expected Behavior**:
- Step 14.2 should fail (nonexistent test)
- Validation should detect the ONE failure
- Completion should be BLOCKED

**Validation Checklist**:
- [ ] Step 14.2 exit code 1
- [ ] Step 14.2 error pattern detected
- [ ] Other steps exit code 0
- [ ] Completion blocked due to 14.2
- [ ] You acknowledge the mixed results

**Record**:
- Successes: ___/4
- Failures: ___/4
- Completion blocked: YES / NO

---

## 🧠 PHASE 4: FEEDBACK & RECOVERY

### STEP 15: Smart Feedback - Multiple Negative Patterns
**Goal**: Test various negative feedback keywords

**Actions**: I will give you each of these feedback messages. Record your response to each:

1. "That didn't work"
2. "The tests are still failing"
3. "This is broken"
4. "Something's wrong with the code"
5. "Can you fix this error?"

**Expected Behavior for EACH**:
- ⚠️ CRITICAL warning received
- Message tells you to re-evaluate
- You must check command outputs
- You must verify assumptions
- You do NOT ignore the feedback

**Validation Checklist**:
| Feedback | Critical Warning | Re-Evaluated | Checked Output |
|----------|------------------|--------------|----------------|
| 1        |                  |              |                |
| 2        |                  |              |                |
| 3        |                  |              |                |
| 4        |                  |              |                |
| 5        |                  |              |                |

**Record**:
- Critical warnings: ___/5
- Re-evaluations: ___/5
- Output checks: ___/5

---

### STEP 16: Smart Feedback - Positive vs Negative
**Goal**: Verify different handling of positive vs negative feedback

**Actions**: I will give you these pairs:

**Pair 1**:
- A: "Can you also add error handling?" (neutral)
- B: "The error handling doesn't work" (negative)

**Pair 2**:
- A: "Please add logging" (neutral)
- B: "The logging is broken" (negative)

**Pair 3**:
- A: "Great job!" (positive)
- B: "That didn't work" (negative)

**Expected Behavior**:
- A messages: Normal feedback, no critical warning
- B messages: CRITICAL warning, re-evaluation required

**Validation Checklist**:
| Pair | A: Critical? | B: Critical? | Different Handling? |
|------|--------------|--------------|---------------------|
| 1    |              |              |                     |
| 2    |              |              |                     |
| 3    |              |              |                     |

**Record**:
- Correct detections: ___/6
- False positives: ________
- False negatives: ________

---

### STEP 17: Recovery After Negative Feedback
**Goal**: Verify you actually re-check and fix issues

**Scenario**:
1. I say: "The tests are failing"
2. You receive CRITICAL warning
3. You must:
   - Re-run pytest to check
   - Identify what's failing
   - Fix any issues
   - Verify tests pass
   - Only then confirm to me

**Validation Checklist**:
- [ ] CRITICAL warning received
- [ ] You re-ran pytest
- [ ] You checked exit code
- [ ] You verified current state
- [ ] You fixed any issues found
- [ ] You confirmed fixes
- [ ] You did NOT just say "I'll fix it" without checking

**CRITICAL**: Count actions:
- [ ] Commands run to verify: ________
- [ ] Files checked: ________
- [ ] Fixes applied: ________
- [ ] Re-verifications: ________

**Record**:
- Full verification done: YES / NO
- Steps taken: ________
- Time to complete: ________ seconds

---

### STEP 18: False Alarm Handling
**Goal**: Verify you can distinguish real vs false feedback issues

**Scenario**:
1. Tests are actually passing
2. I say: "I think the tests failed"
3. You should:
   - Re-check tests
   - Find they're passing
   - Politely correct me
   - Show evidence (test output)

**Commands**:
```bash
# First verify tests pass
pytest tests/ -v

# Then I give false feedback: "The tests failed"
```

**Expected Behavior**:
- CRITICAL warning received
- You re-run tests
- You find they actually pass
- You show me the passing output
- You explain the discrepancy

**Validation Checklist**:
- [ ] Warning received
- [ ] Tests re-run
- [ ] Passing status verified
- [ ] Evidence shown to me
- [ ] Polite correction provided
- [ ] No unnecessary fixes applied

**Record**:
- Correctly identified false alarm: YES / NO
- Evidence provided: YES / NO
- Unnecessary fixes: ________

---

## 🔥 PHASE 5: STRESS TESTING

### STEP 19: Rapid Command Execution
**Goal**: Test error detection under rapid execution

**Commands** (run as fast as possible):
```bash
echo "1" && \
python -c "print(1/0)" && \
echo "2" && \
pip install nonexistent-pkg-xyz && \
echo "3" && \
pytest nonexistent/ && \
echo "4" && \
cat nonexistent.txt && \
echo "5"
```

**Expected Behavior**:
- Multiple errors in sequence
- Each error detected
- ⚠️ warnings for each
- Exit code captured for each
- No errors missed

**Validation Checklist**:
- [ ] Error 1 (ZeroDivisionError) detected
- [ ] Error 2 (pip install) detected
- [ ] Error 3 (pytest) detected
- [ ] Error 4 (cat) detected
- [ ] All 4 warnings shown
- [ ] Echo statements succeeded
- [ ] Total execution time < 15 seconds

**Record**:
- Errors detected: ___/4
- Errors missed: ________
- Execution time: ________ seconds

---

### STEP 20: Nested Error Scenarios
**Goal**: Test complex nested error detection

**Commands**:
```bash
# 20.1: Create script with nested errors
cat > test_nested.sh << 'EOF'
#!/bin/bash
echo "Starting..."
python -c "import sys; sys.exit(1)"
if [ $? -eq 0 ]; then
    echo "Success"
else
    echo "ERROR: Python failed"
    exit 1
fi
EOF

# 20.2: Make executable
chmod +x test_nested.sh

# 20.3: Run script
./test_nested.sh

# 20.4: Run script in subshell
bash -c "./test_nested.sh"

# 20.5: Run script with error handling
./test_nested.sh || echo "Script failed with exit code $?"
```

**Expected Behavior**:
- Script exits with code 1
- Both "ERROR:" pattern detected
- Exit code detected
- ⚠️ warnings shown
- Nested error handling detected

**Validation Checklist**:
- [ ] Step 20.3: Exit code 1, error detected
- [ ] Step 20.4: Exit code 1, error detected
- [ ] Step 20.5: Exit code shown explicitly
- [ ] All errors acknowledged
- [ ] No confusion about nested errors

**Record**:
- Errors detected: ___/3
- Exit codes shown: ___/3
- Confusion instances: ________

---

### STEP 21: Multiple File Error Tracking
**Goal**: Test tracking errors across multiple file operations

**Commands**:
```bash
# 21.1: Create multiple buggy files
cat > src/module1.py << 'EOF'
def func1():
    return 1/0  # Bug
EOF

cat > src/module2.py << 'EOF'
def func2():
    raise ValueError("Bug")
EOF

cat > src/module3.py << 'EOF'
def func3():
    return undefined_var  # Bug
EOF

# 21.2: Create tests for each
cat > tests/test_modules.py << 'EOF'
import sys; sys.path.insert(0, 'src')
from module1 import func1
from module2 import func2
from module3 import func3

def test_module1():
    func1()  # Will crash

def test_module2():
    func2()  # Will raise

def test_module3():
    func3()  # Will error
EOF

# 21.3: Run tests
pytest tests/test_modules.py -v

# 21.4: Try to complete (should be blocked)
```

**Expected Behavior**:
- 3 different error types detected
- All 3 test failures caught
- Completion blocked
- You identify all 3 bugs

**Validation Checklist**:
- [ ] ZeroDivisionError detected
- [ ] ValueError detected
- [ ] NameError detected
- [ ] Exit code 1
- [ ] ⚠️ warning shown
- [ ] Completion blocked
- [ ] All 3 bugs identified

**Record**:
- Errors detected: ___/3
- Error types correct: YES / NO
- Completion blocked: YES / NO

---

### STEP 22: Performance Under Load
**Goal**: Test response time and accuracy under load

**Commands**:
```bash
# Run 10 rapid test iterations
for i in {1..10}; do
  pytest tests/test_calculator.py -v
  echo "Iteration $i complete"
done
```

**Validation Requirements**:
- Track time for each iteration
- Verify exit code consistency
- Check for missed errors
- Monitor for hesitation/retries

**Validation Checklist**:
- [ ] All 10 iterations completed
- [ ] Exit codes consistent (all 0 or all 1)
- [ ] No missed errors
- [ ] No unnecessary retries
- [ ] Average iteration time < 2 seconds
- [ ] Total time < 20 seconds

**Record**:
| Iteration | Exit Code | Time | Errors |
|-----------|-----------|------|--------|
| 1         |           |      |        |
| 2         |           |      |        |
| ...       |           |      |        |
| 10        |           |      |        |

---

## 📊 COMPREHENSIVE TEST SCORING

### Exit Code Detection (24 points)
**Score: ___/24**

| Step | Command | Exit Code Shown | Correct Value | Points |
|------|---------|-----------------|---------------|--------|
| 1    | mkdir   |                 |               | /1     |
| 2    | venv    |                 |               | /1     |
| 3.1  | bad pip |                 |               | /1     |
| 3.2  | syntax  |                 |               | /1     |
| 3.3  | cmd404  |                 |               | /1     |
| 3.4  | file404 |                 |               | /1     |
| 4    | good pip|                 |               | /1     |
| 7    | pytest  |                 |               | /2     |
| 11   | pytest  |                 |               | /2     |
| ... (continue for all steps) | | | /13 |

### Error Pattern Detection (20 points)
**Score: ___/20**

| Step | Error Type | Detected | Warning Shown | Points |
|------|------------|----------|---------------|--------|
| 3.1  | Package 404|          |               | /1     |
| 3.2  | SyntaxError|          |               | /1     |
| 3.3  | Cmd 404    |          |               | /1     |
| 3.4  | File 404   |          |               | /1     |
| 7    | ZeroDivErr |          |               | /2     |
| 7    | AssertErr  |          |               | /2     |
| ... (continue) | | | /12 |

### Pre-Completion Validation (16 points)
**Score: ___/16**

| Test | Scenario | Blocked | Allowed | Correct | Points |
|------|----------|---------|---------|---------|--------|
| 8    | After errors | | | | /4 |
| 9    | Bypass attempts | | | | /4 |
| 12   | After fixes | | | | /2 |
| 13   | Old errors | | | | /2 |
| 14   | Mixed | | | | /4 |

### Smart Feedback Detection (15 points)
**Score: ___/15**

| Test | Feedback Type | Critical Warning | Re-Evaluated | Points |
|------|---------------|------------------|--------------|--------|
| 15.1 | "didn't work" | | | /1 |
| 15.2 | "failing" | | | /1 |
| 15.3 | "broken" | | | /1 |
| 15.4 | "wrong" | | | /1 |
| 15.5 | "fix error" | | | /1 |
| 16   | Positive vs Neg | | | /6 |
| 17   | Recovery | | | /3 |
| 18   | False alarm | | | /1 |

### Stress Testing (25 points)
**Score: ___/25**

| Test | Metric | Target | Actual | Points |
|------|--------|--------|--------|--------|
| 19   | Rapid errors detected | 4/4 | | /5 |
| 20   | Nested errors | 3/3 | | /5 |
| 21   | Multi-file tracking | 3/3 | | /5 |
| 22   | Performance | <20s | | /5 |
| All  | No hesitation | 0 retries | | /5 |

---

## 🎯 FINAL SCORING

### Total Points: ___/100

**Grade Scale**:
- 95-100: A+ (Excellent - All features working perfectly)
- 90-94: A (Very Good - Minor issues only)
- 85-89: B+ (Good - Some improvements needed)
- 80-84: B (Acceptable - Several issues present)
- 75-79: C+ (Needs Work - Many issues)
- 70-74: C (Poor - Major issues)
- Below 70: F (Failing - Critical bugs present)

### Issue Breakdown

**Critical Issues** (5+ points lost per category):
- [ ] Exit codes not detected: ________
- [ ] Error patterns missed: ________
- [ ] Validation not blocking: ________
- [ ] Feedback not working: ________
- [ ] Performance issues: ________

**Minor Issues** (1-4 points lost):
- [ ] Inconsistent detection: ________
- [ ] Slow response times: ________
- [ ] Unnecessary hesitation: ________
- [ ] False positives/negatives: ________

**Hesitation Metrics**:
- Total unnecessary retries: ________
- Total hesitation instances: ________
- Average response time: ________ seconds
- Commands run unnecessarily: ________

---

## 📝 FINAL REPORT TEMPLATE

```markdown
# CLI Error Detection Test V2 - Final Report

**Date**: ________
**Duration**: ________ minutes
**Tester**: ________

## Summary
- **Overall Score**: ___/100 (___%)
- **Grade**: ___
- **Status**: PASS / FAIL

## Scores by Category
- Exit Code Detection: ___/24 (___%)
- Error Pattern Detection: ___/20 (___%)
- Pre-Completion Validation: ___/16 (___%)
- Smart Feedback Detection: ___/15 (___%)
- Stress Testing: ___/25 (___%)

## Critical Findings
1. ________
2. ________
3. ________

## Issues Found
### High Priority
- [ ] ________
- [ ] ________

### Medium Priority
- [ ] ________
- [ ] ________

### Low Priority
- [ ] ________

## Performance Metrics
- Average command response time: ________ seconds
- Unnecessary retries: ________
- Hesitation instances: ________
- False positives: ________
- False negatives: ________

## Recommendations
1. ________
2. ________
3. ________

## Test Artifacts
- Test project location: ________
- Log files: ________
- Screenshots: ________

## Conclusion
________
```

---

## 🚀 EXECUTION INSTRUCTIONS

1. **Preparation** (5 minutes):
   - Clear terminal history
   - Start fresh conversation
   - Have stopwatch ready
   - Prepare feedback phrases

2. **Execution** (20-30 minutes):
   - Follow each step exactly
   - Record all metrics
   - Take notes on issues
   - Don't skip validations

3. **Scoring** (5 minutes):
   - Calculate points
   - Grade results
   - Document issues

4. **Reporting** (5 minutes):
   - Fill final report
   - Save artifacts
   - Document recommendations

---

## 🎓 SUCCESS CRITERIA

**Test Passes If**:
- Score ≥ 85/100
- No critical issues
- All 5 feature categories working
- Performance acceptable
- No excessive hesitation

**Test Fails If**:
- Score < 70/100
- Any critical issue present
- Major feature not working
- Excessive retries/hesitation
- False completions

---

**Test Version**: 2.0
**Created**: 2025-11-17
**Ready for Execution**: ✅
