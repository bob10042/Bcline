# Bug Fix and Deployment Automation

**Purpose**: Automatically fix a bug, commit it, rebuild the extension, and deploy to VS Code.

**Usage**: `/fix-and-deploy <bug description or file location>`

---

## 🎯 WORKFLOW STEPS

You will execute the following steps automatically:

### STEP 1: Analyze and Fix the Bug
1. **Understand the bug**: Read the user's description or investigate the mentioned file/area
2. **Locate the issue**: Find the exact file and line numbers causing the bug
3. **Implement the fix**: Apply the necessary code changes
4. **Verify syntax**: Ensure the code compiles and has no syntax errors

### STEP 2: Git Commit
Once the fix is applied, automatically commit it:

```bash
cd c:/Users/bob43/Downloads/Bcline
git add <modified-files>
git commit -m "$(cat <<'EOF'
fix: <Brief one-line summary of the bug fix>

**Problem**: <2-3 sentences describing what was broken>

**Root Cause**: <1-2 sentences explaining why it was broken>

**Solution**: <2-3 sentences describing the fix>

**Impact**:
- <Benefit 1>
- <Benefit 2>
- <What this fixes or improves>

**Files Changed**:
- <file1>:<lines> - <description>
- <file2>:<lines> - <description>

**Testing**: <How to verify the fix works>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### STEP 3: Push to Remote
```bash
cd c:/Users/bob43/Downloads/Bcline
git push origin claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK
```

### STEP 4: Rebuild Extension
```bash
cd c:/Users/bob43/Downloads/Bcline
npm run package
```

### STEP 5: Package VSIX
```bash
cd c:/Users/bob43/Downloads/Bcline
npx @vscode/vsce package --out bcline-fixed-$(date +%Y%m%d-%H%M%S).vsix
```

### STEP 6: Install in VS Code
```bash
cd c:/Users/bob43/Downloads/Bcline
code --install-extension bcline-fixed-*.vsix --force
```

### STEP 7: Verification Summary
Provide a summary report:
```markdown
## ✅ Bug Fix Deployment Complete

### Bug Fixed
- **Location**: <file>:<line>
- **Issue**: <brief description>
- **Fix**: <what was changed>

### Git Commit
- **Commit**: <commit hash>
- **Branch**: claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK
- **Pushed**: ✅ Yes

### Extension
- **VSIX**: bcline-fixed-<timestamp>.vsix (<size>)
- **Installed**: ✅ Yes
- **Version**: saoudrizwan.claude-dev@3.37.1

### Testing
<Provide instructions on how to test/verify the fix>

### Next Steps
1. Reload VS Code window (Ctrl+Shift+P → "Reload Window")
2. Test the fix by <specific testing steps>
3. If successful, the bug is resolved!
```

---

## ⚠️ IMPORTANT GUIDELINES

### Error Handling
- If ANY step fails, STOP immediately and report the error
- Do NOT proceed to next steps if previous step failed
- Provide clear error messages with suggestions for manual resolution

### Commit Messages
- Use conventional commit format: `fix:`, `feat:`, `docs:`, etc.
- Be descriptive but concise
- Include file locations with line numbers
- Explain impact clearly

### Testing
- After installation, suggest specific test cases
- Mention any edge cases to verify
- Recommend running relevant test suites

### File Paths
- Always use absolute paths for files in Bcline repo
- Use forward slashes (/) even on Windows
- Verify file exists before attempting edits

---

## 📋 EXAMPLES

### Example 1: Simple Bug Fix
```
User: /fix-and-deploy The error warning isn't being saved as a message

You:
1. Investigating src/core/task/index.ts...
2. Found issue at line 1886 - error warning only in tool result
3. Applied fix: Added await this.say("command_output", errorWarning)
4. Committing changes...
5. Rebuilding extension...
6. Installing in VS Code...
✅ Complete! Commit f639df4ba created and deployed.
```

### Example 2: Multiple File Fix
```
User: /fix-and-deploy Fix the validation to also check tool results

You:
1. Analyzing validation logic in AttemptCompletionHandler.ts...
2. Found issue: Only checks command_output, not tool results
3. Applied fix in 2 files:
   - AttemptCompletionHandler.ts:57 - Added tool result filtering
   - index.ts:1888 - Added dual message storage
4. Committing changes...
5. Rebuilding extension...
6. Installing in VS Code...
✅ Complete! Commit abc123def created and deployed.
```

---

## 🔧 CUSTOMIZATION

You can adjust the workflow by:
- **Skip push**: Comment out STEP 3 if testing locally
- **Different branch**: Change branch name in STEP 3
- **Custom VSIX name**: Modify output name in STEP 5
- **Skip install**: Comment out STEP 6 if manually installing

---

## 🚨 TROUBLESHOOTING

### Build Fails
```bash
# Clean and rebuild
cd c:/Users/bob43/Downloads/Bcline
npm run clean:build
npm run package
```

### Git Conflicts
```bash
# Stash changes and retry
cd c:/Users/bob43/Downloads/Bcline
git stash
git pull
git stash pop
# Resolve conflicts, then continue
```

### Extension Not Loading
1. Reload VS Code window
2. Check VS Code Developer Tools (Help → Toggle Developer Tools)
3. Look for errors in Console tab
4. Verify extension is enabled: Extensions → Claude Dev → Enable

---

**Ready to use!** Just call `/fix-and-deploy <bug description>` and the entire pipeline runs automatically.
