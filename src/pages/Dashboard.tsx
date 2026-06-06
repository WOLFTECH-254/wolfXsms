import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/ui/Topbar";
import { getLogs, addLog, getSettings } from "../lib/storage";
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
  const today = new Date().toDateString();
  const todayN = logs.filter((l) => new Date(l.time).toDateString() === today).length;
  const sample = logs.slice(0, 30);
  const rate = sample.length ? Math.round((sample.filter((l) => l.status === "success").length / sample.length) * 100) + "%" : "—";
  const cost = (logs.filter((l) => l.status === "success").length * 0.8).toFixed(2);
  const isSandbox = s.atUsername === "sandbox";
  const handleSend = async () => {
    const phone = formatPhone(to);
    if (!phone || !msg) { showToast("Number and message are required."); return; }
    if (!isValidPhone(phone)) { showToast("Invalid phone number."); return; }
    if (!s.gatewayUrl || !s.gatewayKey) { showToast("Configure gateway in Settings first."); return; }
    setSending(true);
    try {
      const res = await sendSms({ to: phone, message: msg, from: from || undefined });
      if (res.success) { addLog({ to: phone, message: msg, status: "success", cost: "KES 0.80" }); showToast("Message sent!"); setTo(""); setMsg(""); setLogs(getLogs()); }
      else { addLog({ to: phone, message: msg, status: "failed" }); showToast("Failed: " + (res.error || "Unknown")); setLogs(getLogs()); }
    } catch { showToast("Network error. Is the gateway running?"); }
    finally { setSending(false); }
  };
  return (
    <>
      <Topbar title="Dashboard" right={
        <>
          <span className={`badge ${isSandbox ? "badge-sandbox" : "badge-success"}`}>{isSandbox ? "Sandbox mode" : "Production"}</span>
          <Link to="/send" className="btn btn-primary btn-sm"><i className="ti ti-send" /> Send SMS</Link>
        </>
      } />
      <div className="p-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ label: "Total sent", value: logs.length, sub: "all time" }, { label: "Sent today", value: todayN, sub: "since midnight" }, { label: "Success rate", value: rate, sub: "last 30 msgs" }, { label: "Total cost", value: "KES " + cost, sub: "estimated" }].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="text-xs text-[#A0856B] mb-1.5">{s.label}</div>
              <div className="text-2xl font-bold text-[#2C1A0E]">{s.value}</div>
              <div className="text-xs text-[#C98B4A] mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title"><i className="ti ti-send text-[#C98B4A]" /> Quick send</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div><label className="text-xs text-[#A0856B] block mb-1.5">Recipient number</label><input className="form-input" placeholder="+254712345678 or 0712345678" value={to} onChange={(e) => setTo(e.target.value)} /></div>
            <div><label className="text-xs text-[#A0856B] block mb-1.5">Sender ID (optional)</label><input className="form-input" placeholder="WolfSMS" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          </div>
          <div className="mb-4"><label className="text-xs text-[#A0856B] block mb-1.5">Message</label><textarea className="form-input resize-none h-20" placeholder="Type your message..." value={msg} onChange={(e) => setMsg(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={handleSend} disabled={sending}><i className="ti ti-send" />{sending ? "Sending..." : "Send message"}</button>
        </div>
        <div className="card">
          <div className="card-title"><i className="ti ti-history text-[#C98B4A]" /> Recent messages</div>
          {logs.length === 0 ? <div className="text-center py-10 text-sm text-[#C4AFA3]">No messages yet. Send your first SMS above!</div> : (
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-[#A0856B] border-b border-[#EDE6DF]"><th className="text-left pb-2 font-medium">Number</th><th className="text-left pb-2 font-medium">Message</th><th className="text-left pb-2 font-medium">Status</th><th className="text-left pb-2 font-medium">Time</th><th className="text-left pb-2 font-medium">Cost</th></tr></thead>
              <tbody>{logs.slice(0, 8).map((l) => (<tr key={l.id} className="border-b border-[#F5F0EB] last:border-0 hover:bg-[#FAF7F4]"><td className="py-2.5 font-mono text-xs">{l.to}</td><td className="py-2.5 text-[#A0856B] max-w-[200px] truncate">{l.message}</td><td className="py-2.5"><span className={`badge badge-${l.status === "success" ? "success" : "danger"}`}>{l.status}</span></td><td className="py-2.5 text-xs text-[#C4AFA3]">{relTime(l.time)}</td><td className="py-2.5 text-xs text-[#C98B4A]">{l.status === "success" ? "KES 0.80" : "—"}</td></tr>))}</tbody>
            </table>
          )}
          {logs.length > 8 && <div className="mt-3 text-center"><Link to="/logs" className="text-xs text-[#C98B4A] hover:underline">View all {logs.length} logs →</Link></div>}
        </div>
      </div>
    </>
  );
}
