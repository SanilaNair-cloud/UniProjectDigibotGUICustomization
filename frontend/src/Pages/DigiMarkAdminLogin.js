import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const DigiMarkAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("digimark_token");
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (token && user?.user_type === "superadmin") {
      navigate("/digimark-dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/superadmin-auth", {
        method: "POST",
        body: new URLSearchParams({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const token = data.auth;
        const decoded = JSON.parse(atob(token.split(".")[1]));
  
        // ✅ First store both
        localStorage.setItem("digimark_token", token);
        sessionStorage.setItem("user", JSON.stringify(decoded));
  
        console.log("✅ Token stored:", localStorage.getItem("digimark_token"));
  
        // ✅ Wait for confirmation before navigating
        setTimeout(() => {
          navigate("/digimark-dashboard");
        }, 300); 
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Login error. Please try again.");
    }
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("digimark_token"); // ✅ also remove token
    setEmail("");
    setError("");
  };

  const isLoggedIn = !!sessionStorage.getItem("user");

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f6f8"
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, maxWidth: 400 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          DigiMark Admin Login
        </Typography>
        <Stack spacing={2}>
          {isLoggedIn ? (
            <>
              <Typography variant="body1" textAlign="center">
                You're already logged in.
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
              <Button
                variant="contained"
                fullWidth
                onClick={handleLogin}
                disabled={!email}
              >
                Login
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default DigiMarkAdminLogin;
