export const formatPhone = (num: string): string => {
  num = num.trim().replace(/\s+/g, "");
  if (num.startsWith("07") || num.startsWith("01")) return "+254" + num.slice(1);
  if (num.startsWith("254") && !num.startsWith("+")) return "+" + num;
  return num;
};
export const isValidPhone = (num: string): boolean => /^\+\d{7,15}$/.test(num);
export const relTime = (iso: string): string => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return diff + "s ago";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
};
export const generateKey = (): string =>
  "wolf_" + Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, "0")).join("");
