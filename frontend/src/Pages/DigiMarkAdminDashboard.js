// React and state management
import React, { useEffect, useState } from "react";
// MUI components for layout and UI controls
import {
  Box, Typography, Button, Grid, Paper, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, MenuItem, Select,
  InputLabel, FormControl, TextField, Switch, FormControlLabel
} from "@mui/material";
// Chart.js and its modules for rendering charts
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement,
  PointElement, LineElement, Tooltip, Legend, TimeScale
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns';
import { format } from "date-fns";
import LogoutIcon from "@mui/icons-material/Logout";



// Register Chart.js modules
ChartJS.register(
  BarElement, CategoryScale, LinearScale, ArcElement, PointElement,
  LineElement, Tooltip, Legend, TimeScale
);

// Main Admin Dashboard component
const DigiMarkAdminDashboard = () => {
  const [companyList, setCompanyList] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const parseWithTimezoneFallback = (datetimeStr) => {
    // Check if string already includes timezone info
    if (datetimeStr.includes('+') || datetimeStr.includes('Z')) {
      return new Date(datetimeStr);
    }
    // If no timezone, assume +10 offset
    return new Date(datetimeStr + "+10:00");
  };
  const fromDate = dateRange.from ? parseWithTimezoneFallback(dateRange.from + "T00:00:00") : null;
  const toDate = dateRange.to ? parseWithTimezoneFallback(dateRange.to + "T23:59:59") : null;
  const [viewMode, setViewMode] = useState("avg");





  // Fetch feedback and company data on component load
  useEffect(() => {
    const token = localStorage.getItem("digimark_token");
    const user = JSON.parse(sessionStorage.getItem("user"));

    // Validate superadmin access
    if (!token || user?.user_type !== "superadmin") {
      console.warn("⚠️ Not authorized or token missing");
      return;
    }

    // Fetch all feedback
    fetch("http://localhost:8000/feedback-all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch feedback"))
      .then((data) => {

        const normalized = data.map(fb => ({
          ...fb,
          company_id: fb.company_id?.toLowerCase().trim()
        }));
        setFeedbackData(normalized);
      })
      .catch(console.error);

    // Fetch company list
    fetch("http://localhost:8000/admin-settings-all")
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch companies"))
      .then((data) => {
        const formattedCompanies = data.map((item) => ({
          label: item.company_name,
          value: item.company_id?.toLowerCase().trim() // ✅ normalize company_id
        }));

        setCompanyList(formattedCompanies);
      })
      .catch(console.error);
  }, []);


  // Filter feedback based on company, comment, and date range
  const filteredFeedback = feedbackData.filter(fb => {
    const companyMatch =
      selectedCompany === "all" ||
      fb.company_id?.toLowerCase().trim() === selectedCompany.toLowerCase().trim();


    const commentMatch = fb.text?.toLowerCase().includes(searchTerm.toLowerCase());
    const dateMatch =
      (!fromDate || parseWithTimezoneFallback(fb.created_at) >= fromDate) &&
      (!toDate || parseWithTimezoneFallback(fb.created_at) <= toDate);

    return companyMatch && commentMatch && dateMatch;
  });

  const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
  const companyRatings = {};
  const timeSeries = [];
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  filteredFeedback.forEach(fb => {
    if (fb.sentiment) sentimentCounts[fb.sentiment]++;
    companyRatings[fb.company_id] = (companyRatings[fb.company_id] || 0) + fb.rating;
    if (fb.created_at && fb.sentiment_score != null) {
      timeSeries.push({ x: parseWithTimezoneFallback(fb.created_at), y: fb.sentiment_score });
    }
    ratingCounts[fb.rating]++;
    totalRating += fb.rating;
  });

  const avgRating = filteredFeedback.length ? (totalRating / filteredFeedback.length).toFixed(2) : "0.00";
  const avgSentiment = filteredFeedback.length
    ? (
      filteredFeedback.reduce((sum, fb) => sum + (fb.sentiment_score || 0), 0) /
      filteredFeedback.length
    ).toFixed(2) : "0.00";

  // Bar chart for rating per company (toggle between avg and count mode)
  let ratingBarData;
  if (viewMode === "avg") {
    const ratingSums = {};
    const ratingCounts = {};

    filteredFeedback.forEach((fb) => {
      ratingSums[fb.company_id] = (ratingSums[fb.company_id] || 0) + fb.rating;
      ratingCounts[fb.company_id] = (ratingCounts[fb.company_id] || 0) + 1;
    });

    const avgRatings = Object.keys(ratingSums).map(
      (id) => (ratingSums[id] / ratingCounts[id]).toFixed(2)
    );

    ratingBarData = {
      labels: Object.keys(ratingSums),
      datasets: [
        {
          label: "Average Rating",
          data: avgRatings,
          backgroundColor: "skyblue",
        },
      ],
    };
  } else {

    const ratingCounts = {};

    filteredFeedback.forEach((fb) => {
      ratingCounts[fb.company_id] = (ratingCounts[fb.company_id] || 0) + 1;
    });

    ratingBarData = {
      labels: Object.keys(ratingCounts),
      datasets: [
        {
          label: "Rating Count",
          data: Object.values(ratingCounts),
          backgroundColor: "#ff9800",
        },
      ],
    };
  }

  // Pie chart for sentiment distribution
  const sentimentPieData = {
    labels: Object.keys(sentimentCounts),
    datasets: [{
      label: "Sentiment Distribution",
      data: Object.values(sentimentCounts),
      backgroundColor: ["#4caf50", "#ffeb3b", "#f44336"],
    }],
  };

  // Line chart for sentiment score over time
  const sentimentLineData = {
    datasets: [{
      label: "Sentiment Score Over Time",
      data: timeSeries.sort((a, b) => a.x - b.x),
      borderColor: "#3f51b5",
      tension: 0.2,
      fill: false,
    }],
  };

  // Bar chart for count of each rating
  const ratingCountBarData = {
    labels: Object.keys(ratingCounts),
    datasets: [{
      label: "Rating Count",
      data: Object.values(ratingCounts),
      backgroundColor: ["#e57373", "#ffb74d", "#fff176", "#aed581", "#81c784"],
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
  };



  return (
    <Box p={4} maxWidth="1400px" margin="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">DigiMark Admin Dashboard</Typography>
        <Button
          variant="contained"        // Make it a contained/filled button
          color="error"              // Pick from [primary | secondary | error | warning | info | success], or your custom theme color
          startIcon={<LogoutIcon />} // Add an icon to the left
          sx={{
            textTransform: "none",         // Prevent the label from being forced to UPPERCASE
            fontWeight: "bold",            // Make it stand out a bit
            borderRadius: "20px",          // Rounder corners
            padding: "0.6rem 1.4rem",      // More horizontal padding
            boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)", // A bit of a shadow
          }}
          onClick={() => {
            localStorage.removeItem("digimark_token");
            sessionStorage.removeItem("user");
            window.location.href = "/digimark-login";
          }}
        >
          Logout
        </Button>

      </Box>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={selectedCompany}
              label="Select Company"
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <MenuItem value="all">All Companies</MenuItem>
              {companyList.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth label="Search Comment"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            label="From"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateRange.from}
            onChange={(e) => {
              const newFrom = e.target.value;
              setDateRange((prev) => ({
                ...prev,
                from: newFrom,
                to: prev.to && prev.to < newFrom ? "" : prev.to, // clear 'to' if now invalid
              }));
            }}
            inputProps={{
              max: new Date().toISOString().split("T")[0], // today
            }}
          />

        </Grid>

        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            label="To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            inputProps={{
              min: dateRange.from || undefined, // disable dates before 'From'
              max: new Date().toISOString().split("T")[0], // today
            }}
            disabled={!dateRange.from} // prevent selecting 'To' until 'From' is chosen
          />

        </Grid>

      </Grid>

      <FormControlLabel
        control={<Switch checked={viewMode === "avg"} onChange={() => setViewMode(viewMode === "avg" ? "count" : "avg")} />}
        label={`Toggle to ${viewMode === "avg" ? "Count" : "Average"} Mode`}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><Paper sx={{ p: 2 }}><Bar data={ratingBarData} options={chartOptions} /></Paper></Grid>
        <Grid item xs={12} md={4}><Paper sx={{ p: 2 }}><Pie data={sentimentPieData} options={chartOptions} /></Paper></Grid>
        <Grid item xs={12} md={4}><Paper sx={{ p: 2 }}><Line data={sentimentLineData} options={{ ...chartOptions, scales: { x: { type: "time", time: { unit: "day" } }, y: { beginAtZero: true } } }} /></Paper></Grid>
        <Grid item xs={12} md={6}><Paper sx={{ p: 2 }}><Bar data={ratingCountBarData} options={chartOptions} /></Paper></Grid>

        <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
        <Grid item xs={12} md={4}><Paper sx={{ p: 2, textAlign: "center" }}><Typography variant="h5">{avgSentiment}</Typography><Typography>Avg Sentiment</Typography></Paper></Grid>
        <Grid item xs={12} md={4}><Paper sx={{ p: 2, textAlign: "center" }}><Typography variant="h5">{avgRating}</Typography><Typography>Avg Rating</Typography></Paper></Grid>
        <Grid item xs={12} md={4}><Paper sx={{ p: 2, textAlign: "center" }}><Typography variant="h5">{filteredFeedback.length}</Typography><Typography>Total Feedback</Typography></Paper></Grid>

        <Grid item xs={12}><Typography variant="h6" mt={3}>Recent Feedback</Typography></Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Sentiment</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFeedback.map((fb, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{fb.company_id}</TableCell>
                    <TableCell>{fb.rating}</TableCell>
                    <TableCell>{fb.sentiment}</TableCell>
                    <TableCell>{fb.text}</TableCell>
                    <TableCell>{format(new Date(fb.created_at), "dd/MM/yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DigiMarkAdminDashboard;


