import {Outlet} from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col overflow-auto">
      <main className="flex-1 min-h-0 ">
        <Outlet/>
      </main>
    </div>
  )
}