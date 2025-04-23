import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Layout     from "../components/Layout";
import LandingPage from "../pages/LandingPage";
import { routes } from "./routes";

export const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<Layout />}>
      <Route path={routes.LANDING} element={<LandingPage />} />
      {/* <Route path={routes.LOGIN} element={<LoginPage />} /> */}
    </Route>
  )
);
export default function AppRoutes() {
  return <RouterProvider router={router} />;
}