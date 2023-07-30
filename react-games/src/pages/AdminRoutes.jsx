import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../components/AuthContext";

const AdminRoutes = ({ children }) => {
  const { admin } = useAuth();
  const [isAdmin] = admin;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  return isAdmin ? children : null;
};

export default AdminRoutes;
