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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

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

        localStorage.setItem("digimark_token", token);
        sessionStorage.setItem("user", JSON.stringify(decoded));

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
    localStorage.removeItem("digimark_token");
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
      sx={{
        background: "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(8px)",
          animation: "fadeIn 0.8s ease",
          // Defining the keyframes for the fade-in animation
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(20px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <AdminPanelSettingsIcon sx={{ fontSize: 50, color: "#1976d2", mb: 2 }} />
        <Typography variant="h5" fontWeight={600} gutterBottom>
          DigiMark Admin Login
        </Typography>
        <Stack spacing={2} mt={2}>
          {isLoggedIn ? (
            <>
              <Typography variant="body1" color="text.secondary">
                You're already logged in.
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleLogout}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    transition: "box-shadow 0.3s ease",
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.3)",
                    },
                  },
                }}
              />
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={!email}
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  py: 1.5,
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                  backgroundColor: email ? "#1976d2" : "#ccc",
                  "&:hover": {
                    backgroundColor: email ? "#1565c0" : "#ccc",
                    transform: email ? "translateY(-2px)" : "none",
                  },
                }}
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
