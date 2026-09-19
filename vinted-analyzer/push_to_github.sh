#!/bin/bash
set -e

# Usage: ./push_to_github.sh https://github.com/USERNAME/vinted-profit-analyzer-ai.git

REPO_URL=$1

if [ -z "$REPO_URL" ]; then
  echo "❌ Usage: ./push_to_github.sh <GITHUB_REPO_URL>"
  echo "   Exemple: ./push_to_github.sh https://github.com/tonuser/vinted-profit-analyzer-ai.git"
  exit 1
fi

echo "🔗 Configuration remote origin -> $REPO_URL"
cd "$(dirname "$0")"

# Remove existing origin if exists
git remote remove origin 2>/dev/null || true

git remote add origin "$REPO_URL"
git branch -M main

echo "📦 Push vers GitHub..."
git push -u origin main

echo ""
echo "✅ Terminé ! Ton projet est sur GitHub : $REPO_URL"
echo "🌐 Prochaine étape : Connecte à Vercel https://vercel.com/new"
