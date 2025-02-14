import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AuthButton from "./AuthButton";

const Nav = () => {
  const { user, isAuthenticated } = useAuth0();

  // Extract is_staff from the Auth0 user metadata
  const isStaff = user?.["https://mffg-api/is_staff"] || false;

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {/* Links for all users */}
      <Link to="/" style={{ marginRight: "10px" }}>
        Games
      </Link>
      <Link to="/contact" style={{ marginRight: "10px" }}>
        Contact
      </Link>
      <AuthButton />

      {/* Links for Authenticated Users */}
      {isAuthenticated && (
        <>
          <Link to="/profile" style={{ marginRight: "10px" }}>
            Profile
          </Link>
          <Link to="/upload" style={{ marginRight: "10px" }}>
            Upload
          </Link>

          {/* Links for Staff Members Only */}
          {isStaff && (
            <>
              <Link to="/review-uploads" style={{ marginRight: "10px" }}>
                Review Uploads
              </Link>
              <Link to="/reset-uploads" style={{ marginRight: "10px" }}>
                Reset Uploads
              </Link>
              <Link to="/localStorageDisplay" style={{ marginRight: "10px" }}>
                LocalStorage Display
              </Link>
              <Link to="/userProfileDisplay" style={{ marginRight: "10px" }}>
                User Profile Display
              </Link>
            </>
          )}

          {/* External Link */}
          <Link
            to="https://doakmath.github.io/wesleys-dog-game/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: "10px" }}
          >
            The Original: Wesley's Dog Game
          </Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
