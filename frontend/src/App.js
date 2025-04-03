// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CompanyPortal from "./Pages/CompanyPortal";
import AdminSettings from "./Pages/AdminSettings";
import Feedback from "./Pages/Feedback";
import InternalStaffUI from "./Pages/InternalStaffUI";
import FullPageDigibot from "./Pages/FullPageDigibot";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/company-portal" element={<CompanyPortal />}>
          <Route path="admin-settings" element={<AdminSettings />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>

        <Route path="/internal-staff" element={<InternalStaffUI />} />

        {/* Full chatbot iframe */}
        <Route path="/FullPageDigibot" element={<FullPageDigibot />} />
      </Routes>
    </Router>
  );
}

export default App;

