import { useState } from "react";
import { Link } from "react-router-dom";

const features = [
  { icon: "ti-send",    title: "Single & Bulk SMS",  desc: "Send to one or thousands in a single API call." },
  { icon: "ti-key",     title: "API key auth",        desc: "Secure your gateway with generated API keys."  },
  { icon: "ti-list",    title: "Message logs",        desc: "Every message logged with status and cost."    },
  { icon: "ti-refresh", title: "Sandbox ready",       desc: "Test everything free before going live."       },
  { icon: "ti-server",  title: "Self-hosted",         desc: "Deploy on your VPS. You own everything."       },
  { icon: "ti-plug",    title: "Drop-in integration", desc: "Works with any stack that sends HTTP requests." },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{background:"white", minHeight:"100vh"}}>

      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 5%",borderBottom:"1px solid #EDE6DF",position:"sticky",top:0,background:"white",zIndex:50}}>
        <div style={{fontSize:"1.2rem",fontWeight:700,color:"#3B2A1A"}}>wolf<span style={{color:"#C98B4A"}}>X</span>sms</div>
        {/* Desktop links */}
        <div style={{display:"flex",alignItems:"center",gap:"2rem"}} className="desk-nav">
          <a href="#features" style={{fontSize:"0.875rem",color:"#A0856B",textDecoration:"none"}}>Features</a>
          <a href="#pricing"  style={{fontSize:"0.875rem",color:"#A0856B",textDecoration:"none"}}>Pricing</a>
          <Link to="/dashboard" className="btn btn-primary btn-sm">Open Dashboard</Link>
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{display:"none",background:"none",border:"none",fontSize:"1.5rem",cursor:"pointer",color:"#3B2A1A"}} className="mob-menu-btn">☰</button>
      </nav>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{background:"white",borderBottom:"1px solid #EDE6DF",padding:"1rem 5%",display:"flex",flexDirection:"column",gap:"1rem"}}>
          <a href="#features" onClick={()=>setMenuOpen(false)} style={{color:"#A0856B",textDecoration:"none",fontSize:"0.875rem"}}>Features</a>
          <a href="#pricing"  onClick={()=>setMenuOpen(false)} style={{color:"#A0856B",textDecoration:"none",fontSize:"0.875rem"}}>Pricing</a>
          <Link to="/dashboard" className="btn btn-primary btn-sm" style={{alignSelf:"flex-start"}}>Open Dashboard</Link>
        </div>
      )}

      {/* Hero */}
      <section style={{maxWidth:"1100px",margin:"0 auto",padding:"5rem 5% 4rem",textAlign:"center"}}>
        <span style={{fontSize:"0.75rem",padding:"0.25rem 1rem",borderRadius:"9999px",background:"#ffedd5",color:"#9a3412",border:"1px solid #fb923c",display:"inline-block",marginBottom:"1.5rem"}}>
          Powered by Africa&apos;s Talking
        </span>
        <h1 style={{fontSize:"clamp(2rem, 5vw, 3.5rem)",fontWeight:700,color:"#3B2A1A",lineHeight:1.15,marginBottom:"1.25rem"}}>
          Send SMS at scale<br/>with <span style={{color:"#C98B4A"}}>wolfXsms</span>
        </h1>
        <p style={{fontSize:"clamp(0.95rem, 2vw, 1.1rem)",color:"#A0856B",maxWidth:"560px",margin:"0 auto 2.5rem",lineHeight:1.7}}>
          A lightweight, self-hosted SMS gateway built for Kenyan developers. One API, clean dashboard, zero complexity.
        </p>
        <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
          <Link to="/dashboard" className="btn btn-primary"><i className="ti ti-layout-dashboard" /> Go to Dashboard</Link>
          <Link to="/send"      className="btn btn-outline"><i className="ti ti-send" /> Send a Message</Link>
        </div>

        {/* Code block */}
        <div style={{background:"#3B2A1A",borderRadius:"1rem",padding:"1.5rem 2rem",marginTop:"3rem",textAlign:"left",fontFamily:"monospace",fontSize:"clamp(0.75rem,1.5vw,0.875rem)",color:"#F5EDE3",lineHeight:1.9,overflowX:"auto"}}>
          <div style={{color:"#7A6A5A"}}>{"// Send an SMS with wolfXsms"}</div>
          <div><span style={{color:"#C98B4A"}}>POST</span> https://your-vps.com/api/sms/send</div>
          <div>&nbsp;</div>
          <div>{"{"}</div>
          <div>&nbsp;&nbsp;<span style={{color:"#C98B4A"}}>"to"</span>: <span style={{color:"#86efac"}}>"+254712345678"</span>,</div>
          <div>&nbsp;&nbsp;<span style={{color:"#C98B4A"}}>"message"</span>: <span style={{color:"#86efac"}}>"Hello from wolfXsms!"</span></div>
          <div>{"}"}</div>
          <div>&nbsp;</div>
          <div style={{color:"#7A6A5A"}}>{"// Response"}</div>
          <div>{"{ "}<span style={{color:"#C98B4A"}}>"success"</span>: <span style={{color:"#93c5fd"}}>true</span>, <span style={{color:"#C98B4A"}}>"sent"</span>: <span style={{color:"#93c5fd"}}>1</span>{" }"}</div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{background:"#FAF7F4",padding:"5rem 5%"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <h2 style={{fontSize:"clamp(1.5rem,3vw,2rem)",fontWeight:700,color:"#3B2A1A",textAlign:"center",marginBottom:"0.5rem"}}>Everything you need</h2>
          <p style={{textAlign:"center",color:"#A0856B",marginBottom:"3rem"}}>Built simple, built fast, built for Africa.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1.25rem"}}>
            {features.map((f) => (
              <div key={f.title} style={{background:"white",border:"1px solid #EDE6DF",borderRadius:"1rem",padding:"1.5rem"}}>
                <div style={{width:"2.5rem",height:"2.5rem",background:"#ffedd5",borderRadius:"0.5rem",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",color:"#C98B4A",marginBottom:"1rem"}}>
                  <i className={`ti ${f.icon}`} />
                </div>
                <h3 style={{fontSize:"0.875rem",fontWeight:600,color:"#3B2A1A",marginBottom:"0.5rem"}}>{f.title}</h3>
                <p style={{fontSize:"0.8rem",color:"#A0856B",lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{padding:"5rem 5%",background:"white"}}>
        <div style={{maxWidth:"800px",margin:"0 auto"}}>
          <h2 style={{fontSize:"clamp(1.5rem,3vw,2rem)",fontWeight:700,color:"#3B2A1A",textAlign:"center",marginBottom:"0.5rem"}}>Simple pricing</h2>
          <p style={{textAlign:"center",color:"#A0856B",marginBottom:"3rem"}}>You only pay Africa&apos;s Talking rates. wolfXsms is free.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1.5rem"}}>
            {[
              { plan:"Sandbox", price:"KES 0", per:"/ SMS", desc:"Free testing, no real delivery.", features:["Unlimited test messages","Dashboard & logs","Simulator delivery","Full API access"], btn:"Get started free", to:"/dashboard", featured:false },
              { plan:"Production", price:"KES 0.80", per:"/ SMS", desc:"Real delivery via Africa's Talking.", features:["Safaricom, Airtel, Telkom","Custom sender ID","Delivery reports","Full API access"], btn:"Configure now", to:"/settings", featured:true },
            ].map((p) => (
              <div key={p.plan} style={{borderRadius:"1rem",padding:"1.75rem",border: p.featured ? "2px solid #C98B4A" : "1px solid #EDE6DF",background: p.featured ? "#fff9f4" : "white"}}>
                <div style={{fontSize:"0.75rem",fontWeight:600,color:"#A0856B",marginBottom:"0.5rem"}}>{p.plan}</div>
                <div style={{fontSize:"2.25rem",fontWeight:700,color:"#3B2A1A"}}>{p.price} <span style={{fontSize:"0.875rem",fontWeight:400,color:"#A0856B"}}>{p.per}</span></div>
                <div style={{fontSize:"0.8rem",color:"#A0856B",margin:"0.5rem 0 1.25rem"}}>{p.desc}</div>
                <ul style={{listStyle:"none",marginBottom:"1.5rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                  {p.features.map((f) => (<li key={f} style={{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.875rem",color:"#3B2A1A"}}><span style={{color:"#16a34a",fontWeight:700}}>✓</span>{f}</li>))}
                </ul>
                <Link to={p.to} className={`btn ${p.featured ? "btn-accent" : "btn-outline"}`} style={{width:"100%",justifyContent:"center"}}>{p.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background:"#3B2A1A",color:"#7A5C3E",textAlign:"center",padding:"1.75rem 5%",fontSize:"0.875rem"}}>
        &copy; 2026 <span style={{color:"#C98B4A"}}>wolfXsms</span> &mdash; Built by Silent Wolf
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .desk-nav { display: none !important; }
          .mob-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
