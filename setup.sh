#!/bin/bash

# SkyLoft Setup Script
# This script automates the setup process for SkyLoft PWA

set -e

echo "🚀 Welcome to SkyLoft Setup!"
echo "================================"
echo ""

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✅ .env.local created"
        echo ""
        echo "⚠️  IMPORTANT: Edit .env.local with your Firebase credentials:"
        echo "   1. Go to https://console.firebase.google.com"
        echo "   2. Create a new project"
        echo "   3. Enable Firestore and Anonymous Auth"
        echo "   4. Copy your Web app config"
        echo "   5. Paste into .env.local"
        echo ""
    else
        echo "⚠️  .env.example not found. Creating .env.local manually..."
        cat > .env.local << 'EOF'
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
EOF
        echo "✅ .env.local created. Please fill in your Firebase credentials."
        echo ""
    fi
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Create public icons placeholder
echo "🎨 Checking for PWA icons..."
if [ ! -f public/pwa-192x192.png ] || [ ! -f public/pwa-512x512.png ]; then
    echo "⚠️  PWA icons not found in public/"
    echo "   For production, create:"
    echo "   - public/pwa-192x192.png (192x192)"
    echo "   - public/pwa-512x512.png (512x512)"
    echo "   For now, using placeholder emoji icons."
    echo ""
fi

# Ask if user wants to start dev server
echo "🎯 Setup complete!"
echo ""
read -p "Start dev server now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting dev server..."
    echo "   Open http://localhost:5173 in your browser"
    echo "   Click 'Use Demo Flight' to test without Firebase"
    echo ""
    npm run dev
else
    echo ""
    echo "✅ Next steps:"
    echo "   1. Edit .env.local with Firebase credentials"
    echo "   2. Run: npm run dev"
    echo "   3. Open http://localhost:5173"
    echo "   4. Click 'Use Demo Flight' to test"
    echo ""
    echo "📖 For more info, see README.md and SETUP.md"
    echo ""
fi
