import { useState, useEffect, useRef } from "react";

const TOOLS = [
  { id: "blog", label: "Blog Post", icon: "✍️", prompt: (input) => `Write a compelling, SEO-optimized blog post about: "${input}". Include a catchy headline, introduction, 3-4 subheadings with content, and a conclusion with a call to action. Make it engaging and around 500 words.` },
  { id: "email", label: "Sales Email", icon: "📧", prompt: (input) => `Write a persuasive sales email for: "${input}". Include a subject line, personalized opening, clear value proposition, social proof element, and a strong CTA. Keep it concise and compelling.` },
  { id: "caption", label: "Social Caption", icon: "📱", prompt: (input) => `Write 3 engaging social media captions for: "${input}". Make them punchy, include relevant emojis, hashtags, and a hook that stops the scroll. Vary the tone: one professional, one casual, one bold.` },
  { id: "product", label: "Product Description", icon: "🛍️", prompt: (input) => `Write a high-converting product description for: "${input}". Focus on benefits over features, use sensory language, address pain points, and end with urgency. Format it for an e-commerce listing.` },
  { id: "bio", label: "Professional Bio", icon: "👤", prompt: (input) => `Write a compelling professional bio for: "${input}". Write in third person, highlight achievements, establish credibility, show personality, and end with a memorable closing. Keep it to 150 words.` },
  { id: "ad", label: "Ad Copy", icon: "🎯", prompt: (input) => `Write high-converting ad copy for: "${input}". Create 3 variations: one for Google Ads (headline + description), one for Facebook/Instagram (short punchy copy), and one for LinkedIn (professional tone). Focus on pain points and solutions.` },
];

const PLANS = [
  { name: "Free", price: "$0", limit: "5 generations/mo", features: ["All 6 tools", "Standard quality", "Copy to clipboard"], cta: "Get Started", highlight: false },
  { name: "Pro", price: "$19", limit: "Unlimited generations", features: ["All 6 tools", "Priority speed", "Export to .txt", "No watermark", "Email support"], cta: "Start Free Trial", highlight: true },
  { name: "Agency", price: "$79", limit: "Team of 5 seats", features: ["Everything in Pro", "Team workspace", "API access", "Priority support", "Custom brand voice"], cta: "Contact Sales", highlight: false },
];

export default function App() {
  const [view, setView] = useState("landing");
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const outputRef = useRef(null);
  const FREE_LIMIT = 5;

  const generate = async () => {
    if (!input.trim()) return;
    if (usageCount >= FREE_LIMIT) { setShowPaywall(true); return; }

    setLoading(true);
    setOutput("");
    setUsageCount(c => c + 1);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: activeTool.prompt(input) }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "Something went wrong. Try again.";
      
      // Animate text in
      let i = 0;
      const interval = setInterval(() => {
        setOutput(text.slice(0, i));
        i += 8;
        if (i > text.length) { setOutput(text); clearInterval(interval); }
      }, 16);
    } catch {
      setOutput("Error connecting to AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (view === "app") return (
    <AppView
      tools={TOOLS} activeTool={activeTool} setActiveTool={setActiveTool}
      input={input} setInput={setInput} output={output} loading={loading}
      generate={generate} copyToClipboard={copyToClipboard} copied={copied}
      usageCount={usageCount} freeLimit={FREE_LIMIT}
      showPaywall={showPaywall} setShowPaywall={setShowPaywall}
      setView={setView} outputRef={outputRef}
    />
  );

  return <LandingView setView={setView} plans={PLANS} />;
}

function LandingView({ setView, plans }) {
  return (
    <div style={styles.page}>
      <style>{css}</style>
      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.logo}>✦ WORDCRAFT<span style={styles.logoAI}>AI</span></div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="#pricing" style={styles.navLink}>Pricing</a>
          <button style={styles.navCta} onClick={() => setView("app")}>Try Free →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.badge}>✦ AI-Powered Copy in Seconds</div>
        <h1 style={styles.heroTitle}>
          Words that<br /><span style={styles.heroAccent}>sell, convert</span><br />& captivate.
        </h1>
        <p style={styles.heroSub}>
          Generate blog posts, sales emails, ad copy, and more — all powered by advanced AI. No writer's block. No wasted hours.
        </p>
        <button style={styles.heroCta} className="pulse-btn" onClick={() => setView("app")}>
          Start Writing Free — No Card Needed
        </button>
        <p style={styles.heroNote}>5 free generations · No signup required</p>

        {/* Mock UI Preview */}
        <div style={styles.mockup} className="float-up">
          <div style={styles.mockupBar}>
            <span style={{...styles.mockDot, background:"#ff5f57"}} />
            <span style={{...styles.mockDot, background:"#febc2e"}} />
            <span style={{...styles.mockDot, background:"#28c840"}} />
            <span style={styles.mockTitle}>WordCraft AI</span>
          </div>
          <div style={styles.mockBody}>
            <div style={styles.mockTools}>
              {["✍️ Blog", "📧 Email", "📱 Caption", "🛍️ Product"].map((t, i) => (
                <div key={i} style={{...styles.mockTool, ...(i===0 ? styles.mockToolActive : {})}}>{t}</div>
              ))}
            </div>
            <div style={styles.mockInput}>Write a blog post about sustainable fashion trends in 2025...</div>
            <div style={styles.mockOutput}>
              <div style={styles.mockOutputLine} />
              <div style={{...styles.mockOutputLine, width:"85%"}} />
              <div style={{...styles.mockOutputLine, width:"92%"}} />
              <div style={{...styles.mockOutputLine, width:"70%"}} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Everything you need to write better, faster</h2>
        <div style={styles.featureGrid}>
          {[
            { icon: "⚡", title: "Instant Output", desc: "Get polished copy in under 10 seconds. No waiting, no revising endlessly." },
            { icon: "🎯", title: "6 Powerful Tools", desc: "Blog posts, emails, captions, ads, bios & product descriptions — all in one place." },
            { icon: "🧠", title: "Claude AI Engine", desc: "Powered by Anthropic's Claude — one of the most capable AI models available." },
            { icon: "💼", title: "Built to Sell", desc: "Every output is crafted to convert, engage, and get results for your business." },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard} className="feature-card">
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={styles.pricing} id="pricing">
        <h2 style={styles.sectionTitle}>Simple, transparent pricing</h2>
        <p style={styles.sectionSub}>Start free. Scale when you're ready.</p>
        <div style={styles.pricingGrid}>
          {plans.map((p, i) => (
            <div key={i} style={{...styles.planCard, ...(p.highlight ? styles.planHighlight : {})}}>
              {p.highlight && <div style={styles.planBadge}>Most Popular</div>}
              <div style={styles.planName}>{p.name}</div>
              <div style={styles.planPrice}>{p.price}<span style={styles.planPer}>/mo</span></div>
              <div style={styles.planLimit}>{p.limit}</div>
              <div style={styles.planDivider} />
              {p.features.map((f, j) => <div key={j} style={styles.planFeature}>✓ {f}</div>)}
              <button style={{...styles.planCta, ...(p.highlight ? styles.planCtaHighlight : {})}}
                onClick={() => p.name === "Free" ? setView("app") : alert("Connect Stripe to enable payments!")}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.logo}>✦ WORDCRAFT<span style={styles.logoAI}>AI</span></div>
        <p style={styles.footerNote}>Built with Claude AI · Ready to deploy · © 2026</p>
      </footer>
    </div>
  );
}

function AppView({ tools, activeTool, setActiveTool, input, setInput, output, loading, generate, copyToClipboard, copied, usageCount, freeLimit, showPaywall, setShowPaywall, setView, outputRef }) {
  return (
    <div style={styles.appPage}>
      <style>{css}</style>
      {/* App Nav */}
      <nav style={styles.appNav}>
        <button style={styles.backBtn} onClick={() => setView("landing")}>← Back</button>
        <div style={styles.logo}>✦ WORDCRAFT<span style={styles.logoAI}>AI</span></div>
        <div style={styles.usageBadge}>
          {freeLimit - usageCount > 0
            ? `${freeLimit - usageCount} free left`
            : <span style={{ color: "#ff6b6b" }}>Limit reached</span>}
        </div>
      </nav>

      <div style={styles.appLayout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Tools</div>
          {tools.map(tool => (
            <button key={tool.id}
              style={{ ...styles.toolBtn, ...(activeTool.id === tool.id ? styles.toolBtnActive : {}) }}
              onClick={() => { setActiveTool(tool); setInput(""); }}>
              <span style={styles.toolIcon}>{tool.icon}</span>
              {tool.label}
            </button>
          ))}
          <div style={styles.sidebarUpgrade}>
            <div style={styles.upgradeTitle}>Go Unlimited</div>
            <div style={styles.upgradeDesc}>Remove limits & unlock all features</div>
            <button style={styles.upgradeBtn} onClick={() => alert("Connect Stripe to enable payments!")}>Upgrade — $19/mo</button>
          </div>
        </aside>

        {/* Main */}
        <main style={styles.appMain}>
          <div style={styles.appHeader}>
            <div style={styles.appToolLabel}>{activeTool.icon} {activeTool.label} Generator</div>
          </div>
          
          <div style={styles.inputArea}>
            <label style={styles.inputLabel}>What would you like to write about?</label>
            <textarea
              style={styles.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Describe your topic for the ${activeTool.label} generator...`}
              onKeyDown={e => e.key === "Enter" && e.metaKey && generate()}
              rows={4}
            />
            <div style={styles.inputMeta}>Tip: Be specific for better results · ⌘+Enter to generate</div>
          </div>

          <button style={{...styles.generateBtn, ...(loading ? styles.generateBtnLoading : {})}}
            onClick={generate} disabled={loading || !input.trim()}>
            {loading ? <span className="spin">⟳</span> : "✦"} {loading ? "Generating..." : `Generate ${activeTool.label}`}
          </button>

          {output && (
            <div style={styles.outputArea} ref={outputRef}>
              <div style={styles.outputHeader}>
                <span style={styles.outputLabel}>Generated Output</span>
                <button style={styles.copyBtn} onClick={copyToClipboard}>
                  {copied ? "✓ Copied!" : "⎘ Copy"}
                </button>
              </div>
              <div style={styles.outputContent}>{output}</div>
            </div>
          )}

          {!output && !loading && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>{activeTool.icon}</div>
              <div style={styles.emptyTitle}>Ready to generate</div>
              <div style={styles.emptyDesc}>Enter a topic above and click Generate to create your {activeTool.label}.</div>
            </div>
          )}
        </main>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div style={styles.modalOverlay} onClick={() => setShowPaywall(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalIcon}>🚀</div>
            <h2 style={styles.modalTitle}>You've hit the free limit</h2>
            <p style={styles.modalDesc}>Upgrade to Pro for unlimited generations, faster output, and all premium features.</p>
            <button style={styles.modalCta} onClick={() => alert("Connect Stripe to enable payments!")}>
              Upgrade to Pro — $19/mo
            </button>
            <button style={styles.modalClose} onClick={() => setShowPaywall(false)}>Maybe later</button>
          </div>
        </div>
      )}
    </div>
  );
}

const C = {
  bg: "#0a0a0f",
  surface: "#12121a",
  surfaceHover: "#1a1a26",
  border: "#1e1e2e",
  accent: "#7c6aff",
  accentLight: "#a594ff",
  gold: "#f0c040",
  text: "#e8e8f0",
  textMuted: "#6e6e8a",
  textDim: "#3a3a52",
};

const styles = {
  page: { background: C.bg, minHeight: "100vh", fontFamily: "'Georgia', 'Times New Roman', serif", color: C.text, overflowX: "hidden" },
  appPage: { background: C.bg, minHeight: "100vh", fontFamily: "'Georgia', 'Times New Roman', serif", color: C.text, display: "flex", flexDirection: "column" },

  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: "rgba(10,10,15,0.92)", backdropFilter: "blur(12px)", zIndex: 100 },
  logo: { fontSize: 20, fontWeight: 700, letterSpacing: 3, color: C.text, fontFamily: "monospace" },
  logoAI: { color: C.accent, marginLeft: 2 },
  navLink: { color: C.textMuted, textDecoration: "none", fontSize: 14, letterSpacing: 1 },
  navCta: { background: C.accent, color: "#fff", border: "none", padding: "9px 20px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontFamily: "monospace", letterSpacing: 1 },

  hero: { textAlign: "center", padding: "100px 24px 80px", position: "relative", overflow: "hidden" },
  heroGlow: { position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: `radial-gradient(ellipse, ${C.accent}22 0%, transparent 70%)`, pointerEvents: "none" },
  badge: { display: "inline-block", background: `${C.accent}22`, border: `1px solid ${C.accent}44`, color: C.accentLight, fontSize: 12, padding: "6px 16px", borderRadius: 20, letterSpacing: 2, marginBottom: 32 },
  heroTitle: { fontSize: "clamp(48px, 8vw, 88px)", fontWeight: 700, lineHeight: 1.05, margin: "0 auto 28px", maxWidth: 700, letterSpacing: -1 },
  heroAccent: { color: C.accent, fontStyle: "italic" },
  heroSub: { fontSize: 18, color: C.textMuted, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 },
  heroCta: { background: `linear-gradient(135deg, ${C.accent}, #5b4de8)`, color: "#fff", border: "none", padding: "16px 36px", borderRadius: 8, fontSize: 16, cursor: "pointer", fontFamily: "monospace", letterSpacing: 1, boxShadow: `0 0 40px ${C.accent}44` },
  heroNote: { marginTop: 16, color: C.textMuted, fontSize: 13, letterSpacing: 1 },

  mockup: { maxWidth: 680, margin: "64px auto 0", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${C.accent}22` },
  mockupBar: { background: "#1a1a26", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.border}` },
  mockDot: { width: 12, height: 12, borderRadius: "50%", display: "inline-block" },
  mockTitle: { flex: 1, textAlign: "center", fontSize: 12, color: C.textMuted, fontFamily: "monospace", letterSpacing: 2 },
  mockBody: { padding: 24 },
  mockTools: { display: "flex", gap: 8, marginBottom: 20 },
  mockTool: { padding: "6px 14px", borderRadius: 6, fontSize: 12, background: C.bg, border: `1px solid ${C.border}`, color: C.textMuted, fontFamily: "monospace" },
  mockToolActive: { background: `${C.accent}22`, border: `1px solid ${C.accent}66`, color: C.accentLight },
  mockInput: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, fontSize: 13, color: C.textMuted, marginBottom: 20, fontStyle: "italic" },
  mockOutput: { padding: 14, background: `${C.accent}08`, border: `1px solid ${C.accent}22`, borderRadius: 8 },
  mockOutputLine: { height: 10, background: `${C.accent}33`, borderRadius: 4, marginBottom: 10, width: "100%" },

  features: { padding: "100px 48px", maxWidth: 1100, margin: "0 auto" },
  sectionTitle: { fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, textAlign: "center", marginBottom: 16, letterSpacing: -0.5 },
  sectionSub: { color: C.textMuted, textAlign: "center", fontSize: 16, marginBottom: 60 },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginTop: 60 },
  featureCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, transition: "all 0.2s" },
  featureIcon: { fontSize: 36, marginBottom: 16 },
  featureTitle: { fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: -0.3 },
  featureDesc: { color: C.textMuted, fontSize: 14, lineHeight: 1.7 },

  pricing: { padding: "100px 48px", background: `linear-gradient(180deg, ${C.bg} 0%, #0e0e18 100%)` },
  pricingGrid: { display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 60 },
  planCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 36, width: 280, position: "relative", display: "flex", flexDirection: "column", gap: 10 },
  planHighlight: { border: `1px solid ${C.accent}`, boxShadow: `0 0 40px ${C.accent}22, 0 0 0 1px ${C.accent}44` },
  planBadge: { position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#fff", fontSize: 11, padding: "4px 14px", borderRadius: 20, letterSpacing: 1, fontFamily: "monospace" },
  planName: { fontSize: 13, color: C.textMuted, letterSpacing: 2, fontFamily: "monospace" },
  planPrice: { fontSize: 48, fontWeight: 700, letterSpacing: -2 },
  planPer: { fontSize: 16, color: C.textMuted, fontWeight: 400 },
  planLimit: { color: C.accentLight, fontSize: 13, fontFamily: "monospace" },
  planDivider: { height: 1, background: C.border, margin: "8px 0" },
  planFeature: { color: C.textMuted, fontSize: 14, lineHeight: 1.8 },
  planCta: { marginTop: 16, background: C.bg, border: `1px solid ${C.border}`, color: C.text, padding: "12px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "monospace", letterSpacing: 1 },
  planCtaHighlight: { background: C.accent, border: "none", color: "#fff" },

  footer: { textAlign: "center", padding: 48, borderTop: `1px solid ${C.border}` },
  footerNote: { color: C.textMuted, fontSize: 13, marginTop: 12, letterSpacing: 1 },

  // App styles
  appNav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: C.surface },
  backBtn: { background: "none", border: `1px solid ${C.border}`, color: C.textMuted, padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "monospace" },
  usageBadge: { fontSize: 13, fontFamily: "monospace", color: C.textMuted, background: C.bg, padding: "6px 12px", borderRadius: 20, border: `1px solid ${C.border}` },
  appLayout: { display: "flex", flex: 1, height: "calc(100vh - 65px)" },
  sidebar: { width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, padding: 20, display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" },
  sidebarTitle: { fontSize: 11, color: C.textMuted, letterSpacing: 2, fontFamily: "monospace", marginBottom: 8, padding: "0 8px" },
  toolBtn: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: C.textMuted, fontSize: 14, cursor: "pointer", textAlign: "left", transition: "all 0.15s" },
  toolBtnActive: { background: `${C.accent}22`, color: C.accentLight },
  toolIcon: { fontSize: 18 },
  sidebarUpgrade: { marginTop: "auto", padding: 16, background: `${C.accent}11`, border: `1px solid ${C.accent}33`, borderRadius: 10 },
  upgradeTitle: { fontSize: 13, fontWeight: 700, color: C.accentLight, marginBottom: 6 },
  upgradeDesc: { fontSize: 12, color: C.textMuted, lineHeight: 1.5, marginBottom: 12 },
  upgradeBtn: { width: "100%", background: C.accent, border: "none", color: "#fff", padding: "9px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "monospace" },
  appMain: { flex: 1, padding: "36px 48px", overflowY: "auto", maxWidth: 800 },
  appHeader: { marginBottom: 28 },
  appToolLabel: { fontSize: 22, fontWeight: 700, letterSpacing: -0.3 },
  inputArea: { marginBottom: 20 },
  inputLabel: { display: "block", fontSize: 13, color: C.textMuted, letterSpacing: 1, fontFamily: "monospace", marginBottom: 10 },
  textarea: { width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, color: C.text, fontSize: 15, lineHeight: 1.6, resize: "vertical", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box" },
  inputMeta: { fontSize: 12, color: C.textDim, marginTop: 8, fontFamily: "monospace" },
  generateBtn: { background: `linear-gradient(135deg, ${C.accent}, #5b4de8)`, border: "none", color: "#fff", padding: "14px 32px", borderRadius: 8, fontSize: 15, cursor: "pointer", fontFamily: "monospace", letterSpacing: 1, display: "flex", alignItems: "center", gap: 10, boxShadow: `0 4px 20px ${C.accent}44` },
  generateBtnLoading: { opacity: 0.7, cursor: "not-allowed" },
  outputArea: { marginTop: 32, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" },
  outputHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: "#1a1a26" },
  outputLabel: { fontSize: 12, color: C.textMuted, letterSpacing: 2, fontFamily: "monospace" },
  copyBtn: { background: "none", border: `1px solid ${C.border}`, color: C.textMuted, padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "monospace" },
  outputContent: { padding: 24, fontSize: 15, lineHeight: 1.85, color: C.text, whiteSpace: "pre-wrap" },
  emptyState: { textAlign: "center", padding: "80px 40px", color: C.textMuted },
  emptyIcon: { fontSize: 56, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 10 },
  emptyDesc: { fontSize: 14, lineHeight: 1.7 },

  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" },
  modal: { background: C.surface, border: `1px solid ${C.accent}66`, borderRadius: 16, padding: 48, textAlign: "center", maxWidth: 420, width: "90%", boxShadow: `0 0 60px ${C.accent}33` },
  modalIcon: { fontSize: 48, marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: 700, marginBottom: 12 },
  modalDesc: { color: C.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 28 },
  modalCta: { display: "block", width: "100%", background: C.accent, border: "none", color: "#fff", padding: "14px", borderRadius: 8, fontSize: 15, cursor: "pointer", fontFamily: "monospace", marginBottom: 12 },
  modalClose: { background: "none", border: "none", color: C.textMuted, fontSize: 14, cursor: "pointer" },
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; }
  textarea:focus { border-color: #7c6aff !important; }
  textarea::placeholder { color: #3a3a52; }
  .pulse-btn { animation: pulse 3s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 40px #7c6aff44; } 50% { box-shadow: 0 0 60px #7c6aff88; } }
  .float-up { animation: floatUp 0.8s ease-out forwards; opacity: 0; transform: translateY(30px); }
  @keyframes floatUp { to { opacity: 1; transform: translateY(0); } }
  .feature-card:hover { transform: translateY(-4px); border-color: #7c6aff44 !important; }
  .spin { display: inline-block; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0a0f; } ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
`;
