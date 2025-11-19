# Test Suite for 20 Bug Fixes - Bcline v3.37.1

This document provides test cases to verify all 20 bug fixes are working correctly.

---

## 🧪 Pre-Test Checklist

Before starting tests:
- [ ] VSCode restarted after installing extension
- [ ] Developer Console open (`Ctrl+Shift+I`) to monitor warnings
- [ ] Extension version is `saoudrizwan.claude-dev@3.37.1`

---

## Test Group 1: Console & UI (Fixes #7490, #7388)

### Test 1.1 - Console Warnings (Fix #7490)
**What was fixed**: VSCode console warnings about undefined theme variables

**How to test**:
1. Open Developer Console (`Ctrl+Shift+I`)
2. Go to Console tab
3. Clear console
4. Open the Cline extension panel
5. Switch between light/dark theme

**Expected Result**:
- ✅ No warnings about `semanticHighlighting` or undefined theme variables
- ✅ Significantly fewer console warnings overall

**Actual Result**: _______________

---

### Test 1.2 - Task Completed Message (Fix #7388)
**What was fixed**: "Task Completed" message rendered twice in long conversations

**How to test**:
1. Start a conversation with Cline
2. Ask it to complete a simple task: "Create a test file called hello.txt with 'Hello World'"
3. Let it complete the task
4. Scroll through the conversation history

**Expected Result**:
- ✅ Only ONE "Task Completed" message appears
- ✅ No duplicate completion messages

**Actual Result**: _______________

---

## Test Group 2: Token Usage & Context (Fixes #7373, #7371, #7383)

### Test 2.1 - Token Usage Accuracy (Fix #7373)
**What was fixed**: Critical bugs with token counting/usage

**How to test**:
1. Start a new task with Cline
2. Have a conversation (ask it to explain something about the codebase)
3. Watch the token counter in the UI
4. Make several API requests (ask multiple questions)

**Expected Result**:
- ✅ Token count increases smoothly and logically
- ✅ No sudden jumps or decreases
- ✅ Counter matches actual API usage

**Actual Result**: _______________

---

### Test 2.2 - Random Token Spikes (Fix #7371)
**What was fixed**: Unexpected token usage spikes from duplicate counting

**How to test**:
1. Continue from Test 2.1
2. Make 5-10 requests in a row
3. Monitor token usage after each request

**Expected Result**:
- ✅ No random spikes in token usage
- ✅ Each request adds a predictable amount
- ✅ No double-counting of requests

**Actual Result**: _______________

---

### Test 2.3 - Context Window Percentage (Fix #7383)
**What was fixed**: UI shows ~50% but API receives 100%

**How to test**:
1. Have a longer conversation to fill context
2. Check the context window percentage in UI
3. Compare with actual token usage numbers

**Expected Result**:
- ✅ UI percentage matches actual API usage
- ✅ When UI shows 50%, actual usage is ~50% (not 100%)
- ✅ Consistent calculation between frontend and backend

**Actual Result**: _______________

---

## Test Group 3: Commands (Fix #7379)

### Test 3.1 - /smol Command with Full Context (Fix #7379)
**What was fixed**: /smol command crashes when context window is full

**How to test**:
1. Have a long conversation to fill context to 80%+
2. Use the `/smol` command
3. Observe behavior

**Expected Result**:
- ✅ Command works without crashing
- ✅ Context is automatically truncated to make room
- ✅ No error messages about context overflow

**Actual Result**: _______________

---

### Test 3.2 - /compact Command with Full Context (Fix #7379)
**What was fixed**: /compact command crashes when context window is full

**How to test**:
1. Continue from Test 3.1 or create full context
2. Use the `/compact` command
3. Observe behavior

**Expected Result**:
- ✅ Command works without crashing
- ✅ Pre-emptive truncation occurs at 85% threshold
- ✅ Command executes successfully

**Actual Result**: _______________

---

## Test Group 4: Git & Version Control (Fix #7382)

### Test 4.1 - Git Submodules Support (Fix #7382)
**What was fixed**: Commit messages only work in top-level repo, not submodules

**How to test** (if you have submodules):
1. Navigate to a git submodule directory
2. Make a change to a file
3. Ask Cline to create a commit message
4. Check if it recognizes the submodule's git root

**Expected Result**:
- ✅ Commit messages work in submodules
- ✅ Git commands find the correct repository root
- ✅ No errors about "not a git repository"

**Actual Result**: _______________ (N/A if no submodules)

---

## Test Group 5: Model Support (Fix #7486)

### Test 5.1 - GLM/Minimax File Editing (Fix #7486)
**What was fixed**: Minimax and GLM-4.6 models can't edit files via OpenAI-compatible mode

**How to test** (if you use these models):
1. Configure Cline to use GLM-4.6 or Minimax via OpenAI-compatible endpoint
2. Ask it to edit a file: "Add a comment to line 1 of TEST_20_FIXES.md"
3. Observe if it can actually edit

**Expected Result**:
- ✅ GLM/Minimax models can edit files
- ✅ Native tool calling is enabled for these models
- ✅ No errors about unsupported operations

**Actual Result**: _______________ (N/A if not using these models)

---

## Test Group 6: API Providers (Fixes #7464, #7367)

### Test 6.1 - LiteLLM Proxy (Fix #7464)
**What was fixed**: LiteLLM proxy requires Anthropic API key when it shouldn't

**How to test** (if you use LiteLLM):
1. Configure Cline to use LiteLLM proxy
2. Don't provide an Anthropic API key
3. Try to use the extension

**Expected Result**:
- ✅ Works without Anthropic API key
- ✅ No error about missing API key
- ✅ Uses 'noop' default for optional auth

**Actual Result**: _______________ (N/A if not using LiteLLM)

---

### Test 6.2 - SAP AI Core Streaming (Fix #7367)
**What was fixed**: Streaming inference requests fail with SAP AI Core

**How to test** (if you use SAP AI Core):
1. Configure Cline to use SAP AI Core provider
2. Make a request with streaming enabled
3. Check if response streams properly

**Expected Result**:
- ✅ Streaming works with SAP AI Core
- ✅ No connection errors
- ✅ Responses arrive progressively

**Actual Result**: _______________ (N/A if not using SAP AI Core)

---

## Test Group 7: Mode Detection (Fix #7462)

### Test 7.1 - Act Mode Recognition (Fix #7462)
**What was fixed**: Cline doesn't recognize when Act mode is active

**How to test**:
1. Switch Cline to "Act" mode
2. Give it a task
3. Check if it behaves correctly in Act mode (executes without planning)

**Expected Result**:
- ✅ Act mode is explicitly detected
- ✅ No fallback to incorrect mode
- ✅ Behavior matches selected mode

**Actual Result**: _______________

---

## Test Group 8: Tool & Parameter Handling (Fixes #7469, #7467, #7393)

### Test 8.1 - Long MCP Tool Names (Fix #7469)
**What was fixed**: Tool names exceeding 64-char OpenAI limit

**How to test** (if you use MCP servers with long names):
1. Configure an MCP server with a very long tool name (>64 chars)
2. Try to use that tool
3. Check if it works

**Expected Result**:
- ✅ Tool names are intelligently truncated to 64 chars
- ✅ No errors about name length
- ✅ Tools still function correctly

**Actual Result**: _______________ (N/A if not using MCP)

---

### Test 8.2 - Parameter Dependencies (Fix #7467)
**What was fixed**: list_files missing path parameter with Claude Code provider

**How to test**:
1. Use Claude Code provider (Sonnet 4.5)
2. Ask it to list files in a directory
3. Check if parameters are included correctly

**Expected Result**:
- ✅ Required parameters are included
- ✅ Optional parameters handled correctly
- ✅ No missing parameter errors

**Actual Result**: _______________

---

### Test 8.3 - Tool Use Compatibility (Fix #7393)
**What was fixed**: "tool_use is not supported yet" error with Claude Code provider

**How to test**:
1. Use Claude Code provider
2. Perform various tool operations (read files, edit files, etc.)
3. Check for compatibility errors

**Expected Result**:
- ✅ No "tool_use is not supported" errors
- ✅ Backward compatibility maintained
- ✅ All tools work correctly

**Actual Result**: _______________

---

## Test Group 9: Terminal & Commands (Fix #7470, #7468)

### Test 9.1 - Terminal Double Quotes (Fix #7470)
**What was fixed**: Commands with quotes fail in Background Exec mode

**How to test**:
1. Enable Background Exec mode
2. Ask Cline to run a command with double quotes: `echo "Hello World"`
3. Check if it executes correctly

**Expected Result**:
- ✅ Commands with quotes execute properly
- ✅ No escaping errors
- ✅ Output shows correctly

**Actual Result**: _______________

---

### Test 9.2 - Ollama Cancellation (Fix #7468)
**What was fixed**: Ollama requests continue after cancellation

**How to test** (if you use Ollama):
1. Configure Cline to use Ollama
2. Start a long request
3. Click Cancel button
4. Check if request actually stops

**Expected Result**:
- ✅ Request stops immediately when cancelled
- ✅ No continued processing in background
- ✅ Cancellation is acknowledged

**Actual Result**: _______________ (N/A if not using Ollama)

---

## Test Group 10: JetBrains/IntelliJ (Fixes #7374, #7485, #7476, #7474)

### Test 10.1 - IntelliJ Module Resolution (Fix #7374)
**What was fixed**: "Cannot find module 'vscode'" error in IntelliJ plugin

**How to test** (if you use JetBrains IDE):
1. Open the project in IntelliJ/WebStorm/etc.
2. Install the Cline plugin
3. Try to use it

**Expected Result**:
- ✅ No "Cannot find module 'vscode'" errors
- ✅ Plugin loads correctly
- ✅ NODE_PATH and require.main.paths configured

**Actual Result**: _______________ (N/A if not using JetBrains)

---

### Test 10.2 - Codicon Font Loading (Fix #7485)
**What was fixed**: Icon font not loading in IntelliJ plugin

**How to test** (if you use JetBrains IDE):
1. Open Cline in JetBrains IDE
2. Check if icons display correctly
3. Look for missing icon boxes or font errors

**Expected Result**:
- ✅ All icons display correctly
- ✅ Codicon font loads properly
- ✅ No missing glyph errors

**Actual Result**: _______________ (N/A if not using JetBrains)

---

### Test 10.3 - Windows ARM64 Support (Fix #7476)
**What was fixed**: Plugin crashes on Windows ARM64 devices

**How to test** (if you use Windows ARM64):
1. Install plugin on Windows ARM64 device
2. Try to use it
3. Check for crashes or errors

**Expected Result**:
- ✅ Plugin works on Windows ARM64
- ✅ No platform-specific crashes
- ✅ Full functionality available

**Actual Result**: _______________ (N/A if not using Windows ARM64)

---

### Test 10.4 - MCP Server Names (Fix #7474)
**What was fixed**: Server names display as GitHub URLs in Staging

**How to test** (if you use MCP servers):
1. Configure MCP servers
2. Check how they appear in the UI
3. Verify names show correctly (not as URLs)

**Expected Result**:
- ✅ Server names display properly
- ✅ Not showing as GitHub URLs
- ✅ Human-readable names in UI

**Actual Result**: _______________ (N/A if not using MCP)

---

## Summary Test: Overall Extension Health

### General Functionality Check
1. Create a new chat
2. Ask Cline to: "Read this test file, summarize the fixes, and create a file called test-results.txt with your summary"
3. Let it complete the full workflow

**Expected Result**:
- ✅ No crashes or errors
- ✅ Smooth operation throughout
- ✅ Task completes successfully
- ✅ Token usage is accurate
- ✅ Console has minimal warnings

**Actual Result**: _______________

---

## Test Results Summary

| Test Group | Pass | Fail | N/A | Notes |
|------------|------|------|-----|-------|
| Console & UI (2 tests) | ☐ | ☐ | ☐ | |
| Token Usage (3 tests) | ☐ | ☐ | ☐ | |
| Commands (2 tests) | ☐ | ☐ | ☐ | |
| Git (1 test) | ☐ | ☐ | ☐ | |
| Model Support (1 test) | ☐ | ☐ | ☐ | |
| API Providers (2 tests) | ☐ | ☐ | ☐ | |
| Mode Detection (1 test) | ☐ | ☐ | ☐ | |
| Tools (3 tests) | ☐ | ☐ | ☐ | |
| Terminal (2 tests) | ☐ | ☐ | ☐ | |
| JetBrains (4 tests) | ☐ | ☐ | ☐ | |
| Overall Health (1 test) | ☐ | ☐ | ☐ | |

**Total Tests Run**: _____
**Tests Passed**: _____
**Tests Failed**: _____
**Tests N/A**: _____

---

## Issues Found During Testing

If you encounter any issues, document them here:

1. **Issue**:
   - **Test**:
   - **Expected**:
   - **Actual**:
   - **Severity**:

2. **Issue**:
   - **Test**:
   - **Expected**:
   - **Actual**:
   - **Severity**:

---

## Conclusion

Date Tested: _______________
Tested By: _______________
Overall Assessment: _______________

**Recommendation**:
- [ ] Ready for daily use
- [ ] Needs minor fixes
- [ ] Needs major fixes
- [ ] Revert to previous version

---

## Quick Reference: What Changed

1. ✅ Console warnings reduced (#7490)
2. ✅ GLM/Minimax can edit files (#7486)
3. ✅ IntelliJ codicon font fixed (#7485)
4. ✅ Windows ARM64 support (#7476)
5. ✅ MCP server names fixed (#7474)
6. ✅ Terminal quotes fixed (#7470)
7. ✅ MCP tool name truncation (#7469)
8. ✅ Ollama cancellation (#7468)
9. ✅ Parameter dependencies (#7467)
10. ✅ LiteLLM proxy fixed (#7464)
11. ✅ Act mode detection (#7462)
12. ✅ Claude Code tool_use (#7393)
13. ✅ Task completed duplicate (#7388)
14. ✅ Context window accuracy (#7383)
15. ✅ Git submodules (#7382)
16. ✅ /smol and /compact (#7379)
17. ✅ IntelliJ vscode module (#7374)
18. ✅ Token usage bugs (#7373)
19. ✅ Random token spikes (#7371)
20. ✅ SAP AI Core streaming (#7367)

**All 20 fixes included in version 3.37.1**
