#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Send automated prompts to Cline web UI using Playwright

.DESCRIPTION
    This script allows you to programmatically send prompts to the Cline extension
    running in VSCode. It uses Playwright to interact with the web UI.

.PARAMETER Prompt
    The prompt text to send to Cline

.PARAMETER PromptsFile
    Path to a file containing multiple prompts (one per line)

.PARAMETER HeadlessMode
    Run browser in headless mode (no visible window)

.PARAMETER WaitTime
    How long to wait after sending prompt (in seconds). Default: 30

.EXAMPLE
    .\Send-ClinePrompt.ps1 -Prompt "Run the v2 prompt tests again"

.EXAMPLE
    .\Send-ClinePrompt.ps1 -PromptsFile "test-prompts.txt"

.EXAMPLE
    .\Send-ClinePrompt.ps1 -Prompt "Hello Cline" -HeadlessMode -WaitTime 10
#>

param(
    [Parameter(Position = 0)]
    [string]$Prompt = "Hello, Cline!",

    [Parameter()]
    [string]$PromptsFile,

    [Parameter()]
    [switch]$HeadlessMode,

    [Parameter()]
    [int]$WaitTime = 30
)

# Colors for output
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { param($msg) Write-Host $msg -ForegroundColor Red }

Write-Info "[*] Cline Prompt Injector"
Write-Info "========================`n"

# Check if we're in the Bcline directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir

# Check if Playwright is installed
$playwrightInstalled = Test-Path "$rootDir\node_modules\@playwright"
if (-not $playwrightInstalled) {
    Write-Error "[ERROR] Playwright not installed. Run: npm install"
    exit 1
}

# Determine prompts to send
$prompts = @()
if ($PromptsFile) {
    if (Test-Path $PromptsFile) {
        $prompts = Get-Content $PromptsFile | Where-Object { $_ -and $_.Trim() -ne "" }
        Write-Info "[+] Loaded $($prompts.Count) prompts from: $PromptsFile"
    } else {
        Write-Error "[ERROR] Prompts file not found: $PromptsFile"
        exit 1
    }
} else {
    $prompts = @($Prompt)
}

Write-Info "`n[>] Prompts to send:"
$prompts | ForEach-Object { Write-Host "   - $_" }
Write-Info ""

# Run the Playwright test
Write-Info "[!] Starting Playwright..."

$env:CLINE_TEST_PROMPTS = ($prompts -join "|")
$env:HEADLESS_MODE = if ($HeadlessMode) { "true" } else { "false" }
$env:WAIT_TIME = $WaitTime

# Run specific test
Push-Location $rootDir
try {
    npx playwright test src/test/e2e/automated-prompts.test.ts --headed --reporter=list
    Write-Success "`n[OK] All prompts sent successfully!"
} catch {
    Write-Error "`n[ERROR] Error running Playwright test: $_"
    exit 1
} finally {
    Pop-Location
}

Write-Success "[DONE] Complete!"
