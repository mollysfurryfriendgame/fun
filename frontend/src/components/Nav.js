import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AuthButton from "./AuthButton";

const Nav = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {/* Links for all users */}
      <Link to="/" style={{ marginRight: "10px" }}>
        Home
      </Link>
      <Link to="/dashboard" style={{ marginRight: "10px" }}>
        Dashboard
      </Link>
      <Link to="/leaderboard" style={{ marginRight: "10px" }}>
        Leaderboard
      </Link>
      <Link to="/underconstruction" style={{ marginRight: "10px" }}>
        UnderConstruction
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
          <Link to="https://doakmath.github.io/wesleys-dog-game/" style={{ marginRight: "10px" }}>
            The Original Wesley's Dog Game
          </Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
