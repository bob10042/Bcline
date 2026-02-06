export interface TokenSummary {
	totalInputTokens: number
	totalOutputTokens: number
	totalCacheReadTokens: number
	totalCacheWriteTokens: number
	totalCost: number
	requestCount: number
	averageTokensPerRequest: number
}

type TokenUsageEntry = {
	inputTokens: number
	outputTokens: number
	cacheReadTokens?: number
	cacheWriteTokens?: number
}

export function calculateTokenSummary(usage: TokenUsageEntry[]): TokenSummary {
	const requestCount = usage.length

	const totals = usage.reduce(
		(acc, entry) => {
			acc.totalInputTokens += entry.inputTokens
			acc.totalOutputTokens += entry.outputTokens
			acc.totalCacheReadTokens += entry.cacheReadTokens ?? 0
			acc.totalCacheWriteTokens += entry.cacheWriteTokens ?? 0
			return acc
		},
		{
			totalInputTokens: 0,
			totalOutputTokens: 0,
			totalCacheReadTokens: 0,
			totalCacheWriteTokens: 0,
		},
	)

	const inputCost = (totals.totalInputTokens / 1_000_000) * 3
	const outputCost = (totals.totalOutputTokens / 1_000_000) * 15
	const totalCost = inputCost + outputCost

	const totalProcessedTokens = totals.totalInputTokens + totals.totalOutputTokens
	const averageTokensPerRequest = requestCount > 0 ? totalProcessedTokens / requestCount : 0

	return {
		...totals,
		totalCost,
		requestCount,
		averageTokensPerRequest,
	}
}

export function formatTokenSummary(summary: TokenSummary): string {
	return [
		"Token Usage Summary",
		`Requests: ${summary.requestCount}`,
		`Total Input Tokens: ${summary.totalInputTokens.toLocaleString()}`,
		`Total Output Tokens: ${summary.totalOutputTokens.toLocaleString()}`,
		`Total Cache Read Tokens: ${summary.totalCacheReadTokens.toLocaleString()}`,
		`Total Cache Write Tokens: ${summary.totalCacheWriteTokens.toLocaleString()}`,
		`Average Tokens per Request: ${summary.averageTokensPerRequest.toLocaleString()}`,
		`Estimated Cost: $${summary.totalCost.toFixed(6)}`,
	].join("\n")
}
