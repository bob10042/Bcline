import { expect } from "@playwright/test"
import { e2e } from "./utils/helpers"

/**
 * Automated Prompt Injection Test
 *
 * This test demonstrates how to programmatically send prompts to Cline's web UI
 * and monitor responses. Useful for batch testing, regression testing, or
 * automated workflow validation.
 */

// Test prompts to inject
const TEST_PROMPTS = [
	{
		name: "Simple greeting",
		text: "Hello! Can you tell me what version of Cline this is?",
		expectResponse: true,
		waitForCompletion: true,
	},
	{
		name: "File operation",
		text: "Create a file called test-output.txt with the text 'Automated test successful'",
		expectResponse: true,
		waitForCompletion: true,
	},
	{
		name: "Code generation",
		text: "Write a Python function to calculate fibonacci numbers",
		expectResponse: true,
		waitForCompletion: true,
	},
	{
		name: "V2 CLI tests",
		text: "Run the v2 prompt tests again",
		expectResponse: true,
		waitForCompletion: true,
	},
]

e2e("Automated Prompts - Send multiple prompts programmatically", async ({ helper, sidebar, page }) => {
	// Sign in first
	await helper.signin(sidebar)

	const inputbox = sidebar.getByTestId("chat-input")
	const sendButton = sidebar.getByTestId("send-button")

	// Verify UI is ready
	await expect(inputbox).toBeVisible()
	await expect(sendButton).toBeVisible()

	// Process each test prompt
	for (const prompt of TEST_PROMPTS) {
		console.log(`\n📝 Sending prompt: ${prompt.name}`)
		console.log(`   Text: ${prompt.text}`)

		// Fill input box
		await inputbox.fill(prompt.text)
		await expect(inputbox).toHaveValue(prompt.text)

		// Send message
		await sendButton.click()

		// Verify input cleared after sending
		await expect(inputbox).toHaveValue("")

		if (prompt.waitForCompletion) {
			// Wait for Cline to start processing
			// Look for thinking indicator or response messages
			await page.waitForTimeout(2000) // Give Cline time to start thinking

			// Optional: Wait for completion indicators
			// You could look for specific UI elements that indicate completion
			// For example: completion checkmark, "Task completed" message, etc.

			console.log(`   ✅ Prompt sent successfully`)
		}

		// Small delay between prompts to avoid overwhelming the system
		await page.waitForTimeout(1000)
	}

	console.log("\n✅ All automated prompts sent successfully!")
})

/**
 * Single Prompt Test - Simplified version for testing individual prompts
 */
e2e("Automated Prompts - Send single custom prompt", async ({ helper, sidebar, page }) => {
	await helper.signin(sidebar)

	const inputbox = sidebar.getByTestId("chat-input")
	const sendButton = sidebar.getByTestId("send-button")

	// Custom prompt (change this to test different prompts)
	const customPrompt = "can you run the v2 prompt tests again"

	console.log(`\n📝 Sending custom prompt: ${customPrompt}`)

	await inputbox.fill(customPrompt)
	await sendButton.click()
	await expect(inputbox).toHaveValue("")

	console.log("✅ Custom prompt sent!")

	// Keep browser open to watch Cline work
	await page.waitForTimeout(5000)
})

/**
 * Interactive Prompt Injection - Load prompts from a file or environment variable
 */
e2e("Automated Prompts - Load from external source", async ({ helper, sidebar, page }) => {
	await helper.signin(sidebar)

	const inputbox = sidebar.getByTestId("chat-input")
	const sendButton = sidebar.getByTestId("send-button")

	// Example: Load from environment variable
	const externalPrompt = process.env.CLINE_TEST_PROMPT || "What files are in the current directory?"

	console.log(`\n📝 Sending external prompt: ${externalPrompt}`)

	await inputbox.fill(externalPrompt)
	await sendButton.click()

	console.log("✅ External prompt sent!")

	// Wait to observe response
	await page.waitForTimeout(10000)
})

/**
 * Batch Prompt Test - Simulate a full workflow
 */
e2e("Automated Prompts - Full workflow simulation", async ({ helper, sidebar, page }) => {
	await helper.signin(sidebar)

	const inputbox = sidebar.getByTestId("chat-input")
	const sendButton = sidebar.getByTestId("send-button")

	// Workflow: Setup → Test → Cleanup
	const workflow = [
		"Create a new directory called automated-test-workspace",
		"Create a Python file called hello.py with a simple hello world function",
		"Create a test file called test_hello.py that tests the hello world function",
		"Run the tests using pytest",
		"Show me the test results",
	]

	for (let i = 0; i < workflow.length; i++) {
		const step = workflow[i]
		console.log(`\n🔄 Step ${i + 1}/${workflow.length}: ${step}`)

		await inputbox.fill(step)
		await sendButton.click()
		await expect(inputbox).toHaveValue("")

		// Wait between workflow steps
		await page.waitForTimeout(3000)
	}

	console.log("\n✅ Workflow completed!")
})
