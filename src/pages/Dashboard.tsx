import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/ui/Topbar";
import { getLogs, addLog, getSettings, addSimMessage } from "../lib/storage";
import { sendSms } from "../lib/api";
import { formatPhone, isValidPhone, relTime } from "../lib/utils";
import { useToast } from "../context/ToastContext";
import type { SmsLog } from "../types";

export default function Dashboard() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [to, setTo] = useState(""); const [from, setFrom] = useState(""); const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const s = getSettings();

  useEffect(() => { setLogs(getLogs()); }, []);

  const today  = new Date().toDateString();
  const todayN = logs.filter((l) => new Date(l.time).toDateString() === today).length;
  const sample = logs.slice(0, 30);
  const rate   = sample.length ? Math.round((sample.filter((l) => l.status === "success").length / sample.length) * 100) + "%" : "--";
  const cost   = (logs.filter((l) => l.status === "success").length * 0.8).toFixed(2);
  const isSandbox = s.atUsername === "sandbox";

  const handleSend = async () => {
    const phone = formatPhone(to);
    if (!phone || !msg) { showToast("Number and message are required.", "warning"); return; }
    if (!isValidPhone(phone)) { showToast("Invalid phone number.", "warning", "Use +254... or 07..."); return; }
    if (!s.gatewayUrl || !s.gatewayKey) {
      addLog({ to: phone, message: msg, status: "success", cost: "KES 0.00" });
      addSimMessage({ from: from || "WolfSMS", to: phone, message: msg });
      showToast("Sent to simulator!", "success", "No gateway configured — simulator mode");
      setTo(""); setMsg(""); setLogs(getLogs()); return;
    }
    setSending(true);
    try {
      const res = await sendSms({ to: phone, message: msg, from: from || undefined });
      if (res.success) {
        addLog({ to: phone, message: msg, status: "success", cost: "KES 0.80" });
        addSimMessage({ from: from || s.defaultSender || "WolfSMS", to: phone, message: msg });
        showToast("Message sent successfully!", "success", `Delivered to ${phone}`);
        setTo(""); setMsg(""); setLogs(getLogs());
      } else {
        addLog({ to: phone, message: msg, status: "failed" });
        showToast("Failed to send message", "error", res.error || "Unknown error");
        setLogs(getLogs());
      }
    } catch { showToast("Network error", "error", "Is the gateway running?"); }
    finally { setSending(false); }
  };

  const stats = [
    { label: "Total sent",   value: logs.length,   sub: "all time"       },
    { label: "Sent today",   value: todayN,         sub: "since midnight" },
    { label: "Success rate", value: rate,           sub: "last 30 msgs"   },
    { label: "Total cost",   value: "KES " + cost,  sub: "estimated"      },
  ];

  return (
    <>
      <Topbar title="Dashboard" right={
        <>
          <span className={`badge ${isSandbox ? "badge-sandbox" : "badge-success"}`}>{isSandbox ? "Sandbox" : "Production"}</span>
          <Link to="/send" className="btn btn-primary btn-sm"><i className="ti ti-send" /> Send SMS</Link>
        </>
      } />
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.875rem" }}>
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: "0.7rem", color: "#A0856B", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2C1A0E" }}>{s.value}</div>
              <div style={{ fontSize: "0.7rem", color: "#C98B4A", marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title"><i className="ti ti-send" style={{ color: "#C98B4A" }} /> Quick send</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.875rem", marginBottom: "0.875rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Recipient number</label>
              <input className="form-input" placeholder="+254712345678 or 0712345678" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Sender ID (optional)</label>
              <input className="form-input" placeholder="WolfSMS" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: "0.875rem" }}>
            <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Message</label>
            <textarea className="form-input" style={{ resize: "none", height: 80 }} placeholder="Type your message..." value={msg} onChange={(e) => setMsg(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={handleSend} disabled={sending}>
              <i className="ti ti-send" />{sending ? "Sending..." : "Send message"}
            </button>
            {!s.gatewayKey && <span style={{ fontSize: "0.75rem", color: "#C98B4A" }}>Simulator mode active</span>}
          </div>
        </div>
        <div className="card">
          <div className="card-title" style={{ justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i className="ti ti-history" style={{ color: "#C98B4A" }} /> Recent messages</span>
            <Link to="/simulator" className="btn btn-sm btn-outline"><i className="ti ti-device-mobile" /> Simulator</Link>
          </div>
          {logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem", fontSize: "0.875rem", color: "#C4AFA3" }}>No messages yet. Send your first SMS above!</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #EDE6DF" }}>
                    {["Number","Message","Status","Time","Cost"].map(h => <th key={h} style={{ textAlign: "left", padding: "0 0 8px", fontSize: "0.7rem", color: "#A0856B", fontWeight: 500 }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 8).map((l) => (
                    <tr key={l.id} style={{ borderBottom: "1px solid #F5F0EB" }}>
                      <td style={{ padding: "10px 0", fontFamily: "monospace", fontSize: "0.75rem" }}>{l.to}</td>
                      <td style={{ padding: "10px 8px", color: "#A0856B", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.message}</td>
                      <td style={{ padding: "10px 8px" }}><span className={`badge badge-${l.status === "success" ? "success" : "danger"}`}>{l.status}</span></td>
                      <td style={{ padding: "10px 8px", fontSize: "0.7rem", color: "#C4AFA3" }}>{relTime(l.time)}</td>
                      <td style={{ padding: "10px 0", fontSize: "0.7rem", color: "#C98B4A" }}>{l.status === "success" ? (l.cost || "KES 0.80") : "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {logs.length > 8 && <div style={{ marginTop: 12, textAlign: "center" }}><Link to="/logs" style={{ fontSize: "0.75rem", color: "#C98B4A", textDecoration: "none" }}>View all {logs.length} logs</Link></div>}
        </div>
      </div>
    </>
  );
}
