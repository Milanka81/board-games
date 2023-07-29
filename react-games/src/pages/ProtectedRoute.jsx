import { useContext } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [isAuth] = auth;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) navigate("/login");
  }, [isAuth, navigate]);

  return children;
};

export default ProtectedRoute;
