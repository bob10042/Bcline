# Bcline Fixes Tracker - 20 Issue Batch

**Session Started**: 2025-11-16
**Target**: Fix 20 issues from cline/cline repository
**Progress**: 6 / 20 (30%)

---

## Progress Overview

```
[██████░░░░░░░░░░░░░░] 30% (6/20 complete)
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
- **Status**: ⏭️ TODO
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Estimate**: 30-45 min
- **Branch**: `fix-minimax-file-edit`
- **Description**: Minimax and glm-4.6 models can't edit files via OpenAI compatible mode
- **Files to check**: Provider integration, file editing handlers

---

### 3. Issue #7485 - IntelliJ Codicon font fails to load
- **Status**: ⏭️ TODO
- **Labels**: JetBrains
- **Difficulty**: ⭐⭐ MEDIUM
- **Estimate**: 30 min
- **Branch**: `fix-intellij-codicon-font`
- **Description**: Icon font not loading in IntelliJ plugin
- **Files to check**: IntelliJ plugin font/resource loading

---

### 4. Issue #7476 - Windows ARM64 not supported (JetBrains)
- **Status**: ⏭️ TODO
- **Labels**: bug, JetBrains
- **Difficulty**: ⭐⭐⭐ HARD
- **Estimate**: 1-2 hours
- **Branch**: `fix-windows-arm64`
- **Description**: Plugin crashes on Windows ARM64 devices
- **Files to check**: ClineDirs.kt, platform detection

---

### 5. Issue #7474 - MCP server names show as GitHub URLs
- **Status**: ⏭️ TODO
- **Labels**: bug, QA, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Estimate**: 30-45 min
- **Branch**: `fix-mcp-server-names`
- **Description**: Server names display as repo URLs in Staging
- **Files to check**: MCP configuration UI

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
- **Status**: ⏭️ TODO
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Estimate**: 30 min
- **Branch**: `fix-act-mode-detection`
- **Description**: Cline doesn't recognize when Act mode is active
- **Files to check**: Mode detection logic

---

### 12. Issue #7393 - Claude Code provider tool_use error
- **Status**: ⏭️ TODO
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Estimate**: 45-60 min
- **Branch**: `fix-claude-code-tool-use`
- **Description**: "tool_use is not supported yet" error
- **Files to check**: Claude Code provider integration

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
- **Status**: ⏭️ TODO
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐ MEDIUM
- **Estimate**: 30-45 min
- **Branch**: `fix-commit-message-submodules`
- **Description**: Commit messages don't work in submodules
- **Files to check**: Git integration, commit handler

---

## 🟢 LOWER PRIORITY FIXES (16-20)

### 16. Issue #7379 - /smol command fails with overfed context
- **Status**: ⏭️ TODO
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Estimate**: 45-60 min
- **Branch**: `fix-smol-context-overflow`
- **Description**: /smol command crashes when context window is full
- **Files to check**: /smol command handler, context management

---

### 17. Issue #7374 - Cannot find module 'vscode' in IntelliJ
- **Status**: ⏭️ TODO
- **Labels**: bug, JetBrains
- **Difficulty**: ⭐⭐⭐ HARD
- **Estimate**: 1 hour
- **Branch**: `fix-intellij-vscode-module`
- **Description**: Module resolution error in IntelliJ plugin
- **Files to check**: IntelliJ plugin module dependencies

---

### 18. Issue #7373 - Critical bug with token usage
- **Status**: ⏭️ TODO
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Estimate**: 1 hour
- **Branch**: `fix-token-usage-critical`
- **Description**: Critical issues with token counting/usage
- **Files to check**: Token management system

---

### 19. Issue #7371 - Random token spike
- **Status**: ⏭️ TODO
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Estimate**: 1 hour
- **Branch**: `fix-random-token-spike`
- **Description**: Unexpected token usage spikes
- **Files to check**: API calls, token tracking

---

### 20. Issue #7367 - SAP AI Core streaming fails
- **Status**: ⏭️ TODO
- **Labels**: bug, VS Code
- **Difficulty**: ⭐⭐⭐ HARD
- **Estimate**: 45-60 min
- **Branch**: `fix-sap-streaming`
- **Description**: Streaming inference requests fail with SAP AI Core
- **Files to check**: SAP AI Core provider, streaming handler

---

## Statistics

**Total Issues**: 20
**Completed**: 6 (30%)
**In Progress**: 0
**Remaining**: 14 (70%)

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
**Current Task**: 6 fixes completed and pushed
**Completed Fixes**:
- #7490 - VSCode theme warnings (commit b973e15)
- #7469 - Tool name length (commit 9515cd4)
- #7467 - Sonnet 4.5 missing path (commit ef237b7)
- #7388 - Task Completed duplicate (commit 5177d47)
- #7383 - Context window mismatch (commit 67f4dc2)
- #7464 - LiteLLM proxy API key (commit ddefc6b)

All fixes pushed to branch: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
