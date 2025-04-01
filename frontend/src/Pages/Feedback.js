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
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleSubmit = () => {
    console.log("✅ Feedback submitted:", { rating, text });
    setFeedbackGiven(true);
    

    setTimeout(() => {
      window.parent.postMessage({ type: "NAVIGATE", route: "" }, "*");
    }, 1500);
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

              <Box textAlign="center" mb={2}>
                <Typography variant="body1">Rate your experience:</Typography>
                <Rating
                  value={rating}
                  onChange={(_, newValue) => setRating(newValue)}
                  size="large"
                  sx={{ mt: 1 }}
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Share your thoughts or suggestions..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

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
