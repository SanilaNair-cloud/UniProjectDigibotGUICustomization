import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Grid } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate API for password reset
    alert("Password reset link sent to " + email);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "16px" }}>
      <Grid container justifyContent="center" maxWidth="500px">
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "24px", borderRadius: "8px", textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>Forgot Password?</Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginBottom: "16px" }}>
              Enter your email and we'll send you a reset link.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                required
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="contained" color="primary" fullWidth type="submit" style={{ marginTop: "16px" }}>
                Send Reset Link
              </Button>
            </form>
            <Typography variant="body2" style={{ marginTop: "16px" }}>
              <a href="/login" style={{ color: "#1976d2", textDecoration: "none" }}>Back to Login</a>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ForgotPassword;
