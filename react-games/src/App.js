import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserHomePage from "./components/UserHomePage";
import ListOfUsers from "./components/ListOfUsers";
import ListOfGames from "./components/ListOfGames";
import Game from "./components/Game";
import "./css/FormStyle.css";
import "./index.css";
import AddGame from "./components/AddGame";
import EditGame from "./components/EditGame";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Preferences from "./components/Preferences";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
export const AuthContext = React.createContext();

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

        <Routes>
          <Route path="/" element={isAuth ? <UserHomePage /> : <Login />} />
          <Route path="/users" element={isAdmin && <ListOfUsers />} />
          <Route path="/games" element={isAdmin && <ListOfGames />} />
          <Route path="/addGame" element={isAdmin && <AddGame />} />
          <Route path="/editGame/:id" element={isAdmin && <EditGame />} />
          <Route path="/game/:id" element={isAuth ? <Game /> : <Login />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:id/:token" element={<ResetPassword />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Login />} />
          <Route
            path="/preferences"
            element={!isAdmin && isAuth && <Preferences />}
          />
          <Route path="register" element={<Register />} />
        </Routes>
      </AuthContext.Provider>
    </Suspense>
  );
}
