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

# Kill anything running on port 8000 (FastAPI default)
PORT8000=$(lsof -ti :8000)
if [ ! -z "$PORT8000" ]; then
  echo "⚠️ Port 8000 is already in use. Killing process $PORT8000..."
  kill -9 $PORT8000
  echo "✅ Port 8000 cleared."
fi

# Start Uvicorn backend
echo "🚀 Starting FastAPI backend (Uvicorn)..."
uvicorn Main:app --reload &

cd ..

# FRONTEND SETUP
echo "🌐 Installing frontend (React) dependencies..."
cd frontend

# Kill anything running on port 3000 (React dev server)
PORT3000=$(lsof -ti :3000)
if [ ! -z "$PORT3000" ]; then
  echo "⚠️ Port 3000 is already in use. Killing process $PORT3000..."
  kill -9 $PORT3000
  echo "✅ Port 3000 cleared."
fi

if [ -f "package.json" ]; then
  npm install
  echo "✅ Frontend dependencies installed."

  # Start frontend app
  echo "🚀 Starting React frontend..."
  npm start &
else
  echo "⚠️ package.json not found. Skipping frontend setup."
fi

cd ..

# WEBHOOK SERVER
echo "🔗 Starting Webhook Server..."
cd webhook-server

if [ -f "webhookserver.js" ]; then
  node webhookserver.js &
  echo "✅ Webhook server started."
else
  echo "⚠️ webhookserver.js not found. Skipping webhook server startup."
fi

cd ..

echo "🎉 DigiBot setup complete!"
