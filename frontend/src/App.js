import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Chatbot from "./Pages/Chatbot";
import AdminSettings from "./Pages/AdminSettings";
import Feedback from "./Pages/Feedback";

const App = () => {
  return (
    <Router>
      <Routes>
   
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
};

export default App;