

#  README FILE of DigiBotGUICustomization

A full stack DigiBot interface embedded into a company portal, which supports the below:

- Company-specific **admin customization** (branch logo, typography, custom audience, tone of voice)
- Secure **SSO-based authentication** using RSA JWT
- Public-facing DigiBot and internal **staff-facing UI**
- DigiMark Super Admin only **feedback collection** and sentiment dashboard
- Real-time **webhook integration** for dynamic backend responses.
- One-click setup using `setup.bat` / `setup.sh`

# Features
SSO Authentication: Secure login for admins and users using JWT and RSA encryption.
RBAC - Role based access control for admin and user 
-Hide Gear icon(admin settings) for Normal User
-Show Gear icon(admin settings) for admin only
Admin Customization: Company-specific branding – upload logo, customize background, typography settings, and Digibot tone and audience.
Embedded DigiBot: DigiBot integrated directly into the company portal UI.
Internal Staff UI: A simple google like in a sense, full page chatbot interface for internal staff, accessible without separate login.
Feedback Collection: User feedback (rating + comments) stored with sentiment analysis using TextBlob.
DigiMark Admin Dashboard: Centralized view of feedback data with sentiment classification, available only to DigiMark superadmin.
Webhook Integration: Prepared for real-time query relay to n8n-based intelligent response generator.
One-click Setup: Platform independent setup using setup.sh or setup.bat.
Performance Metrics: Integrated reportWebVitals.js for Core Web Vitals monitoring (CLS, FID, FCP, LCP, TTFB).
Swagger Doc to test api end points

# Webhook Integration (Important Note)

The webhook POST to the n8n workflow is not yet functional in production . The /chat API endpoint is fully implemented and tested using mock responses, the actual webhook URL provided by the client has not been activated.Once the client's n8n workflow is made live, DigiBot will forward user queries dynamically  with company-specific custom audience and tone of voice data which will provide intelligent AI generated responses via the webhook integration.

# Technologies Used
------------------------------
Frontend: React.js + Material UI, React Router DOM
Backend: FastAPI (Python)
Database: PostgreSQL (via psycopg2)
Webhook Integration: Node.js (Express)
Authentication: JWT (via RSA encryption)
File Upload: multipart/form-data for logo
Image Cropping: react-easy-crop
Feedback Analysis and dashboard: TextBlob + NLTK , chart.js

## Project Folder Structure

UniProjectDigibotGUICustomization/
│
├── .gitignore                  ← Git ignore rules for dependencies and compiled files
├── README.md
├── setup.bat                   ← Windows setup script
├── setup.sh                    ← macOS/Linux setup script
│
├── backend/
│   ├── __pycache__/            ←  (auto-generated Python cache)
│   ├── keys/
│   │   ├── private.pem         ← RSA Private Key for JWT
│   │   └── public.pem          ← RSA Public Key for JWT
│   ├── uploads/                ← Company logos uploaded locally
│   ├── venv/                   ←  Python virtual environment (will be in .gitignore)
│   ├── database.py             ← DB connection logic
│   ├── Main.py                 ← FastAPI main entry point
│   ├── models.py               ← SQLAlchemy DB models
│   ├── requirements.txt        ←  backend  
│   ├── rsa_utils.py            ← RSA/JWT utility functions
│   └── schemas.py              ← Pydantic schemas for request/response
│
├── frontend/
│   ├── node_modules/           ←  Auto installed, ignores in Git
│   ├── public/
│   │   ├── Images/
│   │   │   └── speech-bubble.png
│   │   ├── DigiBot.js          ← Embedded DigiBot widget script
│   │   ├── index.html          ← React entry template
│   │   ├── manifest.json       ← Web app metadata
│   │   └── public.pem          ← Public key for JWT decoding in frontend
│   ├── src/
│   │   ├── Components/         ← Shared UI components
│   │   └── Pages/
│   │       ├── AdminSettings.js
│   │       ├── CompanyPortal.js
│   │       ├── DigiMarkAdminDashboard.js
│   │       ├── DigiMarkAdminLogin.js
│   │       ├── Feedback.js
│   │       ├── FullPageDigibot.js
│   │       ├── InternalStaffUI.js
│   │       └── RequireSuperAdmin.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── reportWebVitals.js  ← For Performace Testing 
│   ├── package.json
│   ├── package-lock.json
│   └── postcss.config.js
│
├── webhook-server/
│   ├── node_modules/           ←  Auto-installed, ignores in Git
│   ├── package.json
│   ├── package-lock.json
│   └── webhookserver.js        ← Express webhook 

# Setup Instructions
The DigiBot platform supports one click setup for local development using the included automation scripts.

Prerequisite
------------
- Python 3.11+
- Node.js 16+
- PostgreSQL running locally (update credentials in database.py)

For Windows(setup.bat)
----------------------
This will do the below
- Navigates to the backend folder and creates a Python virtual environment (venv) if it does not exist.
- Activates the virtual environment and installs all required backend dependencies from requirements.txt.
- Starts the FastAPI server using Uvicorn on http://localhost:8000.
- Navigates to the frontend folder and installs React dependencies through npm install.
- Starts the React development server on http://localhost:3000 .
- Navigates to the webhook-server folder, initializes package.json if missing, installs Express, and starts the webhook server   through node webhookserver.js.
- Launch at http://localhost:3000/company-portal in the default browser.

Displays a message that all services are launched.

For Mac(setup.sh)
----------------------
- Navigates to the backend folder and creates a Python virtual environment (venv) if it does not exist.
- Activates the virtual environment and installs backend dependencies from requirements.txt.
- Kills any process running on port 8000 and starts the FastAPI backend using Uvicorn in the background.
- Navigates to the frontend folder, kills any process on port 3000, installs frontend dependencies using npm install, and starts the React frontend in the background.
- Navigates to the webhook-server folder and starts the webhook server using node webhookserver.js if it exists.
- Displays a success message when all services are up and running and opens at http://localhost:3000/company-portal in the default browser..

Once the automation script is executed, it opens http://localhost:3000/company-portal in the browser, displaying the Company Portal interface. This simulates the company’s login portal with a secure SSO-based environment.

To initiate the embedded DigiBot experience into the company portal, http://localhost:8000 must be accessed in the browser to generate a secure JWT token and redirect back to the portal with the token as a query parameter. This activates the personalized chatbot experience within the company portal interface.

# Manual Set up Instruction 
-----------------------------
---Backend Setup---
cd backend
python3 -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn Main:app --reload

---Frontend Setup---
cd frontend
npm install
npm start

---Webhook Server Setup---
cd webhook-server
npm install express
node webhookserver.js

--Database Access Setup--
When the FastAPI backend is launched, it will automatically create the required tables (feedback, admin_settings) in your PostgreSQL database if they don’t already exist. Make sure the database is created and the credentials in database.py are valid.

# Manual Verify Database and Tables (PostgreSQL)
-------------------------------------------------
After running uvicorn Main:app --reload
Open  postgress shell or terminal
psql -U digibotuser -d digibotdb (replace postgres with your DB username if different)
\c digibot; (This connects to the digibot database. Replace it with your actual DB name if different.)
\dt (list all tables)
\d admin_settings or \d feedback (View a table schema)
\q (exit)

# Testing
FastAPI endpoints can be tested via Swagger at:
http://localhost:8000/docs

Notes:
reportWebVitals.js is used to measure frontend performance metrics such as FCP, LCP, CLS, FID, and TTFB using the web-vitals package.

Authors
TechSphere Team – Developed as part of the CSC6200 Capstone Project

Team Members:
- Amrit Regmi
- Megha Padmajan
- Sanila Nair
- Stalvin Mathew
- Vidya Vijayan












