import { describe, it } from "mocha"
import "should"
import { calculateTokenSummary } from "../token-summary"

describe("token-summary", () => {
	it("Empty usage array returns all zeros", () => {
		const summary = calculateTokenSummary([])

		summary.should.deepEqual({
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

		summary.totalInputTokens.should.equal(1_000)
		summary.totalOutputTokens.should.equal(500)
		summary.totalCacheReadTokens.should.equal(0)
		summary.totalCacheWriteTokens.should.equal(0)
		summary.requestCount.should.equal(1)
		summary.averageTokensPerRequest.should.equal(1_500)
		summary.totalCost.should.be.approximately(0.0105, 1e-12)
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

		summary.totalInputTokens.should.equal(5_000)
		summary.totalOutputTokens.should.equal(3_000)
		summary.totalCacheReadTokens.should.equal(800)
		summary.totalCacheWriteTokens.should.equal(300)
		summary.requestCount.should.equal(2)
		summary.averageTokensPerRequest.should.equal(4_000)
		summary.totalCost.should.equal(0.06)
	})
})
