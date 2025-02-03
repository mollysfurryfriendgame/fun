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

  return (
    <div>
      <h2>Welcome, {user.name.split('@')[0] || user.nickname.split('@')[0]}!</h2>
      <h3>{user.email}</h3>
      <img src={user.picture} alt={`${user.name || user.nickname}'s profile`} />
      <p>{serverResponse}</p>

      {userProfile && (
        <div>
          <h4>Your Profile Info:</h4>
          <p>Free Uploads Remaining: {userProfile.free_uploads_remaining}</p>
          <p>Total Uploads: {userProfile.total_uploads}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
