import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
} from "@mui/material";
import { Settings, CloudUpload} from "@mui/icons-material";

const AdminSettings = () => {
  const [logo, setLogo] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [typography, setTypography] = useState("Arial");
  const [fontSize, setFontSize] = useState("16px");
  const [textColor, setTextColor] = useState("#000000");
  const [alignment, setAlignment] = useState("Left");
  const [lineSpacing, setLineSpacing] = useState("1.5"); // ✅ Used below
  const [wordSpacing, setWordSpacing] = useState("Normal"); // ✅ Used below
  const [customAudience, setCustomAudience] = useState([]);
  const [tone, setTone] = useState(""); // ✅ Changed to free-form input

  const handleLogoUpload = (event) => {
    setLogo(event.target.files[0]?.name);
  };


  const handleSaveSettings = () => {
    alert("Settings saved successfully!");
    window.location.href = "/chatbot"; 
  };
  

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "16px" }}>
      <Grid container justifyContent="center" maxWidth="700px">
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "24px", borderRadius: "8px", textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Admin Settings <Settings fontSize="large" />
            </Typography>

            {/* 🟡 Upload Logo Section */}
            <div style={{ backgroundColor: "#eef5ff", padding: "20px", borderRadius: "8px", textAlign: "center", marginBottom: "16px" }}>
              <Typography variant="h6">Upload Logo</Typography>
              <label htmlFor="upload-logo">
                <input type="file" id="upload-logo" style={{ display: "none" }} onChange={handleLogoUpload} />
                <Button variant="contained" color="primary" component="span" startIcon={<CloudUpload />} style={{ marginTop: "10px" }}>
                  Choose File
                </Button>
              </label>
              {logo && <Typography variant="body2" color="textSecondary" style={{ marginTop: "8px" }}>Uploaded Logo: {logo}</Typography>}
            </div>

            {/* 🟡 Background Color Picker */}
            <div style={{ backgroundColor: "#fff3e0", padding: "20px", borderRadius: "8px", textAlign: "center", marginBottom: "16px" }}>
              <Typography variant="h6">Select Background Color</Typography>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: "50px", height: "50px", border: "none", background: "none" }} />
            </div>

            {/* 🟡 Typography Section */}
            <div style={{ backgroundColor: "#f7f7f7", padding: "16px", borderRadius: "8px", marginTop: "16px" }}>
              <Typography variant="h6" gutterBottom>Typography Settings</Typography>

              {/* Font Style */}
              <TextField
                fullWidth
                select
                label="Font Style"
                variant="outlined"
                margin="normal"
                value={typography}
                onChange={(e) => setTypography(e.target.value)}
              >
                {["Arial", "Times New Roman", "Verdana", "Roboto", "Courier New"].map((font) => (
                  <MenuItem key={font} value={font}>{font}</MenuItem>
                ))}
              </TextField>

              {/* Font Size */}
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
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </TextField>

              {/* Text Color */}
              <TextField fullWidth type="color" label="Text Color" variant="outlined" margin="normal" value={textColor} onChange={(e) => setTextColor(e.target.value)} />

              {/* Alignment */}
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
                  <MenuItem key={align} value={align}>{align}</MenuItem>
                ))}
              </TextField>

              {/* Line Spacing ✅ */}
              <TextField
                fullWidth
                select
                label="Line Spacing"
                variant="outlined"
                margin="normal"
                value={lineSpacing}
                onChange={(e) => setLineSpacing(e.target.value)}
              >
                {["1.0", "1.5", "2.0"].map((spacing) => (
                  <MenuItem key={spacing} value={spacing}>{spacing}</MenuItem>
                ))}
              </TextField>

              {/* Word Spacing ✅ */}
              <TextField
                fullWidth
                select
                label="Word Spacing"
                variant="outlined"
                margin="normal"
                value={wordSpacing}
                onChange={(e) => setWordSpacing(e.target.value)}
              >
                {["Normal", "Wide", "Extra Wide"].map((spacing) => (
                  <MenuItem key={spacing} value={spacing}>{spacing}</MenuItem>
                ))}
              </TextField>
            </div>

            {/* 🎯 Custom Audience & 🗣️ Tone of Voice */}
            <Paper elevation={3} className="p-4 rounded-lg shadow-md bg-gray-50 mt-6">
              <Typography variant="h6" className="text-center font-bold mb-3 text-gray-800">
                🎯 Custom Audience & 🗣️ Tone of Voice
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Custom Audience"
                    variant="outlined"
                    required
                    size="medium"
                    value={customAudience}
                    onChange={(e) => setCustomAudience(e.target.value)}
                  >
                    {["Teacher", "Student", "Corporate", "Developer", "Marketing"].map((audience) => (
                      <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tone of Voice"
                    variant="outlined"
                    required
                    size="medium"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    placeholder="Example: Friendly and professional"
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Save Button */}
            <Button variant="contained" color="primary" fullWidth style={{ marginTop: "16px" }} onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminSettings;