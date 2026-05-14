import { useState, useRef, useCallback, useEffect } from "react";

const CognyteSl = () => {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);
  const move = useCallback((clientX) => {
    if (!ref.current || !dragging.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos(Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 4), 96));
  }, []);
  useEffect(() => {
    const up = () => { dragging.current = false; };
    const mm = (e) => move(e.touches ? e.touches[0].clientX : e.clientX);
    window.addEventListener("mouseup", up); window.addEventListener("mousemove", mm);
    window.addEventListener("touchend", up); window.addEventListener("touchmove", mm);
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", mm); window.removeEventListener("touchend", up); window.removeEventListener("touchmove", mm); };
  }, [move]);
  return (
    <div>
      <div ref={ref} className="slider-wrap" onMouseDown={e => { dragging.current = true; move(e.clientX); }} onTouchStart={e => { dragging.current = true; move(e.touches[0].clientX); }}>
        <div className="slider-before">
          <div style={{ fontSize: "0.58rem", color: "#888", letterSpacing: "0.12em", marginBottom: "0.6rem" }}>BEFORE -Manual Salesforce</div>
          {["Deal Stage: ???", "MEDDPICC: Incomplete", "Close Date: TBD", "Notes: (empty)"].map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.75)", borderRadius: "8px", padding: "0.4rem 0.7rem", marginBottom: "0.35rem", fontSize: "0.72rem", color: "#555", display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: i < 2 ? "#f87171" : "#fb923c" }} />{t}
            </div>
          ))}
          <div className="ba-label" style={{ left: "0.65rem" }}>BEFORE</div>
        </div>
        <div className="slider-clip" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="slider-after">
            <div style={{ fontSize: "0.58rem", color: "#aaa", letterSpacing: "0.12em", marginBottom: "0.6rem" }}>AFTER -Back-Up Companion</div>
            {["Deal Stage: Validation \u2713", "MEDDPICC: 94% complete", "Close Date: Q3 2025 \u2713", "AI Copilot: Active \uD83E\uDD16"].map((t, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "0.4rem 0.7rem", marginBottom: "0.35rem", fontSize: "0.72rem", color: "#eee", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4ade80" }} />{t}
              </div>
            ))}
            <div className="ba-label" style={{ right: "0.65rem" }}>AFTER</div>
          </div>
        </div>
        <div className="slider-handle" style={{ left: `${pos}%` }}>
          <div className="slider-knob"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5 4L2 8L5 12M11 4L14 8L11 12" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
        </div>
      </div>
      <p style={{ fontSize: "0.7rem", color: "var(--muted)", textAlign: "center", marginTop: "0.65rem" }}>&larr; Drag to compare</p>
    </div>
  );
};

export default CognyteSl;
