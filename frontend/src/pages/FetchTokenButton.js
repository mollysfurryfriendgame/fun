import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const FetchTokenButton = () => {
  const { getAccessTokenSilently } = useAuth0();

  const handleFetchToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log("Access Token:", token);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  return <button onClick={handleFetchToken}>Fetch Access Token</button>;
};

export default FetchTokenButton;
