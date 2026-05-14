import { useState } from "react";
import { Upload, Brain, Search, MessageSquare, Wand2, Play } from "lucide-react";

/* ── Layout constants ── */
const VW = 790;
const VH = 320;
const NR = 30; // node radius

const NODES = [
  { id: "input",   x: 68,  y: 160, label: "User Inputs",    sub: "PDFs · Brand · Inspiration",  Icon: Upload,        color: "#06b6d4" },
  { id: "orch",    x: 235, y: 160, label: "Orchestrator",   sub: "AI Manager",                   Icon: Brain,         color: "#a78bfa" },
  { id: "res",     x: 400, y: 78,  label: "Research Agent", sub: "Gap Finder",                   Icon: Search,        color: "#06b6d4" },
  { id: "hitl",    x: 400, y: 242, label: "HITL Chat",      sub: "Human-in-the-Loop",            Icon: MessageSquare, color: "#f59e0b" },
  { id: "content", x: 560, y: 160, label: "Content Agent",  sub: "Microlearning Creator",        Icon: Wand2,         color: "#a78bfa" },
  { id: "output",  x: 722, y: 160, label: "Output",         sub: "Interactive HTML5",            Icon: Play,          color: "#4ade80" },
];

/* ── Edge paths — start/end just outside node circles ── */
const EDGES = [
  { id: "e1", d: "M98,160 L205,160",                        color: "#06b6d4", label: null           },
  { id: "e2", d: "M256,141 Q317,102 372,88",                color: "#a78bfa", label: null           },
  { id: "e3", d: "M400,108 L400,212",                       color: "#06b6d4", label: null           },
  { id: "e4", d: "M371,228 Q300,262 259,170",               color: "#f59e0b", label: "approval loop" },
  { id: "e5", d: "M265,160 L530,160",                       color: "#a78bfa", label: null           },
  { id: "e6", d: "M590,160 L692,160",                       color: "#4ade80", label: null           },
];

/* Pulse colors match the "from" node of each edge */
const PULSE_COLORS = ["#06b6d4", "#a78bfa", "#67e8f9", "#fbbf24", "#c4b5fd", "#4ade80"];

/* Animation chain: each pulse fires sequentially, looping back via e6.end → e1 */
const ANIM_DUR  = "0.9";   // seconds per segment
const ANIM_GAP  = "+0.35s"; // pause between segments

export default function SynapseGraph() {
  const [activeNode, setActiveNode] = useState(null);

  const toggle = (id) => setActiveNode(a => a === id ? null : id);
  const onKey  = (id) => (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(id); } };

  return (
    <div style={{ fontFamily: "inherit", userSelect: "none" }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="Interactive HITL Multi-Agent Architecture diagram"
      >
        <defs>
          {/* Gradient for static paths */}
          <linearGradient id="sg-pg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.35" />
          </linearGradient>

          {/* Glow filter for pulse dots */}
          <filter id="sg-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Softer glow for active nodes */}
          <filter id="sg-ng" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b" />
            <feFlood floodColor="#06b6d4" floodOpacity="0.35" result="c" />
            <feComposite in="c" in2="b" operator="in" result="s" />
            <feMerge><feMergeNode in="s" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Arrowhead */}
          <marker id="sg-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="rgba(167,139,250,0.55)" />
          </marker>
        </defs>

        {/* ── Outer ambient glow rings ── */}
        {NODES.map((n, i) => (
          <circle key={`glow-${n.id}`} cx={n.x} cy={n.y} r={NR + 14} fill={`${n.color}06`} stroke={`${n.color}18`} strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.12;0.45;0.12" dur={`${3.2 + i * 0.55}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* ── Static edge paths ── */}
        {EDGES.map(e => (
          <path key={e.id} id={e.id} d={e.d} stroke="url(#sg-pg)" strokeWidth="1.5" fill="none" markerEnd="url(#sg-arr)" strokeDasharray="5 3" />
        ))}

        {/* ── Edge labels ── */}
        <text x="307" y="270" textAnchor="middle" style={{ fontFamily: "Inter,sans-serif", fontSize: "7.5px", fill: "var(--muted)", fontStyle: "italic" }}>
          approval loop
        </text>

        {/* ── Animated pulse dots (chained: sg-m6 → sg-m1 → … → sg-m6 → …) ── */}
        {EDGES.map((e, i) => {
          const isFirst = i === 0;
          const prevId  = `sg-m${i}`; // previous motion element id (sg-m0 unused; handled by isFirst)
          const selfId  = `sg-m${i + 1}`;
          const beginAttr = isFirst
            ? `0s; sg-m6.end${ANIM_GAP}`
            : `sg-m${i}.end${ANIM_GAP}`;
          return (
            <circle key={`pulse-${e.id}`} r="5" fill={PULSE_COLORS[i]} filter="url(#sg-glow)">
              <animateMotion id={selfId} dur={`${ANIM_DUR}s`} begin={beginAttr} fill="freeze" calcMode="spline" keySplines="0.42 0 0.58 1">
                <mpath href={`#${e.id}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.88;1" dur={`${ANIM_DUR}s`} begin={beginAttr} />
              <animate attributeName="r" values="3;6;5;3" keyTimes="0;0.15;0.8;1" dur={`${ANIM_DUR}s`} begin={beginAttr} />
            </circle>
          );
        })}

        {/* ── Node circles + icons + labels ── */}
        {NODES.map((n, i) => {
          const isActive = activeNode === n.id;
          return (
            <g
              key={n.id}
              style={{ cursor: "pointer" }}
              onClick={() => toggle(n.id)}
              tabIndex="0"
              role="button"
              aria-pressed={isActive}
              aria-label={`${n.label}: ${n.sub}`}
              onKeyDown={onKey(n.id)}
            >
              {/* Pulsing outer ring */}
              <circle cx={n.x} cy={n.y} r={NR + 9} fill="none" stroke={n.color} strokeWidth={isActive ? "1.5" : "0.8"} strokeOpacity={isActive ? 0.65 : 0.22}>
                <animate attributeName="stroke-opacity" values={`${isActive ? 0.65 : 0.18};${isActive ? 0.95 : 0.5};${isActive ? 0.65 : 0.18}`} dur={`${2.8 + i * 0.6}s`} repeatCount="indefinite" />
              </circle>

              {/* Glass body */}
              <circle
                cx={n.x} cy={n.y} r={NR}
                fill="rgba(8,13,28,0.72)"
                stroke={n.color}
                strokeWidth="1.2"
                strokeOpacity={isActive ? 0.95 : 0.6}
                filter={isActive ? "url(#sg-ng)" : undefined}
              />

              {/* Icon (Lucide via foreignObject) */}
              <foreignObject x={n.x - 11} y={n.y - 11} width="22" height="22" style={{ overflow: "visible" }}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <n.Icon size={17} color={n.color} strokeWidth={1.8} />
                </div>
              </foreignObject>

              {/* Label */}
              <text x={n.x} y={n.y + NR + 13} textAnchor="middle" style={{ fontFamily: "Inter,sans-serif", fontSize: "8.5px", fontWeight: 700, fill: "var(--text)", letterSpacing: "-0.01em" }}>
                {n.label}
              </text>
              <text x={n.x} y={n.y + NR + 23} textAnchor="middle" style={{ fontFamily: "Inter,sans-serif", fontSize: "7px", fill: "var(--muted)" }}>
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>

      <p style={{ fontSize: "0.68rem", color: "var(--muted)", textAlign: "center", marginTop: "0.5rem" }}>
        Click any node to highlight &middot; Watch the data pulse travel through the HITL architecture
      </p>
    </div>
  );
}
