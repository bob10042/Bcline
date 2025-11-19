# Bcline Bug Reports

This directory contains comprehensive bug reports, test suites, and documentation for issues found in Bcline.

---

## Active Bug Reports

### 1. File Truncation During Diff/Edit Operations

**Directory:** `diff-truncation-issue/`
**Severity:** HIGH - Data Loss
**Date Reported:** 2025-11-16
**Status:** Open

**GitHub Issues:**
- Fork: https://github.com/bob10042/Bcline/issues/1
- Upstream: https://github.com/cline/cline/issues/7493

**Summary:**
Bcline truncates files when applying diff/edits from OpenRouter models, despite the models generating complete, correct code.

**Test Results:**
- Sherlock via Direct API: ✅ 100% success (5/5 tests)
- Claude via Claude Code: ✅ 100% success (11/11 tests)
- Sherlock via Bcline: ❌ File truncation

**Root Cause:** Bug in Bcline's diff/edit implementation

**Quick Test:**
```bash
cd diff-truncation-issue
python test_sherlock_diff_agent.py --api-key YOUR_OPENROUTER_KEY
```

**Full Report:** [diff-truncation-issue/README.md](diff-truncation-issue/README.md)

---

## How to Use This Directory

### For Bug Investigation

1. Navigate to the specific bug directory
2. Read the README.md for overview
3. Review test files and results
4. Run automated tests if available

### For Bug Reporting

When reporting a new bug:

1. Create a new directory: `bug-reports/your-bug-name/`
2. Include:
   - README.md (overview and summary)
   - Test files (reproduction steps)
   - Results (logs, screenshots)
   - Analysis (root cause if known)
3. Create GitHub issue
4. Link to bug report directory

### For Bug Fixing

1. Review the bug report directory
2. Run any automated tests
3. Implement fix
4. Re-run tests to verify
5. Update bug report with results

---

## Bug Report Template

```
bug-reports/
└── your-bug-name/
    ├── README.md                  (Overview and summary)
    ├── test-files/                (Reproduction files)
    ├── results/                   (Test results, logs)
    ├── analysis/                  (Root cause analysis)
    └── fixes/                     (Proposed/tested fixes)
```

---

## Statistics

### Total Bugs Reported: 1

| Bug | Severity | Status | Date |
|-----|----------|--------|------|
| Diff/Edit Truncation | HIGH | Open | 2025-11-16 |

### Test Coverage

- **Total Tests Run:** 16
- **Success Rate:** 100% (via direct API)
- **Bcline Success Rate:** 0% (truncation occurs)

---

## Contributing

If you find a bug:

1. Document it thoroughly
2. Create reproducible test case
3. Add to this directory
4. Create GitHub issue
5. Link the two together

---

## Contact

For questions about bug reports:
- **GitHub Issues:** https://github.com/bob10042/Bcline/issues
- **Upstream:** https://github.com/cline/cline/issues

---

**Last Updated:** 2025-11-16
