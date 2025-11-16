# Bcline Fixes Tracker - 20 Issue Batch

**Session Started**: 2025-11-16
**Target**: Fix 20 issues from cline/cline repository
**Progress**: 20 / 20 (100%) ✅ COMPLETE!

---

## Progress Overview

```
[████████████████████] 100% (20/20 complete) ✅
```

---

## 🔴 HIGH PRIORITY FIXES (1-10)

### 1. Issue #7490 - VSCode console warnings (theme variable undefined)
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐ EASY
- **Estimate**: 15-20 min
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: b973e15
- **Description**: Console warnings about undefined theme variables
- **Solution**: Added semantic tokens provider and onDidChange event to suppress warnings

---

### 2. Issue #7486 - Minimax-m2 unable to edit files
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 65f9b7c
- **Description**: Minimax and glm-4.6 models can't edit files via OpenAI compatible mode
- **Solution**: Added isGLMModelFamily() to isNextGenModelFamily() check to enable native tool calling

---

### 3. Issue #7485 - IntelliJ Codicon font fails to load
- **Status**: ✅ DONE
- **Labels**: JetBrains
- **Difficulty**: ⭐⭐ MEDIUM
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 42d2502
- **Description**: Icon font not loading in IntelliJ plugin
- **Solution**: Removed redundant CSS link, let Vite bundle codicon font properly through index.css import

---

### 4. Issue #7476 - Windows ARM64 not supported (JetBrains)
- **Status**: ✅ DONE
- **Labels**: bug, JetBrains
- **Difficulty**: ⭐⭐⭐ HARD
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 28ba257
- **Description**: Plugin crashes on Windows ARM64 devices
- **Solution**: Added Windows ARM64 platform support for JetBrains plugin

---

### 5. Issue #7474 - MCP server names show as GitHub URLs
- **Status**: ✅ DONE
- **Labels**: bug, QA, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 61425be
- **Description**: Server names display as repo URLs in Staging
- **Solution**: Fixed MCP server names showing as GitHub URLs in Staging

---

### 6. Issue #7470 - Terminal double quotes broken
- **Status**: ✅ DONE (PR #7483)
- **Labels**: bug
- **Difficulty**: ⭐⭐ MEDIUM
- **Branch**: `fix-terminal-double-quotes`
- **Description**: Commands with quotes fail in Background Exec mode
- **PR**: https://github.com/cline/cline/pull/7483

---

### 7. Issue #7469 - Tool name exceeds 64-char limit
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Estimate**: 20-30 min
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 9515cd4
- **Description**: Tool name is 68 chars, OpenAI limit is 64
- **Solution**: Implemented intelligent truncation for MCP tool names to meet 64-char limit

---

### 8. Issue #7468 - Ollama API not cancelled
- **Status**: ✅ DONE (PR #7484)
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Branch**: `fix-ollama-cancellation`
- **Description**: Ollama requests continue after cancellation
- **PR**: https://github.com/cline/cline/pull/7484

---

### 9. Issue #7467 - Sonnet 4.5 missing path parameter
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Estimate**: 20-30 min
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: ef237b7
- **Description**: list_files missing path parameter with Claude Code provider
- **Solution**: Added parameter dependency checking for native tool calls to prevent incorrect parameter inclusion

---

### 10. Issue #7464 - LiteLLM proxy API key error
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Estimate**: 30 min
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: ddefc6b
- **Description**: Requires Anthropic key when using LiteLLM proxy
- **Solution**: Removed unnecessary API key validation, allowing optional auth with 'noop' default

---

## 🟡 MEDIUM PRIORITY FIXES (11-15)

### 11. Issue #7462 - Act mode not recognized
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Estimate**: 30 min
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 5cf17d8
- **Description**: Cline doesn't recognize when Act mode is active
- **Solution**: Made mode detection explicit for both 'plan' and 'act' instead of using fallback else clause

---

### 12. Issue #7393 - Claude Code provider tool_use error
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: c151d71
- **Description**: "tool_use is not supported yet" error
- **Solution**: Handle tool_use blocks in Claude Code backward compatibility path

---

### 13. Issue #7388 - "Task Completed" rendered twice
- **Status**: ✅ DONE
- **Labels**: bug, QA, VS Code
- **Difficulty**: ⭐ EASY
- **Estimate**: 15-20 min
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 5177d47
- **Description**: Duplicate "Task Completed" message in long conversations
- **Solution**: Fixed partial message removal to handle all partial completion messages in long conversations

---

### 14. Issue #7383 - Context window usage mismatch
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Estimate**: 1 hour
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 67f4dc2
- **Description**: UI shows ~50% but API receives 100%
- **Solution**: Use maxAllowedSize instead of contextWindow for percentage calculations in both backend and frontend

---

### 15. Issue #7382 - Commit message only supports top-level repo
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 557174e
- **Description**: Commit messages don't work in submodules
- **Solution**: Added getGitRoot() to find actual repository root, updated getGitDiff() and getWorkingState()

---

## 🟢 LOWER PRIORITY FIXES (16-20)

### 16. Issue #7379 - /smol command fails with overfed context
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 81f6b31
- **Description**: /smol command crashes when context window is full
- **Solution**: Added pre-emptive context truncation when /smol or /compact detected at 85% capacity threshold

---

### 17. Issue #7374 - Cannot find module 'vscode' in IntelliJ
- **Status**: ✅ DONE
- **Labels**: bug, JetBrains
- **Difficulty**: ⭐⭐⭐ HARD
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 6cae82d
- **Description**: Module resolution error in IntelliJ plugin
- **Solution**: Set NODE_PATH environment variable and updated require.main.paths for vscode stub module resolution

---

### 18. Issue #7373 - Critical bug with token usage
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 7534c89
- **Description**: Critical issues with token counting/usage
- **Solution**: Fixed combineApiRequests() logic with Map-based lookups and proper message pairing

---

### 19. Issue #7371 - Random token spike
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 7534c89
- **Description**: Unexpected token usage spikes
- **Solution**: Added timestamp deduplication in getApiMetrics() to prevent double-counting API requests

---

### 20. Issue #7367 - SAP AI Core streaming fails
- **Status**: ✅ DONE
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
- **Commit**: 20d9dc9
- **Description**: Streaming inference requests fail with SAP AI Core
- **Solution**: Fixed SAP AI Core streaming inference requests

---

## Statistics

**Total Issues**: 20
**Completed**: 20 (100%) ✅
**In Progress**: 0
**Remaining**: 0 (0%)

**By Difficulty**:
- ⭐ EASY: 2 issues (~30 min total)
- ⭐⭐ MEDIUM: 9 issues (~5 hours total)
- ⭐⭐⭐ HARD: 9 issues (~12 hours total)

**By Platform**:
- VS Code: 15 issues
- JetBrains: 3 issues
- Both: 2 issues

**Estimated Total Time**: ~17-20 hours

---

## Workflow for Each Fix

1. **Create branch**: `git checkout -b fix-issue-name`
2. **Investigate**: Read issue, locate code, understand problem
3. **Fix**: Implement solution
4. **Test**: Verify fix works
5. **Commit**: `git commit -m "Fix: description (Fixes #XXXX)"`
6. **Push**: `git push -u origin fix-issue-name`
7. **PR**: Create pull request to cline/cline
8. **Update tracker**: Mark as complete in this file

---

## Quick Commands

### Start next issue
```bash
# Pick issue from list above
git checkout -b fix-issue-name
```

### Check progress
```bash
cat FIXES_TRACKER.md
```

### View all your PRs
```bash
gh pr list --repo cline/cline --author bob10042
```

---

**Last Updated**: 2025-11-16
**Current Task**: ✅ ALL 20 FIXES COMPLETED!

## All Completed Fixes (20/20):

### Session 1 - Previously Completed (13 fixes):
1. #7490 - VSCode theme warnings (commit b973e15)
2. #7469 - Tool name length (commit 9515cd4)
3. #7467 - Sonnet 4.5 missing path (commit ef237b7)
4. #7388 - Task Completed duplicate (commit 5177d47)
5. #7383 - Context window mismatch (commit 67f4dc2)
6. #7464 - LiteLLM proxy API key (commit ddefc6b)
7. #7462 - Act mode detection (commit 5cf17d8)
8. #7476 - Windows ARM64 support (commit 28ba257)
9. #7474 - MCP server names (commit 61425be)
10. #7470 - Terminal double quotes (commit a7469eb)
11. #7468 - Ollama cancellation (commit ad5e527)
12. #7393 - Claude Code tool_use (commit c151d71)
13. #7367 - SAP AI Core streaming (commit 20d9dc9)

### Session 2 - New Fixes (7 fixes):
14. #7486 - Minimax-m2/GLM file editing (commit 65f9b7c)
15. #7485 - IntelliJ Codicon font (commit 42d2502)
16. #7382 - Commit message submodules (commit 557174e)
17. #7379 - /smol context overflow (commit 81f6b31)
18. #7374 - IntelliJ vscode module (commit 6cae82d)
19. #7373 - Token usage critical bug (commit 7534c89)
20. #7371 - Random token spike (commit 7534c89)

**All fixes pushed to branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
**Status**: 🎉 100% Complete - Ready to Push!
