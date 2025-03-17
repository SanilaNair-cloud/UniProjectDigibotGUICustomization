import React, { useState } from "react";
import { IconButton, Paper, Typography, Button } from "@mui/material";
import { ChatBubbleOutline, Close, Settings, Star, StarBorder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // To navigate to Admin Settings page

const DigiBot = () => {
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const navigate = useNavigate();

  // Simulating user role (In actual implementation, fetch from SSO)
  const isAdmin = localStorage.getItem("userRole") === "admin";

  // Handle closing chatbot (shows feedback)
  const handleClose = () => {
    setOpen(false);
    setFeedbackOpen(true); // Open feedback form
  };

  // Handle feedback submission
  const handleFeedback = (value) => {
    setRating(value);
    setFeedbackGiven(true);
  };

  return (
    <div>
      {/* Floating Chatbot Icon */}
      {!open && !feedbackOpen && (
        <IconButton
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#007bff",
            color: "white",
            padding: "12px",
            borderRadius: "50px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ChatBubbleOutline fontSize="large" />
        </IconButton>
      )}

      {/* Chatbot Popup Window */}
      {open && (
        <Paper
          elevation={6}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: "600px",
            height: "800px",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
          }}>
            <Typography variant="h6">DigiBot</Typography>

            <div>
              {/* Show Admin Settings Gear Icon Only for Admin Users */}
              {isAdmin && (
                <IconButton onClick={() => navigate("/admin-settings")} style={{ color: "white" }}>
                  <Settings />
                </IconButton>
              )}

              <IconButton onClick={handleClose} style={{ color: "white" }}>
                <Close />
              </IconButton>
            </div>
          </div>

          {/* Chat Content */}
          <div style={{ flex: 1, padding: "12px", overflowY: "auto", backgroundColor: "#f8f9fa" }}>
            <Typography variant="body2" color="textSecondary">
              Chatbot conversation will appear here...
            </Typography>
          </div>

          {/* Footer */}
          <div style={{ padding: "12px", backgroundColor: "white", borderTop: "1px solid #ccc" }}>
            <Typography variant="body2" align="center">Powered by DigiBot</Typography>
          </div>
        </Paper>
      )}

      {/* Feedback Popup After Closing Chatbot */}
      {feedbackOpen && (
        <Paper
          elevation={6}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: "300px",
            height: "200px",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="body1" className="text-gray-800 mb-2">
            Rate your experience:
          </Typography>
          <div>
            {[1, 2, 3, 4, 5].map((num) => (
              <IconButton key={num} onClick={() => handleFeedback(num)}>
                {num <= rating ? <Star color="primary" /> : <StarBorder />}
              </IconButton>
            ))}
          </div>

          {/* Confirmation Message */}
          {feedbackGiven ? (
            <Typography variant="body2" className="text-green-600 mt-2">
              Thank you for your feedback!
            </Typography>
          ) : (
            <Button variant="contained" color="primary" onClick={() => setFeedbackOpen(false)} style={{ marginTop: "10px" }}>
              Close
            </Button>
          )}
        </Paper>
      )}
    </div>
  );
};

export default DigiBot;
