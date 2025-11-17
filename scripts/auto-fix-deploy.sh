#!/bin/bash
# Auto Fix and Deploy Script
# Usage: ./scripts/auto-fix-deploy.sh "commit message"

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
VSIX_NAME="bcline-fixed-${TIMESTAMP}.vsix"
BRANCH="claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK"

echo "════════════════════════════════════════════════════════════"
echo "🚀 Automated Bug Fix Deployment Pipeline"
echo "════════════════════════════════════════════════════════════"
echo ""

# Function to print colored messages
print_step() {
    echo -e "\n\033[1;36m▶ STEP $1: $2\033[0m"
}

print_success() {
    echo -e "\033[1;32m✅ $1\033[0m"
}

print_error() {
    echo -e "\033[1;31m❌ ERROR: $1\033[0m"
}

print_info() {
    echo -e "\033[1;33mℹ️  $1\033[0m"
}

# Check if in project root
cd "$PROJECT_ROOT" || exit 1

# ============================================================================
# STEP 1: Git Status Check
# ============================================================================
print_step "1" "Checking Git Status"

if [[ -z $(git status -s) ]]; then
    print_error "No changes to commit!"
    echo "Make sure you've applied the bug fix before running this script."
    exit 1
fi

print_success "Changes detected"
git status -s

# ============================================================================
# STEP 2: Git Add and Commit
# ============================================================================
print_step "2" "Committing Changes"

# Get commit message from argument or use default
COMMIT_MSG="${1:-fix: Automated bug fix deployment}"

git add -A

# Extract changed files for commit message
CHANGED_FILES=$(git diff --cached --name-only | head -5)

git commit -m "$(cat <<EOF
${COMMIT_MSG}

**Files Changed**:
${CHANGED_FILES}

🤖 Generated with automated deployment script

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)" 2>&1 | head -10

COMMIT_HASH=$(git rev-parse --short HEAD)
print_success "Committed as ${COMMIT_HASH}"

# ============================================================================
# STEP 3: Push to Remote
# ============================================================================
print_step "3" "Pushing to Remote"

if git push origin "$BRANCH" 2>&1 | grep -q "Everything up-to-date"; then
    print_info "Already up to date"
else
    print_success "Pushed to ${BRANCH}"
fi

# ============================================================================
# STEP 4: Rebuild Extension
# ============================================================================
print_step "4" "Building Extension"

print_info "Running npm run package..."
if npm run package 2>&1 | tail -20; then
    print_success "Build successful"
else
    print_error "Build failed!"
    exit 1
fi

# ============================================================================
# STEP 5: Package VSIX
# ============================================================================
print_step "5" "Packaging VSIX"

print_info "Creating ${VSIX_NAME}..."
if npx @vscode/vsce package --out "$VSIX_NAME" 2>&1 | tail -10; then
    VSIX_SIZE=$(du -h "$VSIX_NAME" | cut -f1)
    print_success "VSIX created: ${VSIX_NAME} (${VSIX_SIZE})"
else
    print_error "Packaging failed!"
    exit 1
fi

# ============================================================================
# STEP 6: Install in VS Code
# ============================================================================
print_step "6" "Installing in VS Code"

if code --install-extension "$VSIX_NAME" --force; then
    print_success "Extension installed"
else
    print_error "Installation failed!"
    exit 1
fi

# ============================================================================
# STEP 7: Summary
# ============================================================================
echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Deployment Complete!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📦 Commit:     ${COMMIT_HASH}"
echo "🌿 Branch:     ${BRANCH}"
echo "📂 VSIX:       ${VSIX_NAME} (${VSIX_SIZE})"
echo "🔧 Installed:  saoudrizwan.claude-dev@3.37.1"
echo ""
echo "🔄 Next Steps:"
echo "   1. Reload VS Code (Ctrl+Shift+P → 'Reload Window')"
echo "   2. Test the bug fix"
echo "   3. Verify no regressions"
echo ""
echo "════════════════════════════════════════════════════════════"
