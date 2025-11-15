import { fixCommandEscaping, fixModelHtmlEscaping, removeInvalidChars } from "@utils/string"

/**
 * File extensions that use escaped characters (&lt; &gt; &amp;) as valid syntax.
 * Add more extensions as needed (e.g., ".svg", ".xsd", ".xslt")
 */
const ESCAPED_CHARACTER_EXTENSIONS = [".xml"] as const

/**
 * Applies model-specific content fixes to handle quirks from non-Claude models.
 * Fixes escaped character issues and removes invalid characters.
 * Files using escaped characters as syntax (e.g., XML) are exempted from fixing.
 *
 * @param text The content to process
 * @param modelId The model ID to check if fixes are needed (optional - if not provided, applies fixes)
 * @param filePath The file path to determine if it uses escaped characters (optional)
 * @returns The processed content
 */
export function applyModelContentFixes(text: string, modelId?: string, filePath?: string): string {
	if (modelId?.includes("claude")) {
		return text
	}

	const usesEscapedCharacters = ESCAPED_CHARACTER_EXTENSIONS.some((ext) => filePath?.toLowerCase().endsWith(ext))

	let processed = text

	if (!usesEscapedCharacters) {
		processed = fixModelHtmlEscaping(processed)
	}

	processed = removeInvalidChars(processed)

	return processed
}

/**
 * Applies model-specific fixes for terminal commands to handle quirks from non-Claude models.
 * Fixes JSON-escaped quotes and other escaped characters that interfere with shell execution.
 * This is specifically for terminal commands where JSON escaping causes failures.
 *
 * @param text The command text to process
 * @param modelId The model ID to check if fixes are needed (optional - if not provided, applies fixes)
 * @returns The processed command text
 */
export function applyModelCommandFixes(text: string, modelId?: string): string {
	if (modelId?.includes("claude")) {
		return text
	}

	let processed = text

	// Fix JSON-style escaped characters (e.g., \" → ")
	processed = fixCommandEscaping(processed)

	// Fix HTML escaped characters (e.g., &quot; → ")
	processed = fixModelHtmlEscaping(processed)

	// Remove invalid characters
	processed = removeInvalidChars(processed)

	return processed
}
