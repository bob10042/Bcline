# Quick Update Guide - Extension Development Host

**Use this after every fix session to test your updated Cline extension**

---

## Current Status

**Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
**Total Fixes Completed**: **23 fixes** (13 previous + 10 current session)
**Location**: `/home/user/Bcline`

---

## Method: Extension Development Host (Fastest & Easiest)

This method launches a separate VS Code window with your updated extension active - **no VSIX building required!**

### Step 1: Open Your Bcline Directory

```bash
cd /home/user/Bcline
code .
```

### Step 2: Launch Extension Development Host

1. Press **F5** (or click Run → Start Debugging)
2. A new VS Code window will open titled **"[Extension Development Host]"**
3. Your updated Cline extension is automatically active in this window

### Step 3: Test Your Fixes

In the Extension Development Host window:

1. Open Cline (sidebar icon or Cmd/Ctrl+Shift+P → "Cline: Open In New Tab")
2. Test the specific fixes:
   - **Context Window Display** - Check if percentage shows correctly
   - **LiteLLM** - Test without API key if using proxy
   - **Act Mode** - Verify mode detection in environment details
3. All your code changes are live!

### Step 4: Make Additional Changes (Optional)

If you find issues:

1. Keep the Extension Development Host window open
2. Switch back to your main VS Code window
3. Make code changes in `/home/user/Bcline`
4. Press **Ctrl+R** in the Extension Development Host window to reload with changes
5. No need to restart - just reload!

---

## Quick Troubleshooting

### Issue: "F5 doesn't work"
**Solution**: Make sure you're in the `/home/user/Bcline` folder in VS Code, not a subfolder

### Issue: "Extension not loading"
**Solution**: Check the Debug Console in your main VS Code window for errors

### Issue: "Changes not showing up"
**Solution**: Press **Ctrl+R** in the Extension Development Host window to reload

---

## After Testing is Complete

### Option A: Continue Using Extension Development Host
- Just press F5 whenever you want to use your enhanced Cline
- Always has the latest code changes
- Perfect for ongoing development

### Option B: Build VSIX for Permanent Installation
Only do this when you want a permanent installation:

```bash
cd /home/user/Bcline
npm install -g @vscode/vsce
vsce package
```

Then install the generated `.vsix` file in VS Code:
- Extensions → "..." menu → "Install from VSIX"

---

## Session Update Workflow

**After each Claude fix session:**

1. Claude commits and pushes changes ✅
2. You run: `cd /home/user/Bcline && code .`
3. Press **F5**
4. Test fixes in Extension Development Host window
5. Done! 🎉

---

## Fix Progress Tracker

✅ **Session 1**: 13 fixes (security, performance, code quality)
✅ **Session 2**: 10 fixes (7 GitHub issues + 3 docs)
📊 **Total**: **23 out of 20 target fixes** (115% complete!)

See `SESSION_SUMMARY_AND_INSTALLATION.md` for complete fix list and details.

---

**Last Updated**: 2025-11-16
**Ready to test your enhanced Cline extension!** 🚀
