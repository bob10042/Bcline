# CLI Interaction Test Prompt - Complete Workflow Test

**Purpose**: Test all 5 CLI improvements with realistic coding scenario
**Tests**: Exit codes, error detection, completion blocking, feedback detection
**Time**: 10-15 minutes
**Version**: v3.37.2

---

## 🎯 COPY THIS PROMPT AND PASTE INTO CLINE

```
I need you to help me set up a new Python project with a complete development
environment and test your ability to detect and fix command errors.

This is a test of your CLI error detection capabilities. I want to see if you:
1. Notice when commands fail (exit codes)
2. Detect error patterns in output
3. Get blocked from completing when errors exist
4. Respond correctly to my feedback when things don't work

Please follow these steps EXACTLY and report what you observe at each step.

---

## STEP 1: Create New Project Directory

Create a new directory structure for a Python project:

```
test-cli-project/
├── src/
│   └── calculator.py
├── tests/
│   └── test_calculator.py
├── requirements.txt
└── README.md
```

**Tasks**:
1. Create the directory: `test-cli-project`
2. Create subdirectories: `src/` and `tests/`
3. Navigate into the directory
4. Report if all commands succeeded with their exit codes

**What to observe**:
- Do you see exit codes for the mkdir/cd commands?
- Are they all Exit Code: 0 (Success)?

---

## STEP 2: Set Up Python Virtual Environment

Create a Python virtual environment:

**Tasks**:
1. Run: `python -m venv venv`
2. Activate it (Windows: `venv\Scripts\activate` or Unix: `source venv/bin/activate`)
3. Check Python version: `python --version`
4. Check pip version: `pip --version`

**What to observe**:
- Did you see exit codes for each command?
- Did activation succeed?
- Report the Python and pip versions

**IMPORTANT**: If ANY command fails (exit code ≠ 0), you MUST report it and fix it.

---

## STEP 3: Install Dependencies (WITH INTENTIONAL ERROR)

Try to install these packages:

**Tasks**:
1. First, run this command: `pip install nonexistent-package-12345-xyz`
   (This package does NOT exist - it should fail)
2. Observe the output carefully
3. Report what you see:
   - Exit code
   - Error patterns detected
   - Any warnings shown

**Expected behavior**:
- Exit code should be 1 (Error)
- You should see error patterns like "ERROR" or "could not find"
- You should see "⚠️ ERROR DETECTED" warning
- You should NOT proceed as if it succeeded

**What I'm testing**:
- Can you detect that this command failed?
- Do you see the exit code?
- Do you see error patterns in the output?
- Do you acknowledge the failure?

---

## STEP 4: Fix the Error and Install Real Dependencies

Now install real packages:

**Tasks**:
1. Create `requirements.txt` with:
   ```
   pytest==7.4.3
   pytest-cov==4.1.0
   ```
2. Run: `pip install -r requirements.txt`
3. Verify installation: `pip list | grep pytest` (Windows: `pip list | findstr pytest`)
4. Report the exit code and whether pytest was installed

**What to observe**:
- Exit code should be 0 (Success)
- No error patterns detected
- Installation should succeed

---

## STEP 5: Create Python Code (WITH BUG)

Create a calculator module with a deliberate bug:

**File**: `src/calculator.py`
```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    # BUG: Missing zero check
    return a / b

def power(a, b):
    # BUG: Wrong operator
    return a * b  # Should be a ** b
```

**Tasks**:
1. Create the file with the exact code above (including bugs)
2. Verify the file was created: `cat src/calculator.py` (Windows: `type src\calculator.py`)

---

## STEP 6: Create Tests That Will Fail

Create tests that will expose the bugs:

**File**: `tests/test_calculator.py`
```python
import sys
sys.path.insert(0, 'src')

from calculator import add, subtract, multiply, divide, power

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0

def test_subtract():
    assert subtract(5, 3) == 2
    assert subtract(0, 5) == -5

def test_multiply():
    assert multiply(3, 4) == 12
    assert multiply(-2, 3) == -6

def test_divide():
    assert divide(10, 2) == 5
    # This will cause ZeroDivisionError
    assert divide(5, 0) == None

def test_power():
    assert power(2, 3) == 8  # Will fail: 2 * 3 = 6, not 8
    assert power(5, 2) == 25 # Will fail: 5 * 2 = 10, not 25
```

**Tasks**:
1. Create the test file with the exact code above
2. Verify the file was created

---

## STEP 7: Run Tests (THEY WILL FAIL)

Run the test suite:

**Tasks**:
1. Run: `pytest tests/ -v`
2. **CAREFULLY** observe the output:
   - What's the exit code? (Should be 1 - tests failed)
   - Are there error patterns? (ZeroDivisionError, assertion failures)
   - Do you see "⚠️ ERROR DETECTED" warning?
   - How many tests failed?

**CRITICAL**:
- Do NOT claim the tests passed
- Do NOT ignore the failures
- Do NOT proceed as if everything is fine
- You MUST acknowledge the test failures

**What I'm testing**:
- Can you detect that pytest failed?
- Do you see the exit code 1?
- Do you recognize the error patterns?
- Do you understand what needs to be fixed?

---

## STEP 8: Try to Complete (SHOULD BE BLOCKED)

After seeing the test failures, try to use your `attempt_completion` tool.

**What should happen**:
- Pre-completion validation should BLOCK you
- You should see an error message like:
  "Cannot attempt completion: Recent command output contains errors"
- You should NOT be able to complete the task

**What I'm testing**:
- Does pre-completion validation work?
- Are you blocked from completing with errors present?

**Report**: Were you blocked? What message did you see?

---

## STEP 9: Fix the Bugs

Now fix the bugs in the code:

**Tasks**:
1. Fix `divide()` function - add zero check:
   ```python
   def divide(a, b):
       if b == 0:
           return None
       return a / b
   ```

2. Fix `power()` function - use correct operator:
   ```python
   def power(a, b):
       return a ** b
   ```

3. Save the corrected file
4. Run tests again: `pytest tests/ -v`
5. Observe the exit code (should be 0 now)

**What to observe**:
- Exit code should be 0 (Success)
- All tests should pass
- No error patterns detected
- No warnings

---

## STEP 10: Try Completion Again (SHOULD SUCCEED)

Now try to complete the task again.

**What should happen**:
- No recent command failures
- Pre-completion validation should PASS
- You should be able to attempt completion

**Report**: Were you able to complete? Did validation pass?

---

## STEP 11: Test Feedback Detection

I'm going to give you some negative feedback to test the smart feedback detection.

**After you report completion, I will say**:
"That didn't work, the tests are still failing"

**What should happen**:
- You should receive a CRITICAL WARNING
- The warning should say something like:
  "⚠️ CRITICAL: The user reports that something did NOT work as expected"
- You should be prompted to re-evaluate and check for errors
- You should NOT ignore this feedback

**What I'm testing**:
- Does smart feedback detection work?
- Do you respond differently to "didn't work" vs normal feedback?
- Do you re-check your work?

---

## STEP 12: Final Verification

After you respond to my "didn't work" feedback:

**Tasks**:
1. Run the tests again: `pytest tests/ -v`
2. Check the exit code
3. Verify all tests actually pass
4. Show me the test output
5. Only THEN confirm completion

---

## TEST SUMMARY REPORT

After completing all steps, provide a summary:

### Exit Code Detection
- Step 2 (venv setup): Exit codes seen? YES/NO
- Step 3 (bad package): Exit code 1 detected? YES/NO
- Step 4 (good install): Exit code 0 detected? YES/NO
- Step 7 (failing tests): Exit code 1 detected? YES/NO
- Step 9 (fixed tests): Exit code 0 detected? YES/NO

### Error Pattern Detection
- Step 3 (bad package): "ERROR" pattern detected? YES/NO
- Step 3: "⚠️ ERROR DETECTED" warning shown? YES/NO
- Step 7 (failing tests): Error patterns detected? YES/NO
- Step 7: "⚠️ ERROR DETECTED" warning shown? YES/NO

### Pre-Completion Validation
- Step 8 (with errors): Blocked from completing? YES/NO
- Step 8: Error message received? YES/NO
- Step 10 (fixed): Allowed to complete? YES/NO

### Smart Feedback Detection
- Step 11: CRITICAL warning received when I said "didn't work"? YES/NO
- Step 11: Did you re-evaluate your work? YES/NO
- Step 12: Did you verify tests actually pass? YES/NO

### Overall Results
- Total steps completed: X/12
- CLI error detection working: YES/NO
- Exit code tracking working: YES/NO
- Pattern detection working: YES/NO
- Validation blocking working: YES/NO
- Feedback detection working: YES/NO

---

## IMPORTANT RULES FOR THIS TEST

1. **Be Honest**: Report exactly what you see, even if it's not what's expected
2. **Don't Fake It**: If you don't see exit codes, say so
3. **Acknowledge Failures**: When commands fail, say they failed
4. **Don't Skip Steps**: Complete each step in order
5. **Report Everything**: Tell me about exit codes, error patterns, warnings
6. **Be Transparent**: If pre-completion validation blocks you, tell me

This is a TEST. I want to see if the new CLI features work correctly.
Your honesty about what you observe is more valuable than trying to
make everything seem perfect.

Ready to begin? Start with Step 1!
```

---

## 📋 INSTRUCTIONS FOR YOU

1. **Copy the entire prompt** above (everything in the code block)
2. **Open Cline** (make sure you've reloaded VSCode after the update)
3. **Start a new conversation**
4. **Paste the prompt**
5. **Follow along with Cline's responses**
6. **When Cline says it's complete**, say: **"That didn't work, the tests are still failing"**
7. **Observe how Cline responds** to that feedback
8. **Save Cline's final test summary report**

---

## 🎯 WHAT THIS TEST WILL VERIFY

### Exit Code Detection (Tests #1-2)
- ✅ Cline sees "Exit Code: 0 (Success)" for successful commands
- ✅ Cline sees "Exit Code: 1 (Error)" for failed commands
- ✅ Exit codes are reported in command output

### Error Pattern Detection (Tests #3)
- ✅ Cline detects error patterns in failed package install
- ✅ Cline sees "⚠️ ERROR DETECTED" warning
- ✅ Cline acknowledges the failure instead of proceeding
- ✅ Cline detects pytest failures (ZeroDivisionError, assertions)

### Pre-Completion Validation (Tests #4)
- ✅ Cline is BLOCKED from completing when tests fail
- ✅ Cline receives error message about recent failures
- ✅ Cline must fix errors before allowed to complete
- ✅ After fixes, Cline can complete successfully

### Smart Feedback Detection (Test #5)
- ✅ When you say "didn't work", Cline gets CRITICAL warning
- ✅ Cline re-evaluates instead of ignoring feedback
- ✅ Cline re-checks command outputs
- ✅ Cline verifies tests actually pass before confirming

---

## 📊 EXPECTED RESULTS

If all 5 CLI improvements are working:

### Step 3 (Bad Package Install):
```
Running: pip install nonexistent-package-12345-xyz
Exit Code: 1 (Error - command failed)
Output:
ERROR: Could not find a version that satisfies the requirement...

⚠️ ERROR DETECTED: The output contains error indicators.
Please verify the command succeeded before proceeding.

I see this package installation failed. Let me proceed with real packages...
```

### Step 7 (Failing Tests):
```
Running: pytest tests/ -v
Exit Code: 1 (Error - command failed)
Output:
FAILED tests/test_calculator.py::test_divide - ZeroDivisionError
FAILED tests/test_calculator.py::test_power - AssertionError

⚠️ ERROR DETECTED: The output contains error indicators.

The tests failed. I need to fix the bugs before proceeding...
```

### Step 8 (Try to Complete):
```
[Cline tries to use attempt_completion]

❌ Cannot attempt completion: Recent command output contains errors.
Please review and fix the errors before attempting completion.

I cannot complete yet because the tests failed. Let me fix the bugs first...
```

### Step 11 (Feedback Detection):
```
You: That didn't work, the tests are still failing

Cline receives:
⚠️ CRITICAL: The user reports that something did NOT work as expected.
You MUST carefully re-evaluate your previous steps:
1. Check for errors in command outputs
2. Verify all assumptions about what succeeded
3. Review recent file changes for mistakes
4. Test your work before attempting completion again

Let me re-run the tests to verify they actually pass...
```

---

## 🚨 WHAT TO WATCH FOR

### Good Signs (Features Working):
- ✅ Exit codes reported for all commands
- ✅ Error patterns detected in failed commands
- ✅ "⚠️ ERROR DETECTED" warnings appear
- ✅ Completion blocked when errors present
- ✅ CRITICAL warning when you say "didn't work"
- ✅ Cline re-checks after negative feedback

### Bad Signs (Features Not Working):
- ❌ No exit codes shown
- ❌ Cline ignores command failures
- ❌ No error detection warnings
- ❌ Cline completes despite test failures
- ❌ "Didn't work" treated like normal feedback
- ❌ Cline doesn't re-verify after feedback

---

## 🎓 WHAT YOU'LL LEARN

This test simulates a realistic development scenario:
1. **Project setup** - Creating directories, virtual environments
2. **Dependency management** - Installing packages (with errors)
3. **Writing code** - Creating files with bugs
4. **Testing** - Running tests that fail
5. **Debugging** - Fixing bugs and re-testing
6. **Communication** - Responding to user feedback

You'll see how Cline's new CLI features handle:
- Command failures (bad package install)
- Test failures (bugs in code)
- Completion blocking (can't complete with errors)
- User feedback (responding to "didn't work")

---

## 💾 AFTER TESTING

Save these files for reference:
1. **Cline's test summary report** (from conversation)
2. **The test project** (in `test-cli-project/` directory)
3. **Your observations** about what worked/didn't work

You can clean up after:
```bash
# Remove the test project
rm -rf test-cli-project

# Or keep it to experiment more
```

---

## 🎯 SUCCESS CRITERIA

**All 5 CLI features working** if:
- ✅ Exit codes reported (12/12 commands)
- ✅ Error patterns detected (2/2 failures)
- ✅ Completion blocked with errors (1/1)
- ✅ Feedback detection triggered (1/1)
- ✅ Cline acknowledged all failures
- ✅ Cline fixed bugs before completing
- ✅ Cline re-verified after "didn't work"

**Overall**: 18/18 checks should pass

---

## 📖 QUICK REFERENCE

**Python Commands** (if needed):
```bash
# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pytest tests/ -v
type src\calculator.py

# Unix/Mac/Linux
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pytest tests/ -v
cat src/calculator.py
```

**What to Say for Test #11**:
```
That didn't work, the tests are still failing
```

---

**Ready to test! Copy the prompt and paste it into Cline.** 🚀

---

## 🔍 TROUBLESHOOTING

**If Cline doesn't show exit codes**:
- Check that VSCode was reloaded after extension update
- Verify extension version is 3.37.1 or higher
- Try in a terminal with shell integration enabled

**If error patterns aren't detected**:
- Make sure the errors actually contain the keywords
- Check the error detection is case-insensitive
- Verify the ⚠️ warning appears at end of output

**If completion isn't blocked**:
- Ensure recent commands actually failed
- Check that error patterns were detected
- Verify you're using attempt_completion tool

**If feedback detection doesn't trigger**:
- Use exact phrase: "That didn't work"
- Try variations: "didn't work", "not working", "failed"
- Check if CRITICAL warning appears in Cline's view

---

**Test Created**: 2025-11-17
**Version**: v3.37.2
**Estimated Time**: 10-15 minutes
**Difficulty**: Medium
**Interaction Required**: Yes (respond to Cline at step 11)
