# CLI Error Detection Test V2 - Real-World Scenarios

**Purpose:** Test Cline's error detection with realistic development workflow failures that developers actually encounter.

**Date:** 2025-11-18
**Version:** 2.0 - Real-world focused
**Target:** 15/15 error detection rate

---

## Test Philosophy

This test focuses on **real errors developers encounter daily**:
- Build failures with actual error messages
- Package manager issues
- Git workflow problems
- File system errors
- Code execution failures
- Configuration errors

All tests produce **detectable error output**, not just exit codes, because that's how real tools work.

---

## TEST SUITE: Real-World Error Detection

### Test 1: npm Build Failure - Missing Dependency
**Scenario:** Developer tries to build project with missing package

```bash
cd tests/test-cli-project && npm run build 2>&1 || echo "BUILD_FAILED"
```

**Expected Output Contains:**
- `Error:` or `MODULE_NOT_FOUND` or `Cannot find module`
- `BUILD_FAILED` if command fails

**What to Detect:** Module/dependency errors, build failure indicators

---

### Test 2: TypeScript Compilation Errors
**Scenario:** TypeScript file with type errors

Create a test file first:
```bash
echo "const x: number = 'string'; console.log(x);" > /tmp/test-error.ts
```

Then compile it:
```bash
npx tsc /tmp/test-error.ts --noEmit 2>&1
```

**Expected Output Contains:**
- `error TS` (TypeScript error code)
- Line/column number
- Type mismatch description

**What to Detect:** Compilation errors, type errors

---

### Test 3: Git Merge Conflict
**Scenario:** Attempting to merge branches with conflicts

**Step 1 - Setup (run this first):**
```bash
cd /tmp && rm -rf test-git-conflict && git init test-git-conflict && cd test-git-conflict && git config user.email "test@test.com" && git config user.name "Test User"
```

**Step 2 - Create conflict:**
```bash
cd /tmp/test-git-conflict && echo "version 1" > file.txt && git add . && git commit -m "initial"
```

**Step 3 - Branch and modify:**
```bash
cd /tmp/test-git-conflict && git checkout -b branch1 && echo "branch 1 change" > file.txt && git commit -am "b1"
```

**Step 4 - Master and merge (this will conflict):**
```bash
cd /tmp/test-git-conflict && git checkout master && echo "master change" > file.txt && git commit -am "master" && git merge branch1 2>&1
```

**Expected Output Contains:**
- `CONFLICT` (merge conflict indicator)
- `Automatic merge failed`
- File conflict details

**What to Detect:** Merge conflicts, git workflow errors

---

### Test 4: Python Import Error
**Scenario:** Running Python script with missing import

```bash
python -c "import nonexistent_module_xyz123; print('success')" 2>&1
```

**Expected Output Contains:**
- `ModuleNotFoundError` or `ImportError`
- `No module named`
- Traceback

**What to Detect:** Python import failures, traceback patterns

---

### Test 5: File Permission Denied
**Scenario:** Trying to write to read-only location (Windows safe)

```bash
echo "test" > "C:\Windows\System32\test-readonly.txt" 2>&1
```

**Expected Output Contains:**
- `Access is denied` or `Permission denied`
- `cannot create` or error indicator

**What to Detect:** File system permission errors

---

### Test 6: Port Already in Use
**Scenario:** Starting dev server when port is occupied

```bash
node -e "const http = require('http'); const s1 = http.createServer().listen(18765); const s2 = http.createServer(); s2.on('error', (e) => { console.error('PORT_ERROR:', e.code, e.message); s1.close(); process.exit(1); }); s2.listen(18765);" 2>&1
```

**Expected Output Contains:**
- `EADDRINUSE` or `address already in use` or `PORT_ERROR`
- Port number (18765)
- Error code/message

**What to Detect:** Network/port binding errors

---

### Test 7: Docker Container Not Found
**Scenario:** Attempting to interact with non-existent container

```bash
docker exec nonexistent-container-xyz123 echo "test" 2>&1
```

**Expected Output Contains:**
- `Error: No such container` or `Error response from daemon`
- Container name

**What to Detect:** Docker runtime errors (skip if Docker not installed)

---

### Test 8: Invalid JSON in Package File
**Scenario:** npm/yarn trying to read malformed package.json

```bash
cd /tmp && mkdir -p test-bad-json && cd test-bad-json && echo "{invalid json content here}" > package.json && npm install 2>&1
```

**Expected Output Contains:**
- `JSON` (mention of JSON)
- `Unexpected token` or `parse` or `invalid`
- File path to package.json

**What to Detect:** JSON parsing errors, configuration file errors

---

### Test 9: Command Not Found (Typo Simulation)
**Scenario:** Developer typos a common command

```bash
npn install 2>&1
```

**Expected Output Contains:**
- `not found` or `not recognized` or `CommandNotFoundException`
- Command name suggestion (if available)

**What to Detect:** Command typos, missing executables

---

### Test 10: Linter Errors (ESLint)
**Scenario:** Running linter on code with violations

Create test file:
```bash
echo "var x = 5; eval('console.log(x)');" > /tmp/test-lint.js
```

Run linter:
```bash
npx eslint /tmp/test-lint.js 2>&1 || echo "LINT_FAILED"
```

**Expected Output Contains:**
- `error` or `warning`
- Line numbers
- Rule violations
- `LINT_FAILED` if fails

**What to Detect:** Linting errors, code quality issues

---

### Test 11: Database Connection Failure
**Scenario:** Attempting to connect to non-existent database

```bash
node -e "const net = require('net'); const c = net.connect({port: 5432, host: 'nonexistent-db-host-xyz.local', timeout: 500}); c.on('error', (e) => { console.error('DB_ERROR:', e.code, e.message); process.exit(1); }); c.on('timeout', () => { console.error('DB_ERROR: ETIMEDOUT'); c.destroy(); process.exit(1); }); setTimeout(() => { c.destroy(); process.exit(0); }, 1000);" 2>&1
```

**Expected Output Contains:**
- `ENOTFOUND` or `ECONNREFUSED` or `DB_ERROR`
- Host/connection details

**What to Detect:** Network connection errors, database errors

---

### Test 12: Disk Space / File System Full Simulation
**Scenario:** Cannot write file due to system constraints

```bash
node -e "const fs = require('fs'); try { fs.writeFileSync('/dev/full', 'test'); } catch(e) { console.error('WRITE_ERROR:', e.code, e.message); }" 2>&1
```

**Expected Output Contains:**
- `ENOSPC` or `WRITE_ERROR` or `no space`
- Error code/message

**What to Detect:** Disk space errors, write failures (Linux/Mac with /dev/full, Windows will differ)

---

### Test 13: API Request Failure (404)
**Scenario:** Fetching from non-existent API endpoint

```bash
curl -f --max-time 5 https://api.github.com/repos/nonexistent-user-xyz123/nonexistent-repo-xyz123 2>&1
```

**Expected Output Contains:**
- `404` or `Not Found`
- `failed` or `error`
- HTTP status mention

**What to Detect:** HTTP errors, API failures (skip if curl not available)

---

### Test 14: Environment Variable Missing
**Scenario:** Script expecting required env var

```bash
node -e "if (!process.env.REQUIRED_API_KEY_XYZ) { console.error('ERROR: Missing required environment variable REQUIRED_API_KEY_XYZ'); process.exit(1); }" 2>&1
```

**Expected Output Contains:**
- `ERROR`
- `Missing` and `environment variable`
- Variable name

**What to Detect:** Configuration errors, missing environment setup

---

### Test 15: Successful Command (Control Test)
**Scenario:** Normal successful operation

```bash
echo "Build completed successfully" && node -e "console.log('All tests passed ✓')"
```

**Expected Output Contains:**
- `success` or `passed` or `✓`
- NO error indicators

**What to Detect:** Should NOT trigger error warnings

---

## Validation Criteria

For each test, check:
1. **Did you see the error output?** (Captured stderr/stdout)
2. **Did you show ⚠️ ERROR DETECTED warning?** (Error detection triggered)
3. **Did you correctly identify the error type?** (Proper pattern recognition)
4. **Did you proceed anyway or ask about it?** (Workflow behavior)

---

## Scoring System

| Score | Result | Interpretation |
|-------|--------|----------------|
| 14/14 | Perfect | Production-ready error detection |
| 11-13/14 | Excellent | Minor edge cases missed |
| 8-10/14 | Good | Core errors detected, some gaps |
| 5-7/14 | Needs Work | Missing common error patterns |
| < 5/14 | Failing | Error detection not functional |

**Note:** Test 15 must NOT trigger errors (false positive check)

---

## Post-Test Analysis Questions

1. **How many errors detected out of 14?** (Test 15 should be clean)
2. **Which error types were caught?** (Categorize: build, runtime, network, file system, etc.)
3. **Which tests were missed?** (List test numbers)
4. **Any false positives?** (Did Test 15 trigger incorrectly?)
5. **What error patterns worked best?** (Analyze what detection rules fired most)

---

## Expected Patterns to Detect

The error detection system should recognize:

- **Build/Compilation:** `error TS`, `BUILD_FAILED`, `compilation error`
- **Module/Import:** `MODULE_NOT_FOUND`, `ModuleNotFoundError`, `cannot find module`
- **Git:** `CONFLICT`, `merge failed`, `fatal:`
- **File System:** `Permission denied`, `Access is denied`, `ENOENT`, `EACCES`
- **Network:** `EADDRINUSE`, `ECONNREFUSED`, `ENOTFOUND`, `404`
- **JSON/Config:** `Unexpected token`, `JSON parse`, `invalid`
- **Command:** `not found`, `not recognized`, `CommandNotFoundException`
- **Docker:** `No such container`, `Error response from daemon`
- **Database:** `ECONNREFUSED`, `DB_ERROR`
- **General:** `Error:`, `Exception`, `Traceback`, `failed`

---

## Platform Compatibility Notes

**Windows:**
- Tests 1-6, 8-11, 14-15 should work universally
- Test 7 requires Docker Desktop
- Test 12 needs alternative (no `/dev/full`)
- Test 13 requires curl (install via Git Bash or Chocolatey)

**Linux/Mac:**
- All tests should work
- Test 7 requires Docker
- Test 13 requires curl (usually pre-installed)

**Handling Missing Tools:**
- If a tool isn't available (docker, curl), note it and skip that test
- Adjust scoring: [passed]/[attempted] instead of [passed]/14

---

## Usage Instructions

**For Testers:**
1. Copy this entire file content
2. Paste into Cline CLI
3. Let Cline execute all tests sequentially
4. Review the detection results
5. Answer the post-test analysis questions

**For Developers:**
- Use this to validate error detection improvements
- Add new real-world scenarios as discovered
- Keep tests platform-agnostic where possible
- Focus on **output patterns**, not just exit codes

---

## Test Improvement Suggestions

This test can evolve. Consider adding:
- Webpack/Vite build failures
- Test runner failures (Jest, Mocha)
- Certificate/SSL errors
- Timeout errors
- Memory/heap errors
- Circular dependency errors
- Syntax errors in various languages

---

**Version History:**
- V1.0: Original exit-code focused tests (7/9 detection rate)
- V2.0: Real-world scenario focused (this version)
