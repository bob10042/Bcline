import type { ClineMessage } from "@shared/ExtensionMessage"
import { describe, expect, it } from "vitest"
import { getWaitingIndicatorKind } from "./waitingIndicator"

const makeSayMessage = (say: ClineMessage["say"], text?: string): ClineMessage => ({
	type: "say",
	say,
	text,
	ts: Date.now(),
})

describe("getWaitingIndicatorKind", () => {
	it("returns thinking when there are no modified messages", () => {
		expect(getWaitingIndicatorKind([])).toBe("thinking")
	})

	it("returns thinking when last message is user feedback", () => {
		expect(getWaitingIndicatorKind([makeSayMessage("user_feedback", "ok")])).toBe("thinking")
		expect(getWaitingIndicatorKind([makeSayMessage("user_feedback_diff", "diff")])).toBe("thinking")
	})

	it("returns api_request when api_req_started is in progress", () => {
		const msg = makeSayMessage("api_req_started", JSON.stringify({ cost: null }))
		expect(getWaitingIndicatorKind([msg])).toBe("api_request")
	})

	it("returns none when api_req_started has completed (cost present)", () => {
		const msg = makeSayMessage("api_req_started", JSON.stringify({ cost: 0.0123 }))
		expect(getWaitingIndicatorKind([msg])).toBe("none")
	})

	it("returns api_request for malformed api_req_started payload", () => {
		const msg = makeSayMessage("api_req_started", "{bad json")
		expect(getWaitingIndicatorKind([msg])).toBe("api_request")
	})

	it("returns none when latest message is normal streamed content", () => {
		expect(getWaitingIndicatorKind([makeSayMessage("text", "hello")])).toBe("none")
	})
})
