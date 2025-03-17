import React, { useState } from "react";
import { Button, TextField, Typography, Paper, Grid, IconButton, MenuItem } from "@mui/material";
import { Settings, Star, StarBorder } from "@mui/icons-material";

// Chatbot Component
const Chatbot = () => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [rating, setRating] = useState(0);

  const handleFeedback = (value) => {
    setRating(value);
    setFeedbackGiven(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Paper elevation={6} className="p-6 rounded-lg shadow-lg bg-white w-full max-w-md">
        {/* Chatbot Header */}
        <div className="flex justify-between items-center mb-3">
          <Typography variant="h6" className="font-bold text-gray-800">Digi Chatbot</Typography>
          <IconButton color="primary" onClick={() => window.location.href = "/admin-settings"}>
            <Settings />
          </IconButton>
        </div>

        {/* Chatbot Interaction Area (Placeholder) */}
        <div className="border p-4 rounded h-64 overflow-y-auto bg-gray-50">
          <Typography variant="body2" className="text-gray-600">Chatbot conversation will appear here...</Typography>
        </div>

        {/* Feedback Section */}
        {!feedbackGiven ? (
          <div className="mt-4">
            <Typography variant="body1" className="text-gray-800 mb-2">Rate your experience:</Typography>
            <div>
              {[1, 2, 3, 4, 5].map((num) => (
                <IconButton key={num} onClick={() => handleFeedback(num)}>
                  {num <= rating ? <Star color="primary" /> : <StarBorder />}
                </IconButton>
              ))}
            </div>
          </div>
        ) : (
          <Typography variant="body2" className="text-green-600 mt-2">Thank you for your feedback!</Typography>
        )}
      </Paper>
    </div>
  );
};

export default Chatbot;
