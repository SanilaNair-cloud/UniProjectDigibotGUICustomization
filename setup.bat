@echo off
echo 🔧 Starting DigiBot project setup...

REM --- BACKEND SETUP ---
cd backend

IF NOT EXIST venv (
    echo 🐍 Creating virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created.
) ELSE (
    echo ✅ Virtual environment already exists.
)

echo 📦 Activating virtual environment and installing dependencies...
call venv\Scripts\activate
pip install -r requirements.txt

REM Start FastAPI backend in a new terminal window
echo 🚀 Starting FastAPI backend (Uvicorn)...
start cmd /k "cd backend && call venv\Scripts\activate && uvicorn Main:app --reload"

cd ..

REM --- FRONTEND SETUP ---
cd frontend

IF EXIST package.json (
    echo 🌐 Installing frontend dependencies...
    npm install
    echo ✅ Frontend dependencies installed.

    REM Start React frontend in a new terminal window
    echo 🚀 Starting React frontend...
    start cmd /k "cd frontend && npm start"
) ELSE (
    echo ⚠️ package.json not found. Skipping frontend setup.
)

cd ..

REM --- WEBHOOK SERVER SETUP ---
cd webhook-server

IF EXIST webhookserver.js (
    echo 📦 Ensuring webhook server dependencies are installed...

    IF NOT EXIST package.json (
        echo 🧩 Creating package.json...
        npm init -y
    )

    echo 📦 Installing express locally...
    npm install express

    echo 🔗 Starting Webhook Server...
    start cmd /k "cd webhook-server && node webhookserver.js"
    echo ✅ Webhook server started.
) ELSE (
    echo ⚠️ webhookserver.js not found. Skipping webhook server startup.
)

cd ..


