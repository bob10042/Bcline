# Next 20 Bug Fixes - Session Plan

**Session Branch**: `claude/fix-issues-batch-2-[SESSION_ID]`
**Priority**: High → Low
**Estimated Complexity**: Easy → Hard

---

## HIGH PRIORITY - Security & Performance (1-5)

### 1. **Remove Remaining DEBUG Logs in dify.ts**
- **File**: `src/core/api/providers/dify.ts`
- **Lines**: 87-402 (60+ debug statements)
- **Issue**: Still contains extensive debug logging in production code
- **Fix**: Remove all `[DIFY DEBUG]` console.log/warn statements
- **Impact**: Performance, log noise reduction
- **Difficulty**: Easy

### 2. **Remove DEBUG Logs in ExtensionStateContext**
- **File**: `webview-ui/src/context/ExtensionStateContext.tsx`
- **Lines**: 312, 341, 344, 359, 377, 395, 408, 420, 476, 483, 514, 524
- **Issue**: 12+ debug console.log statements in UI state management
- **Fix**: Remove debug logging statements
- **Impact**: Performance, cleaner console output
- **Difficulty**: Easy

### 3. **Remove DEBUG Logs in gRPC Infrastructure**
- **Files**:
  - `src/hosts/vscode/hostbridge-grpc-handler.ts:65,86,110`
  - `src/hosts/vscode/hostbridge/client/host-grpc-client-base.ts:92`
  - `webview-ui/src/services/grpc-client-base.ts:115`
- **Issue**: Debug logging in production gRPC layer
- **Fix**: Remove debug statements
- **Impact**: Performance
- **Difficulty**: Easy

### 4. **Fix DeepSeek Cache Stats Display**
- **File**: `src/shared/api.ts`
- **Lines**: 1544, 1554
- **Issue**: FIXME - DeepSeek reports cache stats differently than Anthropic
- **Fix**: Implement proper cache stats display for DeepSeek models
- **Impact**: User visibility, accuracy
- **Difficulty**: Medium

### 5. **Fix HuggingFace Context Window Detection**
- **File**: `src/core/controller/models/refreshHuggingFaceModels.ts`
- **Line**: 41
- **Issue**: FIXME - Using hardcoded 128k context window
- **Fix**: Fetch actual context window from HuggingFace API
- **Impact**: Model accuracy, user experience
- **Difficulty**: Medium

---

## MEDIUM PRIORITY - Code Quality & Bugs (6-12)

### 6. **Fix Windows Shell Detection**
- **Files**: Multiple in `src/core/prompts/commands/deep-planning/variants/`
- **Lines**: generic.ts:25, gemini.ts:33, anthropic.ts:33
- **Issue**: FIXME - detectedShell returns non-string on some Windows machines
- **Fix**: Add type checking and proper Windows shell detection
- **Impact**: Windows compatibility
- **Difficulty**: Medium

### 7. **Improve Context Truncation for Prompt Caching**
- **File**: `src/core/context/context-management/ContextManager-legacy.ts`
- **Line**: 28
- **Issue**: FIXME - Conversation truncation not optimal for prompt caching
- **Fix**: Implement smarter truncation that preserves cache hits
- **Impact**: Performance, cost optimization
- **Difficulty**: Hard

### 8. **Fix OpenAI Compatible Context Window for DeepSeek**
- **File**: `src/core/context/context-management/context-window-utils.ts`
- **Line**: 12
- **Issue**: FIXME - Hack for DeepSeek context window (should be user-configurable)
- **Fix**: Add UI setting for custom context windows
- **Impact**: Model flexibility
- **Difficulty**: Medium

### 9. **Implement Multi-Root Checkpoint Restore**
- **File**: `src/integrations/checkpoints/MultiRootCheckpointManager.ts`
- **Lines**: 2, 196, 215
- **Issue**: TODO - Multi-root checkpoint manager not yet in use, restore logic incomplete
- **Fix**: Complete implementation and enable feature
- **Impact**: Multi-workspace support
- **Difficulty**: Hard

### 10. **Add Tree-Sitter Caching**
- **File**: `src/services/tree-sitter/index.ts`
- **Line**: 8
- **Issue**: TODO - No caching, re-analyzes project for every new task
- **Fix**: Implement analysis caching with invalidation strategy
- **Impact**: Performance for large projects
- **Difficulty**: Medium

### 11. **Improve Auth State Logic**
- **File**: `src/services/auth/AuthService.ts`
- **Lines**: 191, 198
- **Issue**: TODO - Auth state logic should be cleaner, needs proto for new user info type
- **Fix**: Refactor auth state determination and create proper proto types
- **Impact**: Code clarity, maintainability
- **Difficulty**: Medium

### 12. **Add Tiered Thinking Budget Pricing**
- **File**: `src/utils/cost.ts`
- **Line**: 49
- **Issue**: TODO - No support for tiered thinking budget output pricing
- **Fix**: Implement tiered pricing calculation for extended thinking models
- **Impact**: Cost accuracy
- **Difficulty**: Medium

---

## LOW PRIORITY - Enhancements & Technical Debt (13-20)

### 13. **Update Bedrock Default Model**
- **File**: `src/shared/api.ts`
- **Line**: 488
- **Issue**: TODO - Update to Claude Sonnet 4.5
- **Fix**: Change default from 4.0 to 4.5
- **Impact**: Users get latest model by default
- **Difficulty**: Easy

### 14. **Update Vertex AI Default Model**
- **File**: `src/shared/api.ts`
- **Line**: 830
- **Issue**: TODO - Update to Claude Sonnet 4.5
- **Fix**: Change default from 4.0 to 4.5
- **Impact**: Users get latest model by default
- **Difficulty**: Easy

### 15. **Add Bedrock Proxy Support**
- **File**: `src/core/api/providers/bedrock.ts`
- **Line**: 274
- **Issue**: TODO - No proxy support for AWS SDK
- **Fix**: Implement proxy configuration for Bedrock
- **Impact**: Enterprise network support
- **Difficulty**: Medium

### 16. **Remove SAP AI Core Fallback Deployment ID Methods**
- **File**: `src/core/api/providers/sapaicore.ts`
- **Line**: 403
- **Issue**: TODO - Fallback methods can be removed after user migration complete
- **Fix**: Remove deprecated fallback code
- **Impact**: Code cleanup
- **Difficulty**: Easy

### 17. **Support SAP AI Core Credentials Changes**
- **File**: `src/core/api/providers/sapaicore.ts`
- **Line**: 470
- **Issue**: TODO - No support for credentials changes after initial setup
- **Fix**: Add credential refresh/update capability
- **Impact**: User experience
- **Difficulty**: Medium

### 18. **Add SAP AI Core Caching Support**
- **File**: `src/core/api/providers/sapaicore.ts`
- **Line**: 636
- **Issue**: TODO - Add Anthropic-native cache_control blocks support
- **Fix**: Implement prompt caching for SAP AI Core
- **Impact**: Performance, cost
- **Difficulty**: Medium

### 19. **Remove DEV Content from Production Builds**
- **File**: `src/extension.ts`
- **Line**: 487
- **Issue**: TODO - No automated removal of DEV content in production builds
- **Fix**: Add build-time stripping of dev-only code
- **Impact**: Bundle size, security
- **Difficulty**: Medium

### 20. **Decouple Focus Chain from ClineMessages**
- **File**: `src/core/controller/file/openFocusChainFile.ts`
- **Line**: 23
- **Issue**: TODO - Focus chain tightly coupled with ClineMessages
- **Fix**: Refactor to separate concerns
- **Impact**: Code maintainability, architecture
- **Difficulty**: Medium

---

## Summary Statistics

**By Difficulty:**
- Easy: 5 fixes
- Medium: 13 fixes
- Hard: 2 fixes

**By Category:**
- Debug Logging Cleanup: 3 fixes
- Performance/Optimization: 4 fixes
- Bug Fixes: 6 fixes
- Missing Features: 4 fixes
- Technical Debt: 3 fixes

**Estimated Session Time**: 3-4 hours for all 20 fixes

**Quick Wins (Can complete first):**
1. Remove dify.ts debug logs
2. Remove ExtensionStateContext debug logs
3. Remove gRPC debug logs
4. Update Bedrock default model
5. Update Vertex AI default model
