import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import InternalStaffUI from "./InternalStaffUI";



const CompanyPortal = () => {
  const [showInternalChat, setShowInternalChat] = useState(false);
 
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("auth");

    if (!token) {
      console.warn("No JWT token found in URL.");
      return;
    }

    fetch(`http://localhost:8000/auth?auth=${token}`)
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("userRole", data.user_type);
        localStorage.setItem("companyId", data.company_id);
        localStorage.setItem("companyName", data.company_name);

        const script = document.createElement("script");
        script.src = "http://localhost:3000/Digibot.js";
        script.async = true;
        document.body.appendChild(script);
      });

    return () => {
      const oldIframe = document.getElementById("digibot-iframe");
      const oldLauncher = document.getElementById("digibot-launcher");
      if (oldIframe) oldIframe.remove();
      if (oldLauncher) oldLauncher.remove();
    };
  }, []);

  useEffect(() => {
    const handleNavigation = (event) => {
      if (event.data?.type === "NAVIGATE") {
        const route = event.data.route;
        window.history.pushState({}, "", `/company-portal/${route}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
  
      if (event.data?.type === "REFRESH_SETTINGS") {
        const iframe = document.getElementById("digibot-iframe");
        const payload = {
          type: "USER_INFO",
          payload: {
            userId: localStorage.getItem("userId"),
            userRole: localStorage.getItem("userRole"),
            companyId: localStorage.getItem("companyId"),
            companyName: localStorage.getItem("companyName"),
          },
        };
        iframe?.contentWindow?.postMessage(payload, "*");
      }
    };

    window.addEventListener("message", handleNavigation);
    return () => window.removeEventListener("message", handleNavigation);
  }, []);

  return (
    
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          bgcolor: "#f0f2f5", 
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Company Portal
            </Typography>
            <Typography variant="body1" fontSize="1.2rem" color="text.secondary">
              Simulating the company’s portal with secure SSO login.
            </Typography>
            <Box mt={3}>
                <button
                  style={{ background: "none", border: "none", color: '#1976d2', fontWeight: 'bold', cursor: "pointer" }}
                  onClick={() => setShowInternalChat(true)}
                >
                  🔒 Go to Internal Staff Chat
                </button>
              </Box>

            </Paper>
            {showInternalChat && (
              <Box mt={4}>
                <InternalStaffUI />
              </Box>
            )}
  
          
          <Outlet />
        </Container>
      </Box>
    );
  };

export default CompanyPortal;
