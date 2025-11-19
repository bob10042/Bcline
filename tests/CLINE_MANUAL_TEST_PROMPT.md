# Cline Manual Test Prompt - 20 Fixes Verification

**Purpose**: Test 20 fixes that require the Cline extension running
**Time Required**: 15-20 minutes
**Version**: 3.37.2 (47 fixes total, 26 already verified via automated tests)

---

## 🎯 COPY THIS PROMPT AND PASTE INTO CLINE

```
Hello Cline! I need you to help me test 20 bug fixes in your current version.
Please follow these tests in order and document the results for me.

## TEST SESSION OVERVIEW

You are Cline v3.37.2 with 47 bug fixes. I've already verified 26 fixes through
automated testing (compilation, linting, builds all passed ✅).

Now I need to test the remaining 20 fixes that require you to be running.
Please be thorough and honest about what you observe.

---

## PART 1: TOKEN USAGE TESTS (Critical - Fixes #7373, #7371)

### Test 1.1 - Token Counter Accuracy
**What was fixed**: Critical bugs with token counting/usage

**Instructions**:
1. Tell me your current token usage right now
2. Count how many tokens this conversation has used so far
3. Make 3 simple requests to me (ask me 3 questions)
4. After each response I give, tell me the new token count
5. Verify the count increases smoothly without jumps

**What to observe**:
- ✅ Token count should increase smoothly
- ✅ No sudden jumps or decreases
- ❌ Token count shouldn't spike randomly
- ❌ No double-counting of requests

**Report**: After this test, tell me if token counting worked correctly.

---

### Test 1.2 - Token Spike Prevention
**What was fixed**: Random token usage spikes from duplicate counting

**Instructions**:
1. Make 5 small tool calls in a row (read a file, list files, etc.)
2. After each tool call, report the token usage
3. Look for any unexpected spikes between calls

**What to observe**:
- ✅ Each tool call should add a predictable amount of tokens
- ❌ No random spikes between similar operations
- ❌ No token count decreases

**Report**: Tell me if you noticed any token spikes or anomalies.

---

## PART 2: CONSOLE & UI TESTS (Fixes #7490, #7388, #7383)

### Test 2.1 - Console Warnings Check
**What was fixed**: VSCode console warnings about undefined theme variables

**Instructions**:
1. Ask me to open the Developer Console (Ctrl+Shift+I)
2. Wait for me to confirm it's open
3. Ask me to switch VSCode theme (light to dark or vice versa)
4. Ask me if I see warnings about "semanticHighlighting" or undefined theme variables

**What I should observe**:
- ✅ No warnings about semanticHighlighting
- ✅ No undefined theme variable warnings
- ✅ Minimal console warnings overall

**Report**: Ask me what I saw in the console and document it.

---

### Test 2.2 - Task Completion Message
**What was fixed**: "Task Completed" message rendered twice in long conversations

**Instructions**:
1. Complete a simple task (create a test file with "Hello World")
2. Mark the task as complete
3. Ask me to scroll through our conversation history
4. Ask me how many "Task Completed" messages I see

**What I should observe**:
- ✅ Only ONE "Task Completed" message
- ❌ No duplicate completion messages

**Report**: Document how many completion messages appeared.

---

### Test 2.3 - Context Window Percentage
**What was fixed**: UI shows ~50% but API receives 100%

**Instructions**:
1. Tell me your current context window percentage
2. Tell me the actual token count
3. Calculate if the percentage matches the actual usage
4. Example: If showing 50%, actual usage should be ~50% of max context

**What to verify**:
- ✅ UI percentage should match actual API usage
- ✅ Consistent calculation between what you see and what you report

**Report**: Tell me the percentage shown vs actual token usage percentage.

---

## PART 3: COMMAND TESTS (Fix #7379)

### Test 3.1 - /smol Command Test
**What was fixed**: /smol command crashes when context window is full

**Instructions**:
1. Try using the /smol command right now
2. Observe if it works without crashing
3. Check if context is handled properly

**What to observe**:
- ✅ Command should work without crashing
- ✅ Context automatically truncated if needed
- ❌ No error messages about context overflow

**Report**: Tell me if /smol worked correctly.

---

### Test 3.2 - /compact Command Test
**What was fixed**: /compact command crashes when context window is full

**Instructions**:
1. Try using the /compact command
2. Observe if it works without errors
3. Check if pre-emptive truncation occurs properly

**What to observe**:
- ✅ Command works without crashing
- ✅ Pre-emptive truncation at 85% threshold (if needed)
- ✅ Command executes successfully

**Report**: Tell me if /compact worked correctly.

---

## PART 4: MODE DETECTION TEST (Fix #7462)

### Test 4.1 - Act Mode Recognition
**What was fixed**: Cline doesn't recognize when Act mode is active

**Instructions**:
1. Tell me what mode you're currently in (Plan or Act)
2. Ask me to switch to Act mode
3. After I switch, tell me if you can detect you're in Act mode
4. Ask me to give you a simple task to test behavior
5. Verify you execute without planning (as expected in Act mode)

**What to observe**:
- ✅ You should explicitly detect Act mode
- ✅ No fallback to incorrect mode
- ✅ Behavior should match the selected mode

**Report**: Tell me if you correctly detected the mode change.

---

## PART 5: GIT FEATURES TEST (Fix #7382)

### Test 5.1 - Git Operations
**What was fixed**: Commit messages only work in top-level repo, not submodules

**Instructions**:
1. Check if this workspace is a git repository
2. Tell me the current git status
3. Try to get the git root directory
4. Report if you can access git information correctly

**What to observe**:
- ✅ Git commands should find correct repository root
- ✅ No errors about "not a git repository"
- ✅ Git information accessible

**Report**: Tell me if git operations worked correctly.

---

## PART 6: TOOL & PARAMETER TESTS (Fixes #7467, #7393)

### Test 6.1 - File Listing with Parameters
**What was fixed**: list_files missing path parameter

**Instructions**:
1. List files in the current directory
2. List files in a subdirectory (like src/ or webview-ui/)
3. Verify the path parameter is included correctly

**What to observe**:
- ✅ Required parameters should be included
- ✅ Optional parameters handled correctly
- ❌ No missing parameter errors

**Report**: Tell me if file listing worked with proper parameters.

---

### Test 6.2 - Tool Use Compatibility
**What was fixed**: "tool_use is not supported yet" error

**Instructions**:
1. Use multiple tools in sequence:
   - Read a file (TEST_46_FIXES.md)
   - List files in a directory
   - Create a test file
2. Check for any compatibility errors

**What to observe**:
- ✅ No "tool_use is not supported" errors
- ✅ All tools work correctly
- ✅ Backward compatibility maintained

**Report**: Tell me if you encountered any tool compatibility errors.

---

## PART 7: TERMINAL TEST (Fix #7470)

### Test 7.1 - Terminal Commands with Quotes
**What was fixed**: Commands with quotes fail in Background Exec mode

**Instructions**:
1. Run this command: echo "Hello World"
2. Run this command: echo "Test with 'nested' quotes"
3. Verify both commands execute properly

**What to observe**:
- ✅ Commands with quotes should execute properly
- ✅ No escaping errors
- ✅ Output shows correctly

**Report**: Tell me if the quoted commands worked.

---

## PART 8: PROVIDER-SPECIFIC TESTS (Optional - If Applicable)

### Test 8.1 - Model Provider Check
**Instructions**:
1. Tell me what model provider you're using
2. Tell me what model you're running
3. If you're using Claude Code, OpenRouter, or another provider, tell me

**Report**: Document your provider and model.

---

## FINAL TEST: Overall Extension Health

### General Functionality Check
**Instructions**:
1. Read the file TEST_46_FIXES.md
2. Summarize the fixes listed in it
3. Create a file called MANUAL_TEST_RESULTS.txt with your summary
4. Report if this workflow completed without errors

**What to observe**:
- ✅ No crashes or errors
- ✅ Smooth operation throughout
- ✅ Task completes successfully
- ✅ Token usage is accurate
- ✅ No unexpected warnings

**Report**: Tell me if the complete workflow worked smoothly.

---

## TEST COMPLETION SUMMARY

After all tests, please create a summary report with this format:

### Test Results Summary
- **Test 1.1 (Token Accuracy)**: PASS/FAIL - [notes]
- **Test 1.2 (Token Spikes)**: PASS/FAIL - [notes]
- **Test 2.1 (Console Warnings)**: PASS/FAIL - [notes]
- **Test 2.2 (Task Completion)**: PASS/FAIL - [notes]
- **Test 2.3 (Context Window)**: PASS/FAIL - [notes]
- **Test 3.1 (/smol Command)**: PASS/FAIL - [notes]
- **Test 3.2 (/compact Command)**: PASS/FAIL - [notes]
- **Test 4.1 (Act Mode)**: PASS/FAIL - [notes]
- **Test 5.1 (Git Operations)**: PASS/FAIL - [notes]
- **Test 6.1 (File Parameters)**: PASS/FAIL - [notes]
- **Test 6.2 (Tool Compatibility)**: PASS/FAIL - [notes]
- **Test 7.1 (Terminal Quotes)**: PASS/FAIL - [notes]
- **Test 8.1 (Provider Check)**: INFO - [details]
- **Final Test (Overall Health)**: PASS/FAIL - [notes]

### Overall Assessment
- **Total Tests**: 14
- **Passed**: X
- **Failed**: Y
- **Overall Status**: PASS/FAIL
- **Notes**: [Any issues or observations]

---

Please begin the tests now. Take your time and be thorough!
```

---

## 📋 INSTRUCTIONS FOR YOU

1. **Copy the entire prompt** from the code block above
2. **Open Cline** in VSCode (make sure you're using the v3.37.1+ extension)
3. **Start a new conversation**
4. **Paste the prompt** and let Cline run through all the tests
5. **Respond to Cline's requests** (like switching themes, checking console, etc.)
6. **Save the results** when Cline generates the summary

---

## 🎯 WHAT THIS TEST WILL VERIFY

### Critical Fixes (Must Pass):
- ✅ Token usage accuracy (no double-counting)
- ✅ Token spike prevention (no random jumps)
- ✅ Console warnings reduced
- ✅ Context window calculations correct
- ✅ Commands working (/smol, /compact)

### Important Fixes (Should Pass):
- ✅ Task completion messages (no duplicates)
- ✅ Mode detection (Plan/Act switching)
- ✅ Git operations
- ✅ Tool parameters
- ✅ Terminal quote handling

### Info Gathering:
- 📊 Model provider being used
- 📊 Overall extension health

---

## 📊 EXPECTED RESULTS

If all fixes are working:
- **14/14 tests should PASS**
- Token usage should be smooth and accurate
- No console warnings about themes
- Commands should work without crashes
- Tools should work with proper parameters
- Overall operation should be smooth

---

## 🚨 IF TESTS FAIL

If any test fails:
1. **Document the failure** in detail
2. **Check the error messages**
3. **Note which fix number failed** (from the #XXXX references)
4. **Save the test results**
5. **Report to GitHub** if needed

---

## 💡 TIPS

- **Be patient**: Some tests require your interaction (switching themes, checking console)
- **Read carefully**: Cline will ask you to do specific things
- **Document everything**: Save Cline's final summary report
- **Check console**: Keep Developer Console open (Ctrl+Shift+I) during tests
- **Watch token counter**: Monitor the token display in Cline's UI

---

## ✅ AFTER TESTING

Once complete, you'll have:
1. **MANUAL_TEST_RESULTS.txt** - Created by Cline during testing
2. **Cline's summary report** - In the conversation
3. **Verified fixes count** - Should be 46/46 total (26 automated + 20 manual)

---

## 🎉 SUCCESS CRITERIA

**All 47 Fixes Verified** when:
- ✅ 26 automated tests passed (already done)
- ✅ 20 manual tests passed (run this prompt)
- ✅ No critical failures
- ✅ Extension operates smoothly

---

**Ready to test! Copy the prompt above and paste it into Cline.** 🚀

---

## Quick Reference

**Total Fixes**: 47
- ✅ 26 verified (automated)
- 🔄 20 to verify (manual - this prompt)
- ⏸️ 1 already confirmed (diff/truncation fix)

**Test Time**: ~15-20 minutes
**Test File Created**: Will be MANUAL_TEST_RESULTS.txt
**Interaction Required**: Yes (theme switching, console checking, etc.)

---

**Last Updated**: 2025-11-17
**Version**: 3.37.2
**Status**: Ready for manual testing
