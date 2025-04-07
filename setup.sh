#!/bin/bash

echo "🔧 Starting DigiBot project setup..."

# BACKEND SETUP
echo "🐍 Setting up Python backend virtual environment..."
cd backend

if [ ! -d "venv" ]; then
  python3 -m venv venv
  echo "✅ Virtual environment created."
else
  echo "✅ Virtual environment already exists."
fi

# Activate the virtual environment
source venv/bin/activate

# Install Python requirements
echo "📦 Installing Python dependencies from requirements.txt..."
pip install -r requirements.txt

cd ..

# FRONTEND SETUP
echo "🌐 Installing frontend (React) dependencies..."
cd frontend

if [ -f "package.json" ]; then
  npm install
  echo "✅ Frontend dependencies installed."
else
  echo "⚠️ package.json not found. Skipping frontend setup."
fi

cd ..

echo "✅ All set! You're ready to run the project! 🎉"
