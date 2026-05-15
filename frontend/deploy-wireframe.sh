#!/bin/bash

# Wireframe Deployment Script
# Deploys the static frontend to any static hosting

set -e

echo "🚀 Deploying Vehicle Management Wireframe..."

# Build the project
echo "📦 Building static site..."
npm run build

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist folder not found"
    exit 1
fi

echo "✅ Build complete!"
echo ""
echo "📁 Static files are in the 'dist' folder"
echo ""
echo "Deploy to your preferred platform:"
echo ""
echo "1. Vercel:      npx vercel --prod dist"
echo "2. Netlify:     npx netlify deploy --prod --dir=dist"
echo "3. Surge.sh:    npx surge dist"
echo "4. GitHub Pages: Copy dist contents to gh-pages branch"
echo ""
echo "Or simply upload the 'dist' folder to any static web host."
