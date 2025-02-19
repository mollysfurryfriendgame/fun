
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import LeaderBoard from "./pages/LeaderBoard";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Game from "./pages/Game";
import UnderConstruction from "./pages/UnderConstruction";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import FetchTokenButton from "./pages/FetchTokenButton";
import SuperStaffRoute from "./pages/SuperStaffRoute";
import ReviewUploads from "./pages/ReviewUploads";
import LocalStorageDisplay from "./components/LocalStorageDisplay"
import UserProfileDisplay from "./components/UserProfileDisplay"
import Contact from "./components/Contact";
import AdminResetFreeUploads from "./pages/AdminResetFreeUploads"
import DonateButton from "./components/DonateButton";
import logo from "./assets/logo2.png";


function App() {

  return (
      <Router>
        <Nav />
        <div>
        <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px"
}}>
    <img
        src={logo}
        alt="Molly's Furry Friend Game Logo"
        style={{ maxWidth: "250px", height: "auto", background: "transparent" }}
    />
</div>
          <DonateButton />
          <Routes>
          <Route path="/fetchtokenbutton" element={<FetchTokenButton />} />
          <Route path="/localStorageDisplay" element={<LocalStorageDisplay />} />
          <Route path="/userProfileDisplay" element={<UserProfileDisplay />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/game/:animalType" element={<Game />} />
          <Route path="/underconstruction" element={<UnderConstruction />} />
          <Route path="/upload" element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>} />
          <Route path="/profile" element={
            <ProtectedRoute>
            <Profile />
            </ProtectedRoute>
            } />
            <Route path="/review-uploads" element={
            <SuperStaffRoute>
              <ReviewUploads />
            </SuperStaffRoute>
              }
            />
            <Route path="/reset-uploads" element={
            <SuperStaffRoute>
              <AdminResetFreeUploads />
            </SuperStaffRoute>
              }
            />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
