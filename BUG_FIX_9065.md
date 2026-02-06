# Bug Fix: MCP Environment Variables Overwritten on Toggle

## Upstream Issue

**GitHub Issue:** https://github.com/cline/cline/issues/9065
**Title:** When using environment variables in the MCP server configuration, the value is overwritten with resolved value when server is disabled/enabled from the UI
**Labels:** Help Wanted, VS Code
**Status:** Open, unassigned, no PRs

---

## Bug Summary

When a user has `${env:VAR_NAME}` environment variable references in their MCP server config (e.g. `cline_mcp_settings.json`), toggling a server's disabled state via the UI replaces those variable references with their resolved literal values. This destroys the user's config — they lose the variable syntax and get hardcoded secrets/URLs written to disk.

## Steps to Reproduce

1. Add a server config with env vars:
```json
"testMcpServer": {
    "disabled": false,
    "timeout": 1800,
    "type": "streamableHttp",
    "url": "${env.MCP_URL}",
    "headers": {
        "Authorization": "Bearer ${env.TOKEN}"
    }
}
```
2. Toggle the server disabled/enabled via the UI
3. Open `cline_mcp_settings.json` — env vars are now replaced with literal values:
```json
"url": "http://theActualValue.com",
"headers": {
    "Authorization": "Bearer actualTokenValue"
}
```

---

## Root Cause

**File:** `src/services/mcp/McpHub.ts`

### The Problem (line ~1097-1115)

`toggleServerDisabledRPC()` at **line 1097** calls `readAndValidateMcpSettingsFile()` which expands all environment variables at **line 193** via `expandEnvironmentVariables(config)` before returning. When the expanded config is then written back to disk at **line 1109**, the original `${env:...}` syntax is permanently lost.

```typescript
// line 1097 - THE BUGGY METHOD
public async toggleServerDisabledRPC(serverName: string, disabled: boolean): Promise<McpServer[]> {
    try {
        const config = await this.readAndValidateMcpSettingsFile()  // <-- expands env vars!
        // ...
        config.mcpServers[serverName].disabled = disabled
        const settingsPath = await getMcpSettingsFilePathHelper(await this.getSettingsDirectoryPath())
        await fs.writeFile(settingsPath, JSON.stringify(config, null, 2))  // <-- writes expanded values!
```

### Why It Happens

`readAndValidateMcpSettingsFile()` at **line 167** always calls `expandEnvironmentVariables(config)` at **line 193** before returning. This is correct for *reading* config to connect to servers, but wrong for *write-back* operations that only need to modify a single field.

---

## The Fix

### Approach: Read raw JSON for write operations (recommended)

Follow the pattern already used by `toggleToolAutoApproveRPC()` at **line 1281**, which correctly reads and writes raw JSON without expansion:

```typescript
// line 1281 - THE CORRECT PATTERN (already in codebase)
async toggleToolAutoApproveRPC(...) {
    const settingsPath = await getMcpSettingsFilePathHelper(await this.getSettingsDirectoryPath())
    const content = await fs.readFile(settingsPath, "utf-8")
    const config = JSON.parse(content)  // <-- raw parse, no expansion!
    // ... modify config ...
    await fs.writeFile(settingsPath, JSON.stringify(config, null, 2))  // <-- preserves env vars!
}
```

### What to Change

In `toggleServerDisabledRPC()` (line 1097 of `src/services/mcp/McpHub.ts`), replace:

```typescript
const config = await this.readAndValidateMcpSettingsFile()
if (!config) {
    throw new Error("Failed to read or validate MCP settings")
}
```

With:

```typescript
const settingsPath = await getMcpSettingsFilePathHelper(await this.getSettingsDirectoryPath())
const content = await fs.readFile(settingsPath, "utf-8")
const config = JSON.parse(content)
```

And remove the duplicate `settingsPath` declaration a few lines below (line ~1109) since it's now declared earlier.

### Also Check These Other Callers

Scan all callers of `readAndValidateMcpSettingsFile()` that write config back to disk — they may have the same bug:

- **Line 1002** — check if this also writes back
- **Line 1083** — check if this also writes back  
- **Line 1393** — check if this also writes back

Any method that reads config, modifies it, and writes it back should use raw `JSON.parse()` instead of `readAndValidateMcpSettingsFile()`.

---

## Test Scenarios

1. **Toggle disable/enable** — env vars in config must survive the round-trip
2. **Toggle with no env vars** — should still work identically
3. **Toggle with mixed config** — some servers with env vars, some without
4. **Malformed JSON** — should error gracefully (the raw parse won't have schema validation, so add a try/catch)

---

## Key Files

| File | Purpose |
|------|---------|
| `src/services/mcp/McpHub.ts` | Main file to fix — contains `toggleServerDisabledRPC` and `readAndValidateMcpSettingsFile` |
| `src/services/mcp/McpHub.ts:1281` | Reference implementation — `toggleToolAutoApproveRPC` does it correctly |
| `src/services/mcp/McpHub.ts:193` | Where `expandEnvironmentVariables()` is called during read |
