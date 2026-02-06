import {
	internationalQwenDefaultModelId,
	internationalQwenModels,
	mainlandQwenDefaultModelId,
	mainlandQwenModels,
	QwenApiRegions,
} from "@shared/api"
import { expect } from "chai"
import { QwenHandler } from "../qwen"

describe("QwenHandler getModel", () => {
	it("returns specified valid mainland model id when using China API", () => {
		const validMainlandModelId =
			(Object.keys(mainlandQwenModels).find(
				(id) => id !== mainlandQwenDefaultModelId,
			) as keyof typeof mainlandQwenModels) || mainlandQwenDefaultModelId

		const handler = new QwenHandler({
			qwenApiLine: QwenApiRegions.CHINA,
			apiModelId: validMainlandModelId,
		})

		const model = handler.getModel()
		expect(model.id).to.equal(validMainlandModelId)
		expect(model.info).to.deep.equal(mainlandQwenModels[validMainlandModelId])
	})

	it("falls back to mainland default model for invalid/stale model id on China API", () => {
		const handler = new QwenHandler({
			qwenApiLine: QwenApiRegions.CHINA,
			apiModelId: "qwen3-coder-plus", // valid for qwen-code provider, invalid for mainland qwen models
		})

		const model = handler.getModel()
		expect(model.id).to.equal(mainlandQwenDefaultModelId)
		expect(model.info).to.deep.equal(mainlandQwenModels[mainlandQwenDefaultModelId])
	})

	it("returns specified valid international model id when using International API", () => {
		const validInternationalModelId =
			(Object.keys(internationalQwenModels).find(
				(id) => id !== internationalQwenDefaultModelId,
			) as keyof typeof internationalQwenModels) || internationalQwenDefaultModelId

		const handler = new QwenHandler({
			qwenApiLine: QwenApiRegions.INTERNATIONAL,
			apiModelId: validInternationalModelId,
		})

		const model = handler.getModel()
		expect(model.id).to.equal(validInternationalModelId)
		expect(model.info).to.deep.equal(internationalQwenModels[validInternationalModelId])
	})

	it("falls back to international default for undefined model id", () => {
		const handler = new QwenHandler({
			qwenApiLine: QwenApiRegions.INTERNATIONAL,
			apiModelId: undefined,
		})

		const model = handler.getModel()
		expect(model.id).to.equal(internationalQwenDefaultModelId)
		expect(model.info).to.deep.equal(internationalQwenModels[internationalQwenDefaultModelId])
	})
})
