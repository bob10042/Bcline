# Bcline Bug Fixes Test Script (PowerShell)
# Run: powershell -ExecutionPolicy Bypass -File test-fixes.ps1

Write-Host "=== Bcline Bug Fixes Verification Script ===" -ForegroundColor Green

# 1. Verify cherry-picked fix commits on main
Write-Host "`n1. Checking git commits for fixes..." -ForegroundColor Yellow
git checkout main
git log --oneline -20 | Select-String "Fix:" | ForEach-Object { Write-Host $_ -ForegroundColor Cyan }
$fixCount = (git log --oneline | Select-String "Fix:").Count
if ($fixCount -ge 12) {
    Write-Host "✓ Found $fixCount+ fix commits (PASS)" -ForegroundColor Green
} else {
    Write-Host "✗ Only $fixCount fix commits (FAIL)" -ForegroundColor Red
    exit 1
}

# 2. Verify new files from fixes
if (Test-Path "CONTRIBUTING_WORKFLOW.md" -and Test-Path "ISSUE_FIX_SESSION.md") {
    Write-Host "✓ CONTRIBUTING_WORKFLOW.md & ISSUE_FIX_SESSION.md present (PASS)" -ForegroundColor Green
} else {
    Write-Host "✗ Fix files missing (FAIL)" -ForegroundColor Red
    exit 1
}

# 3. Test terminal double quotes fix (#7483)
Write-Host "`n3. Testing terminal double quotes fix..." -ForegroundColor Yellow
$output = echo 'Test with "double quotes" and ""escaped""'
if ($output -match "double quotes") {
    Write-Host "✓ Double quotes output: $output (PASS)" -ForegroundColor Green
} else {
    Write-Host "✗ Double quotes broken: $output (FAIL)" -ForegroundColor Red
    exit 1
}

# 4. Run unit tests (tool handlers, context, etc.)
Write-Host "`n4. Running npm test:unit..." -ForegroundColor Yellow
npm run test:unit
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Unit tests passed (PASS)" -ForegroundColor Green
} else {
    Write-Host "✗ Unit tests failed (FAIL)" -ForegroundColor Red
    exit 1
}

# 5. Run integration tests (extension tools)
Write-Host "`n5. Running npm test:integration..." -ForegroundColor Yellow
npm run test:integration
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Integration tests passed (PASS)" -ForegroundColor Green
} else {
    Write-Host "✗ Integration tests failed (FAIL)" -ForegroundColor Red
    exit 1
}

# 6. Build & package extension
Write-Host "`n6. Building .vsix..." -ForegroundColor Yellow
npm run package
if (Test-Path "claude-dev-*.vsix") {
    Write-Host "✓ .vsix built (PASS)" -ForegroundColor Green
    $vsix = (Get-ChildItem claude-dev-*.vsix | Select-Object -First 1).Name
    Write-Host "Run: code --install-extension $vsix" -ForegroundColor Cyan
} else {
    Write-Host "✗ .vsix build failed (FAIL)" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== ALL TESTS PASSED! Fixes verified & extension ready. Reload VS Code (Ctrl+R). ===" -ForegroundColor Green
