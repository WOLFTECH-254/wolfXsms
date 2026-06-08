import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import AppLayout  from "./components/layout/AppLayout";
import Landing    from "./pages/Landing";
import Dashboard  from "./pages/Dashboard";
import Send       from "./pages/Send";
import Logs       from "./pages/Logs";
import Simulator  from "./pages/Simulator";
import ApiKeys    from "./pages/ApiKeys";
import Settings   from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send"      element={<Send />} />
            <Route path="/logs"      element={<Logs />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/apikeys"   element={<ApiKeys />} />
            <Route path="/settings"  element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
