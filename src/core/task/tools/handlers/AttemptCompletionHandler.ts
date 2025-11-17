import type Anthropic from "@anthropic-ai/sdk"
import type { ToolUse } from "@core/assistant-message"
import { formatResponse } from "@core/prompts/responses"
import { processFilesIntoText } from "@integrations/misc/extract-text"
import { showSystemNotification } from "@integrations/notifications"
import { findLastIndex } from "@shared/array"
import { COMPLETION_RESULT_CHANGES_FLAG } from "@shared/ExtensionMessage"
import { telemetryService } from "@/services/telemetry"
import { ClineDefaultTool } from "@/shared/tools"
import type { ToolResponse } from "../../index"
import type { IPartialBlockHandler, IToolHandler } from "../ToolExecutorCoordinator"
import type { TaskConfig } from "../types/TaskConfig"
import type { StronglyTypedUIHelpers } from "../types/UIHelpers"
import { ToolResultUtils } from "../utils/ToolResultUtils"

export class AttemptCompletionHandler implements IToolHandler, IPartialBlockHandler {
	readonly name = ClineDefaultTool.ATTEMPT

	getDescription(block: ToolUse): string {
		return `[${block.name}]`
	}

	/**
	 * Handle partial block streaming for attempt_completion
	 * Matches the original conditional logic structure for command vs no-command cases
	 */
	async handlePartialBlock(block: ToolUse, uiHelpers: StronglyTypedUIHelpers): Promise<void> {
		const result = block.params.result
		const command = block.params.command

		if (!command) {
			// no command, still outputting partial result
			await uiHelpers.say(
				"completion_result",
				uiHelpers.removeClosingTag(block, "result", result),
				undefined,
				undefined,
				block.partial,
			)
		}
	}

	async execute(config: TaskConfig, block: ToolUse): Promise<ToolResponse> {
		const result: string | undefined = block.params.result
		const command: string | undefined = block.params.command

		// Validate required parameters
		if (!result) {
			config.taskState.consecutiveMistakeCount++
			return await config.callbacks.sayAndCreateMissingParamError(this.name, "result")
		}

		config.taskState.consecutiveMistakeCount = 0

		// PRE-COMPLETION VALIDATION: Check recent command outputs for errors before allowing completion
		const recentMessages = config.messageState.getClineMessages().slice(-15) // Check last 15 messages
		const recentCommandOutputs = recentMessages.filter((m) => m.say === "command_output")

		// Check for error indicators in recent command outputs
		for (const output of recentCommandOutputs) {
			const text = output.text || ""

			// Check for error patterns
			const errorPatterns = [
				/exit code:.*[^0]\s*\(error/i, // Exit code not 0
				/error:/i,
				/\bfailed\b/i,
				/npm ERR!/i,
				/fatal:/i,
				/exception/i,
				/\[FAIL\]/i,
				/command not found/i,
				/⚠️ ERROR DETECTED/i, // Our own error detection marker
			]

			for (const pattern of errorPatterns) {
				if (pattern.test(text)) {
					config.taskState.consecutiveMistakeCount++
					return formatResponse.toolError(
						`Cannot attempt completion: Recent command output contains errors. Please review and fix the errors before attempting completion. Look for error messages in the command output and address them first.`,
					)
				}
			}
		}

		// Run PreToolUse hook before execution
		try {
			const { ToolHookUtils } = await import("../utils/ToolHookUtils")
			await ToolHookUtils.runPreToolUseIfEnabled(config, block)
		} catch (error) {
			const { PreToolUseHookCancellationError } = await import("@core/hooks/PreToolUseHookCancellationError")
			if (error instanceof PreToolUseHookCancellationError) {
				return formatResponse.toolDenied()
			}
			throw error
		}

		// Show notification if enabled
		if (config.autoApprovalSettings.enableNotifications) {
			showSystemNotification({
				subtitle: "Task Completed",
				message: result.replace(/\n/g, " "),
			})
		}

		const addNewChangesFlagToLastCompletionResultMessage = async () => {
			// Add newchanges flag if there are new changes to the workspace
			const hasNewChanges = await config.callbacks.doesLatestTaskCompletionHaveNewChanges()
			const clineMessages = config.messageState.getClineMessages()

			const lastCompletionResultMessageIndex = findLastIndex(clineMessages, (m: any) => m.say === "completion_result")
			const lastCompletionResultMessage =
				lastCompletionResultMessageIndex !== -1 ? clineMessages[lastCompletionResultMessageIndex] : undefined
			if (
				lastCompletionResultMessage &&
				lastCompletionResultMessageIndex !== -1 &&
				hasNewChanges &&
				!lastCompletionResultMessage.text?.endsWith(COMPLETION_RESULT_CHANGES_FLAG)
			) {
				await config.messageState.updateClineMessage(lastCompletionResultMessageIndex, {
					text: lastCompletionResultMessage.text + COMPLETION_RESULT_CHANGES_FLAG,
				})
			}
		}

		// Remove any partial OR duplicate completion_result messages that may exist
		// Search backwards since other messages may have been inserted after the partial
		// In long conversations, we need to ensure we don't have multiple completion messages
		const clineMessages = config.messageState.getClineMessages()
		const completionIndicesToRemove: number[] = []

		// Find all partial completion_result messages (should be removed)
		for (let i = clineMessages.length - 1; i >= 0; i--) {
			const m = clineMessages[i]
			if (m.partial === true && m.type === "say" && m.say === "completion_result") {
				completionIndicesToRemove.push(i)
			}
		}

		// Remove the found messages
		if (completionIndicesToRemove.length > 0) {
			const updatedMessages = clineMessages.filter((_, index) => !completionIndicesToRemove.includes(index))
			config.messageState.setClineMessages(updatedMessages)
			await config.messageState.saveClineMessagesAndUpdateHistory()
		}

		let commandResult: any
		const lastMessage = config.messageState.getClineMessages().at(-1)

		if (command) {
			if (lastMessage && lastMessage.ask !== "command") {
				// haven't sent a command message yet so first send completion_result then command
				const completionMessageTs = await config.callbacks.say("completion_result", result, undefined, undefined, false)
				await config.callbacks.saveCheckpoint(true, completionMessageTs)
				await addNewChangesFlagToLastCompletionResultMessage()
				telemetryService.captureTaskCompleted(config.ulid)
			} else {
				// we already sent a command message, meaning the complete completion message has also been sent
				await config.callbacks.saveCheckpoint(true)
			}

			// Attempt completion is a special tool where we want to update the focus chain list before the user provides response
			if (!block.partial && config.focusChainSettings.enabled) {
				await config.callbacks.updateFCListFromToolResponse(block.params.task_progress)
			}

			// complete command message - need to ask for approval
			const didApprove = await ToolResultUtils.askApprovalAndPushFeedback("command", command, config)
			if (!didApprove) {
				return formatResponse.toolDenied()
			}

			// User approved, execute the command
			const [userRejected, execCommandResult] = await config.callbacks.executeCommandTool(command!, undefined) // no timeout for attempt_completion command
			if (userRejected) {
				config.taskState.didRejectTool = true
				return execCommandResult
			}
			// user didn't reject, but the command may have output
			commandResult = execCommandResult
		} else {
			// Send the complete completion_result message (partial was already removed above)
			const completionMessageTs = await config.callbacks.say("completion_result", result, undefined, undefined, false)
			await config.callbacks.saveCheckpoint(true, completionMessageTs)
			await addNewChangesFlagToLastCompletionResultMessage()
			telemetryService.captureTaskCompleted(config.ulid)
		}

		// we already sent completion_result says, an empty string asks relinquishes control over button and field
		// in case last command was interactive and in partial state, the UI is expecting an ask response. This ends the command ask response, freeing up the UI to proceed with the completion ask.
		if (config.messageState.getClineMessages().at(-1)?.ask === "command_output") {
			await config.callbacks.say("command_output", "")
		}

		if (!block.partial && config.focusChainSettings.enabled) {
			await config.callbacks.updateFCListFromToolResponse(block.params.task_progress)
		}

		const { response, text, images, files: completionFiles } = await config.callbacks.ask("completion_result", "", false)
		if (response === "yesButtonClicked") {
			return "" // signals to recursive loop to stop (for now this never happens since yesButtonClicked will trigger a new task)
		}

		await config.callbacks.say("user_feedback", text ?? "", images, completionFiles)

		// SMART FEEDBACK DETECTION: Detect negative feedback indicating task is not complete
		const feedbackText = (text ?? "").toLowerCase()
		const negativeIndicators = [
			"didn't work",
			"hasn't worked",
			"not working",
			"doesn't work",
			"does not work",
			"failed",
			"broken",
			"error",
			"wrong",
			"incorrect",
			"issue",
			"problem",
			"bug",
			"not done",
			"incomplete",
			"missing",
			"fix this",
			"try again",
		]

		const isNegativeFeedback = negativeIndicators.some((indicator) => feedbackText.includes(indicator))

		const toolResults: (Anthropic.TextBlockParam | Anthropic.ImageBlockParam)[] = []
		if (commandResult) {
			if (typeof commandResult === "string") {
				toolResults.push({
					type: "text",
					text: commandResult,
				})
			} else if (Array.isArray(commandResult)) {
				toolResults.push(...commandResult)
			}
		}

		// Craft feedback message based on sentiment
		let feedbackMessage = `The user has provided feedback on the results.`

		if (isNegativeFeedback) {
			feedbackMessage += ` ⚠️ CRITICAL: The user reports that something did NOT work as expected. You MUST carefully re-evaluate your previous steps:
1. Check for errors in command outputs (exit codes, error messages)
2. Verify all assumptions about what succeeded
3. Review recent file changes for mistakes
4. Test your work before attempting completion again
Do NOT attempt completion again until you have identified and fixed the reported issues.`
		}

		feedbackMessage += ` Consider their input to continue the task, and then attempt completion again.\n<feedback>\n${text}\n</feedback>`

		toolResults.push({
			type: "text",
			text: feedbackMessage,
		})
		toolResults.push(...formatResponse.imageBlocks(images))

		let fileContentString = ""
		if (completionFiles && completionFiles.length > 0) {
			fileContentString = await processFilesIntoText(completionFiles)
		}

		// Return the tool results as a complex response
		return [
			{
				type: "text" as const,
				text: `[attempt_completion] Result:`,
			},
			...toolResults,
			...(fileContentString
				? [
						{
							type: "text" as const,
							text: fileContentString,
						},
					]
				: []),
		]
	}
}
