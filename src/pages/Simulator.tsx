import { useState, useEffect, useRef } from "react";
import Topbar from "../components/ui/Topbar";
import { getSimMessages, clearSimMessages, addSimMessage, addLog } from "../lib/storage";
import { formatPhone, isValidPhone, relTime } from "../lib/utils";
import { useToast } from "../context/ToastContext";
import type { SimMessage } from "../types";

export default function Simulator() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<SimMessage[]>(() => getSimMessages());
  const [to, setTo]       = useState("");
  const [from, setFrom]   = useState("WolfSMS");
  const [msg, setMsg]     = useState("");
  const [filter, setFilter] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Refresh messages every second so they appear after sending from other pages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(getSimMessages());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const recipient = formatPhone(to.trim() || filter.trim());
    if (!msg.trim()) { showToast("Message is required."); return; }
    if (!isValidPhone(recipient)) { showToast("Enter a valid number first."); return; }
    addSimMessage({ from: from || "WolfSMS", to: recipient, message: msg });
    addLog({ to: recipient, message: msg, status: "success", cost: "KES 0.00" });
    setMessages(getSimMessages());
    setMsg("");
    showToast("Delivered to simulator!");
  };

  const handleClear = () => {
    if (!confirm("Clear all simulator messages?")) return;
    clearSimMessages();
    setMessages([]);
    showToast("Simulator cleared.");
  };

  const filtered = filter
    ? messages.filter((m) => m.to === formatPhone(filter) || m.to === filter || m.to.includes(filter))
    : messages;

  return (
    <>
      <Topbar
        title="SMS Simulator"
        right={
          <button className="btn btn-sm btn-outline" onClick={handleClear}>
            <i className="ti ti-trash" /> Clear
          </button>
        }
      />

      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Banner */}
        <div style={{ background: "#ffedd5", border: "1px solid #fb923c", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#7c2d12", display: "flex", gap: 8 }}>
          <i className="ti ti-info-circle" style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Messages sent from Dashboard or Send SMS appear here instantly. No real SMS sent â€” free testing without a backend.</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", alignItems: "start" }}>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card">
              <div className="card-title">
                <i className="ti ti-send" style={{ color: "#C98B4A" }} /> Send test message
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#A0856B", display: "block", marginBottom: 5 }}>Recipient number</label>
                <input className="form-input" placeholder="+254712345678 or 0712345678" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#A0856B", display: "block", marginBottom: 5 }}>Sender name</label>
                <input className="form-input" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "#A0856B", display: "block", marginBottom: 5 }}>
                  Message <span style={{ float: "right", color: "#C4AFA3" }}>{msg.length}/160</span>
                </label>
                <textarea
                  className="form-input"
                  style={{ resize: "none", height: 80 }}
                  placeholder="Type your test message..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
              </div>
              <button className="btn btn-primary" onClick={handleSend} style={{ width: "100%", justifyContent: "center" }}>
                <i className="ti ti-send" /> Deliver to simulator
              </button>
            </div>

            <div className="card">
              <div className="card-title">
                <i className="ti ti-filter" style={{ color: "#C98B4A" }} /> Filter by number
              </div>
              <input
                className="form-input"
                placeholder="+254712345678 (leave empty to show all)"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <div style={{ fontSize: 12, color: "#A0856B", marginTop: 8 }}>
                Showing <strong>{filtered.length}</strong> of <strong>{messages.length}</strong> messages
              </div>
            </div>
          </div>

          {/* Phone */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 280, minHeight: 520, background: "#1a1a1a",
              borderRadius: 40, padding: 12,
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              border: "6px solid #2a2a2a",
              display: "flex", flexDirection: "column",
            }}>
              {/* Screen */}
              <div style={{ background: "#f0f0f0", borderRadius: 30, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Status bar */}
                <div style={{ background: "#3B2A1A", color: "white", fontSize: 10, padding: "5px 14px", display: "flex", justifyContent: "space-between" }}>
                  <span>9:41 AM</span><span>ðŸ“¶ 100%</span>
                </div>
                {/* Header */}
                <div style={{ background: "#3B2A1A", color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600 }}>
                  <i className="ti ti-message" /> {filter || "All messages"}
                </div>
                {/* Messages */}
                {filtered.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#aaa", fontSize: 13, background: "#e8e8e8" }}>
                    <i className="ti ti-message-off" style={{ fontSize: 32 }} />
                    <span>No messages yet</span>
                    <span style={{ fontSize: 11, textAlign: "center", padding: "0 20px" }}>Send a message from the form or Dashboard</span>
                  </div>
                ) : (
                  <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: 8, background: "#e8e8e8" }}>
                    {[...filtered].reverse().map((m) => (
                      <div key={m.id} style={{ background: "white", borderRadius: "12px 12px 12px 2px", padding: "8px 10px", maxWidth: "85%", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                        <div style={{ fontSize: 10, color: "#C98B4A", fontWeight: 700, marginBottom: 2 }}>{m.from}</div>
                        <div style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.4 }}>{m.message}</div>
                        <div style={{ fontSize: 10, color: "#999", marginTop: 3, textAlign: "right" }}>{relTime(m.time)}</div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* All messages table */}
        {messages.length > 0 && (
          <div className="card">
            <div className="card-title">
              <i className="ti ti-history" style={{ color: "#C98B4A" }} /> All simulator messages ({messages.length})
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #EDE6DF" }}>
                    {["From","To","Message","Time"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "0 8px 8px 0", fontSize: 11, color: "#A0856B", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m.id} style={{ borderBottom: "1px solid #F5F0EB" }}>
                      <td style={{ padding: "9px 8px 9px 0", color: "#C98B4A", fontWeight: 600, fontSize: 12 }}>{m.from}</td>
                      <td style={{ padding: "9px 8px", fontFamily: "monospace", fontSize: 11 }}>{m.to}</td>
                      <td style={{ padding: "9px 8px", color: "#A0856B", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.message}</td>
                      <td style={{ padding: "9px 0", color: "#C4AFA3", fontSize: 11 }}>{relTime(m.time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
