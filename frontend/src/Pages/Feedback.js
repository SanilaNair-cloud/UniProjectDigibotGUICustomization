/**
 * Feedback – User Feedback Form for DigiBot
 *
 * This component allows users to rate their chatbot experience and submit written feedback.
 * After submission, a thank-you message is shown and the user is redirected back to the main screen.
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Paper,
  Avatar,
  Stack,
  Fade,
} from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";

const Feedback = () => {
  // State variables for rating, feedback text, and submission status
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Handle feedback submission to backend API
  const handleSubmit = async () => {
    const payload = {
      rating,
      text,
      company_id: localStorage.getItem("companyId"), // Dynamically retrieve company ID
    };
    console.log("✅ Submitting feedback for:", payload);

    try {
      const response = await fetch("http://localhost:8000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("✅ Feedback submitted:", payload);
        setFeedbackGiven(true); // Show thank-you message

        // Redirect after short delay
        setTimeout(() => {
          window.parent.postMessage({ type: "NAVIGATE", route: "" }, "*");
        }, 1500);
      } else {
        console.error("❌ Failed to submit feedback:", await response.text());
      }
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 8,
        px: 2,
      }}
    >
      <Fade in timeout={500}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            maxWidth: 500,
            width: "100%",
            bgcolor: "white",
            boxShadow: 4,
          }}
        >
          {/* Feedback Form */}
          {!feedbackGiven ? (
            <>
              <Stack spacing={2} alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
                  <EmojiEmotionsIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" fontWeight={600}>
                  We'd love your feedback!
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  How was your experience with DigiBot? Help us improve.
                </Typography>
              </Stack>

              {/* Rating input */}
              <Box textAlign="center" mb={2}>
                <Typography variant="body1">Rate your experience:</Typography>
                <Rating
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue)}
                  size="large"
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* Feedback text input */}
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Share your thoughts or suggestions..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {/* Submit button */}
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                fullWidth
                sx={{ mt: 3, py: 1.3, fontWeight: 600 }}
                onClick={handleSubmit}
              >
                Submit Feedback
              </Button>
            </>
          ) : (
            // Thank-you message
            <Box textAlign="center" mt={2}>
              <Typography variant="h5" fontWeight={600} color="green" mb={2}>
                🎉 Thank you for your feedback!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We're always working to improve your experience.
              </Typography>
            </Box>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default Feedback;
