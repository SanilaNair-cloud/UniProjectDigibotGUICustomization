import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Grid, InputAdornment, IconButton, MenuItem } from "@mui/material";
import { Visibility, VisibilityOff, Facebook, Google } from "@mui/icons-material";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "16px" }}>
      <Grid container spacing={3} justifyContent="center" maxWidth="900px">
        {/* Login Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "24px", borderRadius: "8px", textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>Login</Typography>
            <TextField fullWidth label="Email" variant="outlined" margin="normal" />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="body2" align="right">
              <a href="/forgot-password" style={{ color: "#1976d2", textDecoration: "none" }}>Forgot Password?</a>
            </Typography>
            <Button variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }}>Login</Button>
            <Grid container spacing={1} justifyContent="center" style={{ marginTop: "16px" }}>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" startIcon={<Facebook />} fullWidth style={{ backgroundColor: "#1877F2" }}>
                  Login with Facebook
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="inherit" startIcon={<Google />} fullWidth>
                  Login with Google
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Signup Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "24px", borderRadius: "8px", textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>Signup</Typography>
            <TextField fullWidth label="Full Name" variant="outlined" margin="normal" />
            <TextField fullWidth label="Email" variant="outlined" margin="normal" />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField fullWidth label="Company Name" variant="outlined" margin="normal" />
            <TextField fullWidth select label="Industry Type" variant="outlined" margin="normal">
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Retail">Retail</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <Button variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }}>Signup</Button>
            <Grid container spacing={1} justifyContent="center" style={{ marginTop: "16px" }}>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" startIcon={<Facebook />} fullWidth style={{ backgroundColor: "#1877F2" }}>
                  Signup with Facebook
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="inherit" startIcon={<Google />} fullWidth>
                  Signup with Google
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default AuthPage;
