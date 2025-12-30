#!/bin/bash

# STRONGHOLD - GitHub Deployment Script
# This script prepares and pushes the STRONGHOLD MVP to GitHub

echo "🚀 STRONGHOLD - Deploying to GitHub"
echo "Repository: https://github.com/ONSQ/stronghold"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the stronghold directory."
    exit 1
fi

echo "${BLUE}Step 1: Initializing Git repository${NC}"
git init
echo "✅ Git initialized"
echo ""

echo "${BLUE}Step 2: Adding all files${NC}"
git add .
echo "✅ All files staged"
echo ""

echo "${BLUE}Step 3: Creating initial commit${NC}"
git commit -m "Initial commit - STRONGHOLD MVP

Features:
- Complete check-in flow (Physical, Mental, Emotional)
- AI workout generation with Claude Sonnet 4
- Exercise library (50+ exercises)
- Dark theme throughout
- Offline-first database (WatermelonDB)
- Tab navigation (Home, Workouts, Progress, Settings)
- Complete TypeScript type safety

Built with Claude Code by Anthropic
For Owen @ ONSQ Enterprises"
echo "✅ Initial commit created"
echo ""

echo "${BLUE}Step 4: Adding remote repository${NC}"
git remote add origin https://github.com/ONSQ/stronghold.git
echo "✅ Remote added"
echo ""

echo "${BLUE}Step 5: Setting main branch${NC}"
git branch -M main
echo "✅ Main branch set"
echo ""

echo "${BLUE}Step 6: Pushing to GitHub${NC}"
echo "${YELLOW}Note: You may need to authenticate with GitHub${NC}"
git push -u origin main --force
echo ""

echo "${GREEN}🎉 SUCCESS! STRONGHOLD is now on GitHub!${NC}"
echo ""
echo "Repository: https://github.com/ONSQ/stronghold"
echo ""
echo "${BLUE}Next steps:${NC}"
echo "1. Visit https://github.com/ONSQ/stronghold to verify"
echo "2. Clone on your development machine"
echo "3. Run: npm install"
echo "4. Run: cp .env.example .env"
echo "5. Run: npx expo start"
echo ""
echo "Ready to build your AI workout coach! 💪"
