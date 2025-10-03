#!/bin/bash

echo "🚀 Starting MERN Portfolio Setup..."
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "🔧 Environment setup..."

# Create frontend .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating frontend .env file..."
    cp env.template .env
    echo "✅ Frontend .env created from template"
else
    echo "✅ Frontend .env already exists"
fi

# Create backend .env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📄 Creating backend .env file..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "# Backend environment variables\nPORT=5000\nMONGODB_URI=mongodb://localhost:27017/portfolio_db\nJWT_SECRET=your_jwt_secret_key_here\nADMIN_EMAIL=admin@portfolio.com\nEMAIL_USER=\nEMAIL_PASS=\nCLOUDINARY_CLOUD_NAME=\nCLOUDINARY_API_KEY=\nCLOUDINARY_API_SECRET=" > backend/.env
    echo "✅ Backend .env created - please update with your values"
else
    echo "✅ Backend .env already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update backend/.env with your MongoDB URI and other values"
echo "2. Start the backend: npm run backend"
echo "3. Start the frontend: npm run dev"
echo "4. Visit http://localhost:5173"

echo ""
echo "💡 For more information, read the README.md file"
