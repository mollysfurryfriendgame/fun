import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { setAccessToken, setIsSuperUser } from "../redux/slices";
import "./AuthButton.css";

const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAndStoreToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const payload = JSON.parse(atob(token.split(".")[1]));
          const isSuperUser = payload["https://mffg-api/is_staff"] || false;

          dispatch(setAccessToken(token));
          dispatch(setIsSuperUser(isSuperUser));

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
    <div className="auth-button-container">
      {isAuthenticated ? (
        <button
          className="auth-button"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Logout
        </button>
      ) : (
        <button className="auth-button" onClick={() => loginWithRedirect()}>
          Login
        </button>
      )}
    </div>
  );
};

export default AuthButton;
