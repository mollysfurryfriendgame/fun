import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ProfileEx = () => {
  const { user, isAuthenticated } = useAuth0();
  const [serverResponse, setServerResponse] = useState("");

  useEffect(() => {
    const sendUserData = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch("http://localhost:8000/create-user/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              picture: user.picture,
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
  }, [isAuthenticated, user]);

  return (
    isAuthenticated && (
      <div>
        <h2>Welcome, {user.name}!</h2>
        <p>{serverResponse}</p>
      </div>
    )
  );
};

export default ProfileEx;
