@echo off
REM DigiBot Setup Launcher — ANSI encoding, run in CMD

cd /d %~dp0
echo Starting DigiBot setup...
echo.

REM --- BACKEND ---
if exist backend (
    echo [Backend] setting up...
    pushd backend

    if not exist venv (
        echo  Creating virtual environment...
        python -m venv venv
    )

    echo  Installing backend dependencies...
    call venv\Scripts\activate
    pip install --upgrade pip
    pip install -r requirements.txt

    echo  Launching FastAPI on http://localhost:8000...
    start "FastAPI" cmd /k "call venv\Scripts\activate && uvicorn Main:app --host 127.0.0.1 --port 8000 --reload"
    popd
) else (
    echo [Backend] folder not found — skipping.
)
echo.

REM --- FRONTEND ---
if exist frontend (
    echo [Frontend] setting up...
    pushd frontend

    if exist package.json (
        echo  Installing frontend dependencies...
        npm install

        echo  Launching React on http://localhost:3000...
        start "React" cmd /k "set PORT=3000&& npm start"
    ) else (
        echo [Frontend] package.json not found — skipping.
    )

    popd
) else (
    echo [Frontend] folder not found — skipping.
)
echo.

REM --- WEBHOOK SERVER ---
if exist webhook-server (
    echo [Webhook] setting up...
    pushd webhook-server

    if not exist package.json (
        echo  Creating package.json...
        npm init -y
    )

    echo  Installing express...
    npm install express

    echo  Launching webhook server...
    start "Webhook" cmd /k "node webhookserver.js"
    popd
) else (
    echo [Webhook] folder not found — skipping.
)
echo.

REM --- OPEN BROWSER ---
echo Opening browser to FastAPI at http://localhost:8000
start "" "http://localhost:8000"
echo.

echo All services launched. Check the new CMD windows for logs.
pause
