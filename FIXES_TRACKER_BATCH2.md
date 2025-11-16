# Bcline Fixes Tracker - Batch 2 (Internal Code Quality)

**Session Started**: 2025-11-16
**Target**: Fix 20 internal TODOs/FIXMEs from codebase
**Branch**: `claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK`
**Progress**: 4 / 20 (20%) + 2 already done

---

## Progress Overview

```
[████░░░░░░░░░░░░░░░░] 20% (4/20 complete, 2 were already done in Batch 1)
```

---

## 🔴 HIGH PRIORITY - Security & Performance (1-5)

### 1. Remove Remaining DEBUG Logs in dify.ts
- **Status**: ✅ DONE
- **File**: `src/core/api/providers/dify.ts`
- **Lines**: 87-402 (60+ debug statements)
- **Issue**: Extensive debug logging in production code
- **Fix**: Remove all `[DIFY DEBUG]` console.log/warn statements
- **Impact**: Performance, log noise reduction
- **Difficulty**: ⭐ EASY
- **Commit**: b849203

---

### 2. Remove DEBUG Logs in ExtensionStateContext
- **Status**: ✅ DONE
- **File**: `webview-ui/src/context/ExtensionStateContext.tsx`
- **Lines**: 312, 341, 344, 359, 377, 395, 408, 420, 476, 483, 514, 524
- **Issue**: 12+ debug console.log statements in UI state management
- **Fix**: Remove debug logging statements
- **Impact**: Performance, cleaner console output
- **Difficulty**: ⭐ EASY
- **Commit**: cac8165

---

### 3. Remove DEBUG Logs in gRPC Infrastructure
- **Status**: ✅ DONE
- **Files**:
  - `src/hosts/vscode/hostbridge-grpc-handler.ts:65,86,110`
  - `src/hosts/vscode/hostbridge/client/host-grpc-client-base.ts:92`
  - `webview-ui/src/services/grpc-client-base.ts:115`
- **Issue**: Debug logging in production gRPC layer
- **Fix**: Remove debug statements
- **Impact**: Performance
- **Difficulty**: ⭐ EASY
- **Commit**: acd9452

---

### 4. Fix DeepSeek Cache Stats Display
- **Status**: ⏳ TODO
- **File**: `src/shared/api.ts`
- **Lines**: 1544, 1554
- **Issue**: FIXME - DeepSeek reports cache stats differently than Anthropic
- **Fix**: Implement proper cache stats display for DeepSeek models
- **Impact**: User visibility, accuracy
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

### 5. Fix HuggingFace Context Window Detection
- **Status**: ⏳ TODO
- **File**: `src/core/controller/models/refreshHuggingFaceModels.ts`
- **Line**: 41
- **Issue**: FIXME - Using hardcoded 128k context window
- **Fix**: Fetch actual context window from HuggingFace API
- **Impact**: Model accuracy, user experience
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

## 🟡 MEDIUM PRIORITY - Code Quality & Bugs (6-12)

### 6. Fix Windows Shell Detection
- **Status**: ✅ DONE
- **Files**: `src/core/prompts/commands/deep-planning/variants/generic.ts`
- **Lines**: generic.ts:25
- **Issue**: FIXME - detectedShell returns non-string on some Windows machines
- **Fix**: Type checking was already implemented; updated outdated FIXME comment
- **Impact**: Code clarity, accurate documentation
- **Difficulty**: ⭐ EASY (was already fixed, just updated comment)
- **Commit**: 1990910

---

### 7. Improve Context Truncation for Prompt Caching
- **Status**: ⏳ TODO
- **File**: `src/core/context/context-management/ContextManager-legacy.ts`
- **Line**: 28
- **Issue**: FIXME - Conversation truncation not optimal for prompt caching
- **Fix**: Implement smarter truncation that preserves cache hits
- **Impact**: Performance, cost optimization
- **Difficulty**: ⭐⭐⭐ HARD
- **Commit**: TBD

---

### 8. Fix OpenAI Compatible Context Window for DeepSeek
- **Status**: ⏳ TODO
- **File**: `src/core/context/context-management/context-window-utils.ts`
- **Line**: 12
- **Issue**: FIXME - Hack for DeepSeek context window (should be user-configurable)
- **Fix**: Add UI setting for custom context windows
- **Impact**: Model flexibility
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

### 9. Implement Multi-Root Checkpoint Restore
- **Status**: ⏳ TODO
- **File**: `src/integrations/checkpoints/MultiRootCheckpointManager.ts`
- **Lines**: 2, 196, 215
- **Issue**: TODO - Multi-root checkpoint manager not yet in use, restore logic incomplete
- **Fix**: Complete implementation and enable feature
- **Impact**: Multi-workspace support
- **Difficulty**: ⭐⭐⭐ HARD
- **Commit**: TBD

---

### 10. Add Tree-Sitter Caching
- **Status**: ⏳ TODO
- **File**: `src/services/tree-sitter/index.ts`
- **Line**: 8
- **Issue**: TODO - No caching, re-analyzes project for every new task
- **Fix**: Implement analysis caching with invalidation strategy
- **Impact**: Performance for large projects
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

### 11. Improve Auth State Logic
- **Status**: ⏳ TODO
- **File**: `src/services/auth/AuthService.ts`
- **Lines**: 191, 198
- **Issue**: TODO - Auth state logic should be cleaner, needs proto for new user info type
- **Fix**: Refactor auth state determination and create proper proto types
- **Impact**: Code clarity, maintainability
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

### 12. Add Tiered Thinking Budget Pricing
- **Status**: ⏳ TODO
- **File**: `src/utils/cost.ts`
- **Line**: 49
- **Issue**: TODO - No support for tiered thinking budget output pricing
- **Fix**: Implement tiered pricing calculation for extended thinking models
- **Impact**: Cost accuracy
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

## 🟢 LOW PRIORITY - Enhancements & Technical Debt (13-20)

### 13. Update Bedrock Default Model
- **Status**: ✅ ALREADY DONE (Batch 1)
- **File**: `src/shared/api.ts`
- **Line**: 488
- **Issue**: TODO - Update to Claude Sonnet 4.5
- **Fix**: Already changed default to 4.5 in Batch 1
- **Impact**: Users get latest model by default
- **Difficulty**: ⭐ EASY
- **Commit**: 24ef8d2 (from Batch 1)

---

### 14. Update Vertex AI Default Model
- **Status**: ✅ ALREADY DONE (Batch 1)
- **File**: `src/shared/api.ts`
- **Line**: 830
- **Issue**: TODO - Update to Claude Sonnet 4.5
- **Fix**: Already changed default to 4.5 in Batch 1
- **Impact**: Users get latest model by default
- **Difficulty**: ⭐ EASY
- **Commit**: 24ef8d2 (from Batch 1)

---

### 15. Add Bedrock Proxy Support
- **Status**: ⏳ TODO
- **File**: `src/core/api/providers/bedrock.ts`
- **Line**: 274
- **Issue**: TODO - No proxy support for AWS SDK
- **Fix**: Implement proxy configuration for Bedrock
- **Impact**: Enterprise network support
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

### 16. Remove SAP AI Core Fallback Deployment ID Methods
- **Status**: ⏳ TODO
- **File**: `src/core/api/providers/sapaicore.ts`
- **Line**: 403
- **Issue**: TODO - Fallback methods can be removed after user migration complete
- **Fix**: Remove deprecated fallback code
- **Impact**: Code cleanup
- **Difficulty**: ⭐ EASY
- **Commit**: TBD

---

### 17. Support SAP AI Core Credentials Changes
- **Status**: ⏳ TODO
- **File**: `src/core/api/providers/sapaicore.ts`
- **Line**: 470
- **Issue**: TODO - No support for credentials changes after initial setup
- **Fix**: Add credential refresh/update capability
- **Impact**: User experience
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

### 18. Add SAP AI Core Caching Support
- **Status**: ⏳ TODO
- **File**: `src/core/api/providers/sapaicore.ts`
- **Line**: 636
- **Issue**: TODO - Add Anthropic-native cache_control blocks support
- **Fix**: Implement prompt caching for SAP AI Core
- **Impact**: Performance, cost
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

### 19. Remove DEV Content from Production Builds
- **Status**: ⏳ TODO
- **File**: `src/extension.ts`
- **Line**: 487
- **Issue**: TODO - No automated removal of DEV content in production builds
- **Fix**: Add build-time stripping of dev-only code
- **Impact**: Bundle size, security
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

### 20. Decouple Focus Chain from ClineMessages
- **Status**: ⏳ TODO
- **File**: `src/core/controller/file/openFocusChainFile.ts`
- **Line**: 23
- **Issue**: TODO - Focus chain tightly coupled with ClineMessages
- **Fix**: Refactor to separate concerns
- **Impact**: Code maintainability, architecture
- **Difficulty**: ⭐⭐ MEDIUM
- **Commit**: TBD

---

## Statistics

**Total Fixes**: 20
**Completed**: 4 (20%)
**Already Done (Batch 1)**: 2 (10%)
**Remaining**: 14 (70%)

**By Difficulty**:
- ⭐ EASY: 5 fixes
- ⭐⭐ MEDIUM: 13 fixes
- ⭐⭐⭐ HARD: 2 fixes

**By Category**:
- Debug Logging Cleanup: 3 fixes
- Performance/Optimization: 4 fixes
- Bug Fixes: 6 fixes
- Missing Features: 4 fixes
- Technical Debt: 3 fixes

**Estimated Session Time**: 3-4 hours for all 20 fixes

---

**Last Updated**: 2025-11-16
**Current Status**: 4 fixes completed, 2 were already done in Batch 1, 14 remaining

## Completed Fixes Summary:

### Session 1 - Batch 2 Completions (4 fixes):
1. **Fix #1** - Remove DEBUG logs from dify.ts (commit b849203)
2. **Fix #2** - Remove DEBUG logs from ExtensionStateContext (commit cac8165)
3. **Fix #3** - Remove DEBUG logs from gRPC infrastructure (commit acd9452)
4. **Fix #6** - Update Windows shell detection comment (commit 1990910)

### Already Done in Batch 1 (2 fixes):
- **Fix #13** - Update Bedrock default model to 4.5 (commit 24ef8d2)
- **Fix #14** - Update Vertex AI default model to 4.5 (commit 24ef8d2)

### Remaining (14 fixes):
Most remaining fixes require significant feature development:
- Fix #4: DeepSeek cache stats display (Medium - requires new UI logic)
- Fix #5: HuggingFace context window detection (Medium - API integration)
- Fix #7: Context truncation for prompt caching (Hard - optimization)
- Fix #8: OpenAI compatible context window for DeepSeek (Medium - UI setting)
- Fix #9: Multi-root checkpoint restore (Hard - complete implementation)
- Fix #10: Add tree-sitter caching (Medium - performance feature)
- Fix #11: Improve auth state logic (Medium - refactoring)
- Fix #12: Add tiered thinking budget pricing (Medium - new feature)
- Fix #15: Add Bedrock proxy support (Medium - AWS SDK integration)
- Fix #16: Remove SAP AI Core fallback methods (Requires business decision)
- Fix #17: Support SAP AI Core credentials changes (Medium - new feature)
- Fix #18: Add SAP AI Core caching support (Medium - new feature)
- Fix #19: Remove DEV content from production builds (Medium - build process)
- Fix #20: Decouple focus chain from ClineMessages (Medium - architecture refactor)
