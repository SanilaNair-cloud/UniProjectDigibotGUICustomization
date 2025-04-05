import { Navigate } from "react-router-dom";

const RequireSuperAdmin = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("USER_INFO"));

  if (!userData || userData.user_type !== "superadmin") {
    return <Navigate to="/company-portal" />;
  }

  return children;
};

export default RequireSuperAdmin;
