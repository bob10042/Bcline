# CLI Listener - Quick Start Guide

Send prompts to Cline from the command line, scripts, or other tools!

## 🚀 Quick Setup (2 minutes)

### Step 1: Start the Listener

In your Bcline project directory, run:

```bash
npm run listen
```

You'll see:
```
🎯 Cline Prompt Listener started!
📁 Watching: /home/youruser/.cline/prompts
🗑️  Delete after processing: yes

Drop .txt files in this directory to send them to Cline.
Press Ctrl+C to stop.
```

**Keep this terminal open!** The listener will run in the background and watch for new prompt files.

### Step 2: Send a Prompt

**Option A: Using npm script** (easiest)

Open a new terminal and run:

```bash
npm run send-prompt "Fix the bug in main.js"
```

**Option B: Drop a file**

Create a text file in the watched directory:

```bash
echo "Run all the tests" > ~/.cline/prompts/task1.txt
```

The listener will automatically detect the file and send it to Cline!

**Option C: Direct command**

```bash
node scripts/cline-send-prompt.mjs "Your prompt here"
```

### Step 3: Check Cline

Open Cline in VSCode - you should see your prompt appear as a new task!

## 📝 Common Use Cases

### Send a Simple Prompt

```bash
npm run send-prompt "Review the changes in src/utils.js"
```

### Pipe Output to Cline

```bash
# Send git diff to Cline
git diff | npm run send-prompt

# Send test results
npm test 2>&1 | npm run send-prompt
```

### Read Prompt from File

```bash
npm run send-prompt -- --file my-task.txt
```

### Attach an Image

```bash
npm run send-prompt -- --image screenshot.png "Analyze this UI"
```

### Use in Shell Scripts

```bash
#!/bin/bash
# auto-review.sh - Automatically review your last commit

COMMIT_MSG=$(git log -1 --pretty=%B)
DIFF=$(git diff HEAD~1)

npm run send-prompt "Review this commit:

Commit message: $COMMIT_MSG

Changes:
$DIFF
"
```

### Create an Alias

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
alias ask='npm run send-prompt --'
```

Then use it like:

```bash
ask "What files did I change today?"
git status | ask "Should I commit these changes?"
```

## 🎯 Advanced Examples

### Git Hook Integration

**`.git/hooks/pre-push`**

```bash
#!/bin/bash
# Automatically ask Cline to review before pushing

echo "Review all uncommitted and staged changes before push" | \
  npm run send-prompt
```

Make it executable:

```bash
chmod +x .git/hooks/pre-push
```

### Continuous Prompts (File Watcher Method)

Start the listener:

```bash
npm run listen
```

In another terminal/script, just drop files:

```bash
# Script 1
echo "Refactor authentication logic" > ~/.cline/prompts/task-001.txt

# Script 2
echo "Add error handling to API calls" > ~/.cline/prompts/task-002.txt

# Script 3
echo "Update documentation" > ~/.cline/prompts/task-003.txt
```

The listener processes files in alphabetical order and deletes them after sending.

### Python Integration

```python
#!/usr/bin/env python3
import subprocess
import os

def ask_cline(prompt):
    """Send prompt to Cline from Python"""
    subprocess.run([
        'npm', 'run', 'send-prompt', '--', prompt
    ], check=True, cwd='/path/to/Bcline')

# Usage
ask_cline("Fix the import errors in module.py")
```

### Error Log Monitor

```bash
#!/bin/bash
# monitor-errors.sh - Watch error log and send to Cline

tail -f /var/log/app.log | while read line; do
  if echo "$line" | grep -i "error"; then
    echo "Investigate this error: $line" | npm run send-prompt
  fi
done
```

### Slack Bot Integration

```javascript
// slack-to-cline.js
const { App } = require('@slack/bolt')
const { exec } = require('child_process')

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

app.command('/cline', async ({ command, ack, respond }) => {
  await ack()

  const prompt = command.text
  exec(`npm run send-prompt -- "${prompt}"`, (error) => {
    if (error) {
      respond(`❌ Error: ${error.message}`)
    } else {
      respond('✅ Sent to Cline!')
    }
  })
})

app.start(3000)
```

## 🔧 Configuration

### Change Watch Directory

```bash
npm run listen -- --watch-dir /tmp/my-prompts
```

### Keep Files After Processing

```bash
npm run listen -- --keep-files
```

Files will be moved to `.processed/` instead of deleted.

### Verbose Logging

```bash
npm run listen -- --verbose
```

### Custom gRPC Address

```bash
export PROTOBUS_ADDRESS="192.168.1.100:26040"
npm run send-prompt "Hello from remote machine"
```

## 🐛 Troubleshooting

### "Failed to send prompt: ECONNREFUSED"

**Problem**: Can't connect to Cline's gRPC server

**Solutions**:
1. Make sure Cline (VSCode extension) is running
2. Check port 26040 is not blocked: `netstat -an | grep 26040`
3. Restart VSCode/Cline

### "No prompt text provided"

**Problem**: Empty prompt sent

**Solutions**:
1. Check file contains text: `cat ~/.cline/prompts/yourfile.txt`
2. Ensure file encoding is UTF-8
3. For piped input, make sure command outputs something

### Files Not Being Detected

**Problem**: Listener doesn't process new files

**Solutions**:
1. Check file has `.txt` extension
2. Verify you're using the correct watch directory
3. Files starting with `.` (dot) are ignored
4. Wait a moment after creating file (100ms processing delay)

### Images Not Attaching

**Problem**: Images don't appear in Cline

**Solutions**:
1. Check image file exists
2. Use supported formats: PNG, JPG, JPEG
3. Verify file path is absolute or relative to current directory

### Permission Errors

**Problem**: Cannot read/write files

**Solutions**:
1. Check watch directory permissions: `ls -la ~/.cline/prompts`
2. Create directory if missing: `mkdir -p ~/.cline/prompts`
3. Fix permissions: `chmod 755 ~/.cline/prompts`

## 💡 Pro Tips

1. **Run listener in background**:
   ```bash
   npm run listen &
   # Or use screen/tmux
   screen -S cline-listener npm run listen
   ```

2. **Create a systemd service** (Linux):
   ```ini
   [Unit]
   Description=Cline Prompt Listener

   [Service]
   Type=simple
   User=youruser
   WorkingDirectory=/path/to/Bcline
   ExecStart=/usr/bin/npm run listen
   Restart=always

   [Install]
   WantedBy=default.target
   ```

3. **Add to startup** (macOS):
   Create `~/Library/LaunchAgents/com.cline.listener.plist`

4. **Batch process multiple prompts**:
   ```bash
   for task in task1.txt task2.txt task3.txt; do
     cat "$task" > ~/.cline/prompts/"$(basename $task)"
     sleep 1
   done
   ```

5. **Template-based prompts**:
   ```bash
   # template.txt
   Review the following code changes:

   File: {{FILE}}
   Changes:
   {{CHANGES}}

   Please suggest improvements.

   # Use it
   FILE="main.js" CHANGES="$(git diff main.js)" \
     envsubst < template.txt | npm run send-prompt
   ```

## 🔒 Security Notes

- **Local only**: gRPC server listens on `127.0.0.1` (localhost) by default
- **No authentication**: Anyone with local access can send prompts
- **File access**: Only files readable by your user can be attached
- **Validate input**: Always sanitize/validate prompts in production scripts

## 📚 Full Documentation

For complete documentation, integration examples, and advanced features:
- See `CLI-PROMPT-INTEGRATION.md`

## ❓ Need Help?

- Check verbose output: `npm run listen -- --verbose`
- View gRPC connection: `netstat -an | grep 26040`
- File an issue on GitHub
- Check VSCode Developer Tools console

---

**Happy automating!** 🤖

Made with ❤️ for the Cline community
