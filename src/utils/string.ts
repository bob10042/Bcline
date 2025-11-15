/**
 * Fixes incorrectly escaped HTML entities in AI model outputs
 * @param text String potentially containing incorrectly escaped HTML entities from AI models
 * @returns String with HTML entities converted back to normal characters
 */
export function fixModelHtmlEscaping(text: string): string {
	return text
		.replace(/&gt;/g, ">")
		.replace(/&lt;/g, "<")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, "&")
		.replace(/&apos;/g, "'")
}

/**
 * Removes invalid characters (like the replacement character �) from a string
 * @param text String potentially containing invalid characters
 * @returns String with invalid characters removed
 */
export function removeInvalidChars(text: string): string {
	return text.replace(/\uFFFD/g, "")
}

/**
 * Fixes JSON-style escaped characters in command strings from AI models
 * AI models often output commands with JSON-escaped quotes that need to be unescaped
 * before being executed in a shell (e.g., `echo \"test\"` should become `echo "test"`)
 * @param text Command string potentially containing JSON-style escaped characters
 * @returns Command string with JSON escapes converted to normal characters
 */
export function fixCommandEscaping(text: string): string {
	return text
		.replace(/\\"/g, '"') // \" → "
		.replace(/\\'/g, "'") // \' → '
		.replace(/\\\\/g, "\\") // \\ → \
}
