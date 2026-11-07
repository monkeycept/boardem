#!/usr/bin/env bash
# SkyLoft local setup: checks Node, installs dependencies, creates .env.local.
set -e

echo "✈️  SkyLoft setup"

NODE_MAJOR=$(node -v 2>/dev/null | sed 's/v\([0-9]*\).*/\1/')
if [ -z "$NODE_MAJOR" ] || [ "$NODE_MAJOR" -lt 18 ]; then
  echo "❌ Node.js 18+ is required (found: $(node -v 2>/dev/null || echo none))"
  exit 1
fi
echo "✅ Node $(node -v)"

npm install

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "📝 Created .env.local — fill it in to enable live mode (optional, see SETUP.md)."
fi

echo ""
echo "All set. Run:  npm run dev   then open http://localhost:5173 and tap 'Use Demo Flight'."
