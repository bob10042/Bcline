# TODO - Remaining Bcline Issues

## ✅ Completed (4/5)

- [x] **Issue #7470** - Terminal double quotes in Background Exec
  - Branch: `fix-terminal-double-quotes`
  - PR: https://github.com/cline/cline/pull/7483
  - Status: ✅ Submitted, awaiting review

- [x] **Issue #7468** - Ollama API not cancelled
  - Branch: `fix-ollama-cancellation`
  - PR: https://github.com/cline/cline/pull/7484
  - Status: ✅ Submitted, awaiting review

- [x] **Issue #7474** - MCP server names show as GitHub URLs in Staging
  - Branch: `claude/work-in-progress-017n9F9ivbEfaZGo9XRX6xFx`
  - Commit: `61425be`
  - Status: ✅ Fixed, committed and pushed
  - **Fix**: Added URL detection and extraction logic in `getMcpServerDisplayName()`

- [x] **Issue #7469** - Tool name exceeds 64-char limit
  - Branch: `claude/work-in-progress-017n9F9ivbEfaZGo9XRX6xFx`
  - Commit: `83db309`
  - Status: ✅ Fixed, committed and pushed
  - **Fix**: Added `createMcpToolName()` to enforce 64-char limit with proportional truncation

---

## ⏭️ Remaining (1/5)

- [ ] **Issue #7476** - Windows ARM64 not supported (JetBrains)
  - **URL**: https://github.com/cline/cline/issues/7476
  - **Difficulty**: ⭐⭐⭐ HARD
  - **Estimate**: 1-2 hours
  - **Branch**: `fix-windows-arm64` (create)

  **Problem**: Plugin crashes on Windows ARM64 devices (Surface Laptop)

  **Error**:
  ```
  Caused by: java.lang.IllegalStateException: Unsupported platform: windows 11 aarch64
  at bot.cline.intellij.ClineDirs.PLATFORM_NAME_delegate
  ```

  **Files to Check**:
  - `ClineDirs.kt` (JetBrains plugin)
  - Platform detection logic
  - Build configuration

  **Expected Fix**:
  - Add Windows ARM64 to supported platforms
  - Handle x64 emulation fallback

---

## Quick Commands

### Start Next Issue (#7474)
```bash
cd "c:\Users\bob43\Downloads\Bcline"
git checkout main
git checkout -b fix-mcp-server-names

# Find the code
grep -r "MCP.*server" src/ | grep -i "name\|display"
```

### Check PR Status
```bash
gh pr list --repo cline/cline --author bob10042
gh pr view 7483 --repo cline/cline
gh pr view 7484 --repo cline/cline
```

### Resume Session
```bash
cat RESUME_SESSION.md
```

---

## Session Files

- **RESUME_SESSION.md** - Quick recovery guide
- **ISSUE_FIX_SESSION.md** - Detailed session log
- **CONTRIBUTING_WORKFLOW.md** - Full workflow documentation
- **TODO.md** - This file (task checklist)

---

## Progress

```
╔══════════════════════════════════════╗
║  BCLINE ISSUE FIXES                  ║
║  Progress: 4 / 5 (80%)              ║
╚══════════════════════════════════════╝

[████████████████░░░░] 80%

✅ Terminal quotes (PR #7483)
✅ Ollama cancel (PR #7484)
✅ MCP server names (Commit 61425be)
✅ Tool name length (Commit 83db309)
⏭️ Windows ARM64 ← REMAINING
```

---

**Last Updated**: 2025-11-15
**Status**: 4 of 5 issues completed! Remaining: #7476 (Windows ARM64)
