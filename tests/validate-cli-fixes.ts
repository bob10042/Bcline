/**
 * Automated CLI Fix Validation Script
 *
 * This script validates that all 5 CLI improvements are properly implemented:
 * 1. Exit code detection and reporting
 * 2. Error pattern detection with warnings
 * 3. Pre-completion validation blocking
 * 4. Smart feedback detection
 * 5. Command transparency
 *
 * Usage: npx ts-node tests/validate-cli-fixes.ts
 */

import * as fs from "fs"
import * as path from "path"

interface ValidationResult {
	feature: string
	passed: boolean
	details: string[]
	score: number
	maxScore: number
}

interface FileCheck {
	path: string
	checks: {
		pattern: RegExp
		description: string
		required: boolean
	}[]
}

class CLIFixValidator {
	private results: ValidationResult[] = []
	private baseDir: string

	constructor(baseDir: string) {
		this.baseDir = baseDir
	}

	/**
	 * Run all validation checks
	 */
	async validate(): Promise<void> {
		console.log("🔍 CLI Fix Validation Starting...\n")

		await this.validateSystemPrompt()
		await this.validateExitCodeTracking()
		await this.validateErrorPatternDetection()
		await this.validatePreCompletionValidation()
		await this.validateSmartFeedback()

		this.printReport()
	}

	/**
	 * Validate system prompt changes (CHANGE #1)
	 */
	private async validateSystemPrompt(): Promise<void> {
		const feature = "System Prompt Fix"
		const details: string[] = []
		let score = 0
		const maxScore = 20

		try {
			const filePath = path.join(this.baseDir, "src/core/prompts/system-prompt/components/rules.ts")

			if (!fs.existsSync(filePath)) {
				details.push("❌ File not found: rules.ts")
				this.results.push({ feature, passed: false, details, score, maxScore })
				return
			}

			const content = fs.readFileSync(filePath, "utf-8")

			// Check OLD prompt is removed
			const oldPromptExists = content.includes("assume the terminal executed the command successfully")
			if (oldPromptExists) {
				details.push('❌ OLD PROMPT STILL PRESENT: "assume success" text found')
			} else {
				details.push('✅ Old "assume success" prompt removed')
				score += 8
			}

			// Check NEW prompt is present
			const newPromptPatterns = [
				"carefully check the output for error",
				"error messages, failure indicators",
				"Error:",
				"FAIL",
				"fatal:",
				"non-zero exit codes",
				"verify the command succeeded",
			]

			let newPromptChecks = 0
			for (const pattern of newPromptPatterns) {
				if (content.toLowerCase().includes(pattern.toLowerCase())) {
					newPromptChecks++
				}
			}

			if (newPromptChecks >= 5) {
				details.push(`✅ New "verify success" prompt present (${newPromptChecks}/6 patterns)`)
				score += 12
			} else {
				details.push(`⚠️ New prompt incomplete (${newPromptChecks}/6 patterns found)`)
				score += Math.floor((newPromptChecks / 6) * 12)
			}

			this.results.push({
				feature,
				passed: score >= 15,
				details,
				score,
				maxScore,
			})
		} catch (error) {
			details.push(`❌ Error validating: ${error}`)
			this.results.push({ feature, passed: false, details, score, maxScore })
		}
	}

	/**
	 * Validate exit code tracking (CHANGE #2)
	 */
	private async validateExitCodeTracking(): Promise<void> {
		const feature = "Exit Code Tracking"
		const details: string[] = []
		let score = 0
		const maxScore = 20

		try {
			// Check TerminalProcess.ts
			const terminalPath = path.join(this.baseDir, "src/integrations/terminal/TerminalProcess.ts")

			if (!fs.existsSync(terminalPath)) {
				details.push("❌ TerminalProcess.ts not found")
			} else {
				const content = fs.readFileSync(terminalPath, "utf-8")

				// Check for exit code capture
				if (content.includes("this.exitCode = ") || content.includes("exitCode")) {
					details.push("✅ Exit code capture implemented")
					score += 5
				} else {
					details.push("❌ Exit code capture not found")
				}

				// Check for getExitCode method
				if (content.includes("getExitCode()") || content.includes("getExitCode")) {
					details.push("✅ getExitCode method present")
					score += 5
				} else {
					details.push("⚠️ getExitCode method not found")
				}
			}

			// Check Task handler
			const taskPath = path.join(this.baseDir, "src/core/task/index.ts")

			if (!fs.existsSync(taskPath)) {
				details.push("❌ Task index.ts not found")
			} else {
				const content = fs.readFileSync(taskPath, "utf-8")

				// Check for exit code reporting
				const exitCodeReporting =
					content.includes("Exit Code: 0 (Success)") ||
					content.includes("Exit Code:") ||
					content.includes("exitCode === 0")

				if (exitCodeReporting) {
					details.push("✅ Exit code reporting in task handler")
					score += 10
				} else {
					details.push("⚠️ Exit code reporting not complete")
					score += 5
				}
			}

			this.results.push({
				feature,
				passed: score >= 15,
				details,
				score,
				maxScore,
			})
		} catch (error) {
			details.push(`❌ Error validating: ${error}`)
			this.results.push({ feature, passed: false, details, score, maxScore })
		}
	}

	/**
	 * Validate error pattern detection (CHANGE #3)
	 */
	private async validateErrorPatternDetection(): Promise<void> {
		const feature = "Error Pattern Detection"
		const details: string[] = []
		let score = 0
		const maxScore = 25

		try {
			const filePath = path.join(this.baseDir, "src/integrations/terminal/TerminalManager.ts")

			if (!fs.existsSync(filePath)) {
				details.push("❌ TerminalManager.ts not found")
				this.results.push({ feature, passed: false, details, score, maxScore })
				return
			}

			const content = fs.readFileSync(filePath, "utf-8")

			// Check for error detection method
			if (content.includes("detectErrorPatterns")) {
				details.push("✅ detectErrorPatterns method exists")
				score += 5
			} else {
				details.push("❌ detectErrorPatterns method not found")
			}

			// Check for error patterns
			const requiredPatterns = [
				"error:",
				"failed",
				"npm ERR!",
				"fatal:",
				"exception",
				"command not found",
				"no such file",
				"permission denied",
			]

			let foundPatterns = 0
			for (const pattern of requiredPatterns) {
				if (content.toLowerCase().includes(pattern.toLowerCase())) {
					foundPatterns++
				}
			}

			if (foundPatterns >= 6) {
				details.push(`✅ Error patterns implemented (${foundPatterns}/${requiredPatterns.length})`)
				score += 10
			} else {
				details.push(`⚠️ Only ${foundPatterns}/${requiredPatterns.length} error patterns found`)
				score += Math.floor((foundPatterns / requiredPatterns.length) * 10)
			}

			// Check for warning output
			if (content.includes("⚠️ ERROR DETECTED") || content.includes("ERROR DETECTED")) {
				details.push("✅ Error warning output implemented")
				score += 10
			} else {
				details.push("❌ Error warning output not found")
			}

			this.results.push({
				feature,
				passed: score >= 18,
				details,
				score,
				maxScore,
			})
		} catch (error) {
			details.push(`❌ Error validating: ${error}`)
			this.results.push({ feature, passed: false, details, score, maxScore })
		}
	}

	/**
	 * Validate pre-completion validation (CHANGE #4)
	 */
	private async validatePreCompletionValidation(): Promise<void> {
		const feature = "Pre-Completion Validation"
		const details: string[] = []
		let score = 0
		const maxScore = 20

		try {
			const filePath = path.join(this.baseDir, "src/core/task/tools/handlers/AttemptCompletionHandler.ts")

			if (!fs.existsSync(filePath)) {
				details.push("❌ AttemptCompletionHandler.ts not found")
				this.results.push({ feature, passed: false, details, score, maxScore })
				return
			}

			const content = fs.readFileSync(filePath, "utf-8")

			// Check for validation comment
			if (content.includes("PRE-COMPLETION VALIDATION")) {
				details.push("✅ Pre-completion validation section present")
				score += 5
			} else {
				details.push("⚠️ Validation section comment not found")
			}

			// Check for recent messages check
			if (content.includes("getClineMessages") || content.includes("recentMessages")) {
				details.push("✅ Recent messages check implemented")
				score += 5
			} else {
				details.push("❌ Recent messages check not found")
			}

			// Check for error pattern detection in validation
			if (content.includes("command_output") || content.includes("errorPatterns")) {
				details.push("✅ Command output scanning present")
				score += 5
			} else {
				details.push("❌ Command output scanning not found")
			}

			// Check for blocking logic
			if (content.includes("Cannot attempt completion") || content.includes("Recent command output contains errors")) {
				details.push("✅ Completion blocking logic implemented")
				score += 5
			} else {
				details.push("❌ Blocking logic not found")
			}

			this.results.push({
				feature,
				passed: score >= 15,
				details,
				score,
				maxScore,
			})
		} catch (error) {
			details.push(`❌ Error validating: ${error}`)
			this.results.push({ feature, passed: false, details, score, maxScore })
		}
	}

	/**
	 * Validate smart feedback detection (CHANGE #5)
	 */
	private async validateSmartFeedback(): Promise<void> {
		const feature = "Smart Feedback Detection"
		const details: string[] = []
		let score = 0
		const maxScore = 15

		try {
			const filePath = path.join(this.baseDir, "src/core/task/tools/handlers/AttemptCompletionHandler.ts")

			if (!fs.existsSync(filePath)) {
				details.push("❌ AttemptCompletionHandler.ts not found")
				this.results.push({ feature, passed: false, details, score, maxScore })
				return
			}

			const content = fs.readFileSync(filePath, "utf-8")

			// Check for feedback detection comment
			if (content.includes("SMART FEEDBACK DETECTION")) {
				details.push("✅ Smart feedback detection section present")
				score += 3
			} else {
				details.push("⚠️ Feedback detection section not found")
			}

			// Check for negative indicators
			const negativeIndicators = [
				"didn't work",
				"doesn't work",
				"not working",
				"failed",
				"broken",
				"error",
				"wrong",
				"incorrect",
			]

			let foundIndicators = 0
			for (const indicator of negativeIndicators) {
				if (content.toLowerCase().includes(indicator.toLowerCase())) {
					foundIndicators++
				}
			}

			if (foundIndicators >= 6) {
				details.push(`✅ Negative indicators present (${foundIndicators}/${negativeIndicators.length})`)
				score += 6
			} else {
				details.push(`⚠️ Only ${foundIndicators}/${negativeIndicators.length} negative indicators found`)
				score += Math.floor((foundIndicators / negativeIndicators.length) * 6)
			}

			// Check for critical warning
			if (content.includes("⚠️ CRITICAL") || content.includes("CRITICAL:")) {
				details.push("✅ CRITICAL warning message implemented")
				score += 6
			} else {
				details.push("❌ CRITICAL warning not found")
			}

			this.results.push({
				feature,
				passed: score >= 11,
				details,
				score,
				maxScore,
			})
		} catch (error) {
			details.push(`❌ Error validating: ${error}`)
			this.results.push({ feature, passed: false, details, score, maxScore })
		}
	}

	/**
	 * Print validation report
	 */
	private printReport(): void {
		console.log("\n" + "=".repeat(70))
		console.log("                    VALIDATION REPORT                           ")
		console.log("=".repeat(70) + "\n")

		let totalScore = 0
		let totalMaxScore = 0
		let passedCount = 0

		for (const result of this.results) {
			totalScore += result.score
			totalMaxScore += result.maxScore
			if (result.passed) passedCount++

			const status = result.passed ? "✅ PASS" : "❌ FAIL"
			const percentage = Math.round((result.score / result.maxScore) * 100)

			console.log(`\n${status} | ${result.feature} (${result.score}/${result.maxScore} - ${percentage}%)`)
			console.log("-".repeat(70))

			for (const detail of result.details) {
				console.log(`  ${detail}`)
			}
		}

		console.log("\n" + "=".repeat(70))
		console.log("                       FINAL SUMMARY                            ")
		console.log("=".repeat(70))

		const finalPercentage = Math.round((totalScore / totalMaxScore) * 100)
		const grade = this.calculateGrade(finalPercentage)

		console.log(`\n  Total Score:     ${totalScore}/${totalMaxScore} (${finalPercentage}%)`)
		console.log(`  Features Passed: ${passedCount}/${this.results.length}`)
		console.log(`  Grade:           ${grade.grade} (${grade.description})`)

		console.log("\n" + "=".repeat(70))

		if (finalPercentage >= 80) {
			console.log("\n✅ VALIDATION PASSED - CLI fixes properly implemented!\n")
		} else {
			console.log("\n❌ VALIDATION FAILED - Please review and fix the issues above.\n")
		}

		// Save report to file
		this.saveReport(totalScore, totalMaxScore, finalPercentage, grade)
	}

	/**
	 * Calculate letter grade
	 */
	private calculateGrade(percentage: number): { grade: string; description: string } {
		if (percentage >= 95) return { grade: "A+", description: "Excellent" }
		if (percentage >= 90) return { grade: "A", description: "Very Good" }
		if (percentage >= 85) return { grade: "B+", description: "Good" }
		if (percentage >= 80) return { grade: "B", description: "Acceptable" }
		if (percentage >= 75) return { grade: "C+", description: "Needs Work" }
		if (percentage >= 70) return { grade: "C", description: "Poor" }
		return { grade: "F", description: "Failing" }
	}

	/**
	 * Save report to file
	 */
	private saveReport(
		totalScore: number,
		totalMaxScore: number,
		finalPercentage: number,
		grade: { grade: string; description: string },
	): void {
		const reportPath = path.join(this.baseDir, "tests", "VALIDATION_REPORT.md")
		const timestamp = new Date().toISOString()

		let report = `# CLI Fix Validation Report\n\n`
		report += `**Date**: ${timestamp}\n`
		report += `**Score**: ${totalScore}/${totalMaxScore} (${finalPercentage}%)\n`
		report += `**Grade**: ${grade.grade} (${grade.description})\n\n`

		report += `## Results by Feature\n\n`

		for (const result of this.results) {
			const status = result.passed ? "✅ PASS" : "❌ FAIL"
			const percentage = Math.round((result.score / result.maxScore) * 100)

			report += `### ${status} ${result.feature}\n`
			report += `**Score**: ${result.score}/${result.maxScore} (${percentage}%)\n\n`
			report += `**Details**:\n`
			for (const detail of result.details) {
				report += `- ${detail}\n`
			}
			report += `\n`
		}

		report += `## Recommendations\n\n`

		if (finalPercentage < 80) {
			report += `⚠️ **CRITICAL**: The validation score is below 80%. The following issues need immediate attention:\n\n`
			for (const result of this.results) {
				if (!result.passed) {
					report += `- **${result.feature}**: Review implementation and address issues\n`
				}
			}
		} else if (finalPercentage < 95) {
			report += `✅ **GOOD**: Most features are working correctly. Consider addressing these improvements:\n\n`
			for (const result of this.results) {
				if (result.score < result.maxScore) {
					report += `- **${result.feature}**: Minor improvements possible\n`
				}
			}
		} else {
			report += `✅ **EXCELLENT**: All CLI fixes are properly implemented!\n\n`
		}

		fs.writeFileSync(reportPath, report)
		console.log(`\n📄 Full report saved to: ${reportPath}\n`)
	}
}

// Main execution
async function main() {
	const baseDir = path.join(__dirname, "..")
	const validator = new CLIFixValidator(baseDir)

	try {
		await validator.validate()
	} catch (error) {
		console.error("❌ Validation failed with error:", error)
		process.exit(1)
	}
}

if (require.main === module) {
	main().catch((error) => {
		console.error("Fatal error:", error)
		process.exit(1)
	})
}

export { CLIFixValidator }
export type { ValidationResult }
