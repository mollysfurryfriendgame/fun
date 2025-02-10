import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AuthButton from "./AuthButton";

const Nav = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {/* Links for all users */}
      {/* <Link to="/" style={{ marginRight: "10px" }}>
        Home
        </Link> */}
      <Link to="/" style={{ marginRight: "10px" }}>
        Home
      </Link>
      {/* <Link to="/leaderboard" style={{ marginRight: "10px" }}>
        Leaderboard
        </Link> */}
      <Link to="/contact" style={{ marginRight: "10px" }}>
        Contact
      </Link>
      <AuthButton />



      {/* Protected Links for Authenticated Users */}
      {isAuthenticated && (
        <>
          <Link to="/upload" style={{ marginRight: "10px" }}>
            Upload
          </Link>
          <Link to="/profile" style={{ marginRight: "10px" }}>
            Profile
          </Link>
          <Link to="/review-uploads" style={{ marginRight: "10px" }}>
            Review Uploads
          </Link>
          <Link to="/reset-uploads" style={{ marginRight: "10px" }}>
            Reset Uploads
          </Link>
          <Link to="/localStorageDisplay" style={{ marginRight: "10px" }}>
            localStorage Display and Extraction
          </Link>
          <Link to="/userProfileDisplay" style={{ marginRight: "10px" }}>
            userProfileData
          </Link>
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
