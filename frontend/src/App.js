
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


function App() {

  return (
      <Router>
        <Nav />
        <div>
          <h1>Molly’s Furry Friend Game</h1>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
          </Routes>
        </div>
      </Router>
  );
}

export default App;
