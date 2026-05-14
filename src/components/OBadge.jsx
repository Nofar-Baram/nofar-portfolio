const OBadge = ({ label, bg, color, fs = "0.62rem", pos = {} }) => (
  <div className="orbit-dot" style={{
    background: bg, color, fontSize: fs, fontWeight: 700,
    letterSpacing: "-0.02em", lineHeight: 1, borderRadius: "10px", border: "none",
    boxShadow: "0 4px 16px rgba(0,0,0,0.42), 0 0 0 1.5px rgba(255,255,255,0.1)",
    fontFamily: "inherit", ...pos
  }}>{label}</div>
);

export default OBadge;
