import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const InternalStaffUI = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [companyId, setCompanyId] = useState("");


  useEffect(() => {
    const id = localStorage.getItem("companyId");
    setCompanyId(id || "default123");
  }, []);

  const handleSubmit = async () => {
    if (!message.trim()) return;

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
      <Typography variant="h5" gutterBottom align="center">
        Internal Staff Chat
      </Typography>

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
