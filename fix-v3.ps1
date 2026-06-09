# ============================================================
#  wolfXsms fix-v3 - Sidebar hamburger + Simulator stability
#  Run inside wolfXsms folder: .\fix-v3.ps1
# ============================================================

Write-Host ""
Write-Host "  Applying fixes..." -ForegroundColor Yellow

$sidebarContent = "import { useState, useEffect } from `"react`";
import { NavLink } from `"react-router-dom`";

const links = [
  { to: `"/dashboard`", icon: `"ti-layout-dashboard`", label: `"Dashboard`" },
  { to: `"/send`",      icon: `"ti-send`",             label: `"Send SMS`"  },
  { to: `"/logs`",      icon: `"ti-list`",             label: `"Logs`"      },
  { to: `"/simulator`", icon: `"ti-device-mobile`",    label: `"Simulator`" },
  { to: `"/apikeys`",   icon: `"ti-key`",              label: `"API Keys`"  },
  { to: `"/settings`",  icon: `"ti-settings`",         label: `"Settings`"  },
];

const SIDEBAR_W = 230;
const MOBILE_BP = 768;

export default function Sidebar() {
  const [open, setOpen]     = useState(false);
  const [mobile, setMobile] = useState(() => window.innerWidth < MOBILE_BP);

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < MOBILE_BP);
    window.addEventListener(`"resize`", fn);
    return () => window.removeEventListener(`"resize`", fn);
  }, []);

  const NavList = () => (
    <nav style={{ flex: 1, paddingTop: 8 }}>
      {links.map((l) => (
        <NavLink
          key={l.to} to={l.to}
          onClick={() => setOpen(false)}
          className={({ isActive }) => `"sidebar-link`" + (isActive ? `" active`" : `"`")}
        >
          <i className={``ti `${l.icon}``} style={{ fontSize: 16, width: 18, flexShrink: 0 }} />
          {l.label}
        </NavLink>
      ))}
    </nav>
  );

  const Badge = () => (
    <div style={{ padding: `"12px 16px`", borderTop: `"1px solid #5C3D22`" }}>
      <div style={{ background: `"#4E3420`", borderRadius: 8, padding: `"8px 10px`" }}>
        <div style={{ fontSize: 10, color: `"#7A5C3E`", marginBottom: 3 }}>Connected provider</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: `"#C98B4A`" }}>Africa's Talking</div>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <>
        <div style={{
          position: `"fixed`", top: 0, left: 0, right: 0, height: 52,
          background: `"#3B2A1A`", zIndex: 9999,
          display: `"flex`", alignItems: `"center`", justifyContent: `"space-between`",
          padding: `"0 16px`", boxShadow: `"0 2px 8px rgba(0,0,0,0.3)`",
        }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: `"#F5EDE3`" }}>
            wolf<span style={{ color: `"#C98B4A`" }}>X</span>sms
          </div>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              background: `"#5C3D22`", border: `"none`", color: `"#F5EDE3`",
              borderRadius: 8, width: 38, height: 38,
              display: `"flex`", flexDirection: `"column`",
              alignItems: `"center`", justifyContent: `"center`",
              gap: 5, cursor: `"pointer`", padding: `"8px 10px`",
            }}
          >
            {open ? (
              <i className=`"ti ti-x`" style={{ fontSize: 20 }} />
            ) : (
              <>
                <span style={{ display: `"block`", width: 18, height: 2, background: `"#F5EDE3`", borderRadius: 2 }} />
                <span style={{ display: `"block`", width: 18, height: 2, background: `"#F5EDE3`", borderRadius: 2 }} />
                <span style={{ display: `"block`", width: 18, height: 2, background: `"#F5EDE3`", borderRadius: 2 }} />
              </>
            )}
          </button>
        </div>

        {open && (
          <div style={{ position: `"fixed`", inset: 0, zIndex: 9998, top: 52 }}>
            <div onClick={() => setOpen(false)} style={{ position: `"absolute`", inset: 0, background: `"rgba(0,0,0,0.55)`" }} />
            <div style={{
              position: `"absolute`", top: 0, left: 0, bottom: 0,
              width: SIDEBAR_W, background: `"#3B2A1A`",
              display: `"flex`", flexDirection: `"column`",
              boxShadow: `"4px 0 20px rgba(0,0,0,0.4)`",
            }}>
              <div style={{ padding: `"16px 16px 12px`", borderBottom: `"1px solid #5C3D22`" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: `"#F5EDE3`" }}>wolf<span style={{ color: `"#C98B4A`" }}>X</span>sms</div>
                <div style={{ fontSize: 11, color: `"#7A5C3E`", marginTop: 2 }}>SMS Gateway</div>
              </div>
              <NavList />
              <Badge />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <aside style={{
      width: SIDEBAR_W, background: `"#3B2A1A`",
      display: `"flex`", flexDirection: `"column`",
      position: `"fixed`", top: 0, left: 0, height: `"100vh`", zIndex: 40,
    }}>
      <div style={{ padding: `"22px 18px 14px`", borderBottom: `"1px solid #5C3D22`" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: `"#F5EDE3`" }}>wolf<span style={{ color: `"#C98B4A`" }}>X</span>sms</div>
        <div style={{ fontSize: 11, color: `"#7A5C3E`", marginTop: 2 }}>SMS Gateway</div>
      </div>
      <NavList />
      <Badge />
    </aside>
  );
}
"
[System.IO.File]::WriteAllText("$PSScriptRoot\src\components\layout\Sidebar.tsx", $sidebarContent, [System.Text.Encoding]::UTF8)
Write-Host "  [OK] Sidebar.tsx" -ForegroundColor Green

$simulatorContent = "import { useState, useEffect, useRef } from `"react`";
import Topbar from `"../components/ui/Topbar`";
import { getSimMessages, clearSimMessages, addSimMessage, addLog } from `"../lib/storage`";
import { formatPhone, isValidPhone, relTime } from `"../lib/utils`";
import { useToast } from `"../context/ToastContext`";
import type { SimMessage } from `"../types`";

export default function Simulator() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<SimMessage[]>(() => getSimMessages());
  const [to, setTo]         = useState(`"`");
  const [from, setFrom]     = useState(`"WolfSMS`");
  const [msg, setMsg]       = useState(`"`");
  const [filter, setFilter] = useState(`"`");
  const phoneBodyRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setMessages(getSimMessages()), 1500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phoneBodyRef.current) {
      phoneBodyRef.current.scrollTop = phoneBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const filtered = filter.trim()
    ? messages.filter((m) => m.to.includes(filter.trim()) || m.to === formatPhone(filter.trim()))
    : messages;

  const handleSend = () => {
    const recipient = formatPhone(to.trim() || filter.trim());
    if (!msg.trim()) { showToast(`"Message is required.`"); return; }
    if (!isValidPhone(recipient)) { showToast(`"Enter a valid recipient number.`"); return; }
    addSimMessage({ from: from || `"WolfSMS`", to: recipient, message: msg });
    addLog({ to: recipient, message: msg, status: `"success`", cost: `"KES 0.00`" });
    setMessages(getSimMessages());
    setMsg(`"`");
    showToast(`"Delivered to simulator!`");
  };

  const handleClear = () => {
    if (!confirm(`"Clear all simulator messages?`")) return;
    clearSimMessages();
    setMessages([]);
    showToast(`"Simulator cleared.`");
  };

  return (
    <>
      <Topbar
        title=`"SMS Simulator`"
        right={
          <button className=`"btn btn-sm btn-outline`" onClick={handleClear}>
            <i className=`"ti ti-trash`" /> Clear
          </button>
        }
      />

      <div style={{ padding: `"1.25rem`", display: `"flex`", flexDirection: `"column`", gap: `"1.25rem`" }}>

        <div style={{
          background: `"#ffedd5`", border: `"1px solid #fb923c`",
          borderRadius: 10, padding: `"10px 14px`",
          fontSize: 13, color: `"#7c2d12`",
          display: `"flex`", gap: 8, flexShrink: 0,
        }}>
          <i className=`"ti ti-info-circle`" style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Messages sent from Dashboard or Send SMS appear here. No real SMS sent.</span>
        </div>

        <div style={{
          display: `"grid`",
          gridTemplateColumns: `"repeat(auto-fit, minmax(280px, 1fr))`",
          gap: `"1.25rem`",
          alignItems: `"start`",
        }}>

          <div style={{ display: `"flex`", flexDirection: `"column`", gap: `"1rem`" }}>
            <div className=`"card`">
              <div className=`"card-title`">
                <i className=`"ti ti-send`" style={{ color: `"#C98B4A`" }} /> Send test message
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: `"#A0856B`", display: `"block`", marginBottom: 4 }}>Recipient number</label>
                <input
                  className=`"form-input`"
                  placeholder=`"+254712345678 or 0712345678`"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: `"#A0856B`", display: `"block`", marginBottom: 4 }}>Sender name</label>
                <input className=`"form-input`" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: `"#A0856B`", display: `"block`", marginBottom: 4 }}>
                  Message
                  <span style={{ float: `"right`", color: `"#C4AFA3`" }}>{msg.length}/160</span>
                </label>
                <textarea
                  className=`"form-input`"
                  style={{ height: 80, resize: `"none`", display: `"block`" }}
                  placeholder=`"Type your test message...`"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
              </div>
              <button
                className=`"btn btn-primary`"
                onClick={handleSend}
                style={{ width: `"100%`", justifyContent: `"center`" }}
              >
                <i className=`"ti ti-send`" /> Deliver to simulator
              </button>
            </div>

            <div className=`"card`">
              <div className=`"card-title`">
                <i className=`"ti ti-filter`" style={{ color: `"#C98B4A`" }} /> Filter by number
              </div>
              <input
                className=`"form-input`"
                placeholder=`"+254712345678 (empty = show all)`"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <div style={{ fontSize: 12, color: `"#A0856B`", marginTop: 8 }}>
                Showing <strong>{filtered.length}</strong> of <strong>{messages.length}</strong> messages
              </div>
            </div>
          </div>

          <div style={{ display: `"flex`", justifyContent: `"center`" }}>
            <div style={{
              width: 272,
              background: `"#1a1a1a`",
              borderRadius: 40,
              padding: 10,
              boxShadow: `"0 20px 60px rgba(0,0,0,0.35)`",
              border: `"6px solid #2a2a2a`",
              height: 520,
              display: `"flex`",
              flexDirection: `"column`",
              flexShrink: 0,
            }}>
              <div style={{
                background: `"#f0f0f0`",
                borderRadius: 30,
                flex: 1,
                overflow: `"hidden`",
                display: `"flex`",
                flexDirection: `"column`",
                minHeight: 0,
              }}>
                <div style={{
                  background: `"#3B2A1A`", color: `"white`",
                  fontSize: 10, padding: `"5px 14px`",
                  display: `"flex`", justifyContent: `"space-between`",
                  flexShrink: 0,
                }}>
                  <span>9:41 AM</span>
                  <span>100%</span>
                </div>
                <div style={{
                  background: `"#3B2A1A`", color: `"white`",
                  padding: `"8px 14px`", fontSize: 12, fontWeight: 600,
                  flexShrink: 0,
                }}>
                  <i className=`"ti ti-message`" /> {filter || `"Inbox`"}
                </div>

                {filtered.length === 0 ? (
                  <div style={{
                    flex: 1, display: `"flex`", flexDirection: `"column`",
                    alignItems: `"center`", justifyContent: `"center`",
                    gap: 8, color: `"#aaa`", fontSize: 12,
                    background: `"#e8e8e8`", padding: 16, textAlign: `"center`",
                  }}>
                    <i className=`"ti ti-message-off`" style={{ fontSize: 28 }} />
                    <span>No messages yet</span>
                    <span style={{ fontSize: 11, color: `"#bbb`" }}>Send from the form or Dashboard</span>
                  </div>
                ) : (
                  <div
                    ref={phoneBodyRef}
                    style={{
                      flex: 1,
                      overflowY: `"auto`",
                      padding: `"10px 8px`",
                      display: `"flex`",
                      flexDirection: `"column`",
                      gap: 8,
                      background: `"#e8e8e8`",
                      minHeight: 0,
                    }}
                  >
                    {[...filtered].reverse().map((m) => (
                      <div key={m.id} style={{
                        background: `"white`",
                        borderRadius: `"12px 12px 12px 2px`",
                        padding: `"7px 10px`",
                        maxWidth: `"85%`",
                        boxShadow: `"0 1px 3px rgba(0,0,0,0.1)`",
                        flexShrink: 0,
                      }}>
                        <div style={{ fontSize: 10, color: `"#C98B4A`", fontWeight: 700, marginBottom: 2 }}>{m.from}</div>
                        <div style={{ fontSize: 12, color: `"#1a1a1a`", lineHeight: 1.4, wordBreak: `"break-word`" }}>{m.message}</div>
                        <div style={{ fontSize: 10, color: `"#999`", marginTop: 3, textAlign: `"right`" }}>{relTime(m.time)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {messages.length > 0 && (
          <div className=`"card`">
            <div className=`"card-title`">
              <i className=`"ti ti-history`" style={{ color: `"#C98B4A`" }} />
              All simulator messages ({messages.length})
            </div>
            <div style={{ overflowX: `"auto`" }}>
              <table style={{ width: `"100%`", borderCollapse: `"collapse`", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `"1px solid #EDE6DF`" }}>
                    {[`"From`",`"To`",`"Message`",`"Time`"].map(h => (
                      <th key={h} style={{ textAlign: `"left`", padding: `"0 8px 8px 0`", fontSize: 11, color: `"#A0856B`", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m.id} style={{ borderBottom: `"1px solid #F5F0EB`" }}>
                      <td style={{ padding: `"8px 8px 8px 0`", color: `"#C98B4A`", fontWeight: 600, fontSize: 12 }}>{m.from}</td>
                      <td style={{ padding: `"8px 8px`", fontFamily: `"monospace`", fontSize: 11 }}>{m.to}</td>
                      <td style={{ padding: `"8px 8px`", color: `"#A0856B`", maxWidth: 200, overflow: `"hidden`", textOverflow: `"ellipsis`", whiteSpace: `"nowrap`" }}>{m.message}</td>
                      <td style={{ padding: `"8px 0`", color: `"#C4AFA3`", fontSize: 11 }}>{relTime(m.time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
"
[System.IO.File]::WriteAllText("$PSScriptRoot\src\pages\Simulator.tsx", $simulatorContent, [System.Text.Encoding]::UTF8)
Write-Host "  [OK] Simulator.tsx" -ForegroundColor Green

Write-Host ""
Write-Host "  Done! Run: npm run dev" -ForegroundColor Cyan
Write-Host ""