/**
 * FullPageDigibot – Fullscreen Floating Chatbot Component
 *
 * This component renders the DigiBot chat interface in a fixed floating window.
 * It listens for user data from the parent window, fetches admin settings,
 * handles sending/receiving chat messages, and shows branding and theming per company.
 */

import React, { useEffect, useRef, useState } from "react";
import { keyframes } from '@emotion/react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
  Avatar,
} from "@mui/material";
import { Settings, Close, Send } from "@mui/icons-material";

const FullPageDigibot = () => {
  // Refs and state variables
  const containerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [greeting, setGreeting] = useState("");
  const [theme, setTheme] = useState({});
  const [version, setVersion] = useState(0); // Forces re-render when theme updates
  const isEmbedded = window.self !== window.top;

  // Animation for sliding chatbot into view
  const slideUp = keyframes`
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  `;

  // Fetch company-specific chatbot UI settings
  const fetchSettings = async (companyId, userId) => {
    try {
      const res = await fetch(`http://localhost:8000/admin-settings/${companyId}`);
      const settings = await res.json();
      setLogoUrl(`http://localhost:8000/uploads/${settings.logo}?v=${Date.now()}`); // Fetching latest image
      setTheme(settings);
      setVersion((prev) => prev + 1); // Trigger re-render to apply theme

      const name = userId.split("@")[0];
      setGreeting(`Hi ${name}, how can I help?`);
    } catch (err) {
      console.error("Error loading admin settings:", err);
    }
  };

  // Receive user info and refresh messages from parent window
  useEffect(() => {
    const handleUserInfo = (event) => {
      if (event.data?.type === "USER_INFO") {
        const { userId, userRole, companyId, companyName } = event.data.payload;
        setUserId(userId);
        setUserRole(userRole);
        setCompanyName(companyName);
        fetchSettings(companyId, userId);

        // Store user info locally
        localStorage.setItem("companyId", companyId);
        localStorage.setItem("companyName", companyName);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", userRole);
      }
    };

    const handleRefresh = (event) => {
      if (event.data?.type === "REFRESH_SETTINGS") {
        const companyId = localStorage.getItem("companyId");
        const userId = localStorage.getItem("userId");
        if (companyId && userId) {
          fetchSettings(companyId, userId);
        }
        console.log("🔁 REFRESH received");
      }
    };

    // Add message listeners
    window.addEventListener("message", handleUserInfo);
    window.addEventListener("message", handleRefresh);
    return () => {
      window.removeEventListener("message", handleUserInfo);
      window.removeEventListener("message", handleRefresh);
    };
  }, [isEmbedded]);

  // Send user message to backend and handle chatbot response
  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");

    // Add user's message to chat history
    setChatHistory((prev) => [...prev, { sender: "user", text: userMessage }]);

    // Add bot typing placeholder
    const loadingId = Date.now();
    setChatHistory((prev) => [
      ...prev,
      { sender: "bot", text: "✍️ DigiBot is typing...", id: loadingId }
    ]);

    try {
      const companyId = localStorage.getItem("companyId");

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          company_id: companyId,
        }),
      });

      const data = await response.json();

      // Replace typing placeholder with actual bot response
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { sender: "bot", text: data.reply || "⚠️ No response received." }
            : msg
        )
      );
    } catch (error) {
      console.error("Webhook Error:", error);
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? { sender: "bot", text: "⚠️ Failed to get response." }
            : msg
        )
      );
    }
  };

  // Handle click to navigate admin to settings
  const handleGoToAdmin = () => {
    window.parent.postMessage({ type: "NAVIGATE", route: "admin-settings" }, "*");
  };

  // Handle click to close the bot and redirect to feedback form
  const handleClose = () => {
    window.parent.postMessage({ type: "NAVIGATE", route: "feedback" }, "*");
  };

  // Show loading message until user data is available
  if (!userRole || !userId) {
    return <Box p={2} textAlign="center">Loading chatbot...</Box>;
  }

  return (
    <Box
      key={version}
      ref={containerRef}
      sx={{
        position: "fixed",
        bottom: 20,
        right: { xs: "50%", sm: 20 }, // Center on very small screens
        transform: { xs: "translateX(50%)", sm: "none" }, // Only when right is 50%
        width: { xs: "90vw", sm: 360, md: 400 }, //  Responsive width
        height: { xs: "75vh", sm: 600 }, //  Responsive height
        maxHeight: "85vh",
        borderRadius: 3,
        boxShadow: 6,
        zIndex: 1000,
        overflow: "hidden",
        animation: `${slideUp} 0.4s ease-in-out`,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
      >
        {/* Chatbot Header with Logo, Company Name, and Actions */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" p={2}
          sx={{
            backgroundColor: theme.background_color || "#ffffff",
            transition: "background-color 0.3s ease",
          }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={logoUrl || "/Images/speech-bubble.png"} sx={{ width: 40, height: 40, borderRadius: 2 }} />
            <Box>
              <Typography variant="h6" fontSize={18} m={0}>DigiBot</Typography>
              <Typography variant="caption" color="text.secondary">{companyName}</Typography>
            </Box>
          </Stack>
          <Box>
            {userRole === "admin" && (
              <IconButton size="small" onClick={handleGoToAdmin}>
                <Settings />
              </IconButton>
            )}
            <IconButton size="small" onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </Stack>

        {/* Chat Message Area */}
        <Box flexGrow={1} overflow="auto" mb={2} p={1} bgcolor="#f9f9f9" borderRadius={2}>
          {[{ sender: "bot", text: greeting }, ...chatHistory].map((msg, idx) => (
            <Box key={idx} textAlign={msg.sender === "user" ? "right" : "left"} mb={1}>
              <Box
                component="span"
                sx={{
                  backgroundColor: msg.sender === "user" ? "#e1f5fe" : "#eeeeee",
                  px: 1.5,
                  py: 1,
                  borderRadius: 4,
                  display: "inline-block",
                }}
              >
                {msg.text}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Message Input Field */}
        <Stack direction="row" spacing={1} px={2} pb={2}
          sx={{
            backgroundColor: theme.background_color || "#ffffff",
            transition: "background-color 0.3s ease",
          }}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            fullWidth
            size="small"
            sx={{ borderRadius: 2, backgroundColor: "#f0f0f0" }}
          />
          <IconButton onClick={handleSend} color="primary" sx={{ borderRadius: 2 }}>
            <Send />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
};

export default FullPageDigibot;
