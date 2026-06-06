import { useState } from "react";
import Topbar from "../components/ui/Topbar";
import { getApiKeys, saveApiKeys } from "../lib/storage";
import { generateKey, relTime } from "../lib/utils";
import { useToast } from "../context/ToastContext";
import type { ApiKey } from "../types";
export default function ApiKeys() {
  const { showToast } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>(getApiKeys);
  const handleGenerate = () => {
    const label = prompt("Key label (e.g. WolfPay, WOLFBOT):"); if (!label) return;
    const newKey: ApiKey = { id: Date.now().toString(), label, key: generateKey(), created: new Date().toISOString() };
    const updated = [newKey, ...keys]; saveApiKeys(updated); setKeys(updated);
    showToast("Key generated! Add it to your gateway .env file.");
  };
  const handleDelete = (id: string) => {
    if (!confirm("Delete this key?")) return;
    const updated = keys.filter((k) => k.id !== id); saveApiKeys(updated); setKeys(updated); showToast("Key deleted.");
  };
  return (
    <>
      <Topbar title="API Keys" right={<button className="btn btn-primary btn-sm" onClick={handleGenerate}><i className="ti ti-plus" /> New key</button>} />
      <div className="p-6 flex flex-col gap-5">
        <div className="card">
          <div className="card-title"><i className="ti ti-key text-[#C98B4A]" /> Gateway API keys</div>
          <p className="text-xs text-[#A0856B] mb-5 leading-relaxed">Add generated keys to your backend <code className="bg-[#FAF7F4] px-1.5 py-0.5 rounded">.env</code> as <code className="bg-[#FAF7F4] px-1.5 py-0.5 rounded">GATEWAY_API_KEYS=key1,key2</code></p>
          {keys.length === 0 ? <div className="text-center py-10 text-sm text-[#C4AFA3]">No keys yet. Click "New key" to generate one.</div> : (
            <div className="flex flex-col gap-4">{keys.map((k) => (
              <div key={k.id}>
                <div className="text-xs text-[#A0856B] mb-1.5">{k.label} — <span className="text-[#C4AFA3]">created {relTime(k.created)}</span></div>
                <div className="flex items-center gap-2 bg-[#FAF7F4] border border-[#EDE6DF] rounded-lg px-3 py-2 font-mono text-xs">
                  <span className="flex-1 truncate">{k.key}</span>
                  <button onClick={() => navigator.clipboard.writeText(k.key).then(() => showToast("Copied!"))} className="text-[#C98B4A] hover:opacity-70 p-1"><i className="ti ti-copy text-base" /></button>
                  <button onClick={() => handleDelete(k.id)} className="text-red-600 hover:opacity-70 p-1"><i className="ti ti-trash text-base" /></button>
                </div>
              </div>
            ))}</div>
          )}
        </div>
        <div className="card">
          <div className="card-title"><i className="ti ti-info-circle text-[#C98B4A]" /> How to use</div>
          <p className="text-xs text-[#A0856B] leading-loose">Add your key to every request as a header:<br/><code className="bg-[#FAF7F4] px-2 py-0.5 rounded">x-api-key: your_key_here</code></p>
        </div>
      </div>
    </>
  );
}
