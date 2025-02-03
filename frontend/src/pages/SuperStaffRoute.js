import { useAuth0 } from "@auth0/auth0-react";

function SuperStaffRoute({ children }) {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user['https://mffg-api/is_staff']) {
    return <h1>Access Denied</h1>;
  }

  return children;
}

export default SuperStaffRoute
