import { Navigate, Outlet, useOutletContext } from "react-router-dom";

const ProtectedRoute = () => {
  const context = useOutletContext();

  const userAuth = localStorage.getItem("userAuth");
  const authUser = userAuth ? JSON.parse(userAuth) : null;

  if (!authUser?.isLogin) return <Navigate to="/login" replace />;

  return <Outlet context={context} />;
};

export default ProtectedRoute;
