import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ResetFreeUploads = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleResetUploads = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("http://localhost:8000/admin_reset_free_uploads/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message);
      } else {
        const errorData = await response.json();
        setResponseMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setResponseMessage("An unexpected error occurred. Please try again.");
    }
  };



  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Reset Free Uploads</h1>
      <p>Enter the email of the user whose uploads you want to reset.</p>
      <div style={{ marginBottom: "10px" }}>
        <label>Email Address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email"
          style={{ width: "100%", padding: "10px", marginTop: "5px" }}
        />
      </div>
      <button
        onClick={handleResetUploads}
        style={{
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Reset Uploads
      </button>
      {responseMessage && <p style={{ marginTop: "20px" }}>{responseMessage}</p>}
    </div>
  );
};

export default ResetFreeUploads;
