import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ListOfUsers from "./pages/ListOfUsers";
import ListOfGames from "./pages/ListOfGames";
import Game from "./pages/Game";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import AdminRoutes from "./pages/AdminRoutes";
import "./index.css";

// const HomePage = lazy(() => import("./pages/HomePage"));
// const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
// const ListOfGames = lazy(() => import("./pages/ListOfGames"));
// const ListOfUsers = lazy(() => import("./pages/ListOfUsers"));
// const Profile = lazy(() => import("./pages/Profile"));
// const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
// const ResetPassword = lazy(() => import("./pages/ResetPassword"));
// const PageNotFound = lazy(() => import("./pages/PageNotFound"));
// const Game = lazy(() => import("./pages/Game"));
// const ProtectedRoutes = lazy(() => import("./pages/ProtectedRoutes"));
// const AdminRoutes = lazy(() => import("./pages/AdminRoutes"));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <HomePage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoutes>
              <ListOfUsers />
            </AdminRoutes>
          }
        />
        <Route
          path="/games"
          element={
            <AdminRoutes>
              <ListOfGames />
            </AdminRoutes>
          }
        />
        <Route
          path="/game/:id"
          element={
            <ProtectedRoutes>
              <Game />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />{" "}
      </Routes>
    </Suspense>
  );
}
