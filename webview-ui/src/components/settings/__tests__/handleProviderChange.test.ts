import type { ApiProvider } from "@shared/api"
import {
	anthropicDefaultModelId,
	askSageDefaultModelId,
	bedrockDefaultModelId,
	cerebrasDefaultModelId,
	deepSeekDefaultModelId,
	doubaoDefaultModelId,
	geminiDefaultModelId,
	internationalQwenDefaultModelId,
	mistralDefaultModelId,
	nebiusDefaultModelId,
	openAiNativeDefaultModelId,
	qwenCodeDefaultModelId,
	sambanovaDefaultModelId,
	vertexDefaultModelId,
} from "@shared/api"
import { getProviderDefaultModelId } from "@shared/storage/provider-keys"
import { describe, expect, it } from "vitest"

describe("getProviderDefaultModelId", () => {
	it("returns correct default for anthropic", () => {
		expect(getProviderDefaultModelId("anthropic")).toBe(anthropicDefaultModelId)
	})

	it("returns correct default for openai (openai-native)", () => {
		expect(getProviderDefaultModelId("openai")).toBe(openAiNativeDefaultModelId)
	})

	it("returns correct default for qwen (international)", () => {
		expect(getProviderDefaultModelId("qwen")).toBe(internationalQwenDefaultModelId)
	})

	it("returns correct default for qwen-code", () => {
		expect(getProviderDefaultModelId("qwen-code")).toBe(qwenCodeDefaultModelId)
	})

	it("returns correct default for newly added providers", () => {
		const expectedDefaults: [ApiProvider, string][] = [
			["vertex", vertexDefaultModelId],
			["mistral", mistralDefaultModelId],
			["cerebras", cerebrasDefaultModelId],
			["sambanova", sambanovaDefaultModelId],
			["doubao", doubaoDefaultModelId],
			["asksage", askSageDefaultModelId],
			["nebius", nebiusDefaultModelId],
			["deepseek", deepSeekDefaultModelId],
			["bedrock", bedrockDefaultModelId],
			["gemini", geminiDefaultModelId],
		]

		for (const [provider, expectedDefault] of expectedDefaults) {
			const result = getProviderDefaultModelId(provider)
			expect(result, `${provider} should return "${expectedDefault}"`).toBe(expectedDefault)
		}
	})

	it("returns empty string for providers without defaults (ollama, lmstudio)", () => {
		expect(getProviderDefaultModelId("ollama")).toBe("")
		expect(getProviderDefaultModelId("lmstudio")).toBe("")
	})

	it("switching from qwen-code to qwen would give different default model", () => {
		const qwenCodeDefault = getProviderDefaultModelId("qwen-code")
		const qwenDefault = getProviderDefaultModelId("qwen")
		// These should both be non-empty
		expect(qwenCodeDefault).toBeTruthy()
		expect(qwenDefault).toBeTruthy()
		// The key insight: qwen-code default is qwen3-coder-plus, qwen default is the international default
		expect(qwenCodeDefault).toBe(qwenCodeDefaultModelId)
		expect(qwenDefault).toBe(internationalQwenDefaultModelId)
	})
})
