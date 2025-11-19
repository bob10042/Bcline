#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Quick test of automated prompt injection

.DESCRIPTION
    Simplified script to quickly test sending a prompt to Cline.
    This is a lightweight wrapper around the Playwright tests.

.EXAMPLE
    .\quick-prompt-test.ps1
    # Uses default prompt: "Run the v2 prompt tests again"

.EXAMPLE
    .\quick-prompt-test.ps1 "Hello, Cline! What's the current time?"
#>

param(
    [Parameter(Position = 0)]
    [string]$Prompt = "Run the v2 prompt tests again"
)

Write-Host "`n[*] Quick Prompt Test for Cline" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "[>] Prompt to send: " -NoNewline -ForegroundColor Yellow
Write-Host "$Prompt`n" -ForegroundColor White

Write-Host "[*] Setting up environment..." -ForegroundColor Gray
$env:CLINE_TEST_PROMPT = $Prompt

Write-Host "[!] Launching Playwright test...`n" -ForegroundColor Green

# Run the single prompt test
npx playwright test `
    src/test/e2e/automated-prompts.test.ts `
    --grep "Send single custom prompt" `
    --headed `
    --reporter=list

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[OK] Test completed successfully!" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Test failed with exit code: $LASTEXITCODE" -ForegroundColor Red
}

Write-Host "`n[TIP] Check AUTOMATED_PROMPTS_README.md for more advanced usage`n" -ForegroundColor Cyan
