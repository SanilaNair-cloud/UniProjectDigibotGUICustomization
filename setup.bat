@echo off
echo 🔧 Starting DigiBot project setup...

REM --- BACKEND SETUP ---
cd backend

IF NOT EXIST venv (
    echo 🐍 Creating virtual environment...
    python -m venv venv
) ELSE (
    echo ✅ Virtual environment already exists.
)

echo 📦 Activating virtual environment and installing dependencies...
call venv\Scripts\activate
pip install -r requirements.txt

cd ..

REM --- FRONTEND SETUP ---
cd frontend
IF EXIST package.json (
    echo 🌐 Installing frontend dependencies...
    npm install
) ELSE (
    echo ⚠️ package.json not found. Skipping frontend setup.
)
cd ..

echo ✅ All set! You're ready to run the project! 🎉
pause
