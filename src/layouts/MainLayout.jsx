import {Outlet} from "react-router-dom";
import {Header} from "../components/common";

export default function MainLayout() {
  return (
    <div className="h-screen w-screen bg-dark-950 flex flex-col overflow-auto">
      <Header variant="meeting" />
      <main className="flex-1 min-h-0 ">
        <Outlet/>
      </main>
    </div>
  )
}