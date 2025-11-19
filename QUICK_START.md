# Bcline - Quick Start Guide

## Update & Rebuild Extension

To update your Bcline extension with all your latest fixes from GitHub:

### One Command:
```bash
./UPDATE_EXTENSION.sh
```

This will:
1. ✅ Fetch latest from GitHub
2. ✅ Switch to branch with all your fixes
3. ✅ Pull latest changes
4. ✅ Install dependencies
5. ✅ Build VSIX package
6. ✅ Backup to builds/ folder
7. ✅ Install into VS Code

### After Running:
- Close VS Code completely (quit the app)
- Reopen VS Code
- Your extension now has all your latest fixes!

---

## Important Files

- **[UPDATE_EXTENSION.sh](UPDATE_EXTENSION.sh)** - Rebuild and install extension
- **[builds/](builds/)** - VSIX backups stored here
- **[tests/CLI_STRESS_TEST_CODING_ERRORS.md](tests/CLI_STRESS_TEST_CODING_ERRORS.md)** - Test CLI error detection (comprehensive)
- **[tests/CLI_ERROR_DETECTION_TEST.md](tests/CLI_ERROR_DETECTION_TEST.md)** - Test CLI error detection (quick)

---

## Repository Structure

- `origin` → Your Bcline repo (github.com/bob10042/Bcline)
- `upstream` → Original Cline repo (github.com/cline/cline)

### Main Branches:
- `main` - Base branch
- `claude/continue-next-tasks-...` - **All your bug fixes are here** (this is what gets built)

---

## Testing

After rebuilding, test the CLI error detection fix:

1. Open new Cline conversation
2. Copy contents of [tests/CLI_STRESS_TEST_CODING_ERRORS.md](tests/CLI_STRESS_TEST_CODING_ERRORS.md)
3. Paste into Cline
4. Watch it detect 30-40+ errors throughout the workflow

Expected: Cline should show "⚠️ ERROR DETECTED" and "Command failed with exit code X" messages.

---

## Quick Reference

| Task | Command |
|------|---------|
| Update extension | `./UPDATE_EXTENSION.sh` |
| Check current branch | `git branch --show-current` |
| View latest commits | `git log --oneline -5` |
| List VSIX backups | `ls -lh builds/` |
