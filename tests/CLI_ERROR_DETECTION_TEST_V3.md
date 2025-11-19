# CLI Error Detection Test V3 - Robustness & Precision

**Purpose:** Test Cline's error detection capabilities with a focus on **robustness** (catching tricky errors) and **precision** (avoiding false positives).
**Date:** 2025-11-18
**Version:** 3.0
**Target:** High detection rate for real errors, 0% false positives for non-errors.

---

## Test Philosophy V3

V2 focused on catching identifying errors. V3 expands this to ensuring we don't cry wolf ("False Positives") and can handle complex edge cases.

**Key areas of testing:**
1.  **Hard Failures:** Non-zero exit codes with error text.
2.  **Soft Failures:** Zero exit codes but "Error" text in output (common in some build tools).
3.  **False Positives (Crucial):** Stderr output that is NOT an error (logs, progress bars, warnings).
4.  **Resource Exhaustion:** OOM, Timeouts.
5.  **Cross-Platform Compatibility:** Better handling of Windows/Linux path differences.

---

## SECTION A: The "Recall" Suite (Catching Real Errors)

### Test A1: The "Silent" Failure (Exit Code Only)
**Scenario:** A script that crashes without printing to stderr, relying on exit code.
```bash
node -e "process.exit(1)" || echo "DETECTED_NON_ZERO_EXIT"
```
**Expect:** Detection of non-zero exit code.
**Why:** Some tools crash silently. The system must notice the command failed.

### Test A2: The "Soft" Failure (Text Only)
**Scenario:** A script that prints "Error:" but returns exit code 0 (Bad practice, but happens).
```bash
node -e "console.log('[ERROR] Build target failed');"
```
**Expect:** Detection of the keyword "Error" even if exit code is 0.
**Why:** Logs often contain the real status when exit codes are swallowed by wrapper scripts.

### Test A3: Stack Trace Explosion
**Scenario:** A massive stack trace that might flood the context window.
```bash
node -e "function a() { b(); } function b() { c(); } function c() { throw new Error('Deep Stack Crash'); } a();" 2>&1
```
**Expect:** Identification of the error type (`Error`) and the message (`Deep Stack Crash`).
**Why:** Real apps generate huge traces. The system should parse the core error.

### Test A4: Node.js Heap Out of Memory
**Scenario:** Simulating a memory leak crash.
```bash
node -e "const a = []; while(true) a.push('x'.repeat(1000000));" 2>&1
```
**Expect:** `FATAL ERROR: Ineffective mark-compacts` or `JavaScript heap out of memory`.
**Why:** Resource limits are common in CI/CD and large builds.

### Test A5: Missing Operating System Command
**Scenario:** Trying to run a binary that definitely doesn't exist.
```bash
run-non-existent-tool-v3 2>&1
```
**Expect:** `not found`, `not recognized`, or `command not found`.
**Why:** Basic typo detection.

---

## SECTION B: The "Precision" Suite (Avoiding False Positives)

### Test B1: Stderr is for Logging too
**Scenario:** Writing to stderr without an error. Many tools imply "info" on stderr.
```bash
node -e "console.error('Download progress: 100%'); console.error('Verifying checksum... Done.');"
```
**Expect:** **NO ERROR DETECTED**.
**Why:** If Cline flags this as an error, it disrupts normal workflows (npm, curl, wget often write progress to stderr).

### Test B2: Warnings vs Errors
**Scenario:** A deprecation warning.
```bash
node -e "console.error('Warning: partial option is deprecated. Use partials instead.');"
```
**Expect:** **NO ERROR DETECTED** (or flagged as low-priority warning, not a distinct failure).
**Why:** Developers ignore warnings constantly. Stopping execution for a warning is annoyingly strict.

### Test B3: "Error" variable name (Red Herring)
**Scenario:** Code output that contains the string "error" but isn't an error message.
```bash
echo "const errorCount = 0; console.log('No error found');"
```
**Expect:** **NO ERROR DETECTED**.
**Why:** Context matters. The word "error" appearing in source code or logs shouldn't always trigger an alarm.

---

## SECTION C: Platform Agnostic Scenarios

### Test C1: Path Handling (ENOENT)
**Scenario:** Reading a non-existent file using Node (ignoring platform slash differences).
```bash
node -e "require('fs').readFileSync('non/existent/path/file.txt')" 2>&1
```
**Expect:** `ENOENT` or `no such file`.
**Why:** Commonest FS error.

### Test C2: Git Fatal (No Init Required)
**Scenario:** Running a git command that fails outside a repo.
```bash
git log --max-count=1 2>&1
```
**Expect:** `fatal: not a git repository` (or similar git error).
**Note:** If run inside a repo, try `git checkout non-existent-branch-v3`.

### Test C3: Python Traceback (If Python available)
**Scenario:** Syntax error in Python one-liner.
```bash
python -c "print('hello" 2>&1
```
**Expect:** `SyntaxError: EOL while scanning string literal`.
**Why:** Syntax errors are immediate blockers.

---

## SECTION D: Complex Environment

### Test D1: Chained Command Failure
**Scenario:** A failure in the middle of a chain.
```bash
echo "Start" && false && echo "End"
```
**Expect:** Detection that the command chain stopped/failed (PowerShell vs Bash behavior may vary on `false`, use `exit 1` if needed).
```bash
node -e "console.log('step 1')" && node -e "process.exit(1)" && console.log('step 3')
```

### Test D2: JSON Error Response
**Scenario:** CLI tool returning error as JSON.
```bash
node -e "console.log(JSON.stringify({status: 'error', message: 'Invalid API Key', code: 401})); process.exit(1);"
```
**Expect:** Extraction of the JSON error message.

---

## Instructions for Execution

1.  **Setup:** Ensure `node` is installed (it is). Python is optional but recommended.
2.  **Run:** Execute each command block.
3.  **Analyze:**
    *   Did Cline stop and ask for help? (Good for errors).
    *   Did Cline ignore the noise? (Good for Section B).
    *   Did Cline explain the error correctly?

## Scoring

*   **Total Tests:** 12
*   **Passing Score:** 12/12
*   **Critical Success Factor:** Passing all **Section B** tests (Zero False Positives) is just as important as catching errors.
