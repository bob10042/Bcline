# Test Plan for 46 Fixes (Excluding Diff/Truncation)

**Date**: 2025-11-17
**Extension Version**: 3.37.2
**Total Fixes**: 47 (Testing 46, Diff fix already verified)

---

## 🎯 Test Categories

### ✅ Automated Tests (Can Run Now)
These can be tested programmatically:
- Code quality fixes (4)
- Error handling improvements (5)
- Error logging fixes (14)
- Build & compilation (3)

### 🖥️ Manual Tests (Require Extension Use)
These require running the extension:
- Token usage fixes (2)
- Console warnings (1)
- UI improvements (5)
- Git features (1)
- Commands (2)

### 🔧 Provider-Specific Tests (Optional)
These require specific providers:
- Model support (1)
- API providers (2)
- Terminal features (2)
- JetBrains features (4)

---

## PART 1: Automated Tests ✅

### Build & Compilation Tests

#### Test 1.1 - TypeScript Compilation
**Fixes Tested**: Batch 2 (unused imports), tooling fixes
```bash
npm run compile
```
**Expected**: ✅ No compilation errors
**Actual**: ___________

#### Test 1.2 - Unit Tests
**Fixes Tested**: All code quality fixes
```bash
npm run test:unit
```
**Expected**: ✅ All tests pass
**Actual**: ___________

#### Test 1.3 - Build Package
**Fixes Tested**: All fixes together
```bash
npm run package
```
**Expected**: ✅ Creates .vsix file successfully
**Actual**: ___________

---

### Code Quality Verification

#### Test 2.1 - Check Batch 2 Fixes (4 bugs)
**Fixed Files**:
1. `grpc-handler.ts` (2 locations) - Removed unused imports
2. `ExternalDiffviewProvider.ts` - Removed unused import
3. `DiffViewProvider.ts` - Removed unused import
4. `tasks.ts` - Fixed parseInt usage

**Verification**:
```bash
# Check for compilation errors in these files
npx tsc --noEmit src/integrations/editor/ExternalDiffviewProvider.ts
npx tsc --noEmit src/integrations/editor/DiffViewProvider.ts
npx tsc --noEmit src/core/webview/task/tasks.ts
```
**Expected**: ✅ No errors
**Actual**: ___________

---

### Error Handling Verification

#### Test 3.1 - Check Batch 3 Fixes (5 bugs)
**Fixed Files**:
1. `src/utils/path/ifFileExistsRelativePath.ts` - Improved error messages
2. Deep-planning shell detection - Added error logging
3. `src/services/browser/BrowserSession.ts` - Added try-catch
4. `src/services/auth/providers/ClineAuthProvider.ts` - Improved error handling
5. `src/integrations/grpc/grpc-client-base.ts` - Cleanup and error handling

**Verification**: Check files contain proper error handling
```bash
# Verify error messages exist in these files
grep -n "console.error" src/utils/path/ifFileExistsRelativePath.ts
grep -n "console.error" src/services/browser/BrowserSession.ts
grep -n "console.error" src/services/auth/providers/ClineAuthProvider.ts
```
**Expected**: ✅ Files contain console.error calls
**Actual**: ___________

---

### Error Logging Verification (Batch 4)

#### Test 4.1 - Console.log → Console.error Fixes (6 bugs)
**Fixed Files**:
1. `src/core/task/ToolExecutor.ts:254`
2. `src/services/logging/Logger.ts:37`
3. `src/services/logging/distinctId.ts:48`
4. `src/core/task/focus-chain/index.ts:239`
5. `src/services/EnvUtils.ts:26`
6. `src/services/EnvUtils.ts:38`

**Verification**:
```bash
# Check that errors use console.error (not console.log)
grep -n "console.error" src/core/task/ToolExecutor.ts | head -5
grep -n "console.error" src/services/logging/Logger.ts | head -5
grep -n "console.error" src/services/logging/distinctId.ts | head -5
grep -n "console.error" src/core/task/focus-chain/index.ts | head -5
grep -n "console.error" src/services/EnvUtils.ts | head -5
```
**Expected**: ✅ All files use console.error for errors
**Actual**: ___________

#### Test 4.2 - Empty Error Messages Fixed (2 bugs)
**Fixed Files**:
1. `src/core/assistant-message/diff.ts:732`
2. `src/core/assistant-message/diff.ts:761`

**Verification**:
```bash
# Check that Error() calls have descriptive messages
grep -A2 "new Error" src/core/assistant-message/diff.ts | grep -v "^--$"
```
**Expected**: ✅ No empty Error() calls
**Actual**: ___________

#### Test 4.3 - JSON.parse Crash Prevention (1 bug)
**Fixed File**: `src/integrations/misc/extract-text.ts:79`

**Verification**:
```bash
# Check for try-catch around JSON.parse
grep -A5 "JSON.parse" src/integrations/misc/extract-text.ts | grep -E "(try|catch)"
```
**Expected**: ✅ JSON.parse wrapped in try-catch
**Actual**: ___________

---

## PART 2: Manual Tests (Extension Usage) 🖥️

### Token Usage Tests

#### Test 5.1 - Token Usage Accuracy (Fix #7373)
**What was fixed**: Critical bugs with token counting

**How to test**:
1. Start Bcline extension
2. Open Developer Console (Ctrl+Shift+I)
3. Start a new task
4. Make 5-10 requests
5. Watch token counter

**Expected**:
- ✅ Token count increases smoothly
- ✅ No sudden jumps or decreases
- ✅ Counter matches actual API usage

**Actual**: ___________

---

#### Test 5.2 - Random Token Spikes Fixed (Fix #7371)
**What was fixed**: Unexpected token usage spikes from duplicate counting

**How to test**:
1. Continue from Test 5.1
2. Make 10 more requests
3. Monitor token usage after each request

**Expected**:
- ✅ No random spikes in token usage
- ✅ Each request adds predictable amount
- ✅ No double-counting of requests

**Actual**: ___________

---

### Console & UI Tests

#### Test 6.1 - Console Warnings Reduced (Fix #7490)
**What was fixed**: VSCode console warnings about undefined theme variables

**How to test**:
1. Open Developer Console (Ctrl+Shift+I)
2. Clear console
3. Open Bcline extension panel
4. Switch between light/dark theme

**Expected**:
- ✅ No warnings about semanticHighlighting
- ✅ No undefined theme variable warnings
- ✅ Significantly fewer console warnings overall

**Actual**: ___________

---

#### Test 6.2 - Task Completed Message (Fix #7388)
**What was fixed**: "Task Completed" message rendered twice

**How to test**:
1. Start a conversation with Bcline
2. Complete a simple task
3. Scroll through conversation history

**Expected**:
- ✅ Only ONE "Task Completed" message
- ✅ No duplicate completion messages

**Actual**: ___________

---

#### Test 6.3 - Context Window Percentage (Fix #7383)
**What was fixed**: UI shows ~50% but API receives 100%

**How to test**:
1. Have a longer conversation to fill context
2. Check context window percentage in UI
3. Compare with actual token usage numbers

**Expected**:
- ✅ UI percentage matches actual API usage
- ✅ Consistent calculation between frontend and backend

**Actual**: ___________

---

### Command Tests

#### Test 7.1 - /smol Command with Full Context (Fix #7379)
**What was fixed**: /smol command crashes when context window is full

**How to test**:
1. Have a long conversation to fill context to 80%+
2. Use the `/smol` command
3. Observe behavior

**Expected**:
- ✅ Command works without crashing
- ✅ Context is automatically truncated
- ✅ No error messages about context overflow

**Actual**: ___________

---

#### Test 7.2 - /compact Command with Full Context (Fix #7379)
**What was fixed**: /compact command crashes when context window is full

**How to test**:
1. Continue from Test 7.1 or create full context
2. Use the `/compact` command
3. Observe behavior

**Expected**:
- ✅ Command works without crashing
- ✅ Pre-emptive truncation occurs at 85% threshold
- ✅ Command executes successfully

**Actual**: ___________

---

### Git Features

#### Test 8.1 - Git Submodules Support (Fix #7382)
**What was fixed**: Commit messages only work in top-level repo, not submodules

**How to test** (if you have submodules):
1. Navigate to a git submodule directory
2. Make a change to a file
3. Ask Bcline to create a commit message
4. Check if it recognizes the submodule's git root

**Expected**:
- ✅ Commit messages work in submodules
- ✅ Git commands find correct repository root
- ✅ No errors about "not a git repository"

**Actual**: ___________ (N/A if no submodules)

---

### Mode Detection

#### Test 9.1 - Act Mode Recognition (Fix #7462)
**What was fixed**: Bcline doesn't recognize when Act mode is active

**How to test**:
1. Switch Bcline to "Act" mode
2. Give it a task
3. Check if it behaves correctly in Act mode (executes without planning)

**Expected**:
- ✅ Act mode is explicitly detected
- ✅ No fallback to incorrect mode
- ✅ Behavior matches selected mode

**Actual**: ___________

---

## PART 3: Provider-Specific Tests (Optional) 🔧

### Model Support

#### Test 10.1 - GLM/Minimax File Editing (Fix #7486)
**What was fixed**: Minimax and GLM-4.6 models can't edit files via OpenAI-compatible mode

**How to test** (if you use these models):
1. Configure Bcline to use GLM-4.6 or Minimax via OpenAI-compatible endpoint
2. Ask it to edit a file
3. Observe if it can actually edit

**Expected**:
- ✅ GLM/Minimax models can edit files
- ✅ Native tool calling is enabled for these models

**Actual**: ___________ (N/A if not using these models)

---

### API Provider Tests

#### Test 11.1 - LiteLLM Proxy (Fix #7464)
**What was fixed**: LiteLLM proxy requires Anthropic API key when it shouldn't

**How to test** (if you use LiteLLM):
1. Configure Bcline to use LiteLLM proxy
2. Don't provide an Anthropic API key
3. Try to use the extension

**Expected**:
- ✅ Works without Anthropic API key
- ✅ No error about missing API key
- ✅ Uses 'noop' default for optional auth

**Actual**: ___________ (N/A if not using LiteLLM)

---

#### Test 11.2 - SAP AI Core Streaming (Fix #7367)
**What was fixed**: Streaming inference requests fail with SAP AI Core

**How to test** (if you use SAP AI Core):
1. Configure Bcline to use SAP AI Core provider
2. Make a request with streaming enabled
3. Check if response streams properly

**Expected**:
- ✅ Streaming works with SAP AI Core
- ✅ No connection errors
- ✅ Responses arrive progressively

**Actual**: ___________ (N/A if not using SAP AI Core)

---

### Terminal & Tool Tests

#### Test 12.1 - Terminal Double Quotes (Fix #7470)
**What was fixed**: Commands with quotes fail in Background Exec mode

**How to test**:
1. Enable Background Exec mode
2. Ask Bcline to run: `echo "Hello World"`
3. Check if it executes correctly

**Expected**:
- ✅ Commands with quotes execute properly
- ✅ No escaping errors
- ✅ Output shows correctly

**Actual**: ___________

---

#### Test 12.2 - Long MCP Tool Names (Fix #7469)
**What was fixed**: Tool names exceeding 64-char OpenAI limit

**How to test** (if you use MCP servers with long names):
1. Configure an MCP server with a very long tool name (>64 chars)
2. Try to use that tool
3. Check if it works

**Expected**:
- ✅ Tool names are intelligently truncated to 64 chars
- ✅ No errors about name length
- ✅ Tools still function correctly

**Actual**: ___________ (N/A if not using MCP)

---

#### Test 12.3 - Parameter Dependencies (Fix #7467)
**What was fixed**: list_files missing path parameter with Claude Code provider

**How to test**:
1. Use Claude Code provider (Sonnet 4.5)
2. Ask it to list files in a directory
3. Check if parameters are included correctly

**Expected**:
- ✅ Required parameters are included
- ✅ Optional parameters handled correctly
- ✅ No missing parameter errors

**Actual**: ___________

---

#### Test 12.4 - Tool Use Compatibility (Fix #7393)
**What was fixed**: "tool_use is not supported yet" error with Claude Code provider

**How to test**:
1. Use Claude Code provider
2. Perform various tool operations (read files, edit files, etc.)
3. Check for compatibility errors

**Expected**:
- ✅ No "tool_use is not supported" errors
- ✅ Backward compatibility maintained
- ✅ All tools work correctly

**Actual**: ___________

---

## PART 4: JetBrains Tests (Optional - IntelliJ Users) 🧩

#### Test 13.1 - IntelliJ Module Resolution (Fix #7374)
**What was fixed**: "Cannot find module 'vscode'" error in IntelliJ plugin

**How to test** (if you use JetBrains IDE):
1. Open the project in IntelliJ/WebStorm/etc.
2. Install the Bcline plugin
3. Try to use it

**Expected**:
- ✅ No "Cannot find module 'vscode'" errors
- ✅ Plugin loads correctly

**Actual**: ___________ (N/A if not using JetBrains)

---

#### Test 13.2 - Codicon Font Loading (Fix #7485)
**What was fixed**: Icon font not loading in IntelliJ plugin

**How to test** (if you use JetBrains IDE):
1. Open Bcline in JetBrains IDE
2. Check if icons display correctly
3. Look for missing icon boxes or font errors

**Expected**:
- ✅ All icons display correctly
- ✅ Codicon font loads properly

**Actual**: ___________ (N/A if not using JetBrains)

---

#### Test 13.3 - Windows ARM64 Support (Fix #7476)
**What was fixed**: Plugin crashes on Windows ARM64 devices

**How to test** (if you use Windows ARM64):
1. Install plugin on Windows ARM64 device
2. Try to use it
3. Check for crashes or errors

**Expected**:
- ✅ Plugin works on Windows ARM64
- ✅ No platform-specific crashes

**Actual**: ___________ (N/A if not using Windows ARM64)

---

#### Test 13.4 - MCP Server Names (Fix #7474)
**What was fixed**: Server names display as GitHub URLs in Staging

**How to test** (if you use MCP servers):
1. Configure MCP servers
2. Check how they appear in the UI
3. Verify names show correctly (not as URLs)

**Expected**:
- ✅ Server names display properly
- ✅ Not showing as GitHub URLs

**Actual**: ___________ (N/A if not using MCP)

---

## Quick Automated Test Run

You can run all automated tests at once:

```bash
# Navigate to Bcline directory
cd C:\Users\bob43\Downloads\Bcline

# Run all automated tests
echo "=== Test 1: TypeScript Compilation ==="
npm run compile

echo ""
echo "=== Test 2: Unit Tests ==="
npm run test:unit

echo ""
echo "=== Test 3: Build Package ==="
npm run package

echo ""
echo "=== Test 4: Code Quality Checks ==="
grep -n "console.error" src/core/task/ToolExecutor.ts | head -3
grep -n "console.error" src/services/logging/Logger.ts | head -3
grep -n "console.error" src/services/EnvUtils.ts | head -3

echo ""
echo "=== Test 5: Error Handling Verification ==="
grep -A2 "new Error" src/core/assistant-message/diff.ts | grep -v "^--$" | head -10

echo ""
echo "=== Test 6: JSON.parse Safety ==="
grep -A5 "JSON.parse" src/integrations/misc/extract-text.ts | grep -E "(try|catch)"

echo ""
echo "=== All Automated Tests Complete ==="
```

---

## Test Results Summary

### Automated Tests (23 fixes)
| Category | Tests | Pass | Fail | Notes |
|----------|-------|------|------|-------|
| Build & Compilation | 3 | ☐ | ☐ | |
| Code Quality (Batch 2) | 4 | ☐ | ☐ | |
| Error Handling (Batch 3) | 5 | ☐ | ☐ | |
| Error Logging (Batch 4) | 14 | ☐ | ☐ | |
| Tooling Fixes | 3 | ☐ | ☐ | |

### Manual Tests (18 fixes)
| Category | Tests | Pass | Fail | Notes |
|----------|-------|------|------|-------|
| Token Usage | 2 | ☐ | ☐ | |
| Console & UI | 3 | ☐ | ☐ | |
| Commands | 2 | ☐ | ☐ | |
| Git Features | 1 | ☐ | ☐ | |
| Mode Detection | 1 | ☐ | ☐ | |
| Model Support | 1 | ☐ | ☐ | |
| API Providers | 2 | ☐ | ☐ | |
| Terminal & Tools | 4 | ☐ | ☐ | |
| JetBrains | 4 | ☐ | ☐ | |

**Total Fixes to Test**: 46
**Diff Fix (Already Verified)**: 1
**Grand Total**: 47 fixes

---

## Next Steps

1. **Run Automated Tests First** (Quick - 5 minutes)
   ```bash
   npm run compile && npm run test:unit && npm run package
   ```

2. **Run Manual Tests** (Moderate - 30 minutes)
   - Start with token usage and console tests
   - Test commands if you use them
   - Skip provider-specific tests if not applicable

3. **Document Results**
   - Fill in checkboxes as you go
   - Note any failures
   - Save this file with results

4. **Report Issues**
   - If any tests fail, document in GitHub issues
   - Reference specific fix numbers
   - Include error messages

---

**Test Date**: ___________
**Tested By**: ___________
**Overall Result**: ___________

---

## All 46 Fixes Being Tested

### Batch 1 - GitHub Issues (20 fixes)
1. #7490 - Console warnings
2. #7486 - GLM/Minimax file editing
3. #7485 - IntelliJ Codicon font
4. #7476 - Windows ARM64 support
5. #7474 - MCP server names
6. #7470 - Terminal double quotes
7. #7469 - MCP tool name truncation
8. #7468 - Ollama cancellation
9. #7467 - Parameter dependencies
10. #7464 - LiteLLM proxy
11. #7462 - Act mode detection
12. #7393 - Claude Code tool_use
13. #7388 - Task completed duplicate
14. #7383 - Context window accuracy
15. #7382 - Git submodules
16. #7379 - /smol and /compact
17. #7374 - IntelliJ vscode module
18. #7373 - Token usage bugs
19. #7371 - Random token spikes
20. #7367 - SAP AI Core streaming

### Batch 2 - Code Quality (4 fixes)
21. grpc-handler.ts unused imports (2 locations)
22. ExternalDiffviewProvider.ts unused import
23. DiffViewProvider.ts unused import
24. tasks.ts parseInt usage

### Batch 3 - Error Handling (5 fixes)
25. ifFileExistsRelativePath.ts error messages
26. Deep-planning shell detection error logging
27. BrowserSession.ts error handling
28. ClineAuthProvider.ts error handling
29. grpc-client-base.ts cleanup

### Batch 4 - Error Logging (14 fixes)
30. ToolExecutor.ts:254 console.error
31. Logger.ts:37 console.error
32. distinctId.ts:48 console.error
33. focus-chain/index.ts:239 console.error
34. EnvUtils.ts:26 console.error
35. EnvUtils.ts:38 console.error
36. diff.ts:732 error message
37. diff.ts:761 error message
38. extract-text.ts:79 JSON.parse crash fix

### Tooling Fixes (3 fixes)
39. TypeScript configuration errors in webview-ui
40. triggerApplyStandardContextTruncationNoticeChange parameters
41. Windows shell detection comment

**Total**: 46 fixes (excluding diff/truncation fix #1)

---

**Ready to test!** Start with the automated tests, they're the quickest.
