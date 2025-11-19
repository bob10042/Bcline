# Bcline Extension Update Guide

This guide contains all the commands you need to fetch changes from your repository and rebuild/reinstall the extension with all 20 fixes.

---

## Quick Update Commands (Copy & Paste)

### Option 1: Update Current Branch (Recommended)

If you're already on the fixes branch and just want to get the latest:

```bash
# Navigate to Bcline directory
cd c:\Users\bob43\Downloads\Bcline

# Fetch all latest changes from GitHub
git fetch origin

# Pull the latest fixes
git pull origin claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

# Install dependencies
npm install

# Build the extension
npm run package

# Package as .vsix
npx vsce package

# Install in VSCode
code --install-extension claude-dev-3.37.1.vsix
```

**Then restart VSCode!**

---

### Option 2: Fresh Checkout (If You Want Clean Start)

If you want to start fresh from the fixes branch:

```bash
# Navigate to Bcline directory
cd c:\Users\bob43\Downloads\Bcline

# Stash any local changes
git stash

# Fetch all branches
git fetch origin

# Checkout the fixes branch
git checkout claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

# Pull latest
git pull origin claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

# Install dependencies
npm install

# Build the extension
npm run package

# Package as .vsix
npx vsce package

# Install in VSCode
code --install-extension claude-dev-3.37.1.vsix
```

**Then restart VSCode!**

---

### Option 3: Update All Branches (Get Everything)

If you want to fetch all branches and see what's available:

```bash
# Navigate to Bcline directory
cd c:\Users\bob43\Downloads\Bcline

# Fetch all branches from your fork
git fetch origin

# Fetch all branches from upstream (official Cline)
git fetch upstream

# List all available branches
git branch -a

# Checkout the branch you want (the one with 20 fixes)
git checkout claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

# Pull latest
git pull

# Install dependencies
npm install

# Build the extension
npm run package

# Package as .vsix
npx vsce package

# Install in VSCode
code --install-extension claude-dev-3.37.1.vsix
```

**Then restart VSCode!**

---

## Step-by-Step Explanation

### Step 1: Navigate to Repository
```bash
cd c:\Users\bob43\Downloads\Bcline
```
Gets you into the right directory.

---

### Step 2: Fetch Changes from GitHub
```bash
git fetch origin
```
Downloads all new branches and commits from your GitHub fork (bob10042/Bcline) without changing your local files.

**What this does:**
- Checks GitHub for new branches
- Downloads new commits
- Updates your remote tracking branches
- **Does NOT** change your working files

---

### Step 3: Pull Latest Changes
```bash
git pull origin claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK
```
Actually updates your local files with the latest code from the fixes branch.

**What this does:**
- Downloads the latest commits
- Merges them into your current branch
- Updates your working directory files

---

### Step 4: Install Dependencies
```bash
npm install
```
Installs or updates all required Node.js packages.

**What this does:**
- Reads `package.json`
- Downloads required npm packages
- Updates `node_modules/` folder
- Runs prepare scripts (like husky)

**Time:** ~2-10 seconds (since packages are usually cached)

---

### Step 5: Build the Extension
```bash
npm run package
```
Compiles and builds the extension for production.

**What this does:**
- Runs TypeScript compiler (`check-types`)
- Builds the webview UI (`build:webview`)
- Runs linting (`lint`)
- Compiles with esbuild in production mode
- Creates optimized bundles

**Time:** ~20-30 seconds

**Output:** Compiled code in `dist/` folder

---

### Step 6: Package as .vsix
```bash
npx vsce package
```
Creates the installable VSCode extension file.

**What this does:**
- Bundles all extension files
- Creates `claude-dev-3.37.1.vsix` file
- Includes compiled code, assets, and manifests
- Compresses everything

**Time:** ~30-45 seconds

**Output:** `claude-dev-3.37.1.vsix` (typically 15-20 MB)

---

### Step 7: Install in VSCode
```bash
code --install-extension claude-dev-3.37.1.vsix
```
Installs the extension in VSCode.

**What this does:**
- Removes old version (if exists)
- Installs new version from .vsix file
- Registers with VSCode
- Makes it available in Extensions panel

**Time:** ~2-5 seconds

---

### Step 8: Restart VSCode
**IMPORTANT:** You must restart VSCode for the new version to activate!

**Options:**
- Close all VSCode windows and reopen
- OR: `Ctrl+Shift+P` → "Reload Window"
- OR: `Ctrl+Shift+P` → "Developer: Reload Window"

---

## Verification Commands

After updating, verify everything worked:

```bash
# Check which branch you're on
git branch

# Should show: * claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

# Check latest commits
git log --oneline -5

# Should show:
# cab48c9a0 docs: Update FIXES_TRACKER.md - All 20 fixes complete!
# 6cae82df0 Fix: Vscode module not found in IntelliJ/JetBrains plugin (Issue #7374)
# 7534c8998 Fix: Critical token usage bugs and random token spikes (Issues #7373, #7371)
# ...

# Check installed extension version
code --list-extensions --show-versions | grep claude-dev

# Should show: saoudrizwan.claude-dev@3.37.1

# Check if .vsix file was created
ls -la claude-dev-3.37.1.vsix
# or on Windows:
dir claude-dev-3.37.1.vsix
```

---

## Complete One-Liner (All Commands)

Copy this entire block and paste into your terminal:

```bash
cd c:\Users\bob43\Downloads\Bcline && git fetch origin && git pull origin claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK && npm install && npm run package && npx vsce package && code --install-extension claude-dev-3.37.1.vsix
```

**Then restart VSCode manually.**

---

## Troubleshooting

### Issue: "Your local changes would be overwritten"

**Solution:**
```bash
# Stash your changes
git stash

# Then retry the update commands
git pull origin claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

# Restore your changes (optional)
git stash pop
```

---

### Issue: "npm ERR! Missing script: package"

**Solution:** You might need to use a different build command:
```bash
npm run compile
# or
npm run vscode:prepublish
```

---

### Issue: TypeScript compilation errors

**Solution:** There was one known error we fixed. Apply this patch:

```bash
# Create a patch file
cat > fix-task.patch << 'EOF'
--- a/src/core/task/index.ts
+++ b/src/core/task/index.ts
@@ -2495,8 +2495,9 @@
 				)
 				await this.messageStateHandler.saveClineMessagesAndUpdateHistory()
 				await this.contextManager.triggerApplyStandardContextTruncationNoticeChange(
-					this.taskState.conversationHistoryDeletedRange,
-					`Pre-emptively truncated context to make room for /smol or /compact command`,
+					Date.now(),
+					await ensureTaskDirectoryExists(this.taskId),
+					apiConversationHistory,
 				)
 			}
 		}
EOF

# Apply the patch
patch -p1 < fix-task.patch

# Retry build
npm run package
```

---

### Issue: Extension not updating in VSCode

**Solution:**
```bash
# Uninstall the old version first
code --uninstall-extension saoudrizwan.claude-dev

# Then reinstall
code --install-extension claude-dev-3.37.1.vsix

# Restart VSCode
```

---

### Issue: "npx vsce package" fails

**Solution:** Make sure vsce is available:
```bash
# Install vsce globally if needed
npm install -g @vscode/vsce

# Then retry
npx vsce package
```

---

## Automation Script (PowerShell)

Save this as `update-bcline.ps1`:

```powershell
# Bcline Extension Update Script
Write-Host "=== Bcline Extension Update Script ===" -ForegroundColor Cyan

# Navigate to directory
Write-Host "`n[1/8] Navigating to Bcline directory..." -ForegroundColor Yellow
Set-Location "c:\Users\bob43\Downloads\Bcline"

# Fetch changes
Write-Host "[2/8] Fetching changes from GitHub..." -ForegroundColor Yellow
git fetch origin

# Pull latest
Write-Host "[3/8] Pulling latest fixes..." -ForegroundColor Yellow
git pull origin claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

# Install dependencies
Write-Host "[4/8] Installing dependencies..." -ForegroundColor Yellow
npm install

# Build
Write-Host "[5/8] Building extension..." -ForegroundColor Yellow
npm run package

# Package
Write-Host "[6/8] Packaging as .vsix..." -ForegroundColor Yellow
npx vsce package

# Install
Write-Host "[7/8] Installing in VSCode..." -ForegroundColor Yellow
code --install-extension claude-dev-3.37.1.vsix

# Done
Write-Host "[8/8] Done! Please restart VSCode." -ForegroundColor Green
Write-Host "`n=== Update Complete ===" -ForegroundColor Cyan
Write-Host "Next step: Restart VSCode to activate the new version" -ForegroundColor Yellow
```

**Run it:**
```powershell
powershell -ExecutionPolicy Bypass -File update-bcline.ps1
```

---

## Automation Script (Bash)

Save this as `update-bcline.sh`:

```bash
#!/bin/bash

echo "=== Bcline Extension Update Script ==="

# Navigate to directory
echo "[1/8] Navigating to Bcline directory..."
cd /c/Users/bob43/Downloads/Bcline

# Fetch changes
echo "[2/8] Fetching changes from GitHub..."
git fetch origin

# Pull latest
echo "[3/8] Pulling latest fixes..."
git pull origin claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

# Install dependencies
echo "[4/8] Installing dependencies..."
npm install

# Build
echo "[5/8] Building extension..."
npm run package

# Package
echo "[6/8] Packaging as .vsix..."
npx vsce package

# Install
echo "[7/8] Installing in VSCode..."
code --install-extension claude-dev-3.37.1.vsix

# Done
echo "[8/8] Done! Please restart VSCode."
echo ""
echo "=== Update Complete ==="
echo "Next step: Restart VSCode to activate the new version"
```

**Run it:**
```bash
bash update-bcline.sh
```

---

## What Gets Updated

When you run these commands, the following files/fixes get updated:

### Code Files:
- `src/core/task/index.ts` - Context management fixes
- `src/core/api/providers/*.ts` - API provider fixes
- `src/core/context-management/*.ts` - Token counting fixes
- `src/shared/combineApiRequests.ts` - Token spike fixes
- `src/shared/getApiMetrics.ts` - Metrics calculation fixes
- `package.json` - Version and dependencies
- Many more...

### Documentation:
- `FIXES_TRACKER.md` - List of all 20 fixes
- `SESSION_SUMMARY_AND_INSTALLATION.md` - Installation guide
- `QUICK_UPDATE_GUIDE.md` - Quick reference

### Assets:
- `webview-ui/build/*` - Updated UI components
- Various icon and font fixes

---

## Keeping Extension Updated Long-Term

### Strategy 1: Stay on Fixes Branch
```bash
# Regularly pull updates
cd c:\Users\bob43\Downloads\Bcline
git checkout claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK
git pull
npm run package && npx vsce package && code --install-extension claude-dev-3.37.1.vsix
```

### Strategy 2: Merge to Your Main
```bash
# Merge fixes into your main branch
git checkout main
git merge claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK
npm run package && npx vsce package && code --install-extension claude-dev-3.37.1.vsix
```

### Strategy 3: Track Upstream + Your Fixes
```bash
# Pull from official Cline repo
git fetch upstream
git merge upstream/main

# Then merge your fixes
git merge claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

# Resolve any conflicts, then rebuild
npm run package && npx vsce package && code --install-extension claude-dev-3.37.1.vsix
```

---

## Summary

**Simplest update command:**
```bash
cd c:\Users\bob43\Downloads\Bcline && git pull && npm run package && npx vsce package && code --install-extension claude-dev-3.37.1.vsix
```

**Then restart VSCode!**

---

**Last updated:** 2025-11-16
**Version:** 3.37.1 with 20 bug fixes
**Branch:** claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK
