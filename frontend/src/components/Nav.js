import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AuthButton from "./AuthButton";
import "./Nav.css"; // Import the CSS file

// Import icons from react-icons
import { FaPaw, FaUser, FaUpload, FaInfoCircle, FaEnvelope, FaGamepad } from "react-icons/fa";
import { MdDashboard, MdStorage } from "react-icons/md";

const Nav = () => {
  const { user, isAuthenticated } = useAuth0();
  const isStaff = user?.["https://mffg-api/is_staff"] || false;

  return (
    <nav className="bottom-nav">
      <Link to="/" className="nav-link">
        <FaPaw className="nav-icon" /> Games
      </Link>
      <Link to="/contact" className="nav-link">
        <FaEnvelope className="nav-icon" /> Contact
      </Link>
      <Link to="/about" className="nav-link">
        <FaInfoCircle className="nav-icon" /> About
      </Link>

      <AuthButton />

      {isAuthenticated && (
        <>
          <Link to="/profile" className="nav-link">
            <FaUser className="nav-icon" /> Profile
          </Link>
          <Link to="/upload" className="nav-link">
            <FaUpload className="nav-icon" /> Upload
          </Link>

          {isStaff && (
            <>
              <Link to="/review-uploads" className="nav-link">
                <MdDashboard className="nav-icon" /> Review Uploads
              </Link>
              <Link to="/reset-uploads" className="nav-link">
                <MdStorage className="nav-icon" /> Reset Uploads
              </Link>
              <Link to="/localStorageDisplay" className="nav-link">
                <MdStorage className="nav-icon" /> LocalStorage
              </Link>
              <Link to="/userProfileDisplay" className="nav-link">
                <FaUser className="nav-icon" /> User Profiles
              </Link>
              <Link
                to="https://doakmath.github.io/wesleys-dog-game/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                <FaGamepad className="nav-icon" /> Wesley's Dog Game
              </Link>
            </>
          )}
        </>
      )}
    </nav>
  );
};

export default Nav;
