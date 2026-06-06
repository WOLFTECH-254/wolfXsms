import { ReactNode } from "react";
interface Props { title: string; right?: ReactNode; }
export default function Topbar({ title, right }: Props) {
  return (
    <div className="bg-white border-b border-[#EDE6DF] px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-sm font-semibold text-[#2C1A0E]">{title}</h1>
      {right && <div className="flex items-center gap-3">{right}</div>}
    </div>
  );
}
