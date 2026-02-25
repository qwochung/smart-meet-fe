import {Outlet} from "react-router-dom";
import { Header } from "../components/common";

export default function MainLayout() {
  return (
    <div className="min-h-screen w-screen bg-dark-950">
      <Header />
      <main>
        <Outlet/>
      </main>
    </div>
  )
}