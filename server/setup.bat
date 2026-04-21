@echo off
REM ============================================================================
REM QUICK START SETUP SCRIPT FOR PEPTS BACKEND API (Windows)
REM ============================================================================
REM This script sets up the backend API environment and dependencies
REM Run this from the server directory: setup.bat
REM ============================================================================

setlocal enabledelayedexpansion

echo.
echo 🚀 PEPTS E-Commerce Backend Setup
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

REM Generate Prisma Client
echo 🔧 Generating Prisma Client...
call npm run prisma:generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma Client
    pause
    exit /b 1
)
echo ✅ Prisma Client generated
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local from .env.example...
    copy .env.example .env.local >nul
    echo ⚠️  IMPORTANT: Edit .env.local with your database credentials!
    echo    File: .env.local
    echo.
) else (
    echo ✅ .env.local already exists
)

echo.
echo 🎉 Setup Complete!
echo.
echo NEXT STEPS:
echo ===========
echo 1. Edit .env.local with your database URL:
echo    - Open .env.local in your favorite editor
echo    - Update DATABASE_URL with your PostgreSQL connection string
echo.
echo 2. Run database migrations:
echo    npm run prisma:migrate
echo.
echo 3. Start the development server:
echo    npm run dev
echo.
echo 4. API will be available at: http://localhost:3000
echo.
echo 5. Test the example endpoint:
echo    curl http://localhost:3000/api/example
echo.
echo 📚 For more information, see README.md
echo.
pause
