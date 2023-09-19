import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./sass/main.scss";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
    },
  },
});

export default function App() {
  return (
    <Suspense fallback={null}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
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
      </QueryClientProvider>
    </Suspense>
  );
}
