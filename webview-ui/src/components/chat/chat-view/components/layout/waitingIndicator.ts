import type { ClineMessage } from "@shared/ExtensionMessage"

export type WaitingIndicatorKind = "thinking" | "api_request" | "none"

export const getWaitingIndicatorKind = (modifiedMessages: ClineMessage[]): WaitingIndicatorKind => {
	const lastMsg = modifiedMessages[modifiedMessages.length - 1]
	if (!lastMsg) {
		// No messages after the initial task message - new task just started
		return "thinking"
	}

	if (lastMsg.say === "user_feedback" || lastMsg.say === "user_feedback_diff") {
		return "thinking"
	}

	if (lastMsg.say === "api_req_started") {
		try {
			const info = JSON.parse(lastMsg.text || "{}")
			// Still in progress (no cost) and nothing has streamed after it yet
			return info.cost == null ? "api_request" : "none"
		} catch {
			// Keep showing request progress if payload is malformed
			return "api_request"
		}
	}

	return "none"
}
