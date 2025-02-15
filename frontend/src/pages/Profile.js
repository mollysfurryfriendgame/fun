import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";


const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [serverResponse, setServerResponse] = useState("");
  const [userProfile, setUserProfile] = useState(null);


  // Function to send user data to the backend
  useEffect(() => {
    const sendUserData = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently(); // Fetch the token
          const response = await fetch("http://localhost:8000/create-user/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Add token to Authorization header
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name || user.nickname,
              picture: user.picture,
              sub: user.sub, // Include the unique Auth0 sub identifier
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("data: ", data)
            setServerResponse(data.message);
          } else {
            const errorData = await response.json();
            console.error("Error:", errorData.error);
            setServerResponse("Error creating/updating user.");
          }
        } catch (error) {
          console.error("Error sending user data:", error);
          setServerResponse("An error occurred while connecting to the server.");
        }
      }
    };

    sendUserData();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  // Function to fetch UserProfile data from the backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          if (!token) {
            return;
          }
          const response = await fetch("http://localhost:8000/userprofile/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
          } else {
            console.error("❌ Failed to load user profile. Status:", response.status);
          }
        } catch (error) {
          console.error("❌ Error fetching user profile:", error);
        }
      }
    };

    if (serverResponse) {
      fetchUserProfile();
    }
  }, [isAuthenticated, getAccessTokenSilently, serverResponse]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }


  console.log("userProfile: ", userProfile)

  return (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    minHeight: "100vh",
    paddingTop: "25px" // Moves content closer to the top
  }}>
    <h2 style={{ marginBottom: "5px" }}>
      Welcome, {user.name.split('@')[0] || user.nickname.split('@')[0]}!
    </h2>
    <img
      src={user.picture}
      alt={`${user.name || user.nickname}'s profile`}
      style={{
        borderRadius: "50px",
        width: "80px",
        height: "80px",
        marginBottom: "10px"
      }}
    />
    <p>{serverResponse}</p>

    {userProfile && (
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "15px 20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        marginTop: "20px", // Moves the profile info box slightly below the name
      }}>
        <h4>Your Profile Info:</h4>
        <h3>{user.email}</h3>
        <p>Free Uploads Remaining: {userProfile.profile.free_uploads_remaining ?? "Not available"}</p>
        <p>Total Uploads: {userProfile.profile.total_uploads ?? "Not available"}</p>
      </div>
    )}
  </div>
);


};

export default Profile;
