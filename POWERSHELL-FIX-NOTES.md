# PowerShell Error Detection Fix

## Issue
Cline would hang indefinitely when PowerShell or CLI commands failed during what was expected to be the final command in a conversation. Users had to manually cancel the command and paste error messages back into Cline to continue.

## Root Cause
Cline was only detecting command failures by parsing text output for error keywords (like "error", "fail", etc.) but **never checked the actual process exit code**. PowerShell errors could be silent or formatted in ways Cline didn't recognize, causing it to think the command succeeded when it actually failed.

## Solution
Implemented proper exit code detection across the entire terminal execution pipeline:

### Files Modified
1. **standalone/runtime-files/vscode/enhanced-terminal.js** (lines 86-87)
   - Emit exit code with `completed` and `continue` events

2. **src/integrations/terminal/TerminalProcess.ts** (lines 7-13, 27, 74-78, 216-217, 237-238)
   - Added exit code extraction from VSCode shell integration sequences (`]633;D;exitcode`)
   - Store and emit exit code with completion events
   - Updated TerminalProcessEvents interface to include exit code parameter

3. **src/core/task/index.ts** (lines 1608, 1726-1728, 1858-1864)
   - Capture exit code from completion event
   - Check if exit code is non-zero (indicates failure)
   - Return clear error message: "Command failed with exit code X"

## Behavior After Fix
- ✅ Non-zero exit codes are automatically detected as failures
- ✅ Cline reports "Command failed with exit code X" with output
- ✅ No more hanging on failed PowerShell commands
- ✅ Works with both VSCode shell integration and standalone terminal modes

## Installation Required

**⚠️ IMPORTANT: This fix must be built and installed as a VSIX package to take effect.**

### Steps to Install:

1. **Build the VSIX package:**
   ```bash
   npm run package
   ```
   This creates a `.vsix` file in the project root.

2. **Install the VSIX in VS Code:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Click the "..." menu → "Install from VSIX..."
   - Select the generated `.vsix` file

3. **Reload VS Code:**
   - Reload window or restart VS Code to activate the updated extension

## Testing
After installation, test by running a PowerShell command that fails:
```powershell
# This should fail and Cline should detect it
Get-Item "nonexistent-file.txt"
```

Cline should respond with:
```
Command failed with exit code 1.
Output:
[error output here]
```

## Commit
Commit hash: `3e71642`
Branch: `claude/add-credit-expiration-01Rxj3UZuupxnL9PqDheojqG`
Commit message: "Fix: PowerShell and CLI error detection with exit code checking"

## Date
November 17, 2025
