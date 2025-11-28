# Nuvio Deployment Script
# This script prepares and deploys your Nuvio app

Write-Host "🎵 Nuvio Deployment Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Fix audio file names
Write-Host "Step 1: Fixing audio file names..." -ForegroundColor Yellow
if (Test-Path "fix-audio-names.ps1") {
    .\fix-audio-names.ps1
} else {
    Write-Host "⚠️  fix-audio-names.ps1 not found. Skipping..." -ForegroundColor Yellow
}
Write-Host ""

# Step 2: Install dependencies
Write-Host "Step 2: Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host ""

# Step 3: Run tests
Write-Host "Step 3: Running tests..." -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}
Write-Host "✅ All tests passed!" -ForegroundColor Green
Write-Host ""

# Step 4: Build for production
Write-Host "Step 4: Building for production..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix errors." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 5: Deployment options
Write-Host "Step 5: Choose deployment method:" -ForegroundColor Yellow
Write-Host "1. Vercel (Recommended)" -ForegroundColor White
Write-Host "2. Netlify" -ForegroundColor White
Write-Host "3. Manual (just build, I'll deploy myself)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
        if (Get-Command vercel -ErrorAction SilentlyContinue) {
            vercel --prod
        } else {
            Write-Host "⚠️  Vercel CLI not installed." -ForegroundColor Yellow
            Write-Host "Install it with: npm install -g vercel" -ForegroundColor White
            Write-Host "Then run: vercel --prod" -ForegroundColor White
        }
    }
    "2" {
        Write-Host "Deploying to Netlify..." -ForegroundColor Cyan
        if (Get-Command netlify -ErrorAction SilentlyContinue) {
            netlify deploy --prod
        } else {
            Write-Host "⚠️  Netlify CLI not installed." -ForegroundColor Yellow
            Write-Host "Install it with: npm install -g netlify-cli" -ForegroundColor White
            Write-Host "Then run: netlify deploy --prod" -ForegroundColor White
        }
    }
    "3" {
        Write-Host "✅ Build complete! Your files are in the 'dist' folder." -ForegroundColor Green
        Write-Host "Upload the 'dist' folder to your hosting provider." -ForegroundColor White
    }
    default {
        Write-Host "Invalid choice. Build complete, deploy manually." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Deployment process complete!" -ForegroundColor Green
Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
