import { useState } from "react";
import Topbar from "../components/ui/Topbar";
import { getLogs, clearLogs } from "../lib/storage";
import { relTime } from "../lib/utils";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";
import type { SmsLog } from "../types";

export default function Logs() {
  const { showToast } = useToast();
  const { confirm } = useModal();
  const [logs, setLogs] = useState<SmsLog[]>(getLogs);

  const handleClear = async () => {
    const ok = await confirm(
      "Clear all logs",
      "This will permanently delete all message logs. This action cannot be undone.",
      { confirmLabel: "Yes, clear all", danger: true }
    );
    if (!ok) return;
    clearLogs();
    setLogs([]);
    showToast("Logs cleared.");
  };

  return (
    <>
      <Topbar
        title="Message logs"
        right={
          <button className="btn btn-sm btn-outline" onClick={handleClear}>
            <i className="ti ti-trash" /> Clear logs
          </button>
        }
      />
      <div className="p-6">
        <div className="card">
          {logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3.5rem", fontSize: 14, color: "#C4AFA3" }}>
              No logs yet. Send a message to see it here.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #EDE6DF" }}>
                    {["#","Number","Message","Status","Time","Cost"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "0 8px 8px 0", fontSize: 11, color: "#A0856B", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l, i) => (
                    <tr key={l.id} style={{ borderBottom: "1px solid #F5F0EB" }}>
                      <td style={{ padding: "10px 8px 10px 0", color: "#C4AFA3", fontSize: 11 }}>{i + 1}</td>
                      <td style={{ padding: "10px 8px", fontFamily: "monospace", fontSize: 12 }}>{l.to}</td>
                      <td style={{ padding: "10px 8px", color: "#A0856B", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.message}</td>
                      <td style={{ padding: "10px 8px" }}>
                        <span className={`badge badge-${l.status === "success" ? "success" : "danger"}`}>{l.status}</span>
                      </td>
                      <td style={{ padding: "10px 8px", color: "#C4AFA3", fontSize: 11 }}>{relTime(l.time)}</td>
                      <td style={{ padding: "10px 0", color: "#C98B4A", fontSize: 11 }}>{l.status === "success" ? (l.cost || "KES 0.80") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
