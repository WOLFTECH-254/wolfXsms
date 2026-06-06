import { useState } from "react";
import Topbar from "../components/ui/Topbar";
import { sendSms } from "../lib/api";
import { addLog, getSettings } from "../lib/storage";
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
    if (!s.gatewayUrl || !s.gatewayKey) { showToast("Configure gateway in Settings."); return; }
    setSending(true);
    try {
      const res = await sendSms({ to: phone, message: sMsg, from: sFrom || undefined });
      if (res.success) { addLog({ to: phone, message: sMsg, status: "success", cost: "KES 0.80" }); showToast("Sent!"); setSTo(""); setSMsg(""); }
      else { addLog({ to: phone, message: sMsg, status: "failed" }); showToast("Error: " + (res.error || "Failed")); }
    } catch { showToast("Network error."); } finally { setSending(false); }
  };
  const sendBulk = async () => {
    if (!s.gatewayUrl || !s.gatewayKey) { showToast("Configure gateway in Settings."); return; }
    const numbers = bTo.split(/[\n,]+/).map((n) => formatPhone(n.trim())).filter(isValidPhone);
    if (!numbers.length || !bMsg) { showToast("Valid numbers and message required."); return; }
    setSending(true);
    try {
      const res = await sendSms({ to: numbers, message: bMsg, from: bFrom || undefined });
      if (res.success) { numbers.forEach((n) => addLog({ to: n, message: bMsg, status: "success", cost: "KES 0.80" })); showToast("Bulk sent! " + res.data?.sent + "/" + numbers.length + " delivered."); setBTo(""); setBMsg(""); }
      else { showToast("Error: " + (res.error || "Failed")); }
    } catch { showToast("Network error."); } finally { setSending(false); }
  };
  return (
    <>
      <Topbar title="Send SMS" />
      <div className="p-6 flex flex-col gap-5">
        <div className="card">
          <div className="card-title"><i className="ti ti-send text-[#C98B4A]" /> Single message</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div><label className="text-xs text-[#A0856B] block mb-1.5">Recipient number</label><input className="form-input" placeholder="+254712345678 or 0712345678" value={sTo} onChange={(e) => setSTo(e.target.value)} /></div>
            <div><label className="text-xs text-[#A0856B] block mb-1.5">Sender ID (optional)</label><input className="form-input" placeholder="WolfSMS" value={sFrom} onChange={(e) => setSFrom(e.target.value)} /></div>
          </div>
          <div className="mb-4"><label className="text-xs text-[#A0856B] block mb-1.5">Message <span className="float-right text-[#C4AFA3]">{sMsg.length} / 160</span></label><textarea className="form-input resize-none h-24" placeholder="Type your message..." value={sMsg} onChange={(e) => setSMsg(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={sendSingle} disabled={sending}><i className="ti ti-send" />{sending ? "Sending..." : "Send message"}</button>
        </div>
        <div className="card">
          <div className="card-title"><i className="ti ti-users text-[#C98B4A]" /> Bulk message</div>
          <div className="mb-4"><label className="text-xs text-[#A0856B] block mb-1.5">Recipients (one per line or comma-separated)</label><textarea className="form-input resize-none h-28" placeholder={"+254712345678\n+254722000000"} value={bTo} onChange={(e) => setBTo(e.target.value)} /></div>
          <div className="mb-4"><label className="text-xs text-[#A0856B] block mb-1.5">Sender ID (optional)</label><input className="form-input" placeholder="WolfSMS" value={bFrom} onChange={(e) => setBFrom(e.target.value)} /></div>
          <div className="mb-4"><label className="text-xs text-[#A0856B] block mb-1.5">Message</label><textarea className="form-input resize-none h-24" placeholder="Bulk message..." value={bMsg} onChange={(e) => setBMsg(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={sendBulk} disabled={sending}><i className="ti ti-send" />{sending ? "Sending..." : "Send to all"}</button>
        </div>
      </div>
    </>
  );
}
