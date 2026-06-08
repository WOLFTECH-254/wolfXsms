import type { SmsLog, ApiKey, Settings, SimMessage } from "../types";

const KEYS = {
  logs:     "wolfsms_logs",
  apiKeys:  "wolfsms_apikeys",
  settings: "wolfsms_settings",
  sim:      "wolfsms_sim",
};

export const getLogs = (): SmsLog[] =>
  JSON.parse(localStorage.getItem(KEYS.logs) || "[]");

export const addLog = (entry: Omit<SmsLog, "id" | "time">): void => {
  const logs = getLogs();
  logs.unshift({ ...entry, id: Date.now(), time: new Date().toISOString() });
  localStorage.setItem(KEYS.logs, JSON.stringify(logs.slice(0, 200)));
};

export const clearLogs = (): void => localStorage.removeItem(KEYS.logs);

export const getApiKeys = (): ApiKey[] =>
  JSON.parse(localStorage.getItem(KEYS.apiKeys) || "[]");

export const saveApiKeys = (keys: ApiKey[]): void =>
  localStorage.setItem(KEYS.apiKeys, JSON.stringify(keys));

export const getSettings = (): Settings =>
  JSON.parse(
    localStorage.getItem(KEYS.settings) ||
    JSON.stringify({ gatewayUrl: "http://localhost:3000", gatewayKey: "", atUsername: "sandbox", defaultSender: "" })
  );

export const saveSettings = (s: Settings): void =>
  localStorage.setItem(KEYS.settings, JSON.stringify(s));

export const getSimMessages = (): SimMessage[] =>
  JSON.parse(localStorage.getItem(KEYS.sim) || "[]");

export const addSimMessage = (entry: Omit<SimMessage, "id" | "time">): void => {
  const msgs = getSimMessages();
  msgs.unshift({ ...entry, id: Date.now(), time: new Date().toISOString() });
  localStorage.setItem(KEYS.sim, JSON.stringify(msgs.slice(0, 100)));
};

export const clearSimMessages = (): void => localStorage.removeItem(KEYS.sim);
