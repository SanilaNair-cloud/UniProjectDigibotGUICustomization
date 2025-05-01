// Import core React & routing hooks
import React, { useState,useEffect  } from "react";
import { useNavigate } from "react-router-dom";
// Import Material UI components and icons
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
  //Logo Cropping
  Dialog,
  DialogContent,
  DialogActions,
  //Logo Cropping
} from "@mui/material";
import { Settings, CloudUpload } from "@mui/icons-material";
import axios from "axios";

// Added for cropping
import Cropper from "react-easy-crop";
import getCroppedImg from "../Components/cropImageHelper";


// Main Admin Settings Component
const AdminSettings = () => {
  const [logo, setLogo] = useState(null);
  const [imageSrc, setImageSrc] = useState(null); // For cropping preview
  const [cropDialogOpen, setCropDialogOpen] = useState(false); //  Controls crop dialog
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); //  Stores cropped area
  const [crop, setCrop] = useState({ x: 0, y: 0 }); //  Added missing crop state
  const [zoom, setZoom] = useState(1); // Optional zoom control
  const [previewUrl, setPreviewUrl] = useState(null); //  Cropped preview
  const [imageType, setImageType] = useState("image/png"); // Image Type
  const [uploadError, setUploadError] = useState(""); // Error state for upload

  const [bgColor, setBgColor] = useState("#ffffff");//Backgorund color
  const [typography, setTypography] = useState("Arial");//Font style
  const [fontSize, setFontSize] = useState("14px"); //Default Font
  const [textColor, setTextColor] = useState("#000000");
  const [alignment, setAlignment] = useState("Left");

  
  const [customAudience, setCustomAudience] = useState("");
  const [tone, setTone] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  //const navigate = useNavigate();

  const companyId = localStorage.getItem("companyId") || "";
  const companyName = localStorage.getItem("companyName") || "";
  const adminId = localStorage.getItem("userId") || "";


  const navigate = useNavigate();

  // Load existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/admin-settings/${companyId}`);
        const data = res.data;

        setBgColor(data.background_color);
        setTypography(data.font_style);
        setFontSize(data.font_size);
        setTextColor(data.text_color);
        setAlignment(data.alignment);
        setCustomAudience(data.custom_audience);
        setTone(data.tone);
        
        if (data.logo) {
          const timestamp = new Date().getTime(); // Used to bust cache
          const logoUrl = `http://localhost:8000/uploads/${data.logo}?t=${timestamp}`;
          setPreviewUrl(logoUrl);

        }
      } catch (error) {
        console.error("Error fetching admin settings:", error);
      }
    };

    fetchSettings();
  }, [companyId]);

//  Called when crop is done
const onCropComplete = (_, croppedPixels) => {
  setCroppedAreaPixels(croppedPixels);
};

//  Converts image to base64 and opens cropper dialog
const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
      // Validation for PNG or JPEG
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setUploadError("Only PNG or JPEG files are allowed.");
      return;
    }
    
  
    //(image/png or image/jpeg)
    setImageType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  }
};


// Finalizes cropping and sets logo
const handleCropSave = async () => {
  const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, imageType);

  // Convert blob to a File with a name (required for FastAPI to handle it properly)
  const namedFile = new File(
    [croppedBlob],
    `${companyId}_croplogo.png`, // Any relevant filename
    { type: imageType }
  );

  setLogo(namedFile);  // this ensures FastAPI can access logo.filename
  setPreviewUrl(URL.createObjectURL(namedFile));
  setCropDialogOpen(false);
};


 // Save Admin Settings to Backend (FastAPI)
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
         {/* Logo Cropping */}
          {previewUrl && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <img
                src={previewUrl}
                alt="Logo Preview"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />
            </Box>
          )}
          {/* end of --------------Logo Cropping */}
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
         {/*Logo Crop Dialog */}
        <Dialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogContent sx={{ height: 400, position: "relative" }}>
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop} 
                onCropChange={setCrop} 
                zoom={zoom}
                onZoomChange={setZoom} 
                aspect={1}
                onCropComplete={onCropComplete}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCropDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCropSave} variant="contained" color="primary">
              Crop & Save
            </Button>
          </DialogActions>
        </Dialog>
      
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
      {/*  Upload Error Snackbar */}
        <Snackbar
        open={!!uploadError}
        autoHideDuration={4000}
        onClose={() => setUploadError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
        <Alert onClose={() => setUploadError("")} severity="error" sx={{ width: "100%" }}>
          {uploadError}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default AdminSettings;
