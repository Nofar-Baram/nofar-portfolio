import { useEffect } from "react";
import { PenTool, Code2, Gamepad2, Brain, Zap, Database, Sparkles } from "lucide-react";
import { Cpu as CpuIcon } from "lucide-react";
import FadeUp from "../components/FadeUp";
import Footer from "../components/Footer";

const AboutPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="page page-glow">
      <div className="wrap sec">
        <FadeUp><div className="kicker">Background</div></FadeUp>
        <FadeUp delay={0.04}><h1 className="sec-h"><span className="grad-heading">About</span> &amp; Tech Stack</h1></FadeUp>

        <div className="about-grid">
          <div>
            <FadeUp delay={0.08}>
              <p className="about-p">I'm a <strong>Creative Technologist &amp; UX/UI Designer</strong> in my 3rd year of Instructional Technologies at HIT -blending design thinking, AI integration, and full-stack development into products that are both beautiful and bulletproof.</p>
              <p className="about-p">I'm at my best at the intersection of <strong>AI innovation, visual design, and technical precision</strong> -where systems are designed to be both elegant and resilient.</p>
            </FadeUp>
            <FadeUp delay={0.12}>
              <div className="xp-list">
                {[
                  { t: "B.A. Instructional Technologies -HIT", m: "Oct 2023 \u2013 Present" },
                  { t: "Senior Support Associate -Wolt Enterprises", m: "Oct 2023 \u2013 Present \u00B7 Tel Aviv" },
                  { t: "Graphic Designer & Manager -Shugis", m: "Feb 2021 \u2013 Sep 2022 \u00B7 Tel Aviv" },
                  { t: "Technical Operations Specialist -IDF Elite Unit", m: "2019 \u2013 2021" },
                ].map((x, i) => (
                  <div className="xp-item" key={i}>
                    <div className="xdot" />
                    <div><div className="xp-t">{x.t}</div><div className="xp-m">{x.m}</div></div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>

          <div>
            <FadeUp delay={0.1}>
              <div className="kicker" style={{ marginBottom: "1rem" }}>Tech Stack</div>
              <div className="stack-g">
                {[
                  { icon: <PenTool size={14} />, l: "Figma", s: "UX/UI & Prototyping" },
                  { icon: <Code2 size={14} />, l: "HTML \u00B7 CSS \u00B7 JS", s: "Frontend" },
                  { icon: <Gamepad2 size={14} />, l: "Unity + C#", s: "Game Dev & UI" },
                  { icon: <Brain size={14} />, l: "LLM / GenAI", s: "AI Integration" },
                  { icon: <CpuIcon size={14} />, l: "Computer Vision", s: "ml5.js \u00B7 Kindwise" },
                  { icon: <Sparkles size={14} />, l: "Articulate 360", s: "Instructional Design" },
                  { icon: <Zap size={14} />, l: "QA Testing", s: "Game + Software" },
                  { icon: <Database size={14} />, l: "Salesforce", s: "CRM + UX" },
                ].map(s => (
                  <div className="sitem" key={s.l}>
                    <span className="sico">{s.icon}</span>
                    <div><span className="sitem-l">{s.l}</span><span className="sitem-s">{s.s}</span></div>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.14}>
              <div style={{ marginTop: "1.5rem", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "1.5rem" }}>
                <div className="kicker" style={{ marginBottom: "1rem" }}>Languages</div>
                {[{ l: "Hebrew", v: "Native", p: 100 }, { l: "English", v: "Fluent", p: 92 }, { l: "Spanish", v: "Proficient", p: 65 }].map(ln => (
                  <div key={ln.l} style={{ marginBottom: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{ln.l}</span>
                      <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>{ln.v}</span>
                    </div>
                    <div className="lang-bar"><div className="lang-fill" style={{ width: `${ln.p}%` }} /></div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
