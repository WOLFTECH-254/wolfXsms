import axios from "axios";
import type { SendPayload, SendResponse, PingResponse } from "../types";
import { getSettings } from "./storage";
const client = () => {
  const { gatewayUrl, gatewayKey } = getSettings();
  return axios.create({ baseURL: gatewayUrl, headers: { "x-api-key": gatewayKey, "Content-Type": "application/json" } });
};
export const sendSms = (payload: SendPayload): Promise<SendResponse> =>
  client().post<SendResponse>("/api/sms/send", payload).then((r) => r.data);
export const pingGateway = (): Promise<PingResponse> =>
  client().get<PingResponse>("/api/sms/ping").then((r) => r.data);
