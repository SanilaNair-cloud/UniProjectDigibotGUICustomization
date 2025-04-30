/**
 * InternalStaffUI – Staff Chat Interface with DigiBot
 *
 * This component provides a chat interface for internal staff to interact with DigiBot.
 * Users can type a message, send it, and view the bot's response.
 *
 * Features:
 * - Stores company ID from localStorage
 * - Sends message to backend API on submit
 * - Displays response from DigiBot
 */

import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const InternalStaffUI = () => {
  // State to hold the input message, chatbot response, and company ID
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [companyId, setCompanyId] = useState("");

  // Load company ID from localStorage on component mount
  useEffect(() => {
    const id = localStorage.getItem("companyId");
    setCompanyId(id || "default123"); // fallback if no ID found
  }, []);

  // Handle sending the message to the backend chatbot API
  const handleSubmit = async () => {
    if (!message.trim()) return; // avoid sending empty messages

    setResponse("✍️ DigiBot is thinking...");

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, company_id: companyId }),
      });

      const data = await res.json();
      setResponse(data.reply || "✅ Received, but no reply found.");
    } catch (err) {
      console.error(err);
      setResponse("⚠️ Failed to get response.");
    }

    setMessage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
        px: 2,
      }}
    >
      {/* Page Title */}
      <Typography variant="h5" gutterBottom align="center">
        Internal Staff Chat
      </Typography>

      {/* Chat input area */}
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 500,
          p: 1,
          mb: 3,
        }}
      >
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          variant="standard"
          InputProps={{ disableUnderline: true }}
        />
        <Button variant="text" onClick={handleSubmit}>
          ➤
        </Button>
      </Paper>

      {/* Chatbot response area */}
      {response && (
        <Typography
          variant="body1"
          sx={{
            background: "#f1f1f1",
            p: 2,
            borderRadius: 2,
            maxWidth: 500,
            textAlign: "left",
          }}
        >
          {response}
        </Typography>
      )}
    </Box>
  );
};

export default InternalStaffUI;
