import { createContext, useContext, useState, useCallback, ReactNode } from "react";
interface ToastCtx { showToast: (msg: string) => void; }
const ToastContext = createContext<ToastCtx>({ showToast: () => {} });
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const showToast = useCallback((m: string) => {
    setMsg(m); setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  }, []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 transition-all duration-300"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", pointerEvents: "none" }}>
        <div className="bg-[#3B2A1A] text-[#F5EDE3] text-sm px-5 py-3 rounded-xl shadow-md">{msg}</div>
      </div>
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext);
