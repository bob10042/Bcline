# Auto Fix and Deploy Script (PowerShell)
# Usage: .\scripts\auto-fix-deploy.ps1 "commit message"

param(
    [string]$CommitMessage = "fix: Automated bug fix deployment"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$VsixName = "bcline-fixed-$Timestamp.vsix"
$Branch = "claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK"

# Color functions
function Write-Step {
    param([int]$Number, [string]$Message)
    Write-Host "`n▶ STEP ${Number}: $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ ERROR: $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Yellow
}

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 Automated Bug Fix Deployment Pipeline" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Change to project root
Set-Location $ProjectRoot

# ============================================================================
# STEP 1: Git Status Check
# ============================================================================
Write-Step 1 "Checking Git Status"

$gitStatus = git status -s
if (-not $gitStatus) {
    Write-Error "No changes to commit!"
    Write-Host "Make sure you've applied the bug fix before running this script."
    exit 1
}

Write-Success "Changes detected"
git status -s

# ============================================================================
# STEP 2: Git Add and Commit
# ============================================================================
Write-Step 2 "Committing Changes"

git add -A

# Get changed files
$changedFiles = git diff --cached --name-only | Select-Object -First 5 | Out-String

$commitBody = @"
$CommitMessage

**Files Changed**:
$changedFiles

🤖 Generated with automated deployment script

Co-Authored-By: Claude <noreply@anthropic.com>
"@

git commit -m $commitBody 2>&1 | Select-Object -First 10

$commitHash = git rev-parse --short HEAD
Write-Success "Committed as $commitHash"

# ============================================================================
# STEP 3: Push to Remote
# ============================================================================
Write-Step 3 "Pushing to Remote"

$pushOutput = git push origin $Branch 2>&1 | Out-String
if ($pushOutput -match "Everything up-to-date") {
    Write-Info "Already up to date"
} else {
    Write-Success "Pushed to $Branch"
}

# ============================================================================
# STEP 4: Rebuild Extension
# ============================================================================
Write-Step 4 "Building Extension"

Write-Info "Running npm run package..."
try {
    npm run package 2>&1 | Select-Object -Last 20
    Write-Success "Build successful"
} catch {
    Write-Error "Build failed!"
    exit 1
}

# ============================================================================
# STEP 5: Package VSIX
# ============================================================================
Write-Step 5 "Packaging VSIX"

Write-Info "Creating $VsixName..."
try {
    npx @vscode/vsce package --out $VsixName 2>&1 | Select-Object -Last 10
    $vsixSize = (Get-Item $VsixName).Length / 1MB
    $vsixSizeStr = "{0:N2} MB" -f $vsixSize
    Write-Success "VSIX created: $VsixName ($vsixSizeStr)"
} catch {
    Write-Error "Packaging failed!"
    exit 1
}

# ============================================================================
# STEP 6: Install in VS Code
# ============================================================================
Write-Step 6 "Installing in VS Code"

try {
    code --install-extension $VsixName --force
    Write-Success "Extension installed"
} catch {
    Write-Error "Installation failed!"
    exit 1
}

# ============================================================================
# STEP 7: Summary
# ============================================================================
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Commit:     $commitHash"
Write-Host "🌿 Branch:     $Branch"
Write-Host "📂 VSIX:       $VsixName ($vsixSizeStr)"
Write-Host "🔧 Installed:  saoudrizwan.claude-dev@3.37.1"
Write-Host ""
Write-Host "🔄 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Reload VS Code (Ctrl+Shift+P → 'Reload Window')"
Write-Host "   2. Test the bug fix"
Write-Host "   3. Verify no regressions"
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
