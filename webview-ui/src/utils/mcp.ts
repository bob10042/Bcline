import { McpMarketplaceCatalog, McpResource, McpResourceTemplate } from "@shared/mcp"

/**
 * Matches a URI against an array of URI templates and returns the matching template
 * @param uri The URI to match
 * @param templates Array of URI templates to match against
 * @returns The matching template or undefined if no match is found
 */
export function findMatchingTemplate(uri: string, templates: McpResourceTemplate[] = []): McpResourceTemplate | undefined {
	return templates.find((template) => {
		// Convert template to regex pattern
		const pattern = String(template.uriTemplate)
			// First escape special regex characters
			.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
			// Then replace {param} with ([^/]+) to match any non-slash characters
			// We need to use \{ and \} because we just escaped them
			.replace(/\\\{([^}]+)\\\}/g, "([^/]+)")

		const regex = new RegExp(`^${pattern}$`)
		return regex.test(uri)
	})
}

/**
 * Finds either an exact resource match or a matching template for a given URI
 * @param uri The URI to find a match for
 * @param resources Array of concrete resources
 * @param templates Array of resource templates
 * @returns The matching resource, template, or undefined
 */
export function findMatchingResourceOrTemplate(
	uri: string,
	resources: McpResource[] = [],
	templates: McpResourceTemplate[] = [],
): McpResource | McpResourceTemplate | undefined {
	// First try to find an exact resource match
	const exactMatch = resources.find((resource) => resource.uri === uri)
	if (exactMatch) {
		return exactMatch
	}

	// If no exact match, try to find a matching template
	return findMatchingTemplate(uri, templates)
}

/**
 * Checks if a string is a URL
 * @param str The string to check
 * @returns True if the string appears to be a URL
 */
function isUrl(str: string): boolean {
	return /^https?:\/\//i.test(str)
}

/**
 * Extracts a readable name from a GitHub URL
 * @param url The GitHub URL to extract from
 * @returns A readable name extracted from the URL
 */
function extractNameFromGithubUrl(url: string): string {
	try {
		// Extract repo name from URLs like "https://github.com/user/repo-name"
		const match = url.match(/github\.com\/[^/]+\/([^/]+?)(?:\.git)?$/i)
		if (match && match[1]) {
			// Convert kebab-case or snake_case to Title Case
			return match[1]
				.replace(/[-_]/g, " ")
				.replace(/\b\w/g, (char) => char.toUpperCase())
		}
	} catch (e) {
		// If parsing fails, return the original URL
	}
	return url
}

/**
 * Attempts to convert an MCP server name to its display name using the marketplace catalog
 * @param serverName The server name/ID to look up
 * @param mcpMarketplaceCatalog The marketplace catalog containing server metadata
 * @returns The display name if found in catalog, otherwise returns the original server name
 */
export function getMcpServerDisplayName(serverName: string, mcpMarketplaceCatalog: McpMarketplaceCatalog): string {
	// Find matching item in marketplace catalog
	const catalogItem = mcpMarketplaceCatalog.items.find((item) => item.mcpId === serverName)

	if (!catalogItem) {
		return serverName
	}

	// Check if the name field contains a URL instead of a proper display name
	if (isUrl(catalogItem.name)) {
		// Try to extract a readable name from the GitHub URL
		if (catalogItem.githubUrl) {
			return extractNameFromGithubUrl(catalogItem.githubUrl)
		}
		// Fall back to extracting from the name field itself
		return extractNameFromGithubUrl(catalogItem.name)
	}

	// Return the proper display name
	return catalogItem.name
}
