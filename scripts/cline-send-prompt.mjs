#!/usr/bin/env node
/**
 * CLI tool to send prompts to a running Cline instance via gRPC
 *
 * Usage:
 *   cline-send-prompt "your prompt here"
 *   echo "your prompt" | cline-send-prompt
 *   cline-send-prompt --file prompt.txt
 *   cline-send-prompt --image screenshot.png "analyze this"
 */

import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { existsSync, readFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const PROTOBUS_ADDRESS = process.env.PROTOBUS_ADDRESS || "127.0.0.1:26040"
const PROTO_PATH = join(__dirname, "..", "proto", "cline", "task.proto")
const COMMON_PROTO_PATH = join(__dirname, "..", "proto", "cline", "common.proto")
const STATE_PROTO_PATH = join(__dirname, "..", "proto", "cline", "state.proto")

// Parse command line arguments
function parseArgs() {
	const args = process.argv.slice(2)
	const options = {
		text: "",
		images: [],
		files: [],
		help: false,
		file: null,
	}

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]

		if (arg === "--help" || arg === "-h") {
			options.help = true
		} else if (arg === "--image" || arg === "-i") {
			if (i + 1 < args.length) {
				options.images.push(args[++i])
			}
		} else if (arg === "--file" || arg === "-f") {
			if (i + 1 < args.length) {
				options.file = args[++i]
			}
		} else if (arg === "--attach") {
			if (i + 1 < args.length) {
				options.files.push(args[++i])
			}
		} else {
			// Treat as text prompt
			options.text += (options.text ? " " : "") + arg
		}
	}

	return options
}

function showHelp() {
	console.log(`
Cline Prompt Sender - Send prompts to Cline via gRPC

Usage:
  cline-send-prompt [options] <prompt text>

Options:
  -h, --help              Show this help message
  -f, --file <path>       Read prompt from file
  -i, --image <path>      Attach image (can be used multiple times)
  --attach <path>         Attach file (can be used multiple times)

Environment Variables:
  PROTOBUS_ADDRESS        gRPC server address (default: 127.0.0.1:26040)

Examples:
  # Send a simple prompt
  cline-send-prompt "Fix the bug in main.js"

  # Read prompt from file
  cline-send-prompt --file my-prompt.txt

  # Send prompt with attached image
  cline-send-prompt --image screenshot.png "Analyze this screenshot"

  # Pipe from stdin
  echo "Run the tests" | cline-send-prompt

  # Use in scripts
  git diff | cline-send-prompt "Review these changes"
`)
}

async function sendPrompt(text, images = [], files = []) {
	// Load proto files
	const packageDefinition = protoLoader.loadSync([PROTO_PATH, COMMON_PROTO_PATH, STATE_PROTO_PATH], {
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
		includeDirs: [join(__dirname, "..", "proto")],
	})

	const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
	const taskService = protoDescriptor.cline.TaskService

	// Create gRPC client
	const client = new taskService(PROTOBUS_ADDRESS, grpc.credentials.createInsecure())

	return new Promise((resolve, reject) => {
		const request = {
			metadata: {},
			text: text,
			images: images,
			files: files,
			task_settings: null,
		}

		console.error(`Connecting to Cline at ${PROTOBUS_ADDRESS}...`)

		client.newTask(request, (error, response) => {
			if (error) {
				reject(error)
			} else {
				resolve(response)
			}
			client.close()
		})
	})
}

async function main() {
	const options = parseArgs()

	if (options.help) {
		showHelp()
		process.exit(0)
	}

	// Read from file if specified
	if (options.file) {
		if (!existsSync(options.file)) {
			console.error(`Error: File not found: ${options.file}`)
			process.exit(1)
		}
		options.text = readFileSync(options.file, "utf-8")
	}

	// Read from stdin if no text provided
	if (!options.text && !process.stdin.isTTY) {
		const chunks = []
		for await (const chunk of process.stdin) {
			chunks.push(chunk)
		}
		options.text = Buffer.concat(chunks).toString("utf-8")
	}

	// Validate we have a prompt
	if (!options.text.trim()) {
		console.error("Error: No prompt text provided")
		showHelp()
		process.exit(1)
	}

	// Validate image paths
	for (const imagePath of options.images) {
		if (!existsSync(imagePath)) {
			console.error(`Error: Image file not found: ${imagePath}`)
			process.exit(1)
		}
		// Convert to base64
		const imageData = readFileSync(imagePath, "base64")
		const ext = imagePath.split(".").pop().toLowerCase()
		const mimeType = ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png"
		options.images[options.images.indexOf(imagePath)] = `data:${mimeType};base64,${imageData}`
	}

	// Validate file paths
	for (const filePath of options.files) {
		if (!existsSync(filePath)) {
			console.error(`Error: Attachment file not found: ${filePath}`)
			process.exit(1)
		}
	}

	try {
		console.error(`Sending prompt (${options.text.length} characters)...`)
		const response = await sendPrompt(options.text, options.images, options.files)
		console.error(`✓ Prompt sent successfully!`)
		console.error(`Task ID: ${response.value}`)
		process.exit(0)
	} catch (error) {
		console.error(`✗ Failed to send prompt:`, error.message)
		console.error("\nTroubleshooting:")
		console.error(`  1. Make sure Cline is running`)
		console.error(`  2. Check that gRPC server is running on ${PROTOBUS_ADDRESS}`)
		console.error(`  3. Try setting PROTOBUS_ADDRESS environment variable`)
		process.exit(1)
	}
}

main().catch((error) => {
	console.error("Unexpected error:", error)
	process.exit(1)
})
