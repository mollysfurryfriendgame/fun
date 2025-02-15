import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AuthButton from "./AuthButton";
import "./Nav.css"; // Import the new CSS file

const Nav = () => {
  const { user, isAuthenticated } = useAuth0();
  const isStaff = user?.["https://mffg-api/is_staff"] || false;

  return (
    <nav className="bottom-nav">
      <Link to="/" className="nav-link">
        Games
      </Link>
      <Link to="/contact" className="nav-link">
        Contact
      </Link>
      <Link className="nav-link">
          About
      </Link>

      <AuthButton />

      {isAuthenticated && (
        <>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
          <Link to="/upload" className="nav-link">
            Upload
          </Link>

          {isStaff && (
            <>
              <Link to="/review-uploads" className="nav-link">
                Review Uploads
              </Link>
              <Link to="/reset-uploads" className="nav-link">
                Reset Uploads
              </Link>
              <Link to="/localStorageDisplay" className="nav-link">
                LocalStorage
              </Link>
              <Link to="/userProfileDisplay" className="nav-link">
                User Profiles
              </Link>
              <Link
                to="https://doakmath.github.io/wesleys-dog-game/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                Wesley's Dog Game
              </Link>
            </>
          )}


        </>
      )}
    </nav>
  );
};

export default Nav;
