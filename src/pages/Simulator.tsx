import { useState, useEffect, useRef } from "react";
import Topbar from "../components/ui/Topbar";
import { getSimMessages, clearSimMessages, addSimMessage, addLog } from "../lib/storage";
import { formatPhone, isValidPhone, relTime } from "../lib/utils";
import { useToast } from "../context/ToastContext";
import type { SimMessage } from "../types";

export default function Simulator() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<SimMessage[]>(() => getSimMessages());
  const [to, setTo]         = useState("");
  const [from, setFrom]     = useState("WolfSMS");
  const [msg, setMsg]       = useState("");
  const [filter, setFilter] = useState("");
  const phoneBodyRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setMessages(getSimMessages()), 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phoneBodyRef.current) {
      phoneBodyRef.current.scrollTop = phoneBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const filtered = filter.trim()
    ? messages.filter((m) => m.to.includes(filter.trim()) || m.to === formatPhone(filter.trim()))
    : messages;

  const handleSend = () => {
    const recipient = formatPhone(to.trim() || filter.trim());
    if (!msg.trim()) { showToast("Message is required."); return; }
    if (!isValidPhone(recipient)) { showToast("Enter a valid recipient number."); return; }
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

        <div style={{
          background: "#ffedd5", border: "1px solid #fb923c",
          borderRadius: 10, padding: "10px 14px",
          fontSize: 13, color: "#7c2d12",
          display: "flex", gap: 8, flexShrink: 0,
        }}>
          <i className="ti ti-info-circle" style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Messages sent from Dashboard or Send SMS appear here. No real SMS sent.</span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
          alignItems: "start",
        }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card">
              <div className="card-title">
                <i className="ti ti-send" style={{ color: "#C98B4A" }} /> Send test message
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: "#A0856B", display: "block", marginBottom: 4 }}>Recipient number</label>
                <input
                  className="form-input"
                  placeholder="+254712345678 or 0712345678"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: "#A0856B", display: "block", marginBottom: 4 }}>Sender name</label>
                <input className="form-input" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#A0856B", display: "block", marginBottom: 4 }}>
                  Message
                  <span style={{ float: "right", color: "#C4AFA3" }}>{msg.length}/160</span>
                </label>
                <textarea
                  className="form-input"
                  style={{ height: 80, resize: "none", display: "block" }}
                  placeholder="Type your test message..."
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSend}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <i className="ti ti-send" /> Deliver to simulator
              </button>
            </div>

            <div className="card">
              <div className="card-title">
                <i className="ti ti-filter" style={{ color: "#C98B4A" }} /> Filter by number
              </div>
              <input
                className="form-input"
                placeholder="+254712345678 (empty = show all)"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <div style={{ fontSize: 12, color: "#A0856B", marginTop: 8 }}>
                Showing <strong>{filtered.length}</strong> of <strong>{messages.length}</strong> messages
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 272,
              background: "#1a1a1a",
              borderRadius: 40,
              padding: 10,
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              border: "6px solid #2a2a2a",
              height: 520,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}>
              <div style={{
                background: "#f0f0f0",
                borderRadius: 30,
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}>
                <div style={{
                  background: "#3B2A1A", color: "white",
                  fontSize: 10, padding: "5px 14px",
                  display: "flex", justifyContent: "space-between",
                  flexShrink: 0,
                }}>
                  <span>9:41 AM</span>
                  <span>100%</span>
                </div>
                <div style={{
                  background: "#3B2A1A", color: "white",
                  padding: "8px 14px", fontSize: 12, fontWeight: 600,
                  flexShrink: 0,
                }}>
                  <i className="ti ti-message" /> {filter || "Inbox"}
                </div>

                {filtered.length === 0 ? (
                  <div style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 8, color: "#aaa", fontSize: 12,
                    background: "#e8e8e8", padding: 16, textAlign: "center",
                  }}>
                    <i className="ti ti-message-off" style={{ fontSize: 28 }} />
                    <span>No messages yet</span>
                    <span style={{ fontSize: 11, color: "#bbb" }}>Send from the form or Dashboard</span>
                  </div>
                ) : (
                  <div
                    ref={phoneBodyRef}
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      padding: "10px 8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      background: "#e8e8e8",
                      minHeight: 0,
                    }}
                  >
                    {[...filtered].reverse().map((m) => (
                      <div key={m.id} style={{
                        background: "white",
                        borderRadius: "12px 12px 12px 2px",
                        padding: "7px 10px",
                        maxWidth: "85%",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        flexShrink: 0,
                      }}>
                        <div style={{ fontSize: 10, color: "#C98B4A", fontWeight: 700, marginBottom: 2 }}>{m.from}</div>
                        <div style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.4, wordBreak: "break-word" }}>{m.message}</div>
                        <div style={{ fontSize: 10, color: "#999", marginTop: 3, textAlign: "right" }}>{relTime(m.time)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {messages.length > 0 && (
          <div className="card">
            <div className="card-title">
              <i className="ti ti-history" style={{ color: "#C98B4A" }} />
              All simulator messages ({messages.length})
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
                      <td style={{ padding: "8px 8px 8px 0", color: "#C98B4A", fontWeight: 600, fontSize: 12 }}>{m.from}</td>
                      <td style={{ padding: "8px 8px", fontFamily: "monospace", fontSize: 11 }}>{m.to}</td>
                      <td style={{ padding: "8px 8px", color: "#A0856B", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.message}</td>
                      <td style={{ padding: "8px 0", color: "#C4AFA3", fontSize: 11 }}>{relTime(m.time)}</td>
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
