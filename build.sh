#!/bin/bash

echo "🚀 Building MERN Portfolio for Production..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
    echo "📁 Build files created in 'dist' directory"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf portfolio-build.tar.gz dist/ backend/ package.json vercel.json

echo "✅ Production build complete!"
echo "📦 Deployment package: portfolio-build.tar.gz"
echo ""
echo "🚀 Next steps:"
echo "1. Deploy backend to Render"
echo "2. Deploy frontend to Vercel"
echo "3. Update environment variables"
