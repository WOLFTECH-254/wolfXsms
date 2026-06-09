import { usePageMeta } from '../hooks/usePageMeta';
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
  const handleSave = () => { saveSettings(form); showToast("Settings saved!"); };
  const handleTest = async () => {
    saveSettings(form); setTesting(true); setConnStatus("Testing...");
    try {
      const data = await pingGateway();
      if (data.success) setConnStatus("✓ Connected! Mode: " + data.mode + " | Provider: " + data.provider);
      else setConnStatus("✗ Connection failed.");
    } catch { setConnStatus("✗ Cannot reach gateway. Is it running?"); } finally { setTesting(false); }
  };
  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 flex flex-col gap-5">
        <div className="card">
          <div className="card-title"><i className="ti ti-plug text-[#C98B4A]" /> Gateway connection</div>
          <p className="text-xs text-[#A0856B] mb-4">Point this frontend to your running wolfXsms backend.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div><label className="text-xs text-[#A0856B] block mb-1.5">Gateway URL</label><input className="form-input" placeholder="http://localhost:3000" value={form.gatewayUrl} onChange={(e) => update("gatewayUrl", e.target.value)} /></div>
            <div><label className="text-xs text-[#A0856B] block mb-1.5">Gateway API key</label><input className="form-input" type="password" placeholder="wolf_..." value={form.gatewayKey} onChange={(e) => update("gatewayKey", e.target.value)} /></div>
          </div>
          <div className="flex gap-3 items-center flex-wrap">
            <button className="btn btn-primary" onClick={handleSave}><i className="ti ti-device-floppy" /> Save</button>
            <button className="btn btn-outline" onClick={handleTest} disabled={testing}><i className="ti ti-wifi" /> Test connection</button>
            {connStatus && <span className={`text-xs ${connStatus.startsWith("✓") ? "text-green-700" : "text-red-700"}`}>{connStatus}</span>}
          </div>
        </div>
        <div className="card">
          <div className="card-title"><i className="ti ti-settings text-[#C98B4A]" /> Preferences</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs text-[#A0856B] block mb-1.5">AT username (reference)</label><input className="form-input opacity-70" value={form.atUsername} onChange={(e) => update("atUsername", e.target.value)} placeholder="sandbox" /></div>
            <div><label className="text-xs text-[#A0856B] block mb-1.5">Default sender ID</label><input className="form-input" value={form.defaultSender} onChange={(e) => update("defaultSender", e.target.value)} placeholder="WolfSMS" /></div>
          </div>
          <button className="btn btn-primary mt-4" onClick={handleSave}><i className="ti ti-device-floppy" /> Save</button>
        </div>
      </div>
    </>
  );
}
