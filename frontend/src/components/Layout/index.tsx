import { Outlet } from "react-router-dom";
import Header from "../Header/index";



export default function Layout() {
  return (
    <div className='flex flex-col text-text bg-background h-screen w-screen overflow-y-auto overflow-x-clip'>
      <Header />

      <div className="flex-1 flex flex-row">

        <main className="h-full w-full *:w-full *:h-full">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
