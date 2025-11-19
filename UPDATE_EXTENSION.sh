#!/bin/bash
# Simple script to update and rebuild Bcline extension with all fixes

echo "🔄 Fetching latest from GitHub..."
git fetch origin

echo "📦 Switching to branch with all fixes..."
git checkout claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

echo "⬇️ Pulling latest changes..."
git pull origin claude/continue-next-tasks-017snsDg61FyKa5vVUSd4wpK

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building VSIX..."
npm run package

echo "💾 Backing up VSIX..."
mkdir -p builds
cp claude-dev-*.vsix builds/

echo "🔌 Installing extension..."
code --install-extension claude-dev-*.vsix --force

echo "✅ Done! Reload VS Code to use updated extension with all your fixes."
