import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Layout     from "../components/Layout";
import LandingPage from "../pages/LandingPage";
import { routes } from "./routes";
import LoginPage from "../pages/LoginPage";
import UserRegistration from "../pages/Registration/UserRegistration";

export const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<Layout />}>
      <Route path={routes.LANDING} element={<LandingPage />} />
      <Route path={routes.LOGIN} element={<LoginPage />} /> 
      <Route path={routes.USERSIGNUP} element={<UserRegistration />} /> 
    </Route>
  )
);
export default function AppRoutes() {
  return <RouterProvider router={router} />;
}