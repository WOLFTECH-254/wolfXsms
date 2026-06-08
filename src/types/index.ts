export interface SmsLog {
  id: number;
  to: string;
  message: string;
  status: "success" | "failed";
  time: string;
  cost?: string;
}
export interface ApiKey {
  id: string;
  label: string;
  key: string;
  created: string;
}
export interface Settings {
  gatewayUrl: string;
  gatewayKey: string;
  atUsername: string;
  defaultSender: string;
}
export interface SendPayload {
  to: string | string[];
  message: string;
  from?: string;
}
export interface SendResponse {
  success: boolean;
  data?: { message: string; total: number; sent: number; failed: number; recipients: { number: string; status: string; cost: string; messageId: string }[] };
  error?: string;
}
export interface PingResponse {
  success: boolean;
  provider: string;
  mode: string;
  username: string;
  timestamp: string;
}
export interface SimMessage {
  id: number;
  from: string;
  to: string;
  message: string;
  time: string;
}
