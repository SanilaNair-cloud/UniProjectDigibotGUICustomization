# update_sentiment.py
from textblob import TextBlob
from database import SessionLocal
from models import Feedback

def analyze_sentiment(text):
    polarity = TextBlob(text).sentiment.polarity
    if polarity > 0.2:
        return "Positive", polarity
    elif polarity < -0.2:
        return "Negative", polarity
    else:
        return "Neutral", polarity

def update_all_feedback_sentiments():
    db = SessionLocal()
    feedbacks = db.query(Feedback).all()

    for fb in feedbacks:
        if fb.text:  # only if there's text
            sentiment, score = analyze_sentiment(fb.text)
            fb.sentiment = sentiment
            fb.sentiment_score = score
            print(f"✅ Updated ID {fb.id} → {sentiment} ({score:.2f})")

    db.commit()
    db.close()
    print("🎉 All feedback sentiments updated.")

if __name__ == "__main__":
    update_all_feedback_sentiments()
