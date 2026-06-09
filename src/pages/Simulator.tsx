import { useState, useEffect, useRef } from "react";
import Topbar from "../components/ui/Topbar";
import { getSimMessages, clearSimMessages, addSimMessage, addLog } from "../lib/storage";
import { formatPhone, isValidPhone, relTime } from "../lib/utils";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";
import type { SimMessage } from "../types";

type Screen = "home" | "messages" | "thread" | "dialer" | "clock";

function useTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ── Phone shell wrapper ───────────────────────────────────────
function Phone({ children, statusBarColor = "#1a1a2e" }: { children: React.ReactNode; statusBarColor?: string }) {
  const time = useTime();
  return (
    <div style={{
      width: 300, height: 600,
      background: "#111", borderRadius: 44,
      padding: 10, flexShrink: 0,
      boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 0 0 1px #333",
      display: "flex", flexDirection: "column",
      position: "relative",
    }}>
      {/* Notch */}
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 80, height: 20, background: "#111", borderRadius: "0 0 12px 12px", zIndex: 10 }} />
      {/* Screen */}
      <div style={{ flex: 1, borderRadius: 34, overflow: "hidden", display: "flex", flexDirection: "column", background: "#000" }}>
        {/* Status bar */}
        <div style={{ background: statusBarColor, color: "white", fontSize: 10, padding: "14px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontWeight: 600 }}>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
        {children}
      </div>
      {/* Home bar */}
      <div style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 80, height: 4, background: "#333", borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ── Home screen ───────────────────────────────────────────────
function HomeScreen({ messages, onNav }: { messages: SimMessage[]; onNav: (s: Screen) => void }) {
  const time = useTime();
  const unread = messages.length;

  const apps = [
    { id: "dialer",   icon: "📞", label: "Phone",    badge: 0 },
    { id: "messages", icon: "💬", label: "Messages", badge: unread },
    { id: "clock",    icon: "🕐", label: "Clock",    badge: 0 },
    { id: "home",     icon: "⚙️", label: "Settings", badge: 0 },
  ];

  return (
    <div style={{ flex: 1, background: "linear-gradient(160deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)", display: "flex", flexDirection: "column", padding: "0 0 12px" }}>
      {/* Date + time widget */}
      <div style={{ textAlign: "center", padding: "24px 0 20px", color: "white" }}>
        <div style={{ fontSize: 44, fontWeight: 200, letterSpacing: -1, lineHeight: 1 }}>
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
          {time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Notification strip if messages exist */}
      {unread > 0 && (
        <div
          onClick={() => onNav("messages")}
          style={{ margin: "0 12px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 14px", backdropFilter: "blur(10px)", cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "white" }}>Messages</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{unread} new message{unread > 1 ? "s" : ""}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* App grid */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 24, padding: "16px 8px", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {apps.map((app) => (
              <div
                key={app.id}
                onClick={() => onNav(app.id as Screen)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", position: "relative" }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, position: "relative", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {app.icon}
                  {app.badge > 0 && (
                    <div style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "white", fontSize: 9, fontWeight: 700, borderRadius: 99, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", border: "2px solid #111" }}>
                      {app.badge > 9 ? "9+" : app.badge}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", textAlign: "center" }}>{app.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Messages list ─────────────────────────────────────────────
function MessagesScreen({ messages, onThread, onBack }: { messages: SimMessage[]; onThread: (sender: string) => void; onBack: () => void }) {
  // Group by sender
  const grouped: Record<string, SimMessage[]> = {};
  messages.forEach((m) => {
    if (!grouped[m.from]) grouped[m.from] = [];
    grouped[m.from].push(m);
  });
  const threads = Object.entries(grouped).sort((a, b) => new Date(b[1][0].time).getTime() - new Date(a[1][0].time).getTime());

  return (
    <div style={{ flex: 1, background: "white", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#3B2A1A", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16, padding: 0 }}>←</button>
        <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>Messages</span>
      </div>
      {threads.length === 0 ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#aaa", gap: 8 }}>
          <span style={{ fontSize: 36 }}>💬</span>
          <span style={{ fontSize: 13 }}>No messages yet</span>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto" }}>
          {threads.map(([sender, msgs]) => (
            <div
              key={sender}
              onClick={() => onThread(sender)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}
            >
              {/* Avatar */}
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#3B2A1A", display: "flex", alignItems: "center", justifyContent: "center", color: "#C98B4A", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {sender.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{sender}</span>
                  <span style={{ fontSize: 10, color: "#aaa" }}>{relTime(msgs[0].time)}</span>
                </div>
                <div style={{ fontSize: 12, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                  {msgs[0].message}
                </div>
              </div>
              <div style={{ background: "#C98B4A", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 99, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", flexShrink: 0 }}>
                {msgs.length}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Thread / conversation view ────────────────────────────────
function ThreadScreen({ messages, sender, onBack }: { messages: SimMessage[]; sender: string; onBack: () => void }) {
  const threadMsgs = messages.filter((m) => m.from === sender).reverse();
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView(); }, [messages]);

  return (
    <div style={{ flex: 1, background: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#3B2A1A", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16, padding: 0 }}>←</button>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#C98B4A", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>
          {sender.charAt(0).toUpperCase()}
        </div>
        <span style={{ color: "white", fontWeight: 600, fontSize: 13 }}>{sender}</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
        {threadMsgs.map((m) => (
          <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ background: "white", borderRadius: "14px 14px 14px 2px", padding: "8px 12px", maxWidth: "80%", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: 12, color: "#1a1a1a", lineHeight: 1.45, wordBreak: "break-word" }}>{m.message}</div>
            </div>
            <span style={{ fontSize: 9, color: "#aaa", marginTop: 3, marginLeft: 4 }}>{relTime(m.time)}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "8px 10px", background: "white", borderTop: "1px solid #eee", flexShrink: 0 }}>
        <div style={{ background: "#f5f5f5", borderRadius: 20, padding: "8px 14px", fontSize: 11, color: "#aaa" }}>Read-only — send from dashboard</div>
      </div>
    </div>
  );
}

// ── Dialer ────────────────────────────────────────────────────
function DialerScreen({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const keys = ["1","2","3","4","5","6","7","8","9","*","0","#"];
  const tap = (k: string) => setInput(p => p + k);
  return (
    <div style={{ flex: 1, background: "white", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#3B2A1A", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16, padding: 0 }}>←</button>
        <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>Phone</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 16px 16px" }}>
        {/* Display */}
        <div style={{ textAlign: "center", minHeight: 52, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 28, fontWeight: 300, color: "#1a1a1a", letterSpacing: 2 }}>{input || "Enter number"}</span>
        </div>
        {/* Keypad */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
          {keys.map((k) => (
            <button key={k} onClick={() => tap(k)} style={{ height: 56, borderRadius: 50, background: "#f5f5f5", border: "none", fontSize: 20, cursor: "pointer", fontWeight: 400, color: "#1a1a1a" }}>{k}</button>
          ))}
        </div>
        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
          <button onClick={() => setInput(p => p.slice(0,-1))} style={{ width: 48, height: 48, borderRadius: "50%", background: "#f5f5f5", border: "none", fontSize: 18, cursor: "pointer" }}>⌫</button>
          <button style={{ width: 64, height: 64, borderRadius: "50%", background: "#16a34a", border: "none", fontSize: 28, cursor: "pointer" }}>📞</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#bbb" }}>Demo only — no real calls</div>
      </div>
    </div>
  );
}

// ── Clock ─────────────────────────────────────────────────────
function ClockScreen({ onBack }: { onBack: () => void }) {
  const time = useTime();
  const h = time.getHours() % 12;
  const m = time.getMinutes();
  const s = time.getSeconds();
  const hDeg = h * 30 + m * 0.5;
  const mDeg = m * 6;
  const sDeg = s * 6;

  return (
    <div style={{ flex: 1, background: "#1a1a2e", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#0f0f1a", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16, padding: 0 }}>←</button>
        <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>Clock</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        {/* Analog clock */}
        <div style={{ position: "relative", width: 160, height: 160 }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Face */}
            <circle cx="80" cy="80" r="78" fill="#0f0f1a" stroke="#C98B4A" strokeWidth="2" />
            {/* Hour markers */}
            {[...Array(12)].map((_,i) => {
              const a = (i * 30 - 90) * Math.PI / 180;
              const x1 = 80 + 66 * Math.cos(a); const y1 = 80 + 66 * Math.sin(a);
              const x2 = 80 + 72 * Math.cos(a); const y2 = 80 + 72 * Math.sin(a);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C98B4A" strokeWidth="2" strokeLinecap="round" />;
            })}
            {/* Hour hand */}
            <line x1="80" y1="80" x2={80 + 42 * Math.cos((hDeg - 90) * Math.PI / 180)} y2={80 + 42 * Math.sin((hDeg - 90) * Math.PI / 180)} stroke="white" strokeWidth="4" strokeLinecap="round" />
            {/* Minute hand */}
            <line x1="80" y1="80" x2={80 + 58 * Math.cos((mDeg - 90) * Math.PI / 180)} y2={80 + 58 * Math.sin((mDeg - 90) * Math.PI / 180)} stroke="white" strokeWidth="3" strokeLinecap="round" />
            {/* Second hand */}
            <line x1="80" y1="80" x2={80 + 62 * Math.cos((sDeg - 90) * Math.PI / 180)} y2={80 + 62 * Math.sin((sDeg - 90) * Math.PI / 180)} stroke="#C98B4A" strokeWidth="1.5" strokeLinecap="round" />
            {/* Center dot */}
            <circle cx="80" cy="80" r="4" fill="#C98B4A" />
          </svg>
        </div>
        {/* Digital */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 200, color: "white", letterSpacing: 2 }}>
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
            {time.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        {/* Timezone */}
        <div style={{ background: "rgba(201,139,74,0.15)", borderRadius: 20, padding: "6px 16px", border: "1px solid rgba(201,139,74,0.3)" }}>
          <span style={{ fontSize: 12, color: "#C98B4A" }}>Africa/Nairobi — EAT (UTC+3)</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Simulator Page ───────────────────────────────────────
export default function Simulator() {
  const { showToast } = useToast();
  const { confirm }   = useModal();
  const [messages, setMessages] = useState<SimMessage[]>(() => getSimMessages());
  const [screen, setScreen]     = useState<Screen>("home");
  const [thread, setThread]     = useState<string>("");
  const [to, setTo]     = useState("");
  const [from, setFrom] = useState("WolfSMS");
  const [msg, setMsg]   = useState("");

  // Poll for new messages every 1.5s
  useEffect(() => {
    const id = setInterval(() => setMessages(getSimMessages()), 1500);
    return () => clearInterval(id);
  }, []);

  const handleSend = () => {
    const recipient = formatPhone(to.trim());
    if (!msg.trim()) { showToast("Message is required.", "warning"); return; }
    if (!isValidPhone(recipient)) { showToast("Enter a valid number.", "warning"); return; }
    addSimMessage({ from: from || "WolfSMS", to: recipient, message: msg });
    addLog({ to: recipient, message: msg, status: "success", cost: "KES 0.00" });
    setMessages(getSimMessages());
    setMsg(""); setTo("");
    showToast("Delivered to simulator!", "success", `Sent to ${recipient}`);
  };

  const handleClear = async () => {
    const ok = await confirm("Clear simulator", "Delete all messages from the simulator?", { confirmLabel: "Clear all", danger: true });
    if (!ok) return;
    clearSimMessages(); setMessages([]); setScreen("home");
    showToast("Simulator cleared.", "success");
  };

  const unread = messages.length;

  // Phone screen renderer
  const renderScreen = () => {
    switch (screen) {
      case "home":     return <HomeScreen messages={messages} onNav={setScreen} />;
      case "messages": return <MessagesScreen messages={messages} onThread={(s) => { setThread(s); setScreen("thread"); }} onBack={() => setScreen("home")} />;
      case "thread":   return <ThreadScreen messages={messages} sender={thread} onBack={() => setScreen("messages")} />;
      case "dialer":   return <DialerScreen onBack={() => setScreen("home")} />;
      case "clock":    return <ClockScreen onBack={() => setScreen("home")} />;
      default:         return <HomeScreen messages={messages} onNav={setScreen} />;
    }
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

        {/* Info banner */}
        <div style={{ background: "#ffedd5", border: "1px solid #fb923c", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#7c2d12", display: "flex", gap: 8 }}>
          <i className="ti ti-info-circle" style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Messages sent from Dashboard or Send SMS appear on the phone. Tap the Messages app to read them.</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "start" }}>

          {/* Send form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card">
              <div className="card-title"><i className="ti ti-send" style={{ color: "#C98B4A" }} /> Send test message</div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: "#A0856B", display: "block", marginBottom: 4 }}>Recipient number</label>
                <input className="form-input" placeholder="+254712345678 or 0712345678" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: "#A0856B", display: "block", marginBottom: 4 }}>Sender name</label>
                <input className="form-input" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#A0856B", display: "block", marginBottom: 4 }}>
                  Message <span style={{ float: "right", color: "#C4AFA3" }}>{msg.length}/160</span>
                </label>
                <textarea className="form-input" style={{ height: 80, resize: "none", display: "block" }} placeholder="Type your test message..." value={msg} onChange={(e) => setMsg(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleSend} style={{ width: "100%", justifyContent: "center" }}>
                <i className="ti ti-send" /> Deliver to phone
              </button>
            </div>

            <div className="card">
              <div className="card-title"><i className="ti ti-device-mobile" style={{ color: "#C98B4A" }} /> Phone status</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#A0856B" }}>Total messages</span>
                  <strong style={{ color: "#3B2A1A" }}>{messages.length}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#A0856B" }}>Senders</span>
                  <strong style={{ color: "#3B2A1A" }}>{new Set(messages.map(m => m.from)).size}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#A0856B" }}>Current screen</span>
                  <strong style={{ color: "#C98B4A", textTransform: "capitalize" }}>{screen}</strong>
                </div>
                {unread > 0 && (
                  <button className="btn btn-primary btn-sm" onClick={() => setScreen("messages")} style={{ marginTop: 4 }}>
                    <i className="ti ti-message" /> Open messages ({unread})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Phone */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Phone statusBarColor={screen === "clock" ? "#0f0f1a" : screen === "home" ? "#1a1a2e" : "#3B2A1A"}>
              {renderScreen()}
            </Phone>
          </div>

        </div>
      </div>
    </>
  );
}
