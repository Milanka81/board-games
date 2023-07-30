import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../components/AuthContext";

const ProtectedRoutes = ({ children }) => {
  const { auth } = useAuth();
  const [isAuth] = auth;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) navigate("/login");
  }, [isAuth, navigate]);

  return isAuth ? children : null;
};

export default ProtectedRoutes;
