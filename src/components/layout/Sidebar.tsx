import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
  { to: "/send",      icon: "ti-send",             label: "Send SMS"  },
  { to: "/logs",      icon: "ti-list",             label: "Logs"      },
  { to: "/simulator", icon: "ti-device-mobile",    label: "Simulator" },
  { to: "/apikeys",   icon: "ti-key",              label: "API Keys"  },
  { to: "/settings",  icon: "ti-settings",         label: "Settings"  },
];

const SIDEBAR_W = 230;
const MOBILE_BP = 768;

export default function Sidebar() {
  const [open, setOpen]     = useState(false);
  const [mobile, setMobile] = useState(() => window.innerWidth < MOBILE_BP);

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < MOBILE_BP);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const NavList = () => (
    <nav style={{ flex: 1, paddingTop: 8 }}>
      {links.map((l) => (
        <NavLink
          key={l.to} to={l.to}
          onClick={() => setOpen(false)}
          className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
        >
          <i className={`ti ${l.icon}`} style={{ fontSize: 16, width: 18, flexShrink: 0 }} />
          {l.label}
        </NavLink>
      ))}
    </nav>
  );

  const Badge = () => (
    <div style={{ padding: "12px 16px", borderTop: "1px solid #5C3D22" }}>
      <div style={{ background: "#4E3420", borderRadius: 8, padding: "8px 10px" }}>
        <div style={{ fontSize: 10, color: "#7A5C3E", marginBottom: 3 }}>Connected provider</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#C98B4A" }}>Africa's Talking</div>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <>
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 52,
          background: "#3B2A1A", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#F5EDE3" }}>
            wolf<span style={{ color: "#C98B4A" }}>X</span>sms
          </div>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              background: "#5C3D22", border: "none", color: "#F5EDE3",
              borderRadius: 8, width: 38, height: 38,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 5, cursor: "pointer", padding: "8px 10px",
            }}
          >
            {open ? (
              <i className="ti ti-x" style={{ fontSize: 20 }} />
            ) : (
              <>
                <span style={{ display: "block", width: 18, height: 2, background: "#F5EDE3", borderRadius: 2 }} />
                <span style={{ display: "block", width: 18, height: 2, background: "#F5EDE3", borderRadius: 2 }} />
                <span style={{ display: "block", width: 18, height: 2, background: "#F5EDE3", borderRadius: 2 }} />
              </>
            )}
          </button>
        </div>

        {open && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9998, top: 52 }}>
            <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
            <div style={{
              position: "absolute", top: 0, left: 0, bottom: 0,
              width: SIDEBAR_W, background: "#3B2A1A",
              display: "flex", flexDirection: "column",
              boxShadow: "4px 0 20px rgba(0,0,0,0.4)",
            }}>
              <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #5C3D22" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#F5EDE3" }}>wolf<span style={{ color: "#C98B4A" }}>X</span>sms</div>
                <div style={{ fontSize: 11, color: "#7A5C3E", marginTop: 2 }}>SMS Gateway</div>
              </div>
              <NavList />
              <Badge />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <aside style={{
      width: SIDEBAR_W, background: "#3B2A1A",
      display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 40,
    }}>
      <div style={{ padding: "22px 18px 14px", borderBottom: "1px solid #5C3D22" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#F5EDE3" }}>wolf<span style={{ color: "#C98B4A" }}>X</span>sms</div>
        <div style={{ fontSize: 11, color: "#7A5C3E", marginTop: 2 }}>SMS Gateway</div>
      </div>
      <NavList />
      <Badge />
    </aside>
  );
}
