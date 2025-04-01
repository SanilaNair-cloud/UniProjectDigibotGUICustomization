import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { Settings, CloudUpload } from "@mui/icons-material";
import axios from "axios";

const AdminSettings = () => {
  const [logo, setLogo] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [typography, setTypography] = useState("Arial");
  const [fontSize, setFontSize] = useState("16px");
  const [textColor, setTextColor] = useState("#000000");
  const [alignment, setAlignment] = useState("Left");
  const [customAudience, setCustomAudience] = useState("");
  const [tone, setTone] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const companyId = localStorage.getItem("companyId") || "";
  const companyName = localStorage.getItem("companyName") || "";
  const adminId = localStorage.getItem("userId") || "";

  const handleLogoUpload = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSaveSettings = async () => {
    const formData = new FormData();
    if (logo) formData.append("logo", logo);
    formData.append("background_color", bgColor);
    formData.append("font_style", typography);
    formData.append("font_size", fontSize);
    formData.append("text_color", textColor);
    formData.append("alignment", alignment);
    formData.append("custom_audience", customAudience);
    formData.append("tone", tone);
    formData.append("admin_id", adminId);
    formData.append("company_name", companyName);
    formData.append("company_id", companyId);

    try {
      await axios.post("http://localhost:8000/admin-settings/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setOpenSnackbar(true);
      
      setTimeout(() => {
        window.parent.postMessage({ type: "REFRESH_SETTINGS" }, "*");
        navigate("/company-portal");
      }, 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        px: 2,
        py:6,
      }}
    >

      <Paper
        elevation={5}
        sx={{
          width: "100%",
          maxWidth: "720px",
          bgcolor: "#ffffff",
          p: 4,
          borderRadius: 4,
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Admin Settings <Settings fontSize="small" />
        </Typography>

        {/* Logo Upload */}
        <Box sx={{ bgcolor: "#eef5ff", p: 2.5, borderRadius: 2, mb: 2 }}>
          <Typography variant="h6">Upload Logo</Typography>
          <label htmlFor="upload-logo">
            <input
              type="file"
              id="upload-logo"
              style={{ display: "none" }}
              onChange={handleLogoUpload}
              accept="image/*"
            />
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<CloudUpload />}
              sx={{ mt: 1 }}
            >
              Choose File
            </Button>
          </label>
          {logo && (
            <Typography variant="body2" color="textSecondary" mt={1}>
              Uploaded Logo: {logo.name}
            </Typography>
          )}
        </Box>

      
        <Box sx={{ bgcolor: "#fff3e0", p: 2.5, borderRadius: 2, mb: 2 }}>
          <Typography variant="h6">Select Background Color</Typography>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ width: "50px", height: "50px", border: "none", background: "none" }}
          />
        </Box>

      
        <Box sx={{ bgcolor: "#f7f7f7", p: 2, borderRadius: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Typography Settings
          </Typography>

          <TextField
            fullWidth
            select
            label="Font Style"
            variant="outlined"
            margin="normal"
            value={typography}
            onChange={(e) => setTypography(e.target.value)}
          >
            {["Arial", "Times New Roman", "Verdana", "Roboto", "Courier New"].map(
              (font) => (
                <MenuItem key={font} value={font}>
                  {font}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            fullWidth
            select
            label="Font Size"
            variant="outlined"
            margin="normal"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            {["12px", "14px", "16px", "18px", "20px"].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="color"
            label="Text Color"
            variant="outlined"
            margin="normal"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />

          <TextField
            fullWidth
            select
            label="Text Alignment"
            variant="outlined"
            margin="normal"
            value={alignment}
            onChange={(e) => setAlignment(e.target.value)}
          >
            {["Left", "Center", "Right", "Justify"].map((align) => (
              <MenuItem key={align} value={align}>
                {align}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Custom Audience & Tone */}
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            🎯 Custom Audience & 🗣️ Tone of Voice
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Custom Audience"
                value={customAudience}
                onChange={(e) => setCustomAudience(e.target.value)}
              >
                {["Teacher", "Student", "Corporate", "Developer", "Marketing"].map(
                  (audience) => (
                    <MenuItem key={audience} value={audience}>
                      {audience}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tone of Voice"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g., Friendly and professional"
              />
            </Grid>
          </Grid>
        </Paper>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminSettings;
