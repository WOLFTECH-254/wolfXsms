import { useState } from "react";
import Topbar from "../components/ui/Topbar";
import { getSettings, saveSettings } from "../lib/storage";
import { pingGateway } from "../lib/api";
import { useToast } from "../context/ToastContext";

export default function Settings() {
  const { showToast } = useToast();
  const [form, setForm] = useState(getSettings);
  const [connStatus, setConnStatus] = useState("");
  const [testing, setTesting] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    saveSettings(form);
    showToast("Settings saved successfully!", "success", "Gateway configuration updated");
  };

  const handleTest = async () => {
    saveSettings(form);
    setTesting(true); setConnStatus("Testing...");
    try {
      const data = await pingGateway();
      if (data.success) {
        setConnStatus("Connected! Mode: " + data.mode + " | " + data.provider);
        showToast("Gateway connected!", "success", `Mode: ${data.mode} | Provider: ${data.provider}`);
      } else {
        setConnStatus("Connection failed.");
        showToast("Connection failed", "error", "Check your gateway URL and API key");
      }
    } catch {
      setConnStatus("Cannot reach gateway.");
      showToast("Cannot reach gateway", "error", "Make sure the backend is running");
    }
    finally { setTesting(false); }
  };

  return (
    <>
      <Topbar title="Settings" />
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="card">
          <div className="card-title"><i className="ti ti-plug" style={{ color: "#C98B4A" }} /> Gateway connection</div>
          <p style={{ fontSize: 13, color: "#A0856B", marginBottom: 16 }}>Point this frontend to your running wolfXsms backend.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.875rem", marginBottom: "0.875rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Gateway URL</label>
              <input className="form-input" placeholder="http://localhost:3000" value={form.gatewayUrl} onChange={(e) => update("gatewayUrl", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Gateway API key</label>
              <input className="form-input" type="password" placeholder="wolf_..." value={form.gatewayKey} onChange={(e) => update("gatewayKey", e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={handleSave}><i className="ti ti-device-floppy" /> Save settings</button>
            <button className="btn btn-outline" onClick={handleTest} disabled={testing}><i className="ti ti-wifi" /> Test connection</button>
            {connStatus && (
              <span style={{ fontSize: 12, color: connStatus.startsWith("Connected") ? "#16a34a" : "#dc2626" }}>{connStatus}</span>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-title"><i className="ti ti-settings" style={{ color: "#C98B4A" }} /> Preferences</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.875rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>AT username (reference)</label>
              <input className="form-input" style={{ opacity: 0.7 }} value={form.atUsername} onChange={(e) => update("atUsername", e.target.value)} placeholder="sandbox" />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#A0856B", display: "block", marginBottom: 5 }}>Default sender ID</label>
              <input className="form-input" value={form.defaultSender} onChange={(e) => update("defaultSender", e.target.value)} placeholder="WolfSMS" />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={handleSave}><i className="ti ti-device-floppy" /> Save settings</button>
        </div>
      </div>
    </>
  );
}
