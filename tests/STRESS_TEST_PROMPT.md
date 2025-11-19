# Cline Extreme Stress Test - Version 3.37.1

You are running Cline v3.37.1 with 20 critical bug fixes. This is a comprehensive stress test designed to push your limits and verify all fixes are working under heavy load.

**IMPORTANT**: This is a REAL stress test. Actually perform every operation. No simulations.

---

## STRESS TEST 1: Massive File Operations Barrage

**Objective**: Test file handling, tool use, and stability under rapid operations

### Phase 1: Create File Structure
Create the following directory structure and files:

```
stress-test/
├── data/
│   ├── test-1.txt (content: "Stress test file 1 - Lorem ipsum..." 500 words)
│   ├── test-2.txt (content: "Stress test file 2 - Lorem ipsum..." 500 words)
│   ├── test-3.txt (content: "Stress test file 3 - Lorem ipsum..." 500 words)
│   ├── test-4.txt (content: "Stress test file 4 - Lorem ipsum..." 500 words)
│   └── test-5.txt (content: "Stress test file 5 - Lorem ipsum..." 500 words)
├── output/
│   └── results.txt (empty for now)
└── logs/
    └── operations.log (empty for now)
```

### Phase 2: Rapid Read Operations
1. Read all 5 test files sequentially
2. For each file, count the total words
3. Extract the first and last sentence
4. Write results to `stress-test/output/results.txt`

### Phase 3: Concurrent Edits
1. Edit test-1.txt: Add "EDITED BY STRESS TEST" at the beginning
2. Edit test-2.txt: Append "END OF STRESS TEST" at the end
3. Edit test-3.txt: Replace all "Lorem" with "STRESSED"
4. Edit test-4.txt: Insert line numbers at the start of each line
5. Edit test-5.txt: Reverse the order of paragraphs

### Phase 4: Verification
1. Read all edited files
2. Verify each edit was applied correctly
3. Log all operations to `stress-test/logs/operations.log`

**Report**: Did all operations complete without errors? Any file corruption? Performance issues?

---

## STRESS TEST 2: Context Window Torture Test

**Objective**: Push context management to the limit (Fix #7379, #7383)

### Tasks:
1. Read the entire `src/core/task/index.ts` file
2. Read the entire `FIXES_TRACKER.md` file
3. Read the entire `TEST_20_FIXES.md` file
4. Read the entire `package.json` file
5. Read the entire `README.md` file (if it exists)
6. Now list all the files you've read and summarize each in one sentence
7. **Critical**: After all this reading, try to use `/smol` mode thinking
8. **Critical**: Can you still function? Is context management working?

**Report**:
- Current context usage percentage (if visible)
- Can you still recall information from the first file?
- Did context truncation happen automatically?
- Is /smol mode still accessible?
- Any errors or degradation in performance?

---

## STRESS TEST 3: Git Operations Under Load

**Objective**: Test git functionality extensively (Fix #7382)

### Tasks:
1. Run `git status` - report full output
2. Run `git log --oneline -20` - show 20 commits
3. Run `git branch -a` - list all branches
4. Run `git diff src/core/task/index.ts` - show current changes
5. Check if you're in a git submodule
6. Detect the git root directory
7. Run `git log --stat --oneline -5` - show stats for last 5 commits
8. Can you generate a commit message for current changes?

**Report**:
- Did all git commands execute successfully?
- Any errors with git operations?
- Can you handle complex git scenarios?
- Submodule detection working?

---

## STRESS TEST 4: Error Handling Gauntlet

**Objective**: Test stability and error recovery (Fix #7388, #7393)

### Try to break yourself:
1. Read a file that doesn't exist: `fake-file-999.txt`
2. Try to edit a file that doesn't exist: `nonexistent.txt`
3. Try to delete a file that doesn't exist
4. Try to read a directory as if it were a file: `src/`
5. Try to write to an invalid path: `/invalid/path/file.txt`
6. Try a malformed git command: `git invalidcommand`
7. Try to read a binary file: Find and read a .png or .jpg file
8. Try to list files with an invalid glob pattern

**After each error**:
- Did you recover gracefully?
- Are you still functioning?
- Did you provide helpful error messages?

**Report**: Error handling score (1-10) and any crashes or hangs

---

## STRESS TEST 5: Rapid-Fire Command Execution

**Objective**: Test command handling and terminal operations (Fix #7470, #7468)

### Execute these commands in sequence:
1. `echo "Test 1: Basic echo"`
2. `echo "Test 2: With \"double quotes\""`
3. `echo 'Test 3: With '\''single quotes'\''`
4. `node --version`
5. `npm --version`
6. `git --version`
7. `ls -la stress-test/` (or `dir stress-test/` on Windows)
8. `echo "Multi" && echo "Line" && echo "Commands"`
9. Create a file using echo: `echo "Command output" > stress-test/cmd-test.txt`
10. Verify the file was created

**Report**:
- Did all commands execute successfully?
- Did quote handling work correctly?
- Any command failures?
- Terminal integration stable?

---

## STRESS TEST 6: Complex Multi-Step Workflow

**Objective**: Test coordination of all systems working together

### The Challenge:
You will build a complete analysis system. Follow these exact steps:

**Step 1**: Read all TypeScript files in `src/core/task/` (use glob pattern)

**Step 2**: For each file found:
- Count total lines
- Count lines with "export"
- Count lines with "import"
- Count lines with "async"
- Count lines with "await"

**Step 3**: Create a comprehensive report at `stress-test/output/code-analysis.json`:
```json
{
  "analysis_date": "current date/time",
  "files_analyzed": [...],
  "statistics": {
    "total_files": 0,
    "total_lines": 0,
    "total_exports": 0,
    "total_imports": 0,
    "total_async": 0,
    "total_await": 0
  },
  "per_file_stats": [...]
}
```

**Step 4**: Create a markdown summary at `stress-test/output/analysis-report.md`

**Step 5**: Run `git status` and append it to the markdown report

**Step 6**: Create a final verification file `stress-test/output/complete.txt` with:
- Total operations performed
- Time estimate for completion
- Any errors encountered
- Self-assessment of performance

**Report**: Could you complete this entire workflow? Any step failures?

---

## STRESS TEST 7: Memory and State Retention

**Objective**: Test if you maintain state and memory correctly

### Phase 1: Information Loading
I'm going to give you 10 pieces of information. Remember them all:

1. Secret code: ALPHA-7734-BETA
2. Favorite color: Quantum Blue
3. Magic number: 42.195
4. Test phrase: "The quick brown fox jumps over the lazy dog"
5. Binary sequence: 1101001010
6. Hex code: #FF5733
7. Timestamp: 2025-11-16T17:45:00Z
8. UUID: 550e8400-e29b-41d4-a716-446655440000
9. Password hint: "First pet + birth year"
10. Checksum: CRC32-A7B3C9D1

### Phase 2: Do Intensive Work
Now perform these tasks:
1. Read 3 large files from src/
2. Create 5 new files in stress-test/memory/
3. Execute 10 bash commands
4. Search for patterns in multiple files

### Phase 3: Memory Recall
Now, WITHOUT looking back at Phase 1, tell me:
- What was the secret code?
- What was the magic number?
- What was the UUID?
- What was the hex code?
- What was the binary sequence?

**Report**: How many did you remember correctly? Score: X/5

---

## STRESS TEST 8: Concurrent Tool Usage

**Objective**: Test handling multiple tool types simultaneously

### The Gauntlet:
In one continuous flow, WITHOUT stopping:

1. **Read** the file `package.json`
2. **Execute** `npm list --depth=0`
3. **Write** output to `stress-test/npm-list.txt`
4. **Read** `FIXES_TRACKER.md` lines 1-50
5. **Edit** `stress-test/data/test-1.txt` to add a timestamp
6. **Execute** `git log --oneline -3`
7. **Write** git log to `stress-test/git-log.txt`
8. **Glob** search for all .json files
9. **Read** the first .json file found
10. **Create** a summary in `stress-test/output/tool-test.txt`

**Report**: Continuous flow success? Any tool failures? Performance degradation?

---

## STRESS TEST 9: Edge Cases and Boundary Conditions

**Objective**: Test handling of unusual scenarios

### Tests:
1. **Empty Files**: Create and read a completely empty file
2. **Huge Lines**: Create a file with a single 10,000 character line
3. **Many Small Files**: Create 50 files each with one word
4. **Special Characters**: Create a file with name: `test-!@#$%^&()_+.txt` (if allowed)
5. **Unicode**: Create a file with content: "Hello: 你好 مرحبا नमस्ते 🚀🎉"
6. **Nested Paths**: Create deeply nested directory: `a/b/c/d/e/f/g/test.txt`
7. **Simultaneous Reads**: Try to reference the same file multiple times in one response
8. **Large JSON**: Create a JSON file with 1000 array items
9. **CSV Parsing**: Create and read a CSV with 100 rows
10. **Regex Patterns**: Search files using complex regex patterns

**Report**: Which edge cases passed? Any failures?

---

## STRESS TEST 10: Self-Diagnostic and Recovery

**Objective**: Test self-awareness and problem-solving

### Scenario:
Something has gone wrong (hypothetically).

**Your Tasks**:
1. Check the current state of the `stress-test/` directory
2. Count how many files you've created
3. Verify that all previous stress tests left artifacts
4. Find any errors in operation logs
5. If any test failed, diagnose why
6. Create a recovery plan
7. Implement the recovery plan
8. Verify all systems are operational

**Report**:
- Self-diagnostic capability score (1-10)
- Did you identify any issues?
- Could you fix them?
- Current system health assessment

---

## FINAL CHALLENGE: The Ultimate Stress Test

### The Mission:
Combine EVERYTHING you've learned. Perform this complete sequence WITHOUT any breaks:

1. Read 10 files from the codebase
2. Create a comprehensive analysis
3. Execute 15 different bash commands
4. Create 20 new files with meaningful content
5. Edit 10 existing files
6. Perform complex text searches
7. Generate git commit messages for changes
8. Create a final report with:
   - All operations performed
   - Success/failure count
   - Performance assessment
   - List of all 20 fixes and which you verified working
   - Overall health score (1-100)
   - Recommendation for production use

### Success Criteria:
- ✅ Zero crashes or hangs
- ✅ All operations complete
- ✅ Coherent and accurate throughout
- ✅ Fast response times
- ✅ Error-free execution

---

## EXTREME STRESS TEST REPORT

After completing ALL tests above, provide this comprehensive report:

```
╔════════════════════════════════════════════════════════════╗
║     CLINE v3.37.1 EXTREME STRESS TEST FINAL REPORT        ║
╚════════════════════════════════════════════════════════════╝

Test Date: [date/time]
Model: [your model]
Duration: [estimated time]

═══════════════════════════════════════════════════════════

STRESS TEST RESULTS:

Test 1 - File Operations:        [PASS/FAIL] - [score/10]
Test 2 - Context Torture:         [PASS/FAIL] - [score/10]
Test 3 - Git Under Load:          [PASS/FAIL] - [score/10]
Test 4 - Error Gauntlet:          [PASS/FAIL] - [score/10]
Test 5 - Rapid Commands:          [PASS/FAIL] - [score/10]
Test 6 - Complex Workflow:        [PASS/FAIL] - [score/10]
Test 7 - Memory Retention:        [PASS/FAIL] - [X/5 correct]
Test 8 - Concurrent Tools:        [PASS/FAIL] - [score/10]
Test 9 - Edge Cases:              [PASS/FAIL] - [score/10]
Test 10 - Self-Diagnostic:        [PASS/FAIL] - [score/10]
Final Challenge:                  [PASS/FAIL] - [score/10]

═══════════════════════════════════════════════════════════

OVERALL SCORE: [X/100]

PERFORMANCE METRICS:
- Total Operations: [count]
- Successful Operations: [count]
- Failed Operations: [count]
- Files Created: [count]
- Files Modified: [count]
- Commands Executed: [count]
- Errors Encountered: [count]
- Recovery Success Rate: [percentage]

═══════════════════════════════════════════════════════════

VERIFIED BUG FIXES (from 20 total):

✅ Fix #7490 (Console warnings): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7486 (GLM file editing): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7485 (Codicon font): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7476 (ARM64): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7474 (MCP names): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7470 (Terminal quotes): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7469 (Tool names): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7468 (Ollama cancel): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7467 (Parameters): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7464 (LiteLLM): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7462 (Act mode): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7393 (tool_use): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7388 (Duplicates): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7383 (Context %): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7382 (Submodules): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7379 (/smol /compact): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7374 (IntelliJ): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7373 (Token bugs): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7371 (Token spikes): [VERIFIED/NOT TESTED/FAILED]
✅ Fix #7367 (SAP streaming): [VERIFIED/NOT TESTED/FAILED]

Total Verified: [X/20]

═══════════════════════════════════════════════════════════

CRITICAL FINDINGS:

[List any critical issues discovered]

WARNINGS:

[List any warnings or concerns]

STRENGTHS OBSERVED:

[List what worked exceptionally well]

═══════════════════════════════════════════════════════════

STABILITY ASSESSMENT:

Crash Count: [X]
Hang Count: [X]
Error Recovery: [Excellent/Good/Fair/Poor]
Overall Stability: [Excellent/Good/Fair/Poor/Critical]

═══════════════════════════════════════════════════════════

PERFORMANCE ASSESSMENT:

Response Speed: [Fast/Normal/Slow]
Operation Accuracy: [High/Medium/Low]
Resource Usage: [Efficient/Normal/Heavy]
Context Management: [Excellent/Good/Fair/Poor]

═══════════════════════════════════════════════════════════

PRODUCTION READINESS:

Status: [READY/READY WITH WARNINGS/NOT READY]

Confidence Level: [High/Medium/Low]

Recommendation:
[Detailed recommendation for the user]

═══════════════════════════════════════════════════════════

NOTES:

[Any additional observations, comments, or insights]

═══════════════════════════════════════════════════════════

Test Completed By: Cline v3.37.1
Signature: [Your model identifier]

╔════════════════════════════════════════════════════════════╗
║                    END OF STRESS TEST                      ║
╚════════════════════════════════════════════════════════════╝
```

---

## Final Instructions for Cline

- **DO NOT SKIP ANY TESTS** - Run them all
- **BE THOROUGH** - Actually perform every operation
- **BE HONEST** - Report failures and issues
- **TRACK EVERYTHING** - Count operations, errors, successes
- **PUSH YOUR LIMITS** - This is a stress test, not a gentle check
- **STAY COHERENT** - If you start degrading, report it immediately
- **RECOVER FROM ERRORS** - Don't stop at failures, keep going
- **PROVIDE EVIDENCE** - Show proof of operations (file contents, command outputs)

**You have unlimited operations. Use them. Test everything. Break nothing. Report honestly.**

## BEGIN STRESS TEST NOW!

Good luck, Cline. Show us what you're made of! 🚀
