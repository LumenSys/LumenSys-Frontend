import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import { routes } from "./routes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.LANDING} element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
