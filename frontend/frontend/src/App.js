import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SSOLogin from "./Pages/SSOLogin";
import Chatbot from "./Pages/Chatbot";
import AdminSettings from "./Pages/AdminSettings";
import Feedback from "./Pages/Feedback";
import ForgotPassword from "./Pages/ForgotPassword";
import CustomAudience from "./Pages/CustomAudience";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SSOLogin />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
      </Routes>
    </Router>
  );
};

export default App;