# Cline Automated Prompt Injection System

This system allows you to programmatically send prompts to the Cline web UI for automated testing, batch operations, and workflow automation.

## 🎯 Quick Start

### Method 1: PowerShell Script (Easiest - Windows)

```powershell
# Send a single prompt
.\scripts\Send-ClinePrompt.ps1 "Run the v2 prompt tests again"

# Send multiple prompts from a file
.\scripts\Send-ClinePrompt.ps1 -PromptsFile test-prompts.txt

# Run in headless mode with custom wait time
.\scripts\Send-ClinePrompt.ps1 -Prompt "Hello Cline" -HeadlessMode -WaitTime 60
```

### Method 2: Playwright E2E Tests

```bash
# Run all automated prompt tests
npm run e2e -- src/test/e2e/automated-prompts.test.ts

# Run with UI visible (recommended for debugging)
npm run test:e2e:ui
```

### Method 3: Direct Playwright Test

```bash
# Run specific test
npx playwright test src/test/e2e/automated-prompts.test.ts --headed

# Run in debug mode
npx playwright test src/test/e2e/automated-prompts.test.ts --debug
```

## 📁 Files Created

### 1. **src/test/e2e/automated-prompts.test.ts**
Main Playwright test file with 4 test scenarios:
- ✅ Multiple prompts sequentially
- ✅ Single custom prompt
- ✅ Load from external source (env var)
- ✅ Full workflow simulation

### 2. **scripts/Send-ClinePrompt.ps1**
PowerShell wrapper script with features:
- Single prompt or batch from file
- Headless/headed mode
- Configurable wait times
- Color-coded output

### 3. **scripts/send-prompt.ts**
TypeScript standalone script (alternative approach)

### 4. **test-prompts.txt**
Example batch prompts file:
```
Run the v2 prompt tests again
What files are in the current directory?
Create a Python file that prints Hello World
Run pytest on all test files
...
```

## 🔧 Test Scenarios Included

### Test 1: Sequential Prompts
Sends multiple predefined prompts one after another:
```typescript
const TEST_PROMPTS = [
  "Hello! Can you tell me what version of Cline this is?",
  "Create a file called test-output.txt with the text 'Automated test successful'",
  "Write a Python function to calculate fibonacci numbers",
  "Run the v2 prompt tests again"
]
```

### Test 2: Single Custom Prompt
Quick test for a single prompt:
```typescript
const customPrompt = "can you run the v2 prompt tests again"
```

### Test 3: External Source
Load prompts from environment variables:
```bash
CLINE_TEST_PROMPT="Your prompt here" npm run e2e
```

### Test 4: Full Workflow
Simulates multi-step workflow:
```typescript
const workflow = [
  "Create a new directory called automated-test-workspace",
  "Create a Python file called hello.py with a simple hello world function",
  "Create a test file called test_hello.py that tests the hello world function",
  "Run the tests using pytest",
  "Show me the test results"
]
```

## 🎮 Usage Examples

### Example 1: Run V2 Prompt Tests
```powershell
.\scripts\Send-ClinePrompt.ps1 "Run the v2 prompt tests again"
```

### Example 2: Batch Test Multiple Prompts
Create a file `my-prompts.txt`:
```
List all TypeScript files
Show git status
Run all tests
Create a summary report
```

Run:
```powershell
.\scripts\Send-ClinePrompt.ps1 -PromptsFile my-prompts.txt
```

### Example 3: CI/CD Integration
```bash
# In your CI pipeline
CLINE_TEST_PROMPT="Run integration tests" npm run e2e -- automated-prompts.test.ts
```

### Example 4: Custom Test Suite
Edit `src/test/e2e/automated-prompts.test.ts` and add your own test:
```typescript
e2e("My Custom Test", async ({ helper, sidebar, page }) => {
  await helper.signin(sidebar)

  const inputbox = sidebar.getByTestId("chat-input")
  const sendButton = sidebar.getByTestId("send-button")

  await inputbox.fill("Your custom prompt here")
  await sendButton.click()

  // Add assertions, wait for results, etc.
})
```

## 🔍 How It Works

1. **Test Setup**: Playwright launches VSCode with Cline extension in E2E mode
2. **Authentication**: Auto-signs in to Cline
3. **Prompt Injection**: Fills the `chat-input` testId element and clicks `send-button`
4. **Response Monitoring**: Waits for Cline to process (configurable timeout)
5. **Cleanup**: Closes VSCode instance after test completes

## 🛠️ Advanced Configuration

### Modify Wait Times
In `automated-prompts.test.ts`:
```typescript
await page.waitForTimeout(5000) // Wait 5 seconds
```

### Add Response Validation
```typescript
// Wait for specific response text
await expect(sidebar.getByText("Test completed successfully")).toBeVisible()
```

### Enable Video Recording
Playwright automatically records videos on failure. To record all:
```typescript
// In playwright.config.ts
use: {
  video: "on" // Changed from "retain-on-failure"
}
```

### Headless Mode
```bash
# Run without visible browser
npx playwright test automated-prompts.test.ts
```

## 📊 Test IDs Reference

Key UI elements you can interact with:
- `chat-input` - Main message input textarea
- `send-button` - Send message button
- `new-task-button` - New task button
- Act/Plan switches: `role: "switch", name: "Act"` or `"Plan"`

## 🐛 Debugging

### View Browser Actions
```bash
npx playwright test automated-prompts.test.ts --headed --debug
```

### Slow Down Actions
In the test file:
```typescript
const browser = await chromium.launch({ slowMo: 500 }) // 500ms delay
```

### Inspect Element Selectors
```bash
npx playwright codegen
```

## 🚀 Performance Tips

1. **Parallel Tests**: Set `workers: 4` in `playwright.config.ts`
2. **Reuse Browser Context**: Share auth state across tests
3. **Skip Unnecessary Waits**: Only wait when needed
4. **Headless Mode**: Faster execution without UI rendering

## 📝 Example Output

```
🚀 Cline Prompt Injector
========================

📝 Prompts to send:
   - Run the v2 prompt tests again

🎭 Starting Playwright...

📝 Sending prompt: Run the v2 prompt tests again
   Text: Run the v2 prompt tests again
   ✅ Prompt sent successfully

✅ All automated prompts sent successfully!
🏁 Done!
```

## 🔐 Security Notes

- Tests run in isolated VSCode instance with temp user data
- No production data accessed
- Mock API server used for sensitive operations
- Video recordings stored in `test-results/playwright/`

## 🤝 Contributing

To add new automated tests:

1. Edit `src/test/e2e/automated-prompts.test.ts`
2. Add your test case using the `e2e()` wrapper
3. Use `sidebar.getByTestId()` for reliable element selection
4. Run `npm run test:e2e` to verify

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [VSCode Extension Testing](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- [Cline E2E Test Helpers](./src/test/e2e/utils/helpers.ts)

---

**Need Help?** Check existing tests in `src/test/e2e/` for more examples!
