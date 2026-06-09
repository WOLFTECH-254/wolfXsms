import { useState } from "react";
import Topbar from "../components/ui/Topbar";
import { getApiKeys, saveApiKeys } from "../lib/storage";
import { generateKey, relTime } from "../lib/utils";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";
import type { ApiKey } from "../types";

export default function ApiKeys() {
  const { showToast } = useToast();
  const { prompt, confirm } = useModal();
  const [keys, setKeys] = useState<ApiKey[]>(getApiKeys);

  const handleGenerate = async () => {
    const label = await prompt(
      "New API key",
      "Give this key a label so you know which app uses it.",
      { placeholder: "e.g. WolfPay, WOLFBOT, My App", confirmLabel: "Generate" }
    );
    if (!label || !label.trim()) return;
    const newKey: ApiKey = {
      id: Date.now().toString(),
      label: label.trim(),
      key: generateKey(),
      created: new Date().toISOString(),
    };
    const updated = [newKey, ...keys];
    saveApiKeys(updated);
    setKeys(updated);
    showToast("Key generated! Add it to your gateway .env file.");
  };

  const handleDelete = async (id: string, label: string) => {
    const ok = await confirm(
      "Delete API key",
      `Delete the key "${label}"? Any app using it will lose access immediately.`,
      { confirmLabel: "Delete key", danger: true }
    );
    if (!ok) return;
    const updated = keys.filter((k) => k.id !== id);
    saveApiKeys(updated);
    setKeys(updated);
    showToast("Key deleted.");
  };

  return (
    <>
      <Topbar
        title="API Keys"
        right={
          <button className="btn btn-primary btn-sm" onClick={handleGenerate}>
            <i className="ti ti-plus" /> New key
          </button>
        }
      />
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="card">
          <div className="card-title">
            <i className="ti ti-key" style={{ color: "#C98B4A" }} /> Gateway API keys
          </div>
          <p style={{ fontSize: 13, color: "#A0856B", marginBottom: 16, lineHeight: 1.7 }}>
            These keys authenticate requests to your wolfXsms gateway.<br />
            Add them to your backend <code style={{ background: "#FAF7F4", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>.env</code> as{" "}
            <code style={{ background: "#FAF7F4", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>GATEWAY_API_KEYS=key1,key2</code>
          </p>

          {keys.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem", fontSize: 13, color: "#C4AFA3" }}>
              No keys yet. Click "New key" to generate one.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {keys.map((k) => (
                <div key={k.id}>
                  <div style={{ fontSize: 12, color: "#A0856B", marginBottom: 5 }}>
                    <strong style={{ color: "#3B2A1A" }}>{k.label}</strong>{" "}
                    <span style={{ color: "#C4AFA3" }}>— created {relTime(k.created)}</span>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#FAF7F4", border: "1px solid #EDE6DF",
                    borderRadius: 8, padding: "8px 12px",
                  }}>
                    <span style={{ flex: 1, fontFamily: "monospace", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {k.key}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(k.key).then(() => showToast("Copied!"))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#C98B4A", padding: 4, lineHeight: 1 }}
                      title="Copy key"
                    >
                      <i className="ti ti-copy" style={{ fontSize: 16 }} />
                    </button>
                    <button
                      onClick={() => handleDelete(k.id, k.label)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: 4, lineHeight: 1 }}
                      title="Delete key"
                    >
                      <i className="ti ti-trash" style={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">
            <i className="ti ti-info-circle" style={{ color: "#C98B4A" }} /> How to use
          </div>
          <p style={{ fontSize: 13, color: "#A0856B", lineHeight: 1.9 }}>
            Add your key to every API request as a header:<br />
            <code style={{ background: "#FAF7F4", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>x-api-key: your_key_here</code>
          </p>
        </div>
      </div>
    </>
  );
}
