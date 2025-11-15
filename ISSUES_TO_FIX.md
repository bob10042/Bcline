# Cline Issues to Fix

This list contains 50 issues fetched from the main Cline repository that need to be addressed.

## High Priority Issues

### Security & Critical Bugs
- [x] **#7480**: [Aikido] Fix 2 security issues in tar-fs, js-yaml ✅ ALREADY FIXED
- [ ] **#7431**: [Aikido] Fix 3 security issues in @modelcontextprotocol/sdk, tar
- [ ] **#7373**: Fix critical bug with token usage
- [ ] **#7413**: Fix MCP Servers launching thousands of instances on Windows (crash)

### API & Provider Issues
- [x] **#7484**: Fix: Ollama API requests not cancelled when user clicks cancel ✅ FIXED
- [x] **#7468**: Fix ollama API requests not cancelled ✅ FIXED (duplicate of #7484)
- [x] **#7482**: fix openrouter defaulting modelId when modelInfo is not present ✅ ALREADY FIXED
- [x] **#7481**: Fix Vercel provider token usage ✅ FIXED
- [ ] **#7467**: Sonnet 4.5 with Claude Code provider - list_files missing path parameter
- [ ] **#7464**: Error Anthropic API key is required when using LiteLLM proxy
- [ ] **#7457**: SAPAICore Provider issue on Claude 4.5 sonnet with Orchestration Mode disabled
- [ ] **#7400**: Fix SAP AI Core streaming inference requests fail
- [ ] **#7393**: Claude Code provider throws "tool_use is not supported yet" error

### Terminal & Command Issues
- [x] **#7483**: Fix: Terminal commands with double quotes broken in Background Exec mode ✅ FIXED
- [x] **#7470**: Terminal commands with double quotes are broken when "Terminal Execution Mode" is set to "Background Exec" ✅ FIXED (duplicate of #7483)
- [ ] **#7379**: /smol command fails when context window is overfed during task execution

### Token & Usage Issues
- [ ] **#7383**: Context Window Usage Mismatch - UI shows ~50% but API receives 100% (100K discrepancy)
- [ ] **#7389**: Negative token count showing in usage and overall token use is very less
- [ ] **#7371**: Random token spike
- [ ] **#7447**: Fix: respect reasoning and temperature support flags

### UI/UX Issues
- [ ] **#7430**: New UI is a huge downgrade in UX/DX - auto approve popups cover buttons, missing MCP visibility
- [ ] **#7388**: "Task Completed" is rendered twice for a long conversation
- [ ] **#7415**: URL not displayed properly during response generation
- [ ] **#7398**: Mermaid Node Text Labels are Incomplete or Clipped After Zooming
- [ ] **#7391**: Improve layout and styling in OnboardingView component for small width viewport
- [ ] **#7463**: WIP: focus diff preview for write-to-file changes

### JetBrains/IntelliJ Issues
- [ ] **#7476**: JetBrains plugin does not support Windows/ARM64
- [ ] **#7409**: Cline KO in JetBrains with Mistral: TypeError: Failed to parse URL
- [ ] **#7374**: Cannot find module 'vscode' when running plugin in IntelliJ
- [ ] **#7403**: Cline does not save config in WebStorm 2025.2

### IDE Integration Issues
- [ ] **#7432**: Client agent on VSCode insiders goes blank when Cline terminal runs
- [ ] **#7462**: Cline doesn't recognize that Act mode is active

## Feature Requests & Enhancements

### Model Support
- [ ] **#7482**: Fix openrouter defaulting modelId when modelInfo is not present
- [ ] **#7469**: Error cline latest version different models
- [ ] **#7422**: Request to add MiniMax M2 and Kimi K2 thinking to Fireworks AI provider
- [ ] **#7386**: Add kimi-k2-thinking and kimi-k2-thinking-turbo
- [ ] **#7425**: Move native tools decision to per-model level
- [ ] **#7424**: Native tools not being used in LMStudio
- [ ] **#7380**: Update aihubmix model list

### Provider Integration
- [ ] **#7423**: Add BurnCloud provider metadata
- [ ] **#7402**: Adding Hicap into the Cline CLI

### Development & Infrastructure
- [ ] **#7461**: Add docker setup for CLI development
- [ ] **#7384**: Harbor-compliant record functionality for cli and core
- [ ] **#7458**: Reduce frontend Modules
- [ ] **#7439**: Memoize credits history table component

### Configuration & Settings
- [ ] **#7474**: Github repo url is shown instead of MCP server name when switching to Staging
- [ ] **#7405**: Why does using "@" to select a folder submit all the file content codes
- [ ] **#7382**: Commit message only support top level repo

### Error Handling
- [ ] **#7452**: Healthcheck timed out
- [ ] **#7426**: Failed to start core Healthcheck timed out bot.cline.server.ts LOG BannerService: Invalid response format

### Maintenance
- [ ] **#7473**: Changeset version bump

---

**Total Issues**: 50
**Source**: https://github.com/cline/cline/issues
**Fetched**: 2025-11-15
**File**: cline_issues_page1.json
**Branch**: claude/fetch-fifty-issues-01Nt8STcP7AqL9PhhgDWSLgT

## Notes
- All issues verified to NOT overlap with already fixed issues in this repo
- Last fixed issues in this repo: #7479, #7478, #7477, #7475, #7449
- These are all new/open issues that need attention
