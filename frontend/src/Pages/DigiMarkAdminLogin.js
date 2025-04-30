/**
DigiMark Super Admin Login Page
 *
 * This component handles secure login for the DigiMark Super Admin user.
 * It checks for an existing JWT token, validates email input, and sends a POST request
 * to the backend (/superadmin-auth) for authentication.
 * 
 * On successful login, it stores the JWT and user info in local/session storage
 * and redirects to the DigiMark Admin Dashboard.
 *
 * Technologies used: React, React Router, Material UI
 * Author: TechSphere Team
 *
 */
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


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DigiMarkAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();
  // On load redirect if already logged in as superadmin
  useEffect(() => {
    const token = localStorage.getItem("digimark_token");
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (token && user?.user_type === "superadmin") {
      navigate("/digimark-dashboard");
    }
  }, [navigate]);

 
  // Handles login POST to /superadmin-auth
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
  
  // Clears session/token on logout
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
          background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
        }}
      >
      <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 400,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >

        <Typography
          variant="h5"
          mb={2}
          textAlign="center"
          sx={{ fontFamily: 'Poppins, sans-serif' }}
        >
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!touched) setTouched(true);
                }}
                onBlur={() => setTouched(true)}
                fullWidth
                error={touched && !emailRegex.test(email)}
                helperText={
                  touched && !emailRegex.test(email)
                    ? "Please enter a valid email address"
                    : ""
                }
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
                disabled={!emailRegex.test(email)}
                sx={{
                  mt: 2,
                  backgroundColor: '#1976d2',
                  ':hover': { backgroundColor: '#115293' },
                  transition: 'background-color 0.3s ease',
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