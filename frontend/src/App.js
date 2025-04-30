import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CompanyPortal from "./Pages/CompanyPortal";
import AdminSettings from "./Pages/AdminSettings";
import Feedback from "./Pages/Feedback";
import InternalStaffUI from "./Pages/InternalStaffUI";
import FullPageDigibot from "./Pages/FullPageDigibot";
import DigiMarkAdminDashboard from "./Pages/DigiMarkAdminDashboard"; 
import DigiMarkAdminLogin from "./Pages/DigiMarkAdminLogin"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/company-portal" replace />} />

        <Route path="/company-portal" element={<CompanyPortal />}>
          <Route path="admin-settings" element={<AdminSettings />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>

        <Route path="/internal-staff" element={<InternalStaffUI />} />
        <Route path="/FullPageDigibot" element={<FullPageDigibot />} />
        <Route path="/digimark-dashboard" element={<DigiMarkAdminDashboard />} />
        <Route path="/digimark-login" element={<DigiMarkAdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
