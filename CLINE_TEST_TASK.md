# Test Task: Add Token Usage Summary Utility

## Objective

Create a small TypeScript utility module that analyzes and summarizes token usage from Cline's API conversation history. This involves reading existing code, creating new files, and writing tests.

## Steps

1. **Research**: Look at `src/core/task/index.ts` and find how `apiConversationHistory` is structured and where token usage (`inputTokens`, `outputTokens`, `cacheReadTokens`, `cacheWriteTokens`) is tracked.

2. **Create the utility**: Create a new file at `src/utils/token-summary.ts` with the following:
   - A `TokenSummary` interface with fields: `totalInputTokens`, `totalOutputTokens`, `totalCacheReadTokens`, `totalCacheWriteTokens`, `totalCost`, `requestCount`, and `averageTokensPerRequest`.
   - A function `calculateTokenSummary(usage: Array<{ inputTokens: number; outputTokens: number; cacheReadTokens?: number; cacheWriteTokens?: number }>): TokenSummary` that computes all the summary fields. For `totalCost`, use a simple estimate of `$3 per 1M input tokens` and `$15 per 1M output tokens`.
   - A function `formatTokenSummary(summary: TokenSummary): string` that returns a human-readable multi-line string showing all the stats.

3. **Create tests**: Create `src/utils/__tests__/token-summary.test.ts` with at least 3 test cases:
   - Empty usage array returns all zeros
   - Single request calculates correctly
   - Multiple requests with cache tokens calculates correctly

4. **Summary**: After completing all steps, provide a summary of what files were created and what they contain.

## Success Criteria

- Both files exist and are syntactically valid TypeScript
- Tests cover edge cases
- Code is clean and well-typed
