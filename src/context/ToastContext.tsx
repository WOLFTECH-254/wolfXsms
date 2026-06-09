import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  subtext?: string;
}

interface ToastCtx {
  showToast: (message: string, type?: ToastType, subtext?: string) => void;
}

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });

const config: Record<ToastType, { icon: string; color: string; bg: string; ringColor: string }> = {
  success: { icon: "ti-check",          color: "#16a34a", bg: "#f0fdf4", ringColor: "#bbf7d0" },
  error:   { icon: "ti-x",              color: "#dc2626", bg: "#fef2f2", ringColor: "#fecaca" },
  warning: { icon: "ti-alert-triangle", color: "#d97706", bg: "#fffbeb", ringColor: "#fde68a" },
  info:    { icon: "ti-info-circle",    color: "#C98B4A", bg: "#fff9f4", ringColor: "#F5EDE3" },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => { setToast(null); setExiting(false); }, 300);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info", subtext?: string) => {
    setExiting(false);
    setToast({ id: Date.now(), message, type, subtext });
    setTimeout(() => {
      setExiting(true);
      setTimeout(() => { setToast(null); setExiting(false); }, 300);
    }, 2800);
  }, []);

  const c = toast ? config[toast.type] : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && c && (
        <div
          onClick={dismiss}
          style={{
            position: "fixed", inset: 0, zIndex: 999999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.35)",
            animation: exiting ? "fadeOut 0.3s ease forwards" : "fadeIn 0.2s ease forwards",
            cursor: "pointer",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 24,
              padding: "2.5rem 2rem",
              width: "100%",
              maxWidth: 320,
              margin: "1rem",
              textAlign: "center",
              boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
              animation: exiting ? "popOut 0.3s cubic-bezier(0.4,0,1,1) forwards" : "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            {/* Outer ring */}
            <div style={{
              width: 90, height: 90,
              borderRadius: "50%",
              background: c.ringColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem",
              animation: exiting ? "none" : "ringPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s both",
            }}>
              {/* Inner circle */}
              <div style={{
                width: 68, height: 68,
                borderRadius: "50%",
                background: c.bg,
                border: `3px solid ${c.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: exiting ? "none" : "iconPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.25s both",
              }}>
                <i className={`ti ${c.icon}`} style={{
                  fontSize: 32,
                  color: c.color,
                  animation: exiting ? "none" : "iconIn 0.3s ease 0.35s both",
                }} />
              </div>
            </div>

            {/* Text */}
            <div style={{
              fontSize: 17, fontWeight: 700, color: "#1a1a1a",
              marginBottom: toast.subtext ? 8 : 0,
              lineHeight: 1.3,
              animation: exiting ? "none" : "textIn 0.3s ease 0.3s both",
            }}>
              {toast.message}
            </div>

            {toast.subtext && (
              <div style={{
                fontSize: 13, color: "#888", lineHeight: 1.5,
                animation: exiting ? "none" : "textIn 0.3s ease 0.4s both",
              }}>
                {toast.subtext}
              </div>
            )}

            {/* Progress bar */}
            <div style={{
              height: 3, background: "#f0f0f0",
              borderRadius: 99, marginTop: "1.5rem", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", background: c.color, borderRadius: 99,
                animation: "drain 2.8s linear forwards",
                transformOrigin: "left",
              }} />
            </div>

            <div style={{ fontSize: 11, color: "#ccc", marginTop: 8 }}>
              Click anywhere to dismiss
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes popIn   { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
        @keyframes popOut  { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.8); } }
        @keyframes ringPop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes iconPop { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes iconIn  { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes textIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drain   { from { transform: scaleX(1); } to { transform: scaleX(0); } }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
