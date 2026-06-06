import { NavLink } from "react-router-dom";
const links = [
  { to: "/dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
  { to: "/send",      icon: "ti-send",             label: "Send SMS"  },
  { to: "/logs",      icon: "ti-list",             label: "Logs"      },
  { to: "/apikeys",   icon: "ti-key",              label: "API Keys"  },
  { to: "/settings",  icon: "ti-settings",         label: "Settings"  },
];
export default function Sidebar() {
  return (
    <aside className="w-[230px] bg-[#3B2A1A] flex flex-col fixed top-0 left-0 h-screen z-40">
      <div className="px-5 py-6 border-b border-[#5C3D22]">
        <div className="text-lg font-bold text-[#F5EDE3]">wolf<span className="text-[#C98B4A]">X</span>sms</div>
        <div className="text-xs text-[#7A5C3E] mt-0.5">SMS Gateway</div>
      </div>
      <nav className="flex-1 py-3">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            <i className={`ti ${l.icon} text-base`} />{l.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-[#5C3D22]">
        <div className="bg-[#4E3420] rounded-lg px-3 py-2.5">
          <div className="text-[10px] text-[#7A5C3E] mb-1">Connected provider</div>
          <div className="text-xs font-medium text-[#C98B4A]">Africa&apos;s Talking</div>
        </div>
      </div>
    </aside>
  );
}
