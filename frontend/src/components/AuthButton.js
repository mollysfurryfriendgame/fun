import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { setAccessToken, setIsSuperUser } from "../redux/slices";

const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAndStoreToken = async () => {
      if (isAuthenticated) {
        try {
          // Fetch the access token silently
          const token = await getAccessTokenSilently();
          // Decode the token to check for the `is_staff` claim
          const payload = JSON.parse(atob(token.split(".")[1]));
          const isSuperUser = payload["https://mffg-api/is_staff"] || false;

          // Dispatch the token and `isSuperUser` state to Redux
          dispatch(setAccessToken(token));
          dispatch(setIsSuperUser(isSuperUser));

          // Save the token and `isSuperUser` status to localStorage
          localStorage.setItem("access_token", token);
          localStorage.setItem("is_superuser", JSON.stringify(isSuperUser));
        } catch (error) {
          console.error("Failed to fetch access token:", error);
        }
      }
    };

    fetchAndStoreToken();
  }, [isAuthenticated, getAccessTokenSilently, dispatch]);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name.split('@')[0]}!</p>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
    </div>
  );
};

export default AuthButton;
