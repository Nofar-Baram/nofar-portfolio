import { ChevronRight } from "lucide-react";

const steps = [
  { icon: "\uD83D\uDCF8", label: "Image Captured", sub: "ml5.js client-side filter" },
  { icon: "\uD83D\uDD12", label: "Privacy Check", sub: "No raw image leaves device" },
  { icon: "\uD83D\uDC41\uFE0F", label: "CV Identification", sub: "Kindwise API \u2013 species match" },
  { icon: "\uD83E\uDDE0", label: "AI Safety Reasoning", sub: "GenAI logic layer \u2013 risk score" },
  { icon: "\u2705", label: "Safety Response", sub: "Immediate audiovisual feedback" },
];

const MushBotFlow = () => (
  <div style={{ padding: "0.25rem 0" }}>
    <div className="logic-flow">
      {steps.map((s, i) => (
        <div className="lf-step" key={i}>
          <div className="lf-icon" style={{ background: "var(--bg3)", fontSize: "0.9rem" }}>{s.icon}</div>
          <div><div style={{ fontWeight: 600, fontSize: "0.8rem" }}>{s.label}</div><div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>{s.sub}</div></div>
          {i < steps.length - 1 && <ChevronRight size={11} style={{ marginLeft: "auto", color: "var(--mutedL)" }} />}
        </div>
      ))}
    </div>
  </div>
);

export default MushBotFlow;
