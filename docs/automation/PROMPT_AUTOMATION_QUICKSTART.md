# 🚀 Prompt Automation Quick Start Guide

## TL;DR - Send Prompts to Cline Automatically

```powershell
# Simplest way - just run this:
.\quick-prompt-test.ps1 "Run the v2 prompt tests again"
```

## What This Does

This automation system lets you **send text prompts to Cline's chat input programmatically** - perfect for:

- ✅ **Automated testing** (like "run the v2 prompt tests again")
- ✅ **Batch operations** (send 10 prompts from a file)
- ✅ **CI/CD integration** (trigger Cline tasks in pipelines)
- ✅ **Regression testing** (replay the same prompts daily)
- ✅ **Workflow automation** (multi-step tasks)

## 3 Ways to Use It

### 1️⃣ Ultra-Simple (Recommended)
```powershell
.\quick-prompt-test.ps1 "Your prompt here"
```

### 2️⃣ Batch Mode (Multiple Prompts)
```powershell
.\scripts\Send-ClinePrompt.ps1 -PromptsFile test-prompts.txt
```

### 3️⃣ Full Control (Edit Tests)
```bash
# Edit src/test/e2e/automated-prompts.test.ts
# Then run:
npm run e2e -- automated-prompts.test.ts --headed
```

## Real-World Examples

### Example 1: Run V2 Tests Daily
```powershell
# In your daily automation script:
.\quick-prompt-test.ps1 "Run the v2 prompt tests again"
```

### Example 2: Morning Standup Report
```powershell
# Create morning-standup.txt:
#   - Show git status
#   - List TODO items in all files
#   - Run all tests
#   - Generate a summary report

.\scripts\Send-ClinePrompt.ps1 -PromptsFile morning-standup.txt
```

### Example 3: Pre-Commit Checks
```powershell
# In pre-commit hook:
.\quick-prompt-test.ps1 "Run all tests and verify no errors"
```

## Files You Got

| File | Purpose |
|------|---------|
| `quick-prompt-test.ps1` | ⚡ Fastest way - single prompt testing |
| `scripts/Send-ClinePrompt.ps1` | 🔧 Advanced - batch mode, options |
| `src/test/e2e/automated-prompts.test.ts` | 🎭 Full Playwright tests (4 scenarios) |
| `test-prompts.txt` | 📝 Example batch file |
| `AUTOMATED_PROMPTS_README.md` | 📚 Complete documentation |

## How It Works Under the Hood

```
You run script
    ↓
Playwright launches VSCode
    ↓
Opens Cline extension
    ↓
Finds chat-input element (testId)
    ↓
Fills with your prompt text
    ↓
Clicks send-button
    ↓
Waits for Cline to respond
    ↓
Closes VSCode
```

## Test the Installation

```powershell
# 1. Ensure Playwright is installed
npm install

# 2. Run the simplest test
.\quick-prompt-test.ps1 "Hello, Cline!"

# 3. If successful, you'll see:
#    ✅ Test completed successfully!
```

## Troubleshooting

**Problem**: `npx: command not found`
**Solution**: Install Node.js and npm first

**Problem**: `Playwright not installed`
**Solution**: Run `npm install` in the Bcline directory

**Problem**: Test hangs or times out
**Solution**: Increase timeout in the script or close other VSCode instances

**Problem**: Can't find chat-input element
**Solution**: Make sure Cline extension is properly installed and visible

## Next Steps

1. ✅ Try the quick test: `.\quick-prompt-test.ps1`
2. 📝 Create your own prompt file: `my-tasks.txt`
3. 🔧 Customize tests: Edit `automated-prompts.test.ts`
4. 📚 Read full docs: `AUTOMATED_PROMPTS_README.md`

## Advanced: Integrate with CI/CD

```yaml
# .github/workflows/cline-tests.yml
name: Cline Automated Tests

on: [push]

jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: .\quick-prompt-test.ps1 "Run all tests"
```

## Questions?

- 📚 Full docs: [AUTOMATED_PROMPTS_README.md](./AUTOMATED_PROMPTS_README.md)
- 🔍 Example tests: [src/test/e2e/automated-prompts.test.ts](./src/test/e2e/automated-prompts.test.ts)
- 🛠️ Existing E2E tests: [src/test/e2e/chat.test.ts](./src/test/e2e/chat.test.ts)

---

**Made with ❤️ for automated Cline testing**
