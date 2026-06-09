import { useEffect } from "react";

interface MetaOptions {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
}

const BASE = "wolfXsms";
const BASE_URL = "https://sms.xwolf.space";

export function usePageMeta({ title, description, ogTitle, ogDescription, ogUrl }: MetaOptions) {
  useEffect(() => {
    document.title = `${title} | ${BASE}`;

    const setMeta = (selector: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", value);
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', ogTitle || title);
    setMeta('meta[property="og:description"]', ogDescription || description);
    setMeta('meta[property="og:url"]', `${BASE_URL}${ogUrl || "/"}`);
    setMeta('meta[name="twitter:title"]', ogTitle || title);
    setMeta('meta[name="twitter:description"]', ogDescription || description);
    setMeta('meta[name="twitter:url"]', `${BASE_URL}${ogUrl || "/"}`);
  }, [title, description, ogTitle, ogDescription, ogUrl]);
}