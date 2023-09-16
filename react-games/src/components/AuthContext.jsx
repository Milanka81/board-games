import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [isAdmin, setIsAdmin] = useState(loggedUser?.role === "admin");
  const [isAuth, setIsAuth] = useState(!!token);

  return (
    <AuthContext.Provider
      value={{ auth: [isAuth, setIsAuth], admin: [isAdmin, setIsAdmin] }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error(" AuthContext was used outside of the AuthProvider");
  return context;
};
export { AuthProvider, useAuth };
