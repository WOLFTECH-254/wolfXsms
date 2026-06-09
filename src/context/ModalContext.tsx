import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ModalType = "confirm" | "prompt" | "alert";

interface ModalState {
  type: ModalType;
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  resolve: (value: string | boolean | null) => void;
}

interface ModalCtx {
  confirm: (title: string, message: string, opts?: { confirmLabel?: string; cancelLabel?: string; danger?: boolean }) => Promise<boolean>;
  prompt: (title: string, message: string, opts?: { placeholder?: string; defaultValue?: string; confirmLabel?: string }) => Promise<string | null>;
  alert: (title: string, message: string) => Promise<void>;
}

const ModalContext = createContext<ModalCtx>({
  confirm: async () => false,
  prompt: async () => null,
  alert: async () => {},
});

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [inputValue, setInputValue] = useState("");

  const confirm = useCallback((title: string, message: string, opts?: { confirmLabel?: string; cancelLabel?: string; danger?: boolean }): Promise<boolean> => {
    return new Promise((resolve) => {
      setModal({ type: "confirm", title, message, confirmLabel: opts?.confirmLabel || "Confirm", cancelLabel: opts?.cancelLabel || "Cancel", danger: opts?.danger, resolve });
    });
  }, []);

  const prompt = useCallback((title: string, message: string, opts?: { placeholder?: string; defaultValue?: string; confirmLabel?: string }): Promise<string | null> => {
    setInputValue(opts?.defaultValue || "");
    return new Promise((resolve) => {
      setModal({ type: "prompt", title, message, placeholder: opts?.placeholder, defaultValue: opts?.defaultValue, confirmLabel: opts?.confirmLabel || "OK", resolve });
    });
  }, []);

  const alert = useCallback((title: string, message: string): Promise<void> => {
    return new Promise((resolve) => {
      setModal({ type: "alert", title, message, resolve });
    });
  }, []);

  const handleConfirm = () => {
    if (!modal) return;
    if (modal.type === "prompt") modal.resolve(inputValue);
    else modal.resolve(true);
    setModal(null);
  };

  const handleCancel = () => {
    if (!modal) return;
    if (modal.type === "prompt") modal.resolve(null);
    else modal.resolve(false);
    setModal(null);
  };

  return (
    <ModalContext.Provider value={{ confirm, prompt, alert }}>
      {children}
      {modal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
          background: "rgba(0,0,0,0.45)",
          animation: "fadeIn 0.15s ease",
        }}>
          <div style={{
            background: "white", borderRadius: 16,
            padding: "1.5rem", width: "100%", maxWidth: 420,
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            animation: "slideUp 0.2s ease",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              {modal.type === "alert" && (
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ffedd5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-info-circle" style={{ fontSize: 20, color: "#C98B4A" }} />
                </div>
              )}
              {modal.type === "confirm" && (
                <div style={{ width: 36, height: 36, borderRadius: 10, background: modal.danger ? "#fee2e2" : "#ffedd5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`ti ${modal.danger ? "ti-alert-triangle" : "ti-help-circle"}`} style={{ fontSize: 20, color: modal.danger ? "#dc2626" : "#C98B4A" }} />
                </div>
              )}
              {modal.type === "prompt" && (
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EDE6DF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-pencil" style={{ fontSize: 20, color: "#3B2A1A" }} />
                </div>
              )}
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "#2C1A0E", margin: 0 }}>{modal.title}</h2>
            </div>

            {/* Message */}
            <p style={{ fontSize: 14, color: "#A0856B", margin: "0 0 1.25rem", lineHeight: 1.6 }}>{modal.message}</p>

            {/* Input for prompt */}
            {modal.type === "prompt" && (
              <input
                autoFocus
                className="form-input"
                style={{ marginBottom: "1.25rem" }}
                placeholder={modal.placeholder || ""}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleConfirm(); if (e.key === "Escape") handleCancel(); }}
              />
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              {modal.type !== "alert" && (
                <button
                  onClick={handleCancel}
                  className="btn btn-outline btn-sm"
                  style={{ minWidth: 80 }}
                >
                  {modal.cancelLabel || "Cancel"}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className="btn btn-sm"
                style={{
                  minWidth: 80,
                  background: modal.danger ? "#dc2626" : "#3B2A1A",
                  color: "#F5EDE3",
                }}
              >
                {modal.type === "alert" ? "OK" : modal.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          `}</style>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
