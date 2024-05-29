import { message } from "antd";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const token = Cookies.get("token");
  const user = JSON.parse(Cookies.get("user"));
  const history = useNavigate();

  useEffect(() => {
    if (user.role !== "admin") {
      Cookies.remove("token");
      history("/login");
      message.error("Unauthorized to access this route");
    }
  }, []);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
