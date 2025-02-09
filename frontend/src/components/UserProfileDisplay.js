import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            axios
                .get("https://dev-uurrj85hw68pf4zr.us.auth0.com/userinfo", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then(response => {
                    setProfile(response.data);
                })
                .catch(error => {
                    console.error("Error fetching user profile:", error);
                });
        }
    }, []);

    return (
        <div>
            <h2>User Profile</h2>
            {profile ? (
                <>
                <pre>{JSON.stringify(profile, null, 2)}</pre>
                <p>{profile.nickname}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfile;
