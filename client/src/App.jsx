import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import UserDashboard from "./pages/userDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminContractorPage from "./pages/AdminContractorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/contractors" element={<AdminContractorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
