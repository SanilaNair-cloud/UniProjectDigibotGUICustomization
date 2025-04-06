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
  const containerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [greeting, setGreeting] = useState("");
  const [theme, setTheme] = useState({});
  const [version, setVersion] = useState(0);
  const isEmbedded = window.self !== window.top;
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

  const fetchSettings = async (companyId, userId) => {
    try {
      const res = await fetch(`http://localhost:8000/admin-settings/${companyId}`);
      const settings = await res.json();
      setLogoUrl(`http://localhost:8000/uploads/${settings.logo}`);
      setTheme(settings);
      console.log("✅ Final theme object:", settings);

      setVersion((prev) => prev + 1);
      const name = userId.split("@")[0];
      setGreeting(`Hi ${name}, how can I help?`);
    } catch (err) {
      console.error("Error loading admin settings:", err);
    }
  };

  useEffect(() => {
    const handleUserInfo = (event) => {
      if (event.data?.type === "USER_INFO") {
        const { userId, userRole, companyId, companyName } = event.data.payload;
        setUserId(userId);
        setUserRole(userRole);
        setCompanyName(companyName);
        fetchSettings(companyId, userId);

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

    window.addEventListener("message", handleUserInfo);
    window.addEventListener("message", handleRefresh);
    return () => {
      window.removeEventListener("message", handleUserInfo);
      window.removeEventListener("message", handleRefresh);
    };
  }, [isEmbedded]);

  const handleSend = async () => {
    if (!message.trim()) return;
  
    const userMessage = message;
    setMessage("");
  
    // ✅ Show user's message in the chat
    setChatHistory((prev) => [...prev, { sender: "user", text: userMessage }]);
  
    // ⏳ Typing indicator
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
  
      // ✅ Replace typing with actual reply
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
  
  
  
  

  const handleGoToAdmin = () => {
    window.parent.postMessage({ type: "NAVIGATE", route: "admin-settings" }, "*");
  };

  const handleClose = () => {
    window.parent.postMessage({ type: "NAVIGATE", route: "feedback" }, "*");
  };

  if (!userRole || !userId) {
    return <Box p={2} textAlign="center">Loading chatbot...</Box>;
  }
  console.log("🖼️ Outer background color being used:", theme.background_color);

  return (
    <Box
      key={version}
      ref={containerRef}
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 400,
        height: 600,
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
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" p={2} sx={{
            backgroundColor: theme.background_color || "#ffffff",
            transition: "background-color 0.3s ease",
          }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {/*/logo192.png*/}
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

        <Stack direction="row" spacing={1} px={2} pb={2} sx={{
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
