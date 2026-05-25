#!/bin/bash

# ============================================================================
# QUICK START SETUP SCRIPT FOR PEPTS BACKEND API
# ============================================================================
# This script sets up the backend API environment and dependencies
# Run this from the server directory: bash setup.sh
# ============================================================================

set -e

echo "🚀 PEPTS E-Commerce Backend Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate
echo "✅ Prisma Client generated"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  IMPORTANT: Edit .env.local with your database credentials!"
    echo ""
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "NEXT STEPS:"
echo "==========="
echo "1. Edit .env.local with your database URL:"
echo "   nano .env.local"
echo ""
echo "2. Run database migrations:"
echo "   npm run prisma:migrate"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. API will be available at: http://localhost:3000"
echo ""
echo "5. Test the example endpoint:"
echo "   curl http://localhost:3000/api/example"
echo ""
echo "📚 For more information, see README.md"
