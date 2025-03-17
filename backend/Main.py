from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import smtplib
from email.mime.text import MIMEText
from pydantic import BaseModel

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy database (Replace with actual DB lookup)
users_db = {"user@example.com": {"name": "John Doe", "reset_code": "123456"}}

class PasswordResetRequest(BaseModel):
    email: str

def send_reset_email(email: str, reset_code: str):
    sender_email = "your-email@example.com"
    sender_password = "your-email-password"
    recipient_email = email

    message = MIMEText(f"Click the link to reset your password: http://localhost:3000/reset-password/{reset_code}")
    message["Subject"] = "Password Reset Request"
    message["From"] = sender_email
    message["To"] = recipient_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, message.as_string())
        return True
    except Exception as e:
        print(f"Email failed: {e}")
        return False

@app.post("/api/reset-password")
async def reset_password(request: PasswordResetRequest):
    email = request.email.lower()
    
    if email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")

    reset_code = users_db[email]["reset_code"]  # Generate a secure token in a real app

    if send_reset_email(email, reset_code):
        return {"message": "Password reset link sent to your email"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send email")

