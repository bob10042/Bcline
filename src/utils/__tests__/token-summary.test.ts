import { expect } from "chai"
import { calculateTokenSummary, formatTokenSummary } from "../token-summary"

describe("token-summary", () => {
	it("Empty usage array returns all zeros", () => {
		const summary = calculateTokenSummary([])

		expect(summary).to.deep.equal({
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

		expect(summary.totalInputTokens).to.equal(1_000)
		expect(summary.totalOutputTokens).to.equal(500)
		expect(summary.totalCacheReadTokens).to.equal(0)
		expect(summary.totalCacheWriteTokens).to.equal(0)
		expect(summary.requestCount).to.equal(1)
		expect(summary.averageTokensPerRequest).to.equal(1_500)
		expect(summary.totalCost).to.be.closeTo(0.0105, 0.0001)
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

		expect(summary.totalInputTokens).to.equal(5_000)
		expect(summary.totalOutputTokens).to.equal(3_000)
		expect(summary.totalCacheReadTokens).to.equal(800)
		expect(summary.totalCacheWriteTokens).to.equal(300)
		expect(summary.requestCount).to.equal(2)
		expect(summary.averageTokensPerRequest).to.equal(4_000)
		expect(summary.totalCost).to.equal(0.06)
	})

	it("formatTokenSummary produces readable output", () => {
		const summary = calculateTokenSummary([{ inputTokens: 1_000_000, outputTokens: 500_000 }])
		const output = formatTokenSummary(summary)
		expect(output).to.include("Token Usage Summary")
		expect(output).to.include("Requests: 1")
		expect(output).to.include("Estimated Cost:")
	})
})
