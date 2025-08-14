import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Layout     from "../components/Layout";
import LandingPage from "../pages/LandingPage";
import CadastroEmpresa from "../pages/CadastroEmpresa";
import { routes } from "./routes";
import LoginPage from "../pages/LoginPage";
import UserRegistration from "../pages/Registration/UserRegistration";
import DashBoard from "../pages/DashBoard";
import GerenciarPlanos from "../pages/GerenciarPlanos";
import NotFound from "../pages/NotFound";
import ListOfCompanies from "../pages/Listofcompanies";

export const router = createBrowserRouter(
  createRoutesFromElements(
<>
    <Route path="/" element={<Layout />}>
      <Route path={routes.LANDING} element={<LandingPage />} />
      <Route path={routes.LOGIN} element={<LoginPage />} /> 
      <Route path={routes.USERSIGNUP} element={<UserRegistration />} /> 
      <Route path={routes.DASHBOARD} element={<DashBoard />} />
      <Route path={routes.MANAGE_PLANS} element={<GerenciarPlanos />} />
      <Route path={routes.CADASTRO_EMPRESA} element={<CadastroEmpresa />} />
      <Route path={routes.LIST_COMPANIES} element={<ListOfCompanies />} />
      <Route path="*" element={<NotFound />} />
      </Route>
</>
  )
);
export default function AppRoutes() {
  return <RouterProvider router={router} />;
}