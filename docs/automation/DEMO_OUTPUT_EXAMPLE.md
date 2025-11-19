# 🎬 Demo: Automated Prompt Injection in Action

## What You're About to See

When you run the automated prompt injection, here's the **complete flow** that happens:

---

## 🚀 Step-by-Step Execution

### Step 1: Launch the Test
```powershell
PS C:\Users\bob43\Downloads\Bcline> .\quick-prompt-test.ps1 "Run the v2 prompt tests again"
```

**Console Output:**
```
🎯 Quick Prompt Test for Cline
================================

📝 Prompt to send: Run the v2 prompt tests again

⚙️  Setting up environment...
🚀 Launching Playwright test...
```

---

### Step 2: Playwright Initializes

**Console Output:**
```
Running 2 tests using 1 worker

  [setup test environment] › utils\global.setup.ts:5:6 › setup test environment
    ⏳ Starting global setup...
    ✅ Mock API server started on port 8765
```

---

### Step 3: VSCode Launches

**What You See:**
- 🪟 New VSCode window opens (if --headed mode)
- 📦 Extension Host starts loading
- 🔧 Cline extension activates
- 📱 Sidebar opens with Cline interface

**Console Output:**
```
  [e2e tests] › automated-prompts.test.ts:88:4 › Automated Prompts - Send single custom prompt
    ⏳ Waiting for VSCode to load...
    ✅ VSCode loaded successfully
    ⏳ Opening Cline sidebar...
    ✅ Cline sidebar visible
```

---

### Step 4: Authentication

**What You See in VSCode:**
- 🔑 Cline login screen appears
- 🖱️ Script clicks "Login to Cline" button automatically

**Console Output:**
```
    ⏳ Signing in to Cline...
    ✅ Authentication successful
```

---

### Step 5: Prompt Injection

**What You See in Cline UI:**
1. 📝 Text appears in chat input box: "Run the v2 prompt tests again"
2. ⚡ Send button gets clicked automatically
3. 🧹 Input box clears (message sent)
4. 💭 Cline starts thinking...

**Console Output:**
```
📝 Sending custom prompt: Run the v2 prompt tests again
    ⏳ Filling input box...
    ✅ Input filled
    ⏳ Clicking send button...
    ✅ Message sent!
```

---

### Step 6: Cline Processes

**What You See in Cline UI:**
- 💬 Your message appears in chat history
- 🤖 Cline's thinking indicator shows
- 📊 Cline starts executing commands
- ✅ Tasks get marked as complete

**Example Cline Response:**
```
I'll run the v2 prompt tests for you.

[Thinking] Setting up test environment...
[Executing] cd test-cli-project
[Executing] pytest tests/ -v
[Success] All tests passed! ✅
```

---

### Step 7: Wait for Response

**Console Output:**
```
✅ Custom prompt sent!
    ⏳ Waiting to observe response (5000ms)...
```

**What Happens:**
- Script waits 5 seconds to let Cline work
- You can watch Cline execute your commands
- Optional: Script can validate specific responses

---

### Step 8: Cleanup

**Console Output:**
```
    ✅ Test passed (8.2s)

  2 passed (8.2s)

✅ Test completed successfully!

💡 Tip: Check AUTOMATED_PROMPTS_README.md for more advanced usage
```

**What Happens:**
- 🧹 VSCode window closes automatically
- 📹 Video recording saved (if test failed)
- 📊 Test results written to `test-results/`
- 🗑️ Temp directories cleaned up

---

## 📊 Complete Terminal Output Example

```powershell
PS C:\Users\bob43\Downloads\Bcline> .\quick-prompt-test.ps1 "Run the v2 prompt tests again"

🎯 Quick Prompt Test for Cline
================================

📝 Prompt to send: Run the v2 prompt tests again

⚙️  Setting up environment...
🚀 Launching Playwright test...

Running 2 tests using 1 worker

  [setup test environment] › utils\global.setup.ts:5:6 › setup test environment (2.1s)
  [e2e tests] › automated-prompts.test.ts:88:4 › Automated Prompts - Send single custom prompt (8.2s)

  2 passed (10.3s)

✅ Test completed successfully!

💡 Tip: Check AUTOMATED_PROMPTS_README.md for more advanced usage
```

---

## 🎥 Visual Flow Diagram

```
You
 │
 ├─ Run: .\quick-prompt-test.ps1 "Your prompt"
 │
 ▼
PowerShell Script
 │
 ├─ Sets environment: CLINE_TEST_PROMPT="Your prompt"
 ├─ Launches: npx playwright test
 │
 ▼
Playwright
 │
 ├─ Downloads VSCode (if needed)
 ├─ Launches VSCode with Cline extension
 ├─ Opens Cline sidebar
 │
 ▼
Test Automation
 │
 ├─ Finds element: chat-input (by testId)
 ├─ Fills with: "Your prompt"
 ├─ Finds element: send-button
 ├─ Clicks send button
 │
 ▼
Cline Extension
 │
 ├─ Receives message via gRPC
 ├─ Processes prompt with AI
 ├─ Executes commands
 ├─ Shows results
 │
 ▼
Test Waits
 │
 ├─ Observes response (5-30 seconds)
 ├─ Optional: Validates output
 │
 ▼
Cleanup
 │
 ├─ Closes VSCode
 ├─ Saves test results
 ├─ Reports success/failure
 │
 ▼
Done! ✅
```

---

## 🔍 What Gets Created/Logged

After running a test, you'll find:

```
test-results/
└── playwright/
    └── automated_prompts_send_single_custom_prompt/
        ├── video.webm (if test failed)
        ├── trace.zip (if enabled)
        └── screenshots/ (if enabled)
```

**Playwright HTML Report** (optional):
```powershell
npx playwright show-report
```

---

## 🎯 Real Example with Batch Prompts

```powershell
PS> .\scripts\Send-ClinePrompt.ps1 -PromptsFile test-prompts.txt

🚀 Cline Prompt Injector
========================

📄 Loaded 8 prompts from: test-prompts.txt

📝 Prompts to send:
   - Run the v2 prompt tests again
   - What files are in the current directory?
   - Create a Python file that prints Hello World
   - Run pytest on all test files
   - Show me the git status
   - What is the current branch?
   - List all files matching *.test.ts
   - Search for the word "TODO" in all TypeScript files

🎭 Starting Playwright...

Running 2 tests using 1 worker

  📝 Sending prompt: Run the v2 prompt tests again
     Text: Run the v2 prompt tests again
     ✅ Prompt sent successfully

  📝 Sending prompt: What files are in the current directory?
     Text: What files are in the current directory?
     ✅ Prompt sent successfully

  [... continues for all 8 prompts ...]

✅ All automated prompts sent successfully!
🏁 Done!
```

---

## 🐛 Debug Mode Example

```powershell
npx playwright test automated-prompts.test.ts --debug
```

**What You See:**
- 🔍 Playwright Inspector opens
- ⏸️ Pauses before each action
- 🖱️ Highlights elements before interaction
- 📝 Shows selector strategies
- ▶️ Step through each action manually

---

## 📹 Video Recording Example

If a test fails, Playwright automatically records a video:

```
test-results/
└── automated-prompts-send-single-custom-prompt/
    └── video.webm (1.2 MB)
```

**Watch it:**
```powershell
Start-Process "test-results/.../video.webm"
```

You'll see exactly what the automation saw when it failed!

---

## ✅ Success Indicators

**Test Passed When:**
- ✅ VSCode launches successfully
- ✅ Cline sidebar visible
- ✅ Authentication succeeds
- ✅ Input box found and filled
- ✅ Send button clicked
- ✅ Message sent (input cleared)
- ✅ No exceptions thrown

**Console Shows:**
```
  2 passed (10.3s)

✅ Test completed successfully!
```

---

## ❌ Failure Scenarios

**Test Fails If:**
- ❌ VSCode doesn't launch (timeout)
- ❌ Cline extension not loaded
- ❌ Input box not found (wrong testId)
- ❌ Authentication fails
- ❌ Send button not clickable

**Console Shows:**
```
  1 failed (15.0s)

❌ Test failed with exit code: 1

Error: locator.fill: Target closed
```

**Helpful Output:**
- 📹 Video recording saved to test-results/
- 📸 Screenshots of failure moment
- 📄 Full error stack trace

---

## 🎓 What You Learned

This demo showed you:

1. ✅ How to send automated prompts to Cline
2. ✅ What happens behind the scenes (VSCode, Playwright, Cline)
3. ✅ How to interpret console output
4. ✅ What gets logged and where
5. ✅ How to debug failures
6. ✅ How to run batch prompts

**Now you can:**
- 🚀 Automate repetitive Cline tasks
- 🧪 Regression test your workflows
- 📊 Batch process multiple prompts
- 🔄 Integrate with CI/CD pipelines

---

**Ready to try it yourself?**

```powershell
.\quick-prompt-test.ps1 "Run the v2 prompt tests again"
```

🎉 **Happy Automating!**
