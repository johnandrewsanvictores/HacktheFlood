import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import UserDashboard from "./pages/userDashboard";

import ProjectMap3D from './components/ProjectMap3D.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
    <div className="w-full h-screen">
      <ProjectMap3D />
    </div>
  );
}

export default App;
