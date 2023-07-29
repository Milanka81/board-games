import React, { useState, Suspense, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListOfUsers from "./pages/ListOfUsers";
import ListOfGames from "./pages/ListOfGames";
import Game from "./pages/Game";
import "./index.css";
import AddGame from "./pages/AddGame";
import EditGame from "./pages/EditGame";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./pages/ProtectedRoute";
export const AuthContext = createContext();

export default function App() {
  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [isAdmin, setIsAdmin] = useState(loggedUser?.role === "admin");
  const [isAuth, setIsAuth] = useState(!!token);

  return (
    <Suspense fallback={null}>
      <AuthContext.Provider
        value={{ auth: [isAuth, setIsAuth], admin: [isAdmin, setIsAdmin] }}
      >
        <Header />
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={isAdmin && <ListOfUsers />} />
            <Route path="/games" element={isAdmin && <ListOfGames />} />
            <Route path="/addGame" element={isAdmin && <AddGame />} />
            <Route path="/editGame/:id" element={isAdmin && <EditGame />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route
              path="reset-password/:id/:token"
              element={<ResetPassword />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/preferences" element={!isAdmin && <Preferences />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </ProtectedRoute>
      </AuthContext.Provider>
    </Suspense>
  );
}
