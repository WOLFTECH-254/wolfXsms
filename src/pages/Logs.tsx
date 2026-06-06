import { useState } from "react";
import Topbar from "../components/ui/Topbar";
import { getLogs, clearLogs } from "../lib/storage";
import { relTime } from "../lib/utils";
import { useToast } from "../context/ToastContext";
import type { SmsLog } from "../types";
export default function Logs() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<SmsLog[]>(getLogs);
  const handleClear = () => { if (!confirm("Clear all logs?")) return; clearLogs(); setLogs([]); showToast("Logs cleared."); };
  return (
    <>
      <Topbar title="Message logs" right={<button className="btn btn-sm btn-outline" onClick={handleClear}><i className="ti ti-trash" /> Clear logs</button>} />
      <div className="p-6"><div className="card">
        {logs.length === 0 ? <div className="text-center py-14 text-sm text-[#C4AFA3]">No logs yet.</div> : (
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-[#A0856B] border-b border-[#EDE6DF]"><th className="text-left pb-2 font-medium">#</th><th className="text-left pb-2 font-medium">Number</th><th className="text-left pb-2 font-medium">Message</th><th className="text-left pb-2 font-medium">Status</th><th className="text-left pb-2 font-medium">Time</th><th className="text-left pb-2 font-medium">Cost</th></tr></thead>
            <tbody>{logs.map((l, i) => (<tr key={l.id} className="border-b border-[#F5F0EB] last:border-0 hover:bg-[#FAF7F4]"><td className="py-2.5 text-xs text-[#C4AFA3]">{i+1}</td><td className="py-2.5 font-mono text-xs">{l.to}</td><td className="py-2.5 text-[#A0856B] max-w-[220px] truncate">{l.message}</td><td className="py-2.5"><span className={`badge badge-${l.status === "success" ? "success" : "danger"}`}>{l.status}</span></td><td className="py-2.5 text-xs text-[#C4AFA3]">{relTime(l.time)}</td><td className="py-2.5 text-xs text-[#C98B4A]">{l.status === "success" ? "KES 0.80" : "—"}</td></tr>))}</tbody>
          </table>
        )}
      </div></div>
    </>
  );
}
