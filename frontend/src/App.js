
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProfileEx from './pages/ProfileEx';
import AuthButton from "./components/AuthButton";


function App() {

  return (
      <Router>
        <div>
          <h1>Molly’s Furry Friend Game</h1>
          <AuthButton />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profileEx" element={<ProfileEx />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
