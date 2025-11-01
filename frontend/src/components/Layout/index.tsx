import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/index";
import Footer from "../Footer/index";
import Sidebar from "../Sidebar/index";
import Breadcrumb from "../Breadcrumb/index";
import AccessibilityPanel from '../../components/AccessibilityPanel';

export default function Layout() {
  const location = useLocation();
  const hideSidebarAndBreadcrumb = [
    '/', '/login', '/usersignup'
  ].includes(location.pathname);

  return (
    <div className='flex flex-col min-h-screen text-text bg-background'>
      <Header />
      <div className="flex flex-1 flex-row min-h-0">
        {!hideSidebarAndBreadcrumb && <Sidebar />}
        <main className="flex-1 min-w-0 px-2 md:px-8 pt-4">
          {!hideSidebarAndBreadcrumb && <Breadcrumb />}
          <Outlet />
        </main>
      </div>
      <Footer />
      <AccessibilityPanel />
    </div>
          
  );
}
