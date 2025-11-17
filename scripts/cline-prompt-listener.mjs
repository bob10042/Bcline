#!/usr/bin/env node

/**
 * File watcher that listens for new prompt files and sends them to Cline
 *
 * This creates a "drop box" where you can drop .txt files and they'll automatically
 * be sent to Cline as new prompts.
 *
 * Usage:
 *   cline-prompt-listener [directory]
 *   cline-prompt-listener --watch-dir /tmp/cline-prompts
 */

import { exec } from "child_process"
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, watch } from "fs"
import { homedir } from "os"
import { basename, dirname, extname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const DEFAULT_WATCH_DIR = join(homedir(), ".cline", "prompts")
const SEND_PROMPT_SCRIPT = join(__dirname, "cline-send-prompt.mjs")

function parseArgs() {
	const args = process.argv.slice(2)
	const options = {
		watchDir: null,
		help: false,
		delete: true, // Delete files after processing
		verbose: false,
	}

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]

		if (arg === "--help" || arg === "-h") {
			options.help = true
		} else if (arg === "--watch-dir" || arg === "-d") {
			if (i + 1 < args.length) {
				options.watchDir = args[++i]
			}
		} else if (arg === "--keep-files") {
			options.delete = false
		} else if (arg === "--verbose" || arg === "-v") {
			options.verbose = true
		} else if (!arg.startsWith("--")) {
			// Positional argument
			options.watchDir = arg
		}
	}

	options.watchDir = options.watchDir || DEFAULT_WATCH_DIR

	return options
}

function showHelp() {
	console.log(`
Cline Prompt Listener - Watch directory for prompt files

This tool monitors a directory for new .txt files and automatically
sends them to Cline as prompts. Great for automation and scripting!

Usage:
  cline-prompt-listener [options] [directory]

Options:
  -h, --help              Show this help message
  -d, --watch-dir <path>  Directory to watch (default: ~/.cline/prompts)
  --keep-files            Don't delete files after processing
  -v, --verbose           Show detailed logging

Examples:
  # Start listener with default directory
  cline-prompt-listener

  # Watch a custom directory
  cline-prompt-listener /tmp/my-prompts

  # Keep files after processing
  cline-prompt-listener --keep-files

Directory Structure:
  ${DEFAULT_WATCH_DIR}/
    ├── prompt-001.txt          → Simple text prompt
    ├── prompt-002.txt          → Another prompt
    └── .processed/             → Processed files (if --keep-files)

File Naming Conventions:
  - Files starting with dot (.) are ignored
  - Only .txt files are processed
  - Files are processed in alphabetical order
  - Files are deleted after processing (unless --keep-files)

Integration with Scripts:
  # Shell script example
  echo "Run the tests" > ~/.cline/prompts/run-tests.txt

  # Python example
  with open(os.path.expanduser("~/.cline/prompts/my-task.txt"), "w") as f:
      f.write("Fix the bug in main.py")

  # Git hook example (post-commit)
  git diff HEAD~1 > /tmp/diff.txt
  echo "Review this commit:" > ~/.cline/prompts/review-$(git rev-parse --short HEAD).txt
  cat /tmp/diff.txt >> ~/.cline/prompts/review-$(git rev-parse --short HEAD).txt
`)
}

function ensureDirectoryExists(dir) {
	if (!existsSync(dir)) {
		console.log(`Creating watch directory: ${dir}`)
		mkdirSync(dir, { recursive: true })
	}
}

function processPromptFile(filePath, options) {
	const filename = basename(filePath)

	// Ignore hidden files and non-txt files
	if (filename.startsWith(".") || extname(filename) !== ".txt") {
		return
	}

	console.log(`📝 Processing: ${filename}`)

	try {
		// Read the prompt
		const prompt = readFileSync(filePath, "utf-8")

		if (!prompt.trim()) {
			console.log(`  ⚠️  Skipping empty file`)
			if (options.delete) {
				unlinkSync(filePath)
			}
			return
		}

		// Send to Cline using the send-prompt script
		const cmd = `node "${SEND_PROMPT_SCRIPT}"`
		const child = exec(cmd, {
			maxBuffer: 10 * 1024 * 1024, // 10MB buffer
		})

		// Send prompt via stdin
		child.stdin.write(prompt)
		child.stdin.end()

		child.stderr.on("data", (data) => {
			if (options.verbose) {
				console.log(`  ${data.toString().trim()}`)
			}
		})

		child.on("exit", (code) => {
			if (code === 0) {
				console.log(`  ✓ Sent successfully!`)

				// Delete or move the file
				if (options.delete) {
					unlinkSync(filePath)
				} else {
					const processedDir = join(dirname(filePath), ".processed")
					ensureDirectoryExists(processedDir)
					const processedPath = join(processedDir, `${Date.now()}-${filename}`)
					renameSync(filePath, processedPath)
					console.log(`  → Moved to ${processedPath}`)
				}
			} else {
				console.log(`  ✗ Failed to send (exit code: ${code})`)
			}
		})
	} catch (error) {
		console.error(`  ✗ Error processing file:`, error.message)
	}
}

async function startWatcher(options) {
	const watchDir = options.watchDir

	ensureDirectoryExists(watchDir)

	console.log(`
🎯 Cline Prompt Listener started!
📁 Watching: ${watchDir}
🗑️  Delete after processing: ${options.delete ? "yes" : "no"}

Drop .txt files in this directory to send them to Cline.
Press Ctrl+C to stop.
`)

	// Process any existing files
	const fs = await import("fs/promises")
	try {
		const files = await fs.readdir(watchDir)
		for (const file of files.sort()) {
			const filePath = join(watchDir, file)
			const stats = await fs.stat(filePath)
			if (stats.isFile()) {
				processPromptFile(filePath, options)
			}
		}
	} catch (_error) {
		// Directory might not exist yet
	}

	// Watch for new files
	const watcher = watch(
		watchDir,
		{
			persistent: true,
			recursive: false,
		},
		(eventType, filename) => {
			if (!filename) {
				return
			}

			const filePath = join(watchDir, filename)

			// Check if file exists (might have been deleted)
			if (!existsSync(filePath)) {
				return
			}

			if (options.verbose) {
				console.log(`\n📢 File event: ${eventType} - ${filename}`)
			}

			// Wait a bit for the file to be fully written
			setTimeout(() => {
				if (existsSync(filePath)) {
					processPromptFile(filePath, options)
				}
			}, 100)
		},
	)

	// Handle graceful shutdown
	process.on("SIGINT", () => {
		console.log("\n\n👋 Stopping listener...")
		watcher.close()
		process.exit(0)
	})

	process.on("SIGTERM", () => {
		watcher.close()
		process.exit(0)
	})
}

async function main() {
	const options = parseArgs()

	if (options.help) {
		showHelp()
		process.exit(0)
	}

	await startWatcher(options)
}

main().catch((error) => {
	console.error("Unexpected error:", error)
	process.exit(1)
})
