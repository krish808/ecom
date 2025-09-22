import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * AuthRoute can act as both Private and Public route
 *
 * @param {ReactNode} children - The page to render
 * @param {"private"|"public"} type - The route type
 *
 * - "private": only logged-in users can access
 * - "public": only logged-out users can access
 */
const AuthRoute = ({ children, type }) => {
  const { token } = useSelector((state) => state.auth);

  if (type === "private" && !token) {
    return <Navigate to="/login" replace />;
  }

  if (type === "public" && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise render the page
  return children;
};

export default AuthRoute;
