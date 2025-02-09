import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";






const Auth0Display = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const token = await getAccessTokenSilently(); // Fetch the token

}
