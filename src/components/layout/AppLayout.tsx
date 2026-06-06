import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-[230px] flex-1 flex flex-col min-h-screen"><Outlet /></div>
    </div>
  );
}
