import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FAF7F4" }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: mobile ? 0 : 230,
        paddingTop: mobile ? 52 : 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}>
        <Outlet />
      </main>
    </div>
  );
}
