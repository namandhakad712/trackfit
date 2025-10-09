#!/bin/bash

# RailTrack QR Setup Script
# This script helps you set up the project quickly

echo "🚂 RailTrack QR Setup Script"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "📝 Creating .env.local from .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local"
        echo ""
        echo "⚠️  IMPORTANT: Please update .env.local with your Supabase credentials!"
        echo "   1. Go to https://app.supabase.com"
        echo "   2. Select your project"
        echo "   3. Go to Settings → API"
        echo "   4. Copy your credentials to .env.local"
        echo ""
    else
        echo "❌ .env.example not found"
        exit 1
    fi
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Check if Supabase CLI is installed
echo "🔍 Checking for Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found"
    echo "📝 Installing Supabase CLI..."
    npm install -g supabase
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Supabase CLI"
        echo "   You can install it manually: npm install -g supabase"
    else
        echo "✅ Supabase CLI installed"
    fi
else
    echo "✅ Supabase CLI is installed"
fi

echo ""
echo "=============================="
echo "✅ Setup Complete!"
echo "=============================="
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Link to your Supabase project: npx supabase link --project-ref your-project-ref"
echo "3. Push database migrations: npx supabase db push"
echo "4. Run the development server: npm run dev"
echo ""
echo "📚 For more information, see README.md"
echo ""
