import { ReactNode } from "react";

interface Props { title: string; right?: ReactNode; }

export default function Topbar({ title, right }: Props) {
  return (
    <div style={{ background: "white", borderBottom: "1px solid #EDE6DF", padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30 }}>
      <h1 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#2C1A0E", margin: 0 }}>{title}</h1>
      {right && <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>{right}</div>}
    </div>
  );
}
