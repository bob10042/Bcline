# Bug Fix Task: Model ID Persists When Switching API Providers (Issue #9086)

## Upstream Issue

**GitHub:** https://github.com/cline/cline/issues/9086  
**Title:** Displayed model mismatches actually used model, resulting in unintended charges!  
**Priority:** P2  
**Status:** Unassigned, no open PRs

## Problem Description

When a user switches API providers in Cline's settings UI, only the provider field is updated — the **model ID is not reset** to the new provider's default. This causes:

1. The UI displays a stale model name from the *previous* provider
2. The API handler falls back to a *different* default model internally
3. The user gets charged for a model they didn't intend to use

**Example flow:** User picks "Qwen Code" (model: `qwen3-coder-plus`) → switches to "Alibaba Qwen" with China API → UI shows `qwen3-coder-plus` but API actually uses `qwen3-235b-a22b` (much more expensive).

## Root Cause

In `webview-ui/src/components/settings/ApiOptions.tsx` at line 192, `handleProviderChange` only updates the provider:

```typescript
const handleProviderChange = (newProvider: string) => {
    handleModeFieldChange(
        { plan: "planModeApiProvider", act: "actModeApiProvider" },
        newProvider as any,
        currentMode,
    )
    setIsDropdownVisible(false)
    setSelectedIndex(-1)
}
```

It does **NOT** reset `planModeApiModelId` / `actModeApiModelId` to the new provider's default.

## Files to Modify

### 1. `webview-ui/src/components/settings/ApiOptions.tsx` (line ~192)

**Fix `handleProviderChange`** to also reset the model ID when the provider changes.

- Import `getProviderDefaultModelId` from `@shared/storage/provider-keys`
- After updating the provider, also update the model ID:
  - Use `handleModeFieldsChange` (plural — updates multiple fields atomically) instead of the singular `handleModeFieldChange`
  - The field pairs are:
    - Provider: `{ plan: "planModeApiProvider", act: "actModeApiProvider" }`
    - Model ID: `{ plan: "planModeApiModelId", act: "actModeApiModelId" }`
  - Call it like other pickers do (see `VercelModelPicker.tsx`, `RequestyModelPicker.tsx` for patterns)
  - Use `getProviderDefaultModelId(newProvider as ApiProvider)` to get the correct default
- The `handleModeFieldsChange` function is available from `useApiConfigurationHandlers()` — check the existing destructuring at the top of the component and add it if needed

### 2. `src/shared/storage/provider-keys.ts` (line ~88)

**Verify `ProviderDefaultModelMap` coverage.** Currently it maps `qwen` → `internationalQwenDefaultModelId`. This is incomplete because it doesn't account for whether the user has "China API" or "International API" selected. For now, this mapping is acceptable as a *default* since the user can re-select the model, but review if any other providers are missing from the map. The following providers should have entries:
- `qwen-code` → `qwenCodeDefaultModelId` (check if this exists)
- `vertex` → `vertexDefaultModelId` (check if this exists)
- `mistral` → `mistralDefaultModelId` (check)
- `cerebras` → `cerebrasDefaultModelId` (check)
- `sambanova` → `sambanovaDefaultModelId` (check)
- `doubao` → `doubaoDefaultModelId` (check)
- `asksage` → `askSageDefaultModelId` (check)
- `nebius` → `nebiusDefaultModelId` (check)

Add any that are missing from the map.

### 3. `src/core/api/providers/qwen.ts` (line ~66-80)

**Harden `getModel()` fallback.** Currently the model ID uses nullish coalescing (`??`) which only falls back on `null`/`undefined`, NOT when the ID is a string that doesn't exist in the model map. Change to also fallback when the model ID is not a valid key:

```typescript
// BEFORE (buggy):
id: (modelId as MainlandQwenModelId) ?? mainlandQwenDefaultModelId,
info: mainlandQwenModels[modelId as MainlandQwenModelId] ?? mainlandQwenModels[mainlandQwenDefaultModelId],

// AFTER (fixed):
const resolvedId = mainlandQwenModels[modelId as MainlandQwenModelId]
    ? (modelId as MainlandQwenModelId)
    : mainlandQwenDefaultModelId
return { id: resolvedId, info: mainlandQwenModels[resolvedId] }
```

Apply the same pattern for the international branch.

## Tests to Create

Create `webview-ui/src/components/settings/__tests__/handleProviderChange.test.ts`:

1. **Test:** When provider changes from "qwen-code" to "qwen", model ID should be reset to qwen's default
2. **Test:** When provider changes from "anthropic" to "openai", model ID should be reset to openai's default
3. **Test:** When provider stays the same (re-selecting current provider), model ID should NOT change

Also create `src/core/api/providers/__tests__/qwen-getmodel.test.ts`:

4. **Test:** `getModel()` with valid mainland model ID returns that model
5. **Test:** `getModel()` with invalid/stale model ID (e.g. "qwen3-coder-plus" on China API) falls back to `mainlandQwenDefaultModelId`
6. **Test:** `getModel()` with valid international model ID returns that model

## Verification Steps

After making changes:
1. Run `npx vitest run` on the new test files to verify they pass
2. Check there are no TypeScript errors: `npx tsc --noEmit`
3. Run the linter: `npx biome lint --no-errors-on-unmatched --files-ignore-unknown=true --diagnostic-level=error` on changed files

## Summary

When complete, provide:
- List of all files modified and created
- What each change does
- Confirmation that tests pass
