import { describe, expect, it } from "vitest"
import { calculateTokenSummary, formatTokenSummary } from "../token-summary"

describe("token-summary", () => {
	it("Empty usage array returns all zeros", () => {
		const summary = calculateTokenSummary([])

		expect(summary).toEqual({
			totalInputTokens: 0,
			totalOutputTokens: 0,
			totalCacheReadTokens: 0,
			totalCacheWriteTokens: 0,
			totalCost: 0,
			requestCount: 0,
			averageTokensPerRequest: 0,
		})
	})

	it("Single request calculates correctly", () => {
		const summary = calculateTokenSummary([
			{
				inputTokens: 1_000,
				outputTokens: 500,
			},
		])

		expect(summary.totalInputTokens).toBe(1_000)
		expect(summary.totalOutputTokens).toBe(500)
		expect(summary.totalCacheReadTokens).toBe(0)
		expect(summary.totalCacheWriteTokens).toBe(0)
		expect(summary.requestCount).toBe(1)
		expect(summary.averageTokensPerRequest).toBe(1_500)
		expect(summary.totalCost).toBeCloseTo(0.0105, 10)
	})

	it("Multiple requests with cache tokens calculates correctly", () => {
		const summary = calculateTokenSummary([
			{
				inputTokens: 2_000,
				outputTokens: 1_000,
				cacheReadTokens: 300,
				cacheWriteTokens: 200,
			},
			{
				inputTokens: 3_000,
				outputTokens: 2_000,
				cacheReadTokens: 500,
				cacheWriteTokens: 100,
			},
		])

		expect(summary.totalInputTokens).toBe(5_000)
		expect(summary.totalOutputTokens).toBe(3_000)
		expect(summary.totalCacheReadTokens).toBe(800)
		expect(summary.totalCacheWriteTokens).toBe(300)
		expect(summary.requestCount).toBe(2)
		expect(summary.averageTokensPerRequest).toBe(4_000)
		expect(summary.totalCost).toBe(0.06)
	})

	it("formatTokenSummary produces readable output", () => {
		const summary = calculateTokenSummary([{ inputTokens: 1_000_000, outputTokens: 500_000 }])
		const output = formatTokenSummary(summary)
		expect(output).toContain("Token Usage Summary")
		expect(output).toContain("Requests: 1")
		expect(output).toContain("Estimated Cost:")
	})
})
