# CLI-to-Cline Prompt Integration

This feature allows external scripts and CLI tools to send prompts directly to a running Cline instance via gRPC. Perfect for automation, CI/CD pipelines, git hooks, and external tool integration!

## Overview

Two tools are provided:
1. **cline-send-prompt** - Send a single prompt to Cline
2. **cline-prompt-listener** - Watch a directory for prompt files and auto-send them

## Prerequisites

- Cline must be running with the gRPC ProtoBus service enabled (default port: 26040)
- Node.js installed
- The `@grpc/grpc-js` and `@grpc/proto-loader` packages (already in project dependencies)

## Installation

The scripts are located in `scripts/`:
- `scripts/cline-send-prompt.mjs`
- `scripts/cline-prompt-listener.mjs`

Make them executable:
```bash
chmod +x scripts/cline-send-prompt.mjs scripts/cline-prompt-listener.mjs
```

## Usage

### cline-send-prompt - One-off Prompts

Send a prompt directly to Cline:

```bash
# Simple text prompt
node scripts/cline-send-prompt.mjs "Fix the bug in main.js"

# Read from file
node scripts/cline-send-prompt.mjs --file my-task.txt

# Pipe from stdin
echo "Run all tests" | node scripts/cline-send-prompt.mjs

# With attached image
node scripts/cline-send-prompt.mjs --image screenshot.png "Analyze this UI"

# Attach multiple files
node scripts/cline-send-prompt.mjs --attach error.log --attach config.json "Debug this error"
```

**Options:**
- `-f, --file <path>` - Read prompt from file
- `-i, --image <path>` - Attach image (can use multiple times)
- `--attach <path>` - Attach file (can use multiple times)
- `-h, --help` - Show help

**Environment Variables:**
- `PROTOBUS_ADDRESS` - gRPC server address (default: `127.0.0.1:26040`)

### cline-prompt-listener - Continuous Listening

Start a file watcher that monitors a directory for new `.txt` files:

```bash
# Start listener (default: ~/.cline/prompts)
node scripts/cline-prompt-listener.mjs

# Watch custom directory
node scripts/cline-prompt-listener.mjs /tmp/my-prompts

# Keep files after processing (don't delete)
node scripts/cline-prompt-listener.mjs --keep-files

# Verbose logging
node scripts/cline-prompt-listener.mjs --verbose
```

**Options:**
- `-d, --watch-dir <path>` - Directory to watch (default: `~/.cline/prompts`)
- `--keep-files` - Don't delete files after processing (moves to `.processed/`)
- `-v, --verbose` - Show detailed logging
- `-h, --help` - Show help

## Use Cases & Examples

### 1. Git Hooks Integration

**Post-commit hook** (`.git/hooks/post-commit`):
```bash
#!/bin/bash
# Automatically ask Cline to review commits

PROMPT_DIR="$HOME/.cline/prompts"
mkdir -p "$PROMPT_DIR"

COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%B)

cat > "$PROMPT_DIR/review-$COMMIT_HASH.txt" <<EOF
Review this commit:

Commit: $COMMIT_HASH
Message: $COMMIT_MSG

Changes:
$(git diff HEAD~1)
EOF
```

**Pre-push hook** (`.git/hooks/pre-push`):
```bash
#!/bin/bash
# Run tests before pushing

echo "Run all tests and report results" | node scripts/cline-send-prompt.mjs
```

### 2. CI/CD Integration

**GitHub Actions Example** (`.github/workflows/cline-review.yml`):
```yaml
name: Cline PR Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Send PR to Cline
        run: |
          echo "Review this pull request and provide feedback:" > prompt.txt
          git diff origin/main >> prompt.txt
          node scripts/cline-send-prompt.mjs --file prompt.txt
```

### 3. Error Monitoring Integration

**Sentry/Error Tracking Integration**:
```javascript
// error-handler.js
import { exec } from 'child_process'
import { writeFileSync } from 'fs'

function sendErrorToCline(error, context) {
  const prompt = `
Investigate this production error:

Error: ${error.message}
Stack: ${error.stack}
Context: ${JSON.stringify(context, null, 2)}

Please analyze the cause and suggest a fix.
`

  writeFileSync('/home/user/.cline/prompts/error-' + Date.now() + '.txt', prompt)
}
```

### 4. Cron Job Integration

```bash
# Daily code review reminder
0 9 * * 1-5 echo "Review any uncommitted changes in the project" | node /path/to/cline-send-prompt.mjs

# Weekly dependency update check
0 10 * * 1 echo "Check for outdated npm dependencies and suggest updates" | node /path/to/cline-send-prompt.mjs
```

### 5. Terminal Workflow Integration

```bash
# Create an alias in ~/.bashrc or ~/.zshrc
alias ask-cline='node /path/to/scripts/cline-send-prompt.mjs'

# Then use it naturally:
ask-cline "What files changed in the last commit?"
git diff | ask-cline "Review these changes"
npm test 2>&1 | ask-cline "These tests are failing, help me fix them"
```

### 6. File Watcher for Continuous Prompts

```bash
# Start the listener in the background
node scripts/cline-prompt-listener.mjs &

# Now scripts can just drop files
echo "Refactor utils.js" > ~/.cline/prompts/task-001.txt
echo "Add error handling to API calls" > ~/.cline/prompts/task-002.txt
echo "Update documentation" > ~/.cline/prompts/task-003.txt
```

### 7. Python Integration

```python
#!/usr/bin/env python3
import os
import subprocess

def ask_cline(prompt, images=None, files=None):
    """Send a prompt to Cline from Python"""
    cmd = ['node', 'scripts/cline-send-prompt.mjs']

    if images:
        for img in images:
            cmd.extend(['--image', img])

    if files:
        for f in files:
            cmd.extend(['--attach', f])

    cmd.append(prompt)

    subprocess.run(cmd, check=True)

# Usage
ask_cline("Analyze this screenshot", images=["debug.png"])
ask_cline("Review this config", files=["config.json"])
```

### 8. Slack/Discord Bot Integration

```javascript
// slack-bot.js - Forward Slack messages to Cline
import { App } from '@slack/bolt'
import { exec } from 'child_process'

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

app.command('/ask-cline', async ({ command, ack, respond }) => {
  await ack()

  const prompt = command.text
  exec(`echo "${prompt}" | node scripts/cline-send-prompt.mjs`, (error) => {
    if (error) {
      respond(`Error: ${error.message}`)
    } else {
      respond('✓ Sent to Cline!')
    }
  })
})
```

## Architecture

```
┌─────────────────┐
│  External Tool  │
│  (CLI/Script)   │
└────────┬────────┘
         │
         │ Sends prompt via gRPC
         ▼
┌─────────────────────┐
│  ProtoBus Service   │
│  (Port 26040)       │
│  TaskService.newTask│
└────────┬────────────┘
         │
         │ Creates new task
         ▼
┌─────────────────────┐
│  Cline Instance     │
│  (VSCode Extension) │
└─────────────────────┘
```

## Troubleshooting

### "Failed to send prompt: ECONNREFUSED"
- Make sure Cline is running
- Check that the gRPC server is enabled and listening on port 26040
- Verify `PROTOBUS_ADDRESS` environment variable if using a custom address

### "No prompt text provided"
- Ensure the prompt file or stdin has content
- Check file encoding (should be UTF-8)

### Images not attaching
- Image files must exist at the specified path
- Supported formats: PNG, JPG, JPEG
- Images are automatically converted to base64 data URLs

### File watcher not detecting new files
- Check directory permissions
- Ensure files have `.txt` extension
- Files starting with `.` (dot) are ignored
- Wait a moment after creating the file for it to be fully written

## Security Considerations

1. **Local Only**: The gRPC server listens on `127.0.0.1` by default (localhost only)
2. **No Authentication**: Currently no auth required - anyone with local access can send prompts
3. **File Access**: Attached files must be readable by the Node.js process
4. **Prompt Sanitization**: Prompts are sent as-is - validate input in your scripts

## Advanced Configuration

### Custom gRPC Address

```bash
export PROTOBUS_ADDRESS="192.168.1.100:26040"
node scripts/cline-send-prompt.mjs "Hello from remote machine"
```

### Systemd Service for Listener

Create `/etc/systemd/system/cline-listener.service`:
```ini
[Unit]
Description=Cline Prompt Listener
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/Bcline
ExecStart=/usr/bin/node /path/to/Bcline/scripts/cline-prompt-listener.mjs
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable cline-listener
sudo systemctl start cline-listener
```

## Performance

- **Latency**: ~50-200ms per prompt (local network)
- **Throughput**: Can handle ~10-20 prompts/second
- **File Size Limits**: Images and files limited by gRPC message size (~4MB default)

## Future Enhancements

Potential improvements:
- [ ] Authentication/API keys
- [ ] Response streaming (get Cline's answer back)
- [ ] Webhook support for task completion
- [ ] REST API wrapper for easier integration
- [ ] WebSocket alternative to gRPC
- [ ] Prompt templates and preprocessing
- [ ] Rate limiting and queueing

## Contributing

To improve or extend this feature:
1. Check `proto/cline/task.proto` for the gRPC service definition
2. Review `src/standalone/protobus-service.ts` for the server implementation
3. Test with the provided scripts
4. Submit PRs with new integration examples!

## License

Same as Bcline project.

## Support

- File issues on GitHub
- Check gRPC connection with `netstat -an | grep 26040`
- Enable verbose logging with `--verbose` flag
- Review logs in VSCode Developer Tools console

---

**Happy automating!** 🤖
