/**
 * RequireSuperAdmin – Route Guard for Superadmin Access Only
 *
 * This component protects certain routes in the app so only users
 * with the "superadmin" role can access them.
 *
 * If a non-superadmin user tries to access the route, they will be
 * redirected to the /company-portal page.
 *
 * Usage:
 * <RequireSuperAdmin>
 *   <ProtectedComponent />
 * </RequireSuperAdmin>
 */

import { Navigate } from "react-router-dom";

const RequireSuperAdmin = ({ children }) => {
  // Get user info from localStorage
  const userData = JSON.parse(localStorage.getItem("USER_INFO"));

  // Redirect if user is not a superadmin or not logged in
  if (!userData || userData.user_type !== "superadmin") {
    return <Navigate to="/company-portal" />;
  }

  // If superadmin, allow access to the children components
  return children;
};

export default RequireSuperAdmin;
