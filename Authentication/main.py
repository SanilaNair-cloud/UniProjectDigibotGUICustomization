from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Authentication API is running!"}

# Run the server
# uvicorn authentication.main:app --reload
