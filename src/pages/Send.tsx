import { usePageMeta } from '../hooks/usePageMeta';
import { useState } from "react";
import Topbar from "../components/ui/Topbar";
import { sendSms } from "../lib/api";
import { addLog, getSettings, addSimMessage } from "../lib/storage";
import { formatPhone, isValidPhone } from "../lib/utils";
import { useToast } from "../context/ToastContext";

export default function Send() {
  const { showToast } = useToast();
  const [sTo, setSTo] = useState(""); const [sFrom, setSFrom] = useState(""); const [sMsg, setSMsg] = useState("");
  const [bTo, setBTo] = useState(""); const [bFrom, setBFrom] = useState(""); const [bMsg, setBMsg] = useState("");
  const [sending, setSending] = useState(false);
  const s = getSettings();

  const sendSingle = async () => {
    const phone = formatPhone(sTo);
    if (!phone || !sMsg) { showToast("Number and message are required."); return; }
    if (!isValidPhone(phone)) { showToast("Invalid phone number."); return; }
    if (!s.gatewayUrl || !s.gatewayKey) {
      addLog({ to: phone, message: sMsg, status: "success", cost: "KES 0.00" });
      addSimMessage({ from: sFrom || "WolfSMS", to: phone, message: sMsg });
      showToast("Sent to simulator!"); setSTo(""); setSMsg(""); return;
    }
    setSending(true);
    try {
      const res = await sendSms({ to: phone, message: sMsg, from: sFrom || undefined });
      if (res.success) {
        addLog({ to: phone, message: sMsg, status: "success", cost: "KES 0.80" });
        addSimMessage({ from: sFrom || "WolfSMS", to: phone, message: sMsg });
        showToast("Sent!"); setSTo(""); setSMsg("");
      } else { addLog({ to: phone, message: sMsg, status: "failed" }); showToast("Error: " + (res.error || "Failed")); }
    } catch { showToast("Network error."); } finally { setSending(false); }
  };

  const sendBulk = async () => {
    const numbers = bTo.split(/[\n,]+/).map((n) => formatPhone(n.trim())).filter(isValidPhone);
    if (!numbers.length || !bMsg) { showToast("Valid numbers and message required."); return; }
    if (!s.gatewayUrl || !s.gatewayKey) {
      numbers.forEach((n) => { addLog({ to: n, message: bMsg, status: "success", cost: "KES 0.00" }); addSimMessage({ from: bFrom || "WolfSMS", to: n, message: bMsg }); });
      showToast("Bulk sent to simulator! " + numbers.length + " messages."); setBTo(""); setBMsg(""); return;
    }
    setSending(true);
    try {
      const res = await sendSms({ to: numbers, message: bMsg, from: bFrom || undefined });
      if (res.success) {
        numbers.forEach((n) => { addLog({ to: n, message: bMsg, status: "success", cost: "KES 0.80" }); addSimMessage({ from: bFrom || "WolfSMS", to: n, message: bMsg }); });
        showToast("Bulk sent! " + res.data?.sent + "/" + numbers.length + " delivered."); setBTo(""); setBMsg("");
      } else { showToast("Error: " + (res.error || "Failed")); }
    } catch { showToast("Network error."); } finally { setSending(false); }
  };

  return (
    <>
      <Topbar title="Send SMS" />
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {!s.gatewayKey && (
          <div style={{ background: "#ffedd5", border: "1px solid #fb923c", borderRadius: "0.75rem", padding: "0.75rem 1.25rem", fontSize: "0.8rem", color: "#7c2d12", display: "flex", gap: "0.5rem" }}>
            <i className="ti ti-info-circle" style={{ marginTop: 1 }} />
            <span>No gateway configured â€” messages will go to the <strong>Simulator</strong>. Configure in Settings to send real SMS.</span>
          </div>
        )}
        <div className="card">
          <div className="card-title"><i className="ti ti-send" style={{ color: "#C98B4A" }} /> Single message</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.875rem", marginBottom: "0.875rem" }}>
            <div><label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Recipient number</label><input className="form-input" placeholder="+254712345678 or 0712345678" value={sTo} onChange={(e) => setSTo(e.target.value)} /></div>
            <div><label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Sender ID (optional)</label><input className="form-input" placeholder="WolfSMS" value={sFrom} onChange={(e) => setSFrom(e.target.value)} /></div>
          </div>
          <div style={{ marginBottom: "0.875rem" }}>
            <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Message <span style={{ float: "right", color: "#C4AFA3" }}>{sMsg.length}/160</span></label>
            <textarea className="form-input" style={{ resize: "none", height: 90 }} placeholder="Type your message..." value={sMsg} onChange={(e) => setSMsg(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={sendSingle} disabled={sending}><i className="ti ti-send" />{sending ? "Sending..." : "Send message"}</button>
        </div>

        <div className="card">
          <div className="card-title"><i className="ti ti-users" style={{ color: "#C98B4A" }} /> Bulk message</div>
          <div style={{ marginBottom: "0.875rem" }}>
            <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Recipients (one per line or comma-separated)</label>
            <textarea className="form-input" style={{ resize: "none", height: 100 }} placeholder={"+254712345678\n+254722000000\n+254700111222"} value={bTo} onChange={(e) => setBTo(e.target.value)} />
          </div>
          <div style={{ marginBottom: "0.875rem" }}>
            <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Sender ID (optional)</label>
            <input className="form-input" placeholder="WolfSMS" value={bFrom} onChange={(e) => setBFrom(e.target.value)} />
          </div>
          <div style={{ marginBottom: "0.875rem" }}>
            <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Message</label>
            <textarea className="form-input" style={{ resize: "none", height: 90 }} placeholder="Bulk message..." value={bMsg} onChange={(e) => setBMsg(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={sendBulk} disabled={sending}><i className="ti ti-send" />{sending ? "Sending..." : "Send to all"}</button>
        </div>
      </div>
    </>
  );
}
