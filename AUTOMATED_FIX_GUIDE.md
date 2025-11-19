# 🚀 Automated Bug Fix & Deployment Guide

This guide explains how to use the automated bug fix workflow to quickly fix, commit, rebuild, and deploy changes to the Bcline VS Code extension.

---

## 📋 Quick Reference

### Method 1: Claude Slash Command (Recommended)
```
/fix-and-deploy <bug description or location>
```

**Example:**
```
/fix-and-deploy The validation isn't checking tool results at line 57
```

**What it does:**
1. Analyzes and fixes the bug
2. Commits to git with detailed message
3. Pushes to remote repository
4. Rebuilds the extension
5. Packages new VSIX
6. Installs in VS Code
7. Provides verification summary

---

### Method 2: PowerShell Script (Windows)
```powershell
cd c:\Users\bob43\Downloads\Bcline
.\scripts\auto-fix-deploy.ps1 "fix: Your commit message here"
```

**Use this when:**
- You've already manually fixed the bug
- You just need to commit, build, and deploy
- You want a quick automated pipeline

---

### Method 3: Bash Script (Linux/Mac/Git Bash)
```bash
cd /c/Users/bob43/Downloads/Bcline
./scripts/auto-fix-deploy.sh "fix: Your commit message here"
```

**Same as PowerShell but for Unix-like systems.**

---

## 🎯 When to Use Each Method

### Use `/fix-and-deploy` when:
- ✅ You found a bug and want Claude to fix it
- ✅ You need the entire pipeline automated from analysis to deployment
- ✅ You want a detailed investigation and fix explanation
- ✅ You're not sure exactly where the bug is

### Use the scripts when:
- ✅ You've already fixed the bug manually
- ✅ You just need to commit, build, and deploy
- ✅ You want a fast, no-questions-asked deployment
- ✅ You're iterating quickly on a fix

---

## 📖 Detailed Workflows

### Workflow 1: Full Automated Fix with Claude

**Step-by-Step:**

1. **Find the bug** (or have it reported to you)
   ```
   Example: "The error warning isn't being stored as a message"
   ```

2. **Call the slash command:**
   ```
   /fix-and-deploy The error warning isn't being stored as a message in src/core/task/index.ts
   ```

3. **Claude will automatically:**
   - Investigate the file and locate the exact issue
   - Apply the fix with proper code changes
   - Create a git commit with detailed explanation
   - Push to the remote branch
   - Run `npm run package` to rebuild
   - Package the VSIX with timestamp
   - Install the extension in VS Code
   - Provide a verification summary

4. **You just need to:**
   - Reload VS Code window (Ctrl+Shift+P → "Reload Window")
   - Test the fix
   - Verify it works!

**Expected Output:**
```markdown
## ✅ Bug Fix Deployment Complete

### Bug Fixed
- **Location**: src/core/task/index.ts:1888
- **Issue**: Error warning not stored as command_output message
- **Fix**: Added await this.say("command_output", errorWarning)

### Git Commit
- **Commit**: f639df4
- **Branch**: claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK
- **Pushed**: ✅ Yes

### Extension
- **VSIX**: bcline-fixed-20251117-172200.vsix (39 MB)
- **Installed**: ✅ Yes
- **Version**: saoudrizwan.claude-dev@3.37.1

### Testing
Run the V2 test Steps 8, 9, 12 to verify attempt_completion is blocked properly.

### Next Steps
1. Reload VS Code window
2. Test the fix by running pytest with failures
3. Verify attempt_completion is blocked correctly
```

---

### Workflow 2: Quick Script Deployment

**Step-by-Step:**

1. **Fix the bug manually** in your editor

2. **Save all changes**

3. **Run the deployment script:**

   **Windows (PowerShell):**
   ```powershell
   .\scripts\auto-fix-deploy.ps1 "fix: Store error warnings as command_output messages"
   ```

   **Linux/Mac/Git Bash:**
   ```bash
   ./scripts/auto-fix-deploy.sh "fix: Store error warnings as command_output messages"
   ```

4. **Watch the automated pipeline:**
   ```
   ════════════════════════════════════════════════════════════
   🚀 Automated Bug Fix Deployment Pipeline
   ════════════════════════════════════════════════════════════

   ▶ STEP 1: Checking Git Status
   ✅ Changes detected

   ▶ STEP 2: Committing Changes
   ✅ Committed as f639df4

   ▶ STEP 3: Pushing to Remote
   ✅ Pushed to claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

   ▶ STEP 4: Building Extension
   ✅ Build successful

   ▶ STEP 5: Packaging VSIX
   ✅ VSIX created: bcline-fixed-20251117-172200.vsix (39 MB)

   ▶ STEP 6: Installing in VS Code
   ✅ Extension installed

   ════════════════════════════════════════════════════════════
   ✅ Deployment Complete!
   ════════════════════════════════════════════════════════════
   ```

5. **Reload VS Code and test!**

---

## 🛠️ Configuration

### Change the Git Branch
Edit the branch variable in the script:
```powershell
# PowerShell
$Branch = "your-branch-name"
```

```bash
# Bash
BRANCH="your-branch-name"
```

### Skip Remote Push
Comment out Step 3 in the script:
```powershell
# Write-Step 3 "Pushing to Remote"
# git push origin $Branch
```

### Custom VSIX Name
Modify the VSIX filename:
```powershell
$VsixName = "my-custom-name-$Timestamp.vsix"
```

---

## 🚨 Troubleshooting

### Script Fails at Build Step

**Problem:** `npm run package` fails

**Solution:**
```bash
# Clean and rebuild
npm run clean:build
npm install
npm run package
```

### Git Push Rejected

**Problem:** Remote has changes you don't have

**Solution:**
```bash
git pull origin claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK --rebase
./scripts/auto-fix-deploy.sh "fix: Your message"
```

### Extension Not Loading After Install

**Solutions:**
1. **Reload VS Code window** (Ctrl+Shift+P → "Reload Window")
2. **Check Developer Tools** (Help → Toggle Developer Tools → Console tab)
3. **Verify installation:**
   ```bash
   code --list-extensions | grep claude
   ```
4. **Manual install:**
   ```bash
   code --install-extension bcline-fixed-*.vsix --force
   ```

### Build Takes Too Long

**Solution:** The first build after changes takes ~30 seconds. Subsequent builds are faster due to caching.

---

## 📁 File Locations

- **Slash Command**: `.claude/commands/fix-and-deploy.md`
- **PowerShell Script**: `scripts/auto-fix-deploy.ps1`
- **Bash Script**: `scripts/auto-fix-deploy.sh`
- **This Guide**: `AUTOMATED_FIX_GUIDE.md`

---

## 🎓 Examples

### Example 1: Fix Validation Bug
```
/fix-and-deploy The AttemptCompletionHandler validation at line 57
doesn't check tool results, only command_output messages. This causes
validation to miss errors.
```

**Claude will:**
1. Read `AttemptCompletionHandler.ts:57`
2. Identify the filtering issue
3. Add tool result checking
4. Commit, build, and deploy

---

### Example 2: Fix Multiple Related Bugs
```
/fix-and-deploy Fix the error detection system:
1. index.ts:1888 - Store warnings as messages
2. AttemptCompletionHandler.ts:57 - Check both command_output and tool
```

**Claude will:**
1. Fix both locations
2. Create a single commit covering both fixes
3. Deploy the combined fix

---

### Example 3: Using Script for Quick Iteration
```powershell
# Make change 1
.\scripts\auto-fix-deploy.ps1 "fix: Add null check"

# Test, find issue

# Make change 2
.\scripts\auto-fix-deploy.ps1 "fix: Improve null check logic"

# Test again, deploy final version
```

---

## ✅ Best Practices

### 1. Test Locally First
- Fix the bug
- Test manually in VS Code
- Verify it works
- Then run the automated deployment

### 2. Write Good Commit Messages
```
✅ Good: "fix: Store error warnings as command_output messages for validation"
❌ Bad: "fix bug"
```

### 3. One Fix Per Deployment
- Don't bundle unrelated changes
- Makes git history cleaner
- Easier to debug if something breaks

### 4. Always Reload VS Code
After deployment:
1. Save all files
2. Ctrl+Shift+P → "Reload Window"
3. Wait for extension to activate
4. Test the fix

### 5. Keep Backup VSIXs
The timestamped VSIXs are automatic backups:
```
bcline-fixed-20251117-172200.vsix  ← Latest
bcline-fixed-20251117-153000.vsix  ← Previous (keep for rollback)
bcline-fixed-20251117-120000.vsix  ← Older (can delete)
```

---

## 🎉 You're Ready!

Now you can fix bugs and deploy them in seconds:

**Option A - Full Automation:**
```
/fix-and-deploy <describe the bug>
```

**Option B - Quick Deploy:**
```powershell
.\scripts\auto-fix-deploy.ps1 "fix: Your message"
```

**That's it!** No more manual commit → build → package → install steps. 🚀
