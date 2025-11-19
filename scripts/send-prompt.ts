#!/usr/bin/env ts-node
/**
 * Standalone Prompt Injector Script
 *
 * Usage:
 *   npm run send-prompt "Your prompt here"
 *   npm run send-prompt "Run the v2 prompt tests again"
 *
 * Or with environment variable:
 *   PROMPT="Your prompt" npm run send-prompt
 */

import { chromium } from "playwright"

async function sendPromptToCline(promptText: string) {
	console.log("🚀 Starting Cline prompt injection...")
	console.log(`📝 Prompt: ${promptText}\n`)

	// Launch browser
	const browser = await chromium.launch({
		headless: false, // Set to true for headless mode
		slowMo: 100, // Slow down actions for visibility
	})

	const context = await browser.newContext()
	const page = await context.newPage()

	try {
		// Navigate to VSCode (assuming it's running on localhost)
		// Note: This requires VSCode to be running with the Cline extension
		await page.goto("http://localhost:3000") // Adjust port as needed

		// Wait for Cline sidebar to load
		await page.waitForTimeout(2000)

		// Find the input box
		const inputbox = page.getByTestId("chat-input")
		const sendButton = page.getByTestId("send-button")

		// Fill and send
		await inputbox.fill(promptText)
		await sendButton.click()

		console.log("✅ Prompt sent successfully!")

		// Keep browser open to watch response
		console.log("⏳ Waiting for response (30s)...")
		await page.waitForTimeout(30000)
	} catch (error) {
		console.error("❌ Error sending prompt:", error)
	} finally {
		await browser.close()
		console.log("🏁 Done!")
	}
}

// Get prompt from command line args or environment
const prompt = process.argv[2] || process.env.PROMPT || "Hello, Cline!"

sendPromptToCline(prompt)
