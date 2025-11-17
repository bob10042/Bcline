# 🚀 Quick Bug Fix Reference Card

## One Command to Rule Them All

```
/fix-and-deploy <bug description>
```

That's it! Everything else is automatic.

---

## What Happens Automatically

```
1. 🔍 Analyzes bug          ← Claude investigates
2. 🔧 Implements fix        ← Code changes applied
3. 📝 Git commit            ← Detailed commit message
4. ☁️  Pushes to remote     ← Syncs with GitHub
5. 🏗️  Rebuilds extension   ← npm run package
6. 📦 Packages VSIX         ← Timestamped file
7. 🔌 Installs in VS Code   ← Ready to use
8. ✅ Verification report   ← What was changed
```

Total time: **~30 seconds**

---

## Usage Examples

### Example 1: Simple Bug
```
/fix-and-deploy The error warning isn't being stored as a message
```

### Example 2: Specific Location
```
/fix-and-deploy Fix validation at src/core/task/tools/handlers/AttemptCompletionHandler.ts:57
```

### Example 3: Multiple Issues
```
/fix-and-deploy Fix error detection system:
- index.ts:1888 doesn't store warnings
- AttemptCompletionHandler.ts:57 only checks command_output
```

---

## Alternative: Quick Deploy Script

If you already fixed the bug manually:

**Windows:**
```powershell
.\scripts\auto-fix-deploy.ps1 "fix: Your message"
```

**Mac/Linux:**
```bash
./scripts/auto-fix-deploy.sh "fix: Your message"
```

---

## After Deployment

1. **Reload VS Code**
   - Press `Ctrl+Shift+P`
   - Type "Reload Window"
   - Press Enter

2. **Test the fix**
   - Run your test case
   - Verify the bug is gone

3. **Done!** 🎉

---

## Troubleshooting

### Script fails?
```bash
npm run clean:build
npm run package
```

### Extension not loading?
- Reload VS Code window
- Check: Help → Toggle Developer Tools → Console

### Git conflicts?
```bash
git stash
git pull --rebase
git stash pop
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `.claude/commands/fix-and-deploy.md` | Slash command definition |
| `scripts/auto-fix-deploy.ps1` | PowerShell automation |
| `scripts/auto-fix-deploy.sh` | Bash automation |
| `AUTOMATED_FIX_GUIDE.md` | Complete documentation |
| `QUICK_FIX_REFERENCE.md` | This reference card |

---

## Pro Tips

✅ **Test first** - Fix locally, test, then deploy
✅ **One fix per deploy** - Don't bundle unrelated changes
✅ **Good commit messages** - Be descriptive
✅ **Keep backup VSIXs** - Timestamped for rollback
✅ **Always reload** - VS Code needs restart after install

---

**Need help?** Read `AUTOMATED_FIX_GUIDE.md` for detailed instructions.

**Ready to fix?** Just type:
```
/fix-and-deploy <your bug description>
```
