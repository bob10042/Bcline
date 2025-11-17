# CLI-to-Cline Commands - Quick Reference

## Prerequisites
- Cline running in VSCode
- Navigate to your Bcline repository directory

## Commands

### Send a Single Message to Cline

```bash
npm run send-prompt "Your message here"
```

**Examples:**
```bash
# Ask a question
npm run send-prompt "What files changed in the last commit?"

# Request an action
npm run send-prompt "Fix the bug in main.js"

# Review changes
npm run send-prompt "Review the code changes in src/"

# Pipe input
git diff | npm run send-prompt

# From file
npm run send-prompt -- --file task.txt

# With image
npm run send-prompt -- --image screenshot.png "Analyze this UI"
```

### Start the Listener (Optional - for continuous watching)

```bash
npm run listen
```

This watches `~/.cline/prompts/` for new `.txt` files and automatically sends them to Cline.

**Use listener when:**
- Running automated scripts
- Using git hooks
- Want a "drop box" for prompts

**Drop files while listener is running:**
```bash
echo "Run the tests" > ~/.cline/prompts/task1.txt
echo "Update docs" > ~/.cline/prompts/task2.txt
```

### Run Listener in Background

```bash
# Option 1: Background process
npm run listen &

# Option 2: Screen (detachable)
screen -S cline npm run listen
# Press Ctrl+A then D to detach
# Reconnect with: screen -r cline

# Option 3: tmux
tmux new -s cline "npm run listen"
# Detach with Ctrl+B then D
# Reconnect with: tmux attach -t cline
```

## Full Workflow Examples

### 1. Quick One-Off Message
```bash
cd /path/to/Bcline
npm run send-prompt "Your task here"
```

### 2. Git Hook Integration

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
cd /path/to/Bcline
git diff --cached | npm run send-prompt
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

### 3. Continuous Automation

**Terminal 1:**
```bash
cd /path/to/Bcline
npm run listen
```

**Terminal 2 or scripts:**
```bash
# Scripts drop files
echo "Task 1" > ~/.cline/prompts/task1.txt
echo "Task 2" > ~/.cline/prompts/task2.txt
```

### 4. Shell Alias (Add to ~/.bashrc or ~/.zshrc)

```bash
alias ask-cline='cd /path/to/Bcline && npm run send-prompt --'
```

Then use:
```bash
ask-cline "What's in this directory?"
git status | ask-cline
```

## Troubleshooting

### Error: ECONNREFUSED
**Problem:** Can't connect to Cline

**Solution:**
1. Make sure VSCode with Cline extension is running
2. Check port 26040: `netstat -an | grep 26040`
3. Restart VSCode

### Error: No prompt text provided
**Problem:** Empty message sent

**Solution:**
```bash
# Check you provided text
npm run send-prompt "Some text here"

# Or pipe has content
echo "Some text" | npm run send-prompt
```

### Listener not detecting files
**Problem:** Files aren't being processed

**Solution:**
1. Verify listener is running
2. Check files have `.txt` extension
3. Files in correct directory: `~/.cline/prompts/`
4. Don't start filenames with `.` (dot)

## Environment Variables

```bash
# Custom gRPC address (default: 127.0.0.1:26040)
export PROTOBUS_ADDRESS="192.168.1.100:26040"
npm run send-prompt "Hello from remote"
```

## All Commands Summary

| Command | Purpose |
|---------|---------|
| `npm run send-prompt "text"` | Send one message to Cline |
| `npm run listen` | Start file watcher |
| `npm run listen &` | Run listener in background |
| `npm run send-prompt -- --file task.txt` | Send from file |
| `npm run send-prompt -- --image pic.png "text"` | Send with image |
| `echo "text" \| npm run send-prompt` | Pipe to Cline |
| `git diff \| npm run send-prompt` | Review git changes |

## Where Files Go

- **Watch directory:** `~/.cline/prompts/`
- **Full path:** `/home/youruser/.cline/prompts/`
- **Create manually:** `mkdir -p ~/.cline/prompts`

## Quick Test

```bash
# 1. Make sure Cline is running in VSCode
# 2. Run this:
cd /path/to/Bcline
npm run send-prompt "Hello Cline! This is a test message."
# 3. Check Cline chat window - message should appear!
```

---

**Need detailed docs?** See `CLI-LISTENER-QUICKSTART.md` or `CLI-PROMPT-INTEGRATION.md`
