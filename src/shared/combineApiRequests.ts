import { ClineMessage } from "./ExtensionMessage"

/**
 * Combines API request start and finish messages in an array of ClineMessages.
 *
 * This function looks for pairs of 'api_req_started' and 'api_req_finished' messages.
 * When it finds a pair, it combines them into a single 'api_req_combined' message.
 * The JSON data in the text fields of both messages are merged.
 *
 * @param messages - An array of ClineMessage objects to process.
 * @returns A new array of ClineMessage objects with API requests combined.
 *
 * @example
 * const messages = [
 *   { type: "say", say: "api_req_started", text: '{"request":"GET /api/data"}', ts: 1000 },
 *   { type: "say", say: "api_req_finished", text: '{"cost":0.005}', ts: 1001 }
 * ];
 * const result = combineApiRequests(messages);
 * // Result: [{ type: "say", say: "api_req_started", text: '{"request":"GET /api/data","cost":0.005}', ts: 1000 }]
 */
export function combineApiRequests(messages: ClineMessage[]): ClineMessage[] {
	// Use Map for O(1) lookups and proper pairing (Issue #7373)
	// Fixes critical bug where API requests could be incorrectly combined or double-counted
	const combinedRequests = new Map<number, ClineMessage>()
	const processedFinished = new Set<number>() // Track which finished messages we've used

	// First pass: Find all api_req_started messages and pair them with their api_req_finished
	for (let i = 0; i < messages.length; i++) {
		const msg = messages[i]
		if (msg.type === "say" && msg.say === "api_req_started" && msg.text) {
			const startedData = JSON.parse(msg.text)
			let foundFinished = false

			// Look for the matching api_req_finished message (should be after this one)
			for (let j = i + 1; j < messages.length; j++) {
				const finishMsg = messages[j]
				if (
					finishMsg.type === "say" &&
					finishMsg.say === "api_req_finished" &&
					finishMsg.text &&
					!processedFinished.has(finishMsg.ts)
				) {
					// Found a matching finished message
					const finishedData = JSON.parse(finishMsg.text)
					const combinedData = {
						...startedData,
						...finishedData,
					}

					combinedRequests.set(msg.ts, {
						...msg,
						text: JSON.stringify(combinedData),
					})

					processedFinished.add(finishMsg.ts)
					foundFinished = true
					break
				}

				// Stop if we hit another api_req_started (they should alternate)
				if (finishMsg.type === "say" && finishMsg.say === "api_req_started") {
					break
				}
			}

			// If no matching finished message found, keep the original started message
			if (!foundFinished) {
				combinedRequests.set(msg.ts, msg)
			}
		}
	}

	// Return filtered and mapped messages
	return messages
		.filter((msg) => !(msg.type === "say" && msg.say === "api_req_finished"))
		.map((msg) => {
			if (msg.type === "say" && msg.say === "api_req_started") {
				return combinedRequests.get(msg.ts) || msg
			}
			return msg
		})
}
