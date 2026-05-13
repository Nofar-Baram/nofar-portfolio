import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import {
  Sun, Moon, ChevronRight, X, ArrowLeft, Sparkles,
  Layers, Brain, Coffee, Shield, PenTool, Code2,
  Gamepad2, Mail, ExternalLink, Zap, Database,
  Cpu as CpuIcon, Ghost, Wind, BookOpen
} from "lucide-react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, NavLink } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ─── Theme Context ─── */
const ThemeCtx = createContext();
const useTheme = () => useContext(ThemeCtx);

/* ─── Animation helper ─── */
const FadeUp = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)", scale: 0.96 }}
      animate={
        inView
          ? { opacity: 1, y: 0,  filter: "blur(0px)", scale: 1    }
          : { opacity: 0, y: 22, filter: "blur(5px)", scale: 0.97 }
      }
      transition={
        inView
          ? {
              opacity: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
              filter:  { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
              y:       { type: "spring", stiffness: 300, damping: 26, delay },
              scale:   { type: "spring", stiffness: 300, damping: 26, delay },
            }
          : { duration: 0.38, ease: [0.4, 0, 0.6, 1] }
      }
    >
      {children}
    </motion.div>
  );
};

/* ─── Count-up stat number ─── */
const CountUp = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const num = parseInt(value);
  const suffix = isNaN(num) ? "" : value.replace(/[0-9]/g, "");
  const [display, setDisplay] = useState(isNaN(num) ? value : "0" + suffix);
  useEffect(() => {
    if (!inView) return;
    if (isNaN(num)) { setDisplay(value); return; }
    const start = performance.now();
    const dur = 1300;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * num) + suffix);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView]);
  return <span ref={ref}>{display}</span>;
};

/* ─── Mouse parallax hook ─── */
const useMouseParallax = (strength = 16) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handle = (e) => {
      setPos({
        x: (e.clientX / window.innerWidth  - 0.5) * strength,
        y: (e.clientY / window.innerHeight - 0.5) * strength,
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [strength]);
  return pos;
};

/* ─────────────────────────── GLOBAL STYLES ─────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;1,14..32,300;1,14..32,400&family=Space+Grotesk:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    .pr {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-feature-settings: "cv11", "ss01";
      min-height: 100vh;
      transition: background 0.55s cubic-bezier(0.4,0,0.2,1), color 0.4s ease;
    }
    .pr *, .pr *::before, .pr *::after {
      transition: background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
    }

    /* ── Light ── */
    .pr.light {
      --bg:        #ffffff;
      --bg2:       #f5f8ff;
      --bg3:       #eaefff;
      --surface:   rgba(255,255,255,0.80);
      --glass-bg:  rgba(255,255,255,0.68);
      --border:    rgba(99,102,241,0.1);
      --borderH:   rgba(6,182,212,0.32);
      --text:      #0a0f1e;
      --muted:     #536080;
      --mutedL:    #9aa5c0;
      --shadow:    0 1px 4px rgba(10,15,30,0.07), 0 2px 8px rgba(10,15,30,0.04);
      --shadowH:   0 8px 32px rgba(6,182,212,0.14), 0 2px 8px rgba(99,102,241,0.08);
      background: var(--bg); color: var(--text);
    }

    /* ── Dark ── */
    .pr.dark {
      --bg:        #0a0f1e;
      --bg2:       #0e1628;
      --bg3:       #152038;
      --surface:   rgba(10,15,30,0.75);
      --glass-bg:  rgba(14,22,40,0.55);
      --border:    rgba(167,139,250,0.12);
      --borderH:   rgba(6,182,212,0.38);
      --text:      #e4edff;
      --muted:     #7a8fb5;
      --mutedL:    #3d506e;
      --shadow:    0 1px 4px rgba(0,0,0,0.55);
      --shadowH:   0 8px 40px rgba(6,182,212,0.16), 0 4px 16px rgba(0,0,0,0.45);
      background:
        radial-gradient(ellipse at 15% 0%,  rgba(6,182,212,0.07)  0%, transparent 45%),
        radial-gradient(ellipse at 85% 0%,  rgba(167,139,250,0.09) 0%, transparent 45%),
        #0a0f1e;
      color: var(--text);
    }

    /* ── Nav ── */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 90;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2rem; height: 58px;
      background: var(--surface);
      backdrop-filter: blur(28px) saturate(200%);
      -webkit-backdrop-filter: blur(28px) saturate(200%);
      border-bottom: 1px solid var(--border);
      box-shadow: 0 1px 0 rgba(6,182,212,0.08), 0 4px 24px rgba(0,0,0,0.12);
    }
    .nav-logo {
      text-decoration: none; display: flex; align-items: center;
      position: relative; height: 64px;
    }
    .nav-logo img {
      height: 64px; width: auto; object-fit: contain; display: block;
      position: absolute; top: 0; left: 0;
    }
    .nav-links { display: flex; align-items: center; gap: 0.1rem; }
    .nav-link {
      font-size: 0.8rem; font-weight: 500; color: var(--muted);
      background: none; border: none; padding: 0.35rem 0.75rem;
      border-radius: 8px; cursor: pointer; text-decoration: none;
      transition: color 0.2s, background 0.2s;
    }
    .nav-link:hover, .nav-link.active { color: var(--text); background: var(--bg2); }
    .theme-btn {
      width: 32px; height: 32px; border-radius: 8px;
      border: 1px solid var(--border); background: none;
      color: var(--muted); display: flex; align-items: center;
      justify-content: center; cursor: pointer; transition: all 0.2s;
      margin-left: 0.5rem;
    }
    .theme-btn:hover { color: var(--text); border-color: var(--borderH); }

    /* ── Layout ── */
    .page { padding-top: 58px; min-height: 100vh; }
    .wrap { max-width: 1080px; margin: 0 auto; padding: 0 2rem; }

    /* ── Hero ── */
    .hero {
      min-height: calc(100vh - 58px); display: flex;
      align-items: center; gap: 2rem;
      padding: 4rem 2rem; max-width: 1080px; margin: 0 auto;
    }
    .hero-left { flex: 1; min-width: 0; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 0.45rem;
      background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.28);
      color: var(--muted); border-radius: 100px;
      font-size: 0.7rem; font-weight: 500; letter-spacing: 0.03em;
      padding: 0.3rem 0.9rem; margin-bottom: 2rem;
    }
    .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #06b6d4; }
    @keyframes badge-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.75); } }
    .badge-dot { animation: badge-pulse 2s ease-in-out infinite; }

    .hero-intro {
      font-size: 1.5rem; font-weight: 500; letter-spacing: -0.02em;
      color: var(--muted); margin-bottom: 0.55rem;
    }
    .hero-h1 {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: clamp(2.6rem, 5.5vw, 4.4rem);
      font-weight: 800; line-height: 1.02; letter-spacing: -0.04em;
    }
    .hero-h1 .dim { color: var(--muted); font-weight: 300; }
    .hero-accent {
      background: linear-gradient(135deg, #06b6d4, #7c3aed, #a78bfa, #06b6d4);
      background-size: 300% 300%;
      animation: grad-shift 6s ease infinite;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-h1 .sub-line {
      display: block; font-size: 0.38em; font-weight: 500;
      letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--muted); margin-top: 0.8em;
    }
    .hero-body {
      font-size: 1rem; color: var(--muted); line-height: 1.85;
      max-width: 460px; margin: 1.75rem 0 2rem;
    }
    .hero-body strong { color: var(--text); font-weight: 600; }
    .hero-btns { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%);
      color: #fff;
      font-size: 0.85rem; font-weight: 600; font-family: inherit;
      padding: 0.72rem 1.5rem; border-radius: 10px;
      border: none; cursor: pointer; text-decoration: none;
      transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    }
    .btn-primary:hover { opacity: 0.92; transform: translateY(-2px); box-shadow: 0 10px 32px rgba(6,182,212,0.32); }
    .btn-secondary {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: none; color: var(--text);
      font-size: 0.85rem; font-weight: 500; font-family: inherit;
      padding: 0.72rem 1.5rem; border-radius: 10px;
      border: 1px solid var(--border); cursor: pointer; text-decoration: none;
      transition: border-color 0.2s, transform 0.2s;
    }
    .btn-secondary:hover { border-color: var(--borderH); transform: translateY(-2px); }
    .hero-stats { display: flex; gap: 2.5rem; margin-top: 3rem; flex-wrap: wrap; }
    .hstat-n { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.03em; }
    .hstat-l { font-size: 0.7rem; color: var(--muted); margin-top: 0.1rem; letter-spacing: 0.02em; }

    /* ── Floating Hero Badges ── */
    @keyframes hfloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33%       { transform: translateY(-10px) rotate(1.5deg); }
      66%       { transform: translateY(5px)  rotate(-1deg); }
    }
    .hero-float-zone {
      position: absolute; inset: 0; pointer-events: none;
      overflow: hidden; z-index: 0;
    }
    .hfbadge {
      position: absolute;
      border-radius: 10px; padding: 6px 12px;
      font-size: 0.6rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1;
      box-shadow: 0 4px 16px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.09);
      animation: hfloat ease-in-out infinite;
      opacity: 0.72;
    }

    /* ── Animated gradient text ── */
    @keyframes grad-shift {
      0%   { background-position: 0%   50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0%   50%; }
    }

    /* ── Orbit ── */
    @keyframes orbit-cw  { to { transform: rotate(360deg);  } }
    @keyframes orbit-ccw { to { transform: rotate(-360deg); } }
    @keyframes core-pulse {
      0%, 100% { transform: translate(-50%,-50%) scale(1);   box-shadow: 0 0 18px 6px rgba(6,182,212,0.45),  0 0 50px 20px rgba(6,182,212,0.13); }
      50%       { transform: translate(-50%,-50%) scale(1.7); box-shadow: 0 0 28px 10px rgba(6,182,212,0.6), 0 0 70px 30px rgba(167,139,250,0.2); }
    }
    .orbit-wrap {
      position: relative; width: 380px; height: 380px; flex-shrink: 0;
    }
    .orbit-wrap::before {
      content: ''; position: absolute; inset: -40px; border-radius: 50%;
      background: radial-gradient(ellipse at 55% 45%,
        rgba(6,182,212,0.14) 0%, rgba(167,139,250,0.09) 40%, transparent 70%);
      pointer-events: none; z-index: 0;
    }
    .orbit-center {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      width: 33.68%; height: 33.68%; border-radius: 50%;
      overflow: hidden; border: 1.5px solid var(--borderH);
      box-shadow: var(--shadowH), 0 0 0 6px rgba(99,102,241,0.08); z-index: 4;
    }
    .orbit-ring {
      position: absolute; top: 50%; left: 50%;
      border-radius: 50%;
    }
    .orbit-ring-1 {
      width: 52.63%; height: 52.63%; margin: -26.32% 0 0 -26.32%;
      border: 1px solid rgba(6,182,212,0.38);
      box-shadow: 0 0 22px rgba(6,182,212,0.12), inset 0 0 18px rgba(6,182,212,0.06);
      animation: orbit-cw 11s linear infinite;
    }
    .orbit-ring-2 {
      width: 73.68%; height: 73.68%; margin: -36.84% 0 0 -36.84%;
      border: 1px dashed rgba(167,139,250,0.32);
      box-shadow: 0 0 18px rgba(167,139,250,0.1);
      animation: orbit-ccw 18s linear infinite;
    }
    .orbit-ring-3 {
      width: 89.47%; height: 89.47%; margin: -44.74% 0 0 -44.74%;
      border: 1px solid rgba(6,182,212,0.16);
      box-shadow: 0 0 24px rgba(6,182,212,0.07);
      animation: orbit-cw 28s linear infinite;
    }
    .orbit-dot {
      position: absolute; width: 38px; height: 38px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.62rem; font-weight: 700; line-height: 1;
      top: -19px; left: calc(50% - 19px); z-index: 3;
    }
    .orbit-ring-1 .orbit-dot { animation: orbit-ccw 11s linear infinite; }
    .orbit-ring-2 .orbit-dot { animation: orbit-cw  18s linear infinite; }
    .orbit-ring-3 .orbit-dot { animation: orbit-ccw 28s linear infinite; }
    .orbit-core {
      position: absolute; top: 50%; left: 50%;
      width: 10px; height: 10px; border-radius: 50%;
      background: #06b6d4;
      animation: core-pulse 2.8s ease-in-out infinite;
      z-index: 4;
    }

    /* ── Bento Grid ── */
    .bento {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.85rem; margin-top: 3.5rem;
    }
    .bcard {
      background: var(--glass-bg);
      backdrop-filter: blur(18px) saturate(160%);
      -webkit-backdrop-filter: blur(18px) saturate(160%);
      border: 1px solid var(--border);
      border-radius: 22px; padding: 0;
      cursor: pointer; position: relative; overflow: hidden;
      text-decoration: none; color: inherit; display: flex; flex-direction: column;
      transition: border-color 0.28s, box-shadow 0.28s, transform 0.32s;
    }
    .bcard:hover {
      border-color: rgba(6,182,212,0.42);
      box-shadow: 0 8px 40px rgba(6,182,212,0.13), 0 2px 12px rgba(167,139,250,0.1), 0 0 0 1px rgba(6,182,212,0.12);
      transform: translateY(-6px);
    }
    .bcard::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.06) 50%, transparent 65%);
      transform: translateX(-100%); transition: transform 0.6s ease;
      pointer-events: none; z-index: 2; border-radius: 22px;
    }
    .bcard:hover::after { transform: translateX(100%); }
    .bcard-feat { grid-column: span 2; }
    /* ── Cover media ── */
    .bcard-cover {
      position: relative; overflow: hidden;
      height: 180px; flex-shrink: 0;
      border-radius: 22px 22px 0 0; background: var(--bg3);
    }
    .bcard-feat .bcard-cover { height: 248px; }
    .bcard-cover img, .bcard-cover video {
      width: 100%; height: 100%; object-fit: cover;
      object-position: center top; display: block;
    }
    .bcard-cover-overlay {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.52) 100%);
    }
    /* ── Card content ── */
    .bcard-content { padding: 1.2rem 1.5rem 2.5rem; flex: 1; position: relative; }
    .bcard-num {
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.18em;
      color: var(--mutedL); text-transform: uppercase; margin-bottom: 0.7rem;
    }
    .bcard-tags { display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 0.6rem; }
    .btag {
      font-size: 0.58rem; font-weight: 600; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--muted);
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 100px; padding: 0.16rem 0.55rem;
    }
    .bcard-title { font-size: 1.15rem; font-weight: 700; letter-spacing: -0.025em; margin-bottom: 0.35rem; line-height: 1.25; }
    .bcard-feat .bcard-title { font-size: 1.5rem; }
    .bcard-line { font-size: 0.83rem; color: var(--muted); line-height: 1.6; }
    .bcard-arrow {
      position: absolute; bottom: 1.25rem; right: 1.5rem;
      color: var(--mutedL); transition: all 0.2s;
    }
    .bcard:hover .bcard-arrow { color: var(--text); transform: translate(3px,-3px); }

    /* ── Section ── */
    .sec { padding: 5rem 0; }
    .kicker {
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--muted); margin-bottom: 0.6rem;
    }
    .sec-h {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 800; letter-spacing: -0.035em; line-height: 1.1;
    }
    .sec-sub { font-size: 0.92rem; color: var(--muted); line-height: 1.8; max-width: 480px; margin-top: 0.5rem; }
    .hdiv { height: 1px; background: var(--border); }

    /* ── Project Detail ── */
    .proj-hero {
      padding: 5rem 2rem 3rem; max-width: 1080px; margin: 0 auto;
      border-bottom: 1px solid var(--border);
    }
    .back-btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 0.8rem; font-weight: 500; color: var(--muted);
      text-decoration: none; margin-bottom: 2.5rem;
      background: none; border: none; cursor: pointer; padding: 0;
      font-family: inherit; transition: color 0.2s;
    }
    .back-btn:hover { color: var(--text); }
    .proj-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
    .ptag {
      font-size: 0.62rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
      color: var(--muted); background: var(--bg2); border: 1px solid var(--border);
      border-radius: 100px; padding: 0.2rem 0.65rem;
    }
    .proj-title { font-size: clamp(2rem, 5.5vw, 3.8rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.0; }
    .proj-tagline { font-size: 1.05rem; color: var(--muted); line-height: 1.75; max-width: 620px; margin-top: 0.75rem; }
    .proj-meta { display: flex; gap: 3rem; margin-top: 2.5rem; flex-wrap: wrap; }
    .pmeta { display: flex; flex-direction: column; gap: 0.2rem; }
    .pmeta-label { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--mutedL); }
    .pmeta-val { font-size: 0.88rem; font-weight: 500; }
    .proj-body { max-width: 1080px; margin: 0 auto; padding: 3rem 2rem; display: flex; flex-direction: column; gap: 2.5rem; }
    .proj-section-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.85rem; }
    .proj-p { font-size: 0.92rem; color: var(--muted); line-height: 1.9; }
    .proj-steps { display: flex; flex-direction: column; gap: 0.6rem; list-style: none; }
    .proj-step { display: flex; gap: 0.75rem; align-items: flex-start; font-size: 0.88rem; color: var(--muted); line-height: 1.75; }
    .step-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--text); flex-shrink: 0; margin-top: 0.7rem; }
    .tool-chips { display: flex; flex-wrap: wrap; gap: 0.45rem; }
    .tool-chip {
      font-size: 0.72rem; font-weight: 500;
      background: var(--bg2); border: 1px solid var(--border);
      border-radius: 8px; padding: 0.3rem 0.75rem; color: var(--muted);
    }
    .live-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 18px; padding: 1.5rem; }
    .live-label { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 1rem; }
    .media-col { display: flex; flex-direction: column; gap: 0.85rem; }

    /* ── Live Links (external) ── */
    .live-links { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1.75rem; }
    .live-link-btn {
      display: inline-flex; align-items: center; gap: 0.45rem;
      font-size: 0.78rem; font-weight: 600; font-family: inherit;
      padding: 0.55rem 1.2rem; border-radius: 10px;
      border: 1px solid rgba(6,182,212,0.38);
      background: rgba(6,182,212,0.08);
      color: #06b6d4; text-decoration: none;
      transition: background 0.2s, border-color 0.2s, transform 0.2s, color 0.2s, box-shadow 0.2s;
    }
    .live-link-btn:hover {
      background: rgba(6,182,212,0.16); border-color: rgba(6,182,212,0.65);
      color: #67e8f9; transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(6,182,212,0.18);
    }

    /* ── Project Gallery ── */
    .proj-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.25rem;
    }
    .proj-gallery img {
      width: 100%; border-radius: 16px; display: block;
      border: 1px solid var(--border);
      box-shadow: 0 4px 24px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06);
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .proj-gallery img:hover {
      transform: translateY(-3px) scale(1.008);
      box-shadow: 0 10px 40px rgba(6,182,212,0.14), 0 2px 8px rgba(167,139,250,0.1);
    }

    /* ── About/Contact Color Accents ── */
    .page-glow {
      position: relative;
    }
    .page-glow::before {
      content: ''; position: fixed; top: 0; left: 50%; transform: translateX(-50%);
      width: 900px; height: 600px; pointer-events: none; z-index: 0;
      background: radial-gradient(ellipse at 50% 0%,
        rgba(6,182,212,0.08) 0%, rgba(167,139,250,0.06) 40%, transparent 65%);
    }
    .page-glow > * { position: relative; z-index: 1; }
    .grad-heading {
      background: linear-gradient(135deg, #06b6d4 0%, #7c3aed 50%, #a78bfa 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .sitem:hover {
      border-color: rgba(6,182,212,0.4);
      background: linear-gradient(135deg, rgba(6,182,212,0.07) 0%, rgba(167,139,250,0.04) 100%);
    }
    .clink:hover {
      border-color: rgba(6,182,212,0.5);
      background: rgba(6,182,212,0.07);
      color: #67e8f9;
    }
    .contact-accent em {
      background: linear-gradient(135deg, #06b6d4 0%, #7c3aed 50%, #a78bfa 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      font-style: italic;
    }

    /* ── About ── */
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; margin-top: 3rem; }
    .about-p { font-size: 0.9rem; color: var(--muted); line-height: 1.95; margin-bottom: 0.9rem; }
    .about-p strong { color: var(--text); font-weight: 600; }
    .xp-list { display: flex; flex-direction: column; gap: 0.55rem; margin-top: 2.5rem; }
    .xp-item {
      display: flex; gap: 0.85rem; align-items: flex-start;
      background: var(--bg2); border: 1px solid var(--border);
      border-radius: 12px; padding: 1rem 1.2rem;
    }
    .xdot { width: 6px; height: 6px; border-radius: 50%; background: var(--text); flex-shrink: 0; margin-top: 0.45rem; }
    .xp-t { font-size: 0.85rem; font-weight: 600; line-height: 1.3; }
    .xp-m { font-size: 0.7rem; color: var(--muted); margin-top: 0.15rem; }
    .stack-g { display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem; }
    .sitem {
      display: flex; align-items: center; gap: 0.6rem;
      background: var(--bg2); border: 1px solid var(--border);
      border-radius: 12px; padding: 0.8rem 1rem;
      transition: border-color 0.2s;
    }
    .sitem:hover { border-color: var(--borderH); }
    .sitem-l { font-size: 0.82rem; font-weight: 600; }
    .sitem-s { font-size: 0.68rem; color: var(--muted); display: block; margin-top: 0.05rem; }
    .sico { color: var(--muted); flex-shrink: 0; }
    .lang-bar { height: 2px; background: var(--border); border-radius: 2px; overflow: hidden; margin-top: 0.35rem; }
    .lang-fill { height: 100%; background: linear-gradient(90deg, #06b6d4, #a78bfa); border-radius: 2px; }

    /* ── Contact ── */
    .contact-inner { text-align: center; padding: 9rem 2rem; max-width: 600px; margin: 0 auto; }
    .contact-h { font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.05; margin-bottom: 1rem; }
    .contact-sub { font-size: 1rem; color: var(--muted); line-height: 1.8; margin-bottom: 2.5rem; }
    .clinks { display: flex; justify-content: center; gap: 0.65rem; flex-wrap: wrap; }
    .clink {
      display: inline-flex; align-items: center; gap: 0.5rem;
      font-size: 0.85rem; font-weight: 500; font-family: inherit;
      padding: 0.7rem 1.4rem; border-radius: 10px;
      border: 1px solid var(--border); background: var(--bg2);
      color: var(--text); text-decoration: none; transition: border-color 0.2s, background 0.2s;
    }
    .clink:hover { border-color: var(--borderH); background: var(--bg3); }

    /* ── Footer ── */
    .foot {
      border-top: 1px solid var(--border); padding: 1.5rem 2rem;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 0.7rem; color: var(--mutedL);
    }

    /* ── iPhone 15/16 Pro Mockup Frame ── */
    .iphone-wrap { display: flex; justify-content: center; padding: 1.5rem 1rem 0.5rem; }
    .iphone-outer {
      position: relative; width: 216px;
      background: linear-gradient(155deg, #3a3a3c 0%, #1c1c1e 40%, #111113 100%);
      border-radius: 46px; padding: 8px;
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.18),
        0 0 0 2.5px #0a0a0b,
        0 0 0 4px rgba(255,255,255,0.06),
        0 50px 120px rgba(0,0,0,0.8),
        0 20px 40px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.12),
        inset 0 -1px 0 rgba(0,0,0,0.4);
    }
    .iphone-island {
      width: 80px; height: 24px;
      background: #050505; border-radius: 100px;
      margin: 0 auto 8px;
      box-shadow: inset 0 1px 4px rgba(0,0,0,1), 0 0 0 0.5px rgba(255,255,255,0.06);
    }
    .iphone-screen {
      position: relative; border-radius: 38px; overflow: hidden;
      aspect-ratio: 9/19.5; background: #000;
    }
    .iphone-screen video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
    .iphone-side-btn {
      position: absolute; right: -2.5px; top: 108px;
      width: 2.5px; height: 32px;
      background: linear-gradient(180deg, #3a3a3c, #2c2c2e);
      border-radius: 0 2px 2px 0;
    }
    .iphone-side-vol {
      position: absolute; left: -2.5px; top: 88px;
      width: 2.5px; height: 28px;
      background: linear-gradient(180deg, #3a3a3c, #2c2c2e);
      border-radius: 2px 0 0 2px;
    }
    .iphone-side-vol2 { top: 126px; }

    /* ── Bento Device Stages ── */
    .bcard-device-stage {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    .bcard-device-stage-laptop  { background: linear-gradient(145deg, #0d0d1a 0%, #161628 55%, #0a0a14 100%); }
    .bcard-device-stage-phone   { background: linear-gradient(145deg, #0a0812 0%, #130f20 55%, #080610 100%); }
    .bcard-device-stage-monitor { background: linear-gradient(145deg, #080e14 0%, #0d1520 55%, #060c12 100%); }

    /* ── Laptop Mockup (bento grid) ── */
    .mock-laptop-mini {
      width: 92%; display: flex; flex-direction: column; align-items: center;
      transform: translateY(22px);
    }
    .mock-laptop-mini-lid {
      width: 100%; position: relative;
      background: linear-gradient(175deg, #484848 0%, #2e2e30 100%);
      border-radius: 10px 10px 0 0; padding: 7px 7px 0;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.11), inset 0 1.5px 0 rgba(255,255,255,0.08);
    }
    .mock-laptop-mini-cam {
      width: 5px; height: 5px; border-radius: 50%; background: #666;
      position: absolute; top: 3.5px; left: 50%; transform: translateX(-50%);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
    }
    .mock-laptop-mini-screen {
      position: relative; aspect-ratio: 16/10; background: #060609;
      border-radius: 5px; overflow: hidden;
    }
    .mock-laptop-mini-screen img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .mock-laptop-mini-base {
      width: 112%; height: 11px;
      background: linear-gradient(180deg, #4a4a4c 0%, #2e2e30 100%);
      border-radius: 0 0 7px 7px;
      box-shadow: 0 6px 28px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07);
    }
    .mock-laptop-mini-notch {
      width: 50px; height: 5px; background: #202022;
      border-radius: 0 0 4px 4px; margin: 0 auto;
    }

    /* ── iPhone Mockup (bento grid) ── */
    .mock-phone-mini {
      width: 48%; position: relative;
      background: linear-gradient(175deg, #2e2e30 0%, #1a1a1c 100%);
      border-radius: 42px; padding: 8px;
      box-shadow:
        0 0 0 2px rgba(255,255,255,0.13),
        0 0 0 4.5px rgba(0,0,0,0.9),
        0 30px 70px rgba(0,0,0,0.85);
      transform: translateY(-18px);
    }
    .mock-phone-mini-side-btn {
      position: absolute; right: -4px; top: 90px;
      width: 4px; height: 38px; background: #2e2e30;
      border-radius: 0 2px 2px 0;
    }
    .mock-phone-mini-vol {
      position: absolute; left: -4px; top: 80px;
      width: 4px; height: 28px; background: #2e2e30;
      border-radius: 2px 0 0 2px;
    }
    .mock-phone-mini-vol2 { top: 118px; }
    .mock-phone-mini-island {
      width: 52px; height: 12px; background: #090909;
      border-radius: 100px; margin: 0 auto 5px;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.95);
    }
    .mock-phone-mini-screen {
      position: relative; border-radius: 32px; overflow: hidden;
      aspect-ratio: 9/19.5; background: #000;
    }
    .mock-phone-mini-screen img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
    }

    /* ── Game Console Mockup (bento grid - Get The Ghost) ── */
    .mock-console-mini {
      width: 94%; display: flex; flex-direction: column; align-items: center;
      transform: translateY(14px);
    }
    .mock-console-mini-body {
      width: 100%; position: relative;
      background: linear-gradient(170deg, #1a1a28 0%, #0e0e18 100%);
      border-radius: 14px; padding: 8px;
      border: 2px solid #6d28d9;
      box-shadow:
        0 0 0 1px rgba(109,40,217,0.25),
        0 0 28px rgba(109,40,217,0.2),
        inset 0 1px 0 rgba(255,255,255,0.05);
    }
    .mock-console-mini-screen {
      position: relative; aspect-ratio: 16/9; background: #040408;
      border-radius: 7px; overflow: hidden;
      box-shadow: inset 0 0 0 1px rgba(109,40,217,0.3), inset 0 0 20px rgba(109,40,217,0.12);
    }
    .mock-console-mini-screen img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .mock-console-mini-left-joy {
      position: absolute; left: -10px; top: 50%; transform: translateY(-50%);
      width: 10px; height: 58%;
      background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%);
      border-radius: 6px 0 0 6px;
      box-shadow: -2px 0 10px rgba(124,58,237,0.5);
    }
    .mock-console-mini-right-joy {
      position: absolute; right: -10px; top: 50%; transform: translateY(-50%);
      width: 10px; height: 58%;
      background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%);
      border-radius: 0 6px 6px 0;
      box-shadow: 2px 0 10px rgba(124,58,237,0.5);
    }
    .mock-console-mini-bar {
      display: flex; align-items: center; justify-content: center; gap: 5px;
      padding: 4px 0 2px;
    }
    .mock-console-mini-btn {
      width: 7px; height: 7px; border-radius: 50%;
    }

    /* ── Bento Fallback (no image, no device) ── */
    .bcard-cover-fallback {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 5rem; font-weight: 800; letter-spacing: -0.05em;
      font-family: 'Space Grotesk', sans-serif;
      color: rgba(255,255,255,0.06); user-select: none; pointer-events: none;
    }

    /* ── Live: Before/After Slider ── */
    .slider-wrap { border-radius: 14px; overflow: hidden; position: relative; user-select: none; cursor: col-resize; height: 260px; }
    .slider-before { position: absolute; inset: 0; background: #f0eef8; display: flex; flex-direction: column; justify-content: center; padding: 1.5rem; }
    .slider-after  { position: absolute; inset: 0; background: #0d0d0d; display: flex; flex-direction: column; justify-content: center; padding: 1.5rem; overflow: hidden; }
    .slider-clip   { position: absolute; inset: 0; overflow: hidden; }
    .slider-handle { position: absolute; top: 0; bottom: 0; width: 2px; background: #fff; display: flex; align-items: center; justify-content: center; z-index: 5; }
    .slider-knob   { width: 32px; height: 32px; border-radius: 50%; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: #333; flex-shrink: 0; }
    .ba-label      { position: absolute; bottom: 0.75rem; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(0,0,0,0.4); color: #fff; padding: 0.18rem 0.55rem; border-radius: 100px; }

    /* ── Live: Node Graph ── */
    .node-graph { width: 100%; padding: 0.4rem 0; }
    .ng-svg { width: 100%; height: 265px; }
    .node-text { font-family: 'Inter',sans-serif; font-size: 9px; fill: var(--text); text-anchor: middle; font-weight: 600; }
    .node-sub  { font-family: 'Inter',sans-serif; font-size: 7px; fill: var(--muted); text-anchor: middle; }
    @keyframes dash { to { stroke-dashoffset: 0; } }
    @keyframes nodeFlow { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
    .flow-path        { stroke: rgba(255,255,255,0.14); stroke-width:1.5; fill:none; stroke-dasharray:5 4; }
    .flow-path.past   { stroke:#06b6d4; opacity:0.6; stroke-width:1.5; stroke-dasharray:5 4; }
    .flow-path.active { stroke:#06b6d4; opacity:1;   stroke-width:2;   stroke-dasharray:5 4; animation:dash 1.4s linear infinite; }
    .node-dot { animation: nodeFlow 1.8s ease-in-out infinite; }
    .syn-tooltip {
      min-height: 38px; margin: 0.45rem 0 0; padding: 0.5rem 0.9rem;
      background: rgba(8,13,26,0.88); border: 1px solid rgba(6,182,212,0.25);
      border-radius: 10px; backdrop-filter: blur(14px);
      font-size: 0.65rem; color: var(--muted); line-height: 1.55;
      transition: opacity 0.18s;
    }
    .syn-tt-title { font-weight: 700; color: var(--text); margin-right: 0.3rem; }

    /* ── Live: Safety Flow ── */
    .logic-flow { display: flex; flex-direction: column; gap: 0.55rem; }
    .lf-step { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 0.85rem; border-radius: 10px; background: var(--bg3); border: 1px solid var(--border); font-size: 0.8rem; }
    .lf-icon { width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

    /* ── Laptop Frame (detail page) ── */
    .laptop-frame-wrap { display: flex; justify-content: center; padding: 0.5rem 0; }
    .laptop-frame {
      width: 100%; max-width: 800px;
      display: flex; flex-direction: column; align-items: center;
    }
    .laptop-frame-lid {
      width: 100%; position: relative;
      background: linear-gradient(175deg, #585858 0%, #2e2e30 100%);
      border-radius: 14px 14px 0 0; padding: 10px 10px 0;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.12), inset 0 1.5px 0 rgba(255,255,255,0.09);
    }
    .laptop-frame-cam {
      width: 6px; height: 6px; border-radius: 50%; background: #555;
      position: absolute; top: 4px; left: 50%; transform: translateX(-50%);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
    }
    .laptop-frame-screen {
      position: relative; aspect-ratio: 16/10; background: #060609;
      border-radius: 7px; overflow: hidden;
    }
    .laptop-frame-screen video {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .laptop-frame-base {
      width: 114%; height: 16px;
      background: linear-gradient(180deg, #525254 0%, #2a2a2c 100%);
      border-radius: 0 0 10px 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07);
    }
    .laptop-frame-notch {
      width: 64px; height: 7px; background: #1e1e20;
      border-radius: 0 0 5px 5px; margin: 0 auto;
    }

    /* ── Video section (split view) ── */
    .video-section { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
    .video-section-label {
      font-size: 1rem; font-weight: 700; letter-spacing: -0.01em; color: var(--text);
    }
    .video-section-desc {
      font-size: 0.85rem; color: var(--muted); line-height: 1.75; max-width: 640px;
    }

    /* ── WIP Badge ── */
    .wip-badge {
      position: absolute; top: 10px; right: 10px; z-index: 5;
      display: inline-flex; align-items: center; gap: 0.3rem;
      font-size: 0.55rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
      background: linear-gradient(135deg, rgba(167,139,250,0.22) 0%, rgba(124,58,237,0.18) 100%);
      border: 1px solid rgba(167,139,250,0.5);
      color: #c4b5fd; border-radius: 100px; padding: 0.22rem 0.65rem;
      backdrop-filter: blur(8px);
    }
    .wip-dot { width: 5px; height: 5px; border-radius: 50%; background: #a78bfa; flex-shrink: 0; }
    @keyframes wip-pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.55; transform:scale(0.7); } }
    .wip-dot { animation: wip-pulse 2s ease-in-out infinite; }

    /* ── Proj detail WIP notice ── */
    .wip-notice {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(124,58,237,0.09) 100%);
      border: 1px solid rgba(167,139,250,0.4); border-radius: 12px;
      padding: 0.6rem 1.1rem; font-size: 0.8rem; font-weight: 600; color: #c4b5fd;
      margin-bottom: 0.5rem;
    }

    /* ── Responsive ── */
    @media (max-width: 820px) {
      .hero { flex-direction: column; padding: 3rem 1.25rem; }
      .orbit-wrap { width: min(320px, 82vw); height: min(320px, 82vw); align-self: center; }
      .orbit-dot  { width: 30px; height: 30px; border-radius: 8px; }
      .bento { grid-template-columns: 1fr; }
      .bcard-feat { grid-column: span 1; }
      .about-grid { grid-template-columns: 1fr; gap: 2rem; }
      .nav { padding: 0 1.25rem; }
      .proj-hero { padding: 3rem 1.25rem 2rem; }
      .proj-body { padding: 2rem 1.25rem; }
    }
  `}</style>
);

/* ─────────────────── LIVE ELEMENTS ─────────────────── */

/* 1. Ninja -Video in iPhone Frame */
const NinjaPhone = () => (
  <div className="iphone-wrap">
    <div className="iphone-outer">
      <div className="iphone-side-btn" />
      <div className="iphone-side-vol" />
      <div className="iphone-side-vol iphone-side-vol2" />
      <div className="iphone-island" />
      <div className="iphone-screen">
        <video src="/assets/Ninja.mp4" autoPlay loop muted playsInline />
      </div>
    </div>
  </div>
);

/* 3. Synapse Pipeline */
const synNodes = [
  { id:"user",     x:55,  y:122, r:32, label:"User Input",   sub:"PDF",        tooltip:null },
  { id:"orch",     x:185, y:122, r:38, label:"Orchestrator", sub:"Agent",      tooltip:"Dynamic Routing, Context Extrapolation, & Contradiction Resolution." },
  { id:"research", x:318, y:55,  r:27, label:"Research",     sub:"Agent",      tooltip:"Parses PDFs, computes depth score, and extrapolates context." },
  { id:"content",  x:318, y:188, r:27, label:"Content",      sub:"Agent",      tooltip:"Generates interactive scenarios and ensures Pydantic JSON validation." },
  { id:"spa",      x:452, y:122, r:27, label:"SPA Engine",   sub:"Vanilla JS", tooltip:"Infects Tailwind CSS & Vanilla JS for dynamic SPA player." },
  { id:"out",      x:558, y:122, r:38, label:"",             sub:"",           tooltip:null },
];
/* flow: user->orch->{research,content}->orch->spa[GATE]->out */
const synSeq = [
  { from:"user",     to:"orch",    gate:false },
  { from:"orch",     to:"research",gate:false },
  { from:"orch",     to:"content", gate:false },
  { from:"research", to:"orch",    gate:false },
  { from:"content",  to:"orch",    gate:false },
  { from:"orch",     to:"spa",     gate:true, gateLabel:"Syllabus Approval" },
  { from:"spa",      to:"out",     gate:false },
];
const gnSyn = id => synNodes.find(n => n.id === id);
const SYN_CURVE = {
  "user->orch":    -10,
  "orch->research":-22,
  "orch->content": +22,
  "research->orch":+22,
  "content->orch": -22,
  "orch->spa":      -8,
  "spa->out":       -8,
};
const synPath = (a, b) => {
  const f = gnSyn(a), t = gnSyn(b);
  const off = SYN_CURVE[`${a}->${b}`] ?? -12;
  const cx = (f.x + t.x) / 2, cy = (f.y + t.y) / 2 + off;
  return `M${f.x},${f.y} Q${cx},${cy} ${t.x},${t.y}`;
};
const STEP_MS = 1400;

const SynapseGraph = () => {
  const [step, setStep]       = useState(0);
  const [gates, setGates]     = useState({ 5: false });
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const e = synSeq[step];
    if (e.gate && !gates[step]) return;
    const t = setTimeout(() => setStep(s => {
      const n = s + 1;
      if (n >= synSeq.length) { setGates({ 5: false }); return 0; }
      return n;
    }), STEP_MS);
    return () => clearTimeout(t);
  }, [step, gates]);

  const hNode   = hovered ? gnSyn(hovered) : null;
  const thinkId = synSeq[step]?.to;

  return (
    <div className="node-graph">
      <svg className="ng-svg" viewBox="0 0 614 248" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arr-d" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L5,2.5 z" fill="rgba(255,255,255,0.15)" />
          </marker>
          <marker id="arr-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L0,5 L5,2.5 z" fill="#06b6d4" />
          </marker>
          <filter id="pkt-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="g"/>
            <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="nd-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="g"/>
            <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="think-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="9" result="g"/>
            <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {synSeq.map((e, i) => {
          const past   = i < step || (i === step && gates[i]);
          const active = i === step && !(e.gate && !gates[i]);
          return <path key={i} d={synPath(e.from, e.to)}
            className={`flow-path${past?" past":active?" active":""}`}
            markerEnd={(past||active)?"url(#arr-a)":"url(#arr-d)"} />;
        })}

        {/* Data packet */}
        {(() => {
          const e = synSeq[step];
          if (e.gate && !gates[step]) return null;
          return (
            <circle key={`pkt${step}`} r="5.5" fill="#06b6d4" filter="url(#pkt-glow)">
              <animateMotion dur={`${STEP_MS}ms`} fill="freeze"
                calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"
                path={synPath(e.from, e.to)} />
            </circle>
          );
        })()}

        {/* HITL Gate */}
        {synSeq.map((e, i) => {
          if (!e.gate) return null;
          const f = gnSyn(e.from), t = gnSyn(e.to);
          const gx = (f.x + t.x) / 2, gy = (f.y + t.y) / 2 - 12;
          const isHere  = i === step && !gates[i];
          const approved = gates[i];
          return (
            <g key={`gate${i}`} style={{ cursor: isHere ? "pointer" : "default" }}
               onClick={() => isHere && setGates(g => ({ ...g, [i]: true }))}>
              <circle cx={gx} cy={gy} r={9}
                fill={approved ? "rgba(16,185,129,0.12)" : isHere ? "rgba(250,204,21,0.14)" : "rgba(250,204,21,0.04)"}
                stroke={approved ? "#10b981" : isHere ? "#facc15" : "rgba(250,204,21,0.25)"}
                strokeWidth="1.5">
                {isHere && <>
                  <animate attributeName="r" values="8;14;8" dur="1.1s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="1;0.3;1" dur="1.1s" repeatCount="indefinite"/>
                </>}
              </circle>
              <text x={gx} y={gy + 4} textAnchor="middle" fontSize="8" fontWeight="800"
                fill={approved ? "#10b981" : isHere ? "#facc15" : "rgba(250,204,21,0.4)"}
                fontFamily="Inter,sans-serif">
                {approved ? "✓" : "G"}
              </text>
              {isHere && (
                <text x={gx} y={gy + 22} textAnchor="middle" fontSize="6" fill="#facc15"
                  fontFamily="Inter,sans-serif" letterSpacing="0.04em">
                  {e.gateLabel} · click
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {synNodes.map((n, ni) => {
          const isHov   = hovered === n.id;
          const isThink = thinkId === n.id;
          const destIdx = synSeq.findIndex(e => e.to === n.id);
          const lit     = n.id === "user" || step > destIdx;
          return (
            <g key={n.id}
               onMouseEnter={() => setHovered(n.id)}
               onMouseLeave={() => setHovered(null)}
               style={{ cursor: n.tooltip ? "pointer" : "default" }}>
              {isThink && (
                <circle cx={n.x} cy={n.y} r={n.r + 14}
                  fill="rgba(6,182,212,0.08)" stroke="rgba(6,182,212,0.45)" strokeWidth="1.5"
                  filter="url(#think-glow)">
                  <animate attributeName="r" values={`${n.r+8};${n.r+18};${n.r+8}`} dur="0.9s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.9s" repeatCount="indefinite"/>
                </circle>
              )}
              {isHov && !isThink && (
                <circle cx={n.x} cy={n.y} r={n.r + 12}
                  fill="rgba(6,182,212,0.06)" stroke="rgba(6,182,212,0.22)"
                  strokeWidth="1" filter="url(#nd-glow)" />
              )}
              <circle cx={n.x} cy={n.y} r={n.r}
                fill="var(--bg3)"
                stroke={isThink||isHov ? "#06b6d4" : lit ? "rgba(6,182,212,0.55)" : "var(--borderH)"}
                strokeWidth={isThink||isHov ? 2.5 : lit ? 1.8 : 1.5} />
              {n.id === "out" ? (
                <>
                  <text className="node-text" x={n.x} y={n.y - 9} style={{fontSize:"7px"}}>Interactive</text>
                  <text className="node-text" x={n.x} y={n.y + 1} style={{fontSize:"7px"}}>Micro-Learning</text>
                  <text className="node-sub"  x={n.x} y={n.y + 13}>Module</text>
                </>
              ) : (
                <>
                  <text className="node-text" x={n.x} y={n.y - 4}>{n.label}</text>
                  <text className="node-sub"  x={n.x} y={n.y + 9}>{n.sub}</text>
                </>
              )}
              <circle className="node-dot"
                fill={isThink||isHov ? "#06b6d4" : "var(--text)"}
                cx={n.x + n.r - 5} cy={n.y - n.r + 5} r="3.5"
                style={{ animationDelay: `${ni * 0.25}s` }} />
            </g>
          );
        })}
      </svg>

      {/* Tooltip bar */}
      <div className="syn-tooltip" style={{ opacity: hNode?.tooltip ? 1 : 0 }}>
        {hNode?.tooltip
          ? <><span className="syn-tt-title">{hNode.label} {hNode.sub}</span>— {hNode.tooltip}</>
          : " "}
      </div>

      <p style={{ fontSize: "0.64rem", color: "var(--muted)", textAlign: "center", marginTop: "0.3rem" }}>
        Click <span style={{ color:"#facc15", fontWeight:700 }}>gate</span> to approve handoff · Hover nodes for roles
      </p>
    </div>
  );
};


/* ─────────────────── LAPTOP FRAME ─────────────────── */
const LaptopFrame = ({ src }) => (
  <div className="laptop-frame-wrap">
    <div className="laptop-frame">
      <div className="laptop-frame-lid">
        <div className="laptop-frame-cam" />
        <div className="laptop-frame-screen">
          <video src={src} autoPlay loop muted playsInline />
        </div>
      </div>
      <div className="laptop-frame-base">
        <div className="laptop-frame-notch" />
      </div>
    </div>
  </div>
);

const BCardCover = ({ p }) => {
  const cover = p.coverImage || null;
  if (cover) return <img src={cover} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />;
  return <div className="bcard-cover-fallback">0{p.id}</div>;
};

/* ─────────────────── ORBIT BADGE ─────────────────── */
const OBadge = ({ label, bg, color, fs = "0.62rem", pos = {} }) => (
  <div className="orbit-dot" style={{
    background: bg, color, fontSize: fs, fontWeight: 700,
    letterSpacing: "-0.02em", lineHeight: 1, borderRadius: "10px", border: "none",
    boxShadow: "0 4px 16px rgba(0,0,0,0.42), 0 0 0 1.5px rgba(255,255,255,0.1)",
    fontFamily: "inherit", ...pos
  }}>{label}</div>
);

/* ─────────────────── PROJECT DATA ─────────────────── */
const PROJECTS = [
  {
    id: 1,
    icon: <Shield size={17} />,
    tags: [{ l: "UX/UI Lead" }, { l: "Salesforce" }, { l: "AI Copilot" }],
    title: "Cognyte 'Back-Up'",
    tagline: "Turning Salesforce reporting from a chore into a smart strategic companion.",
    role: "UX/UI Designer -Lead",
    tools: ["Figma", "Salesforce", "Microsoft Copilot"],
    problem: "Sales reps at Cognyte found MEDDPICC qualification reporting to be a heavy administrative burden. Inconsistent, rushed data entry was silently hurting forecasting accuracy and creating friction across the pipeline.",
    solution: '"Back-Up" is a Smart Salesforce Companion built in two phases: a Logic Wizard that standardises data entry via guided flows, followed by an AI-driven Copilot Accelerator with multilingual support and MS Copilot integration.',
    process: [
      "Conducted user research sessions with sales reps, mapping emotional and cognitive burden of MEDDPICC",
      "Defined the 'Safe Zone' -a friction-free space where reps can enter data without judgment",
      "Designed a modular Logic Wizard with branching qualification flows",
      "Architected the Copilot Accelerator layer for AI-automated field population",
      "Iterated in Figma with real reps to validate clarity and reduce cognitive load",
    ],
    outcome: "A modular, scalable Salesforce companion that reduces rep reporting friction and improves forecast data consistency.",
    liveEl: null,
    liveLabel: "Before / After -Salesforce Transformation",
    liveLinks: [
      { label: "Admin View", url: "https://command-deal-nexus.lovable.app/" },
      { label: "Sales Rep View", url: "https://cognyte-dealflow.lovable.app/" },
    ],
    coverImage: "/assets/cognyte-cover.png",
    mediaVideos: [],
    mediaImages: [],
    videoSections: [
      {
        label: "Sales Representative View",
        desc: "A guided, friction-free interface that helps reps complete MEDDPICC fields through smart logic flows and AI-powered suggestions - reducing cognitive load and improving data quality.",
        video: "/assets/BackUp.mp4",
      },
      {
        label: "Manager / Admin View",
        desc: "A real-time dashboard giving managers full pipeline visibility, forecast analytics, and team performance tracking - turning Salesforce into a strategic command centre.",
        video: "/assets/backUpAdmin.mp4",
      },
    ],
  },
  {
    id: 2,
    icon: <Brain size={17} />,
    tags: [{ l: "LLM Agents" }, { l: "Capstone" }, { l: "AI Architecture" }],
    title: "Synapse",
    tagline: "Automating the instructional design workflow with a Multi-Agent ecosystem.",
    role: "UX Designer + AI Architect",
    tools: ["Figma", "LLMs", "Articulate 360 (Research)", "Docebo (Research)"],
    problem: "Manual instructional design is slow, resource-heavy, and impossible to scale. Creating quality learning materials requires weeks of expert work that can't keep pace with modern learning demands.",
    solution: "A 'Super-Agent' platform powered by LLMs that orchestrates specialised sub-agents for research, learning architecture, and UX flow creation. Designers stay in the loop as creative directors.",
    process: [
      "Comparative research across Articulate 360, Docebo, and existing AI writing assistants",
      "Defined a multi-agent architecture -each agent's scope, inputs, outputs, and handoff protocols",
      "Mapped complex AI-human collaboration flows: where designers approve, intervene, or redirect",
      "Designed a 'director model' UI -full oversight without manual execution burden",
      "Validated with instructional design professionals for usability and trust in AI-generated outputs",
    ],
    outcome: "A defined architecture and full UX prototype for an AI platform that could reduce instructional design time by 60%+ while keeping human expertise central.",
    liveEl: <SynapseGraph />,
    liveLabel: "Live Agent Flow -Multi-Agent Architecture",
    liveLinks: [],
    coverImage: "/assets/synapse-cover.png",
    wip: true,
    mediaVideos: [],
    mediaImages: ["/assets/synapse-hive-dark.jpeg"],
  },
  {
    id: 3,
    icon: <Layers size={17} />,
    tags: [{ l: "Computer Vision" }, { l: "GenAI" }, { l: "Privacy-First" }],
    title: "MushBot",
    tagline: "Safety-first mushroom identification using Hybrid AI architecture.",
    role: "Full-Stack Designer + Developer",
    tools: ["HTML5", "CSS3", "JavaScript", "Kindwise API", "ml5.js", "Gen-AI"],
    problem: "Amateur foragers need high-accuracy, real-time safety information in the field. Existing solutions upload raw images to cloud servers raising serious privacy concerns.",
    solution: "A web app combining Computer Vision (Kindwise API) for scientific species identification with a Gen-AI reasoning layer. ml5.js runs client-side filtering -no raw images leave the device. Privacy by design.",
    process: [
      "Researched forager behaviour and the life-critical stakes of misidentification edge cases",
      "Designed a 'safety-first' UX flow with immediate audiovisual feedback at every decision point",
      "Implemented ml5.js for on-device preprocessing -protecting privacy before any API call",
      "Orchestrated Kindwise API + GenAI layer for species ID and contextual safety risk scoring",
      "Built strict error-handling protocols for low-confidence scores and poor lighting conditions",
    ],
    outcome: "A functional, privacy-preserving web app with a hybrid AI pipeline and safety guardrails woven into every step of the UX.",
    liveEl: null,
    liveLabel: "Safety Pipeline",
    liveLinks: [{ label: "View Live Project", url: "https://mushbot.onrender.com/" }],
    coverImage: "/assets/mushbot-cover.png",
    laptopFrame: true,
    mediaVideos: ["/assets/mushbotvideoo.mp4"],
    mediaImages: [],
  },
  {
    id: 4,
    icon: <Coffee size={17} />,
    tags: [{ l: "Figma Prototyping" }, { l: "UX Writing" }, { l: "Interactive" }],
    title: "Ninja Coffee Guide",
    tagline: "A digital ritual: Transforming a physical manual into an interactive experience.",
    role: "UX Designer + Figma Prototyper",
    tools: ["Figma", "Advanced Prototyping", "UX Writing"],
    problem: "Physical product manuals are dense and linear, ignoring how users actually interact with appliances. The Ninja machine's manual failed to guide new users through setup in a calm, intuitive way.",
    solution: "An interactive digital guide built in Figma that simulates the machine's physical interface. Users step through each stage with contextual visuals and UX copy written for calm and confidence.",
    process: [
      "Audited the original Ninja manual for clarity gaps and user anxiety trigger points",
      "Mapped the full machine interaction model -buttons, modes, brew sequences -as a UX flow",
      "Designed interactive screen states in Figma, mirroring the machine's physical display accurately",
      "Wrote UX copy for each step: clear, warm, and completely jargon-free",
      "Used Figma advanced prototyping (overlays, conditionals, scroll triggers) for a native-app feel",
    ],
    outcome: "A polished high-fidelity Figma prototype demonstrating how UX writing and interaction design transform a mundane appliance manual into a delightful product experience.",
    liveEl: <NinjaPhone />,
    liveLabel: "Figma Prototype -Mobile Screen Recording",
    liveLinks: [{ label: "View Figma Prototype", url: "https://www.figma.com/proto/8PpWjHqQ4Eio9eZqSl1GIn/%D7%A0%D7%99%D7%A0%D7%92%D7%B3%D7%94-%D7%90%D7%A4%D7%99%D7%95%D7%9F-%D7%91%D7%9E%D7%95%D7%91%D7%99%D7%9C?page-id=46%3A2&node-id=555-203&viewport=1398%2C-599%2C0.14&t=ugECNsdmIFAJ9oKc-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=555%3A142&show-proto-sidebar=1" }],
    phoneFrame: true,
    coverImage: "/assets/Ninja-cover.png",
    mediaVideos: ["/assets/Ninja.mp4"],
    mediaImages: ["/assets/ninja.png"],
  },
  {
    id: 5,
    icon: <BookOpen size={17} />,
    tags: [{ l: "Instructional Design" }, { l: "UX/UI" }, { l: "E-Learning" }],
    title: "E-Learning Platform",
    tagline: "A comprehensive digital learning experience designed for scalable instructional delivery.",
    role: "Instructional Designer + UX/UI",
    tools: ["Figma", "Articulate 360", "HTML5", "CSS3"],
    problem: "Traditional learning management systems lack engaging, modern UI and fail to keep learners focused throughout complex instructional sequences.",
    solution: "A full UX/UI redesign of an e-learning platform built around learner motivation principles -clean layouts, clear progress indicators, and micro-interaction driven engagement loops.",
    process: [
      "Conducted learner experience research to identify dropout points and motivation gaps",
      "Defined information architecture and learning flow mapping across all module types",
      "Designed the complete UI component library in Figma -cards, progress bars, quiz modals",
      "Built HTML5/CSS3 prototype screens for key interactions and responsiveness",
      "Validated with test learners and iterated on completion flows",
    ],
    outcome: "A modern, learner-centred platform UI with 12 fully-designed screens covering onboarding, lessons, quizzes, and progress tracking.",
    liveEl: null,
    liveLabel: null,
    liveLinks: [{ label: "View Live Course", url: "https://360.articulate.com/review/content/fbfcc041-d87a-441d-8987-96591393ee15/review" }],
    coverImage: "/assets/ELEARNING1.png",
    mediaVideos: [],
    mediaImages: [
      "/assets/ELEARNING1.png", "/assets/ELEARNING2.png", "/assets/ELEARNING3.png",
      "/assets/ELEARNING5.png", "/assets/ELEARNING8.png", "/assets/ELEARNING11.png",
    ],
  },
  {
    id: 6,
    icon: <Wind size={17} />,
    tags: [{ l: "UX/UI" }, { l: "Motion Design" }, { l: "Interaction" }],
    title: "Ruaj Gbit",
    tagline: "A fluid, motion-driven interface designed for immersive digital experiences.",
    role: "UX/UI Designer + Motion",
    tools: ["Figma", "CSS Animation", "JavaScript"],
    problem: "Static interfaces lack the expressiveness needed for emotionally resonant brand experiences. Users disengage without meaningful visual feedback.",
    solution: "A motion-first interface design that uses fluid transitions, parallax depth, and gestural interactions to create a tactile digital experience with strong brand presence.",
    process: [
      "Defined motion principles -easing curves, timing hierarchies, transition triggers",
      "Designed component-level animations integrated with layout scroll behaviour",
      "Prototyped interactive state transitions in Figma with advanced overlays",
      "Built CSS keyframe animations and JS scroll triggers for the live prototype",
      "Tested motion performance across devices and refined timing for smoothness",
    ],
    outcome: "A high-fidelity, motion-rich prototype demonstrating how micro-interactions and fluid transitions elevate user engagement.",
    liveEl: null,
    liveLabel: null,
    liveLinks: [{ label: "View Live Project", url: "https://ruach-gabit-project.onrender.com/" }],
    coverImage: "/assets/ruch-gabit-cover.png",
    laptopFrame: true,
    mediaVideos: ["/assets/ruaj_gbit.mp4"],
    mediaImages: [],
  },
  {
    id: 7,
    icon: <PenTool size={17} />,
    tags: [{ l: "Product Design" }, { l: "Mockup" }, { l: "Mobile" }],
    title: "Pilpeled",
    tagline: "A bold product design concept brought to life through high-fidelity mobile mockups.",
    role: "Product Designer + Prototype",
    tools: ["Figma", "Principle", "After Effects"],
    problem: "Concept products often fail to communicate their value because static wireframes lack the fidelity needed to test real user reactions and stakeholder buy-in.",
    solution: "A full high-fidelity mobile design system and interactive prototype for Pilpeled -with polished visual language, interaction states, and realistic content that conveys the product vision clearly.",
    process: [
      "Defined brand identity: typography, colour system, iconography, illustration style",
      "Built a complete Figma component library with all states (default, hover, active, error)",
      "Designed all primary user flows: onboarding, discovery, detail, checkout",
      "Created a high-fidelity interactive prototype with realistic transitions",
      "Produced a mockup video for stakeholder and portfolio presentation",
    ],
    outcome: "A publication-ready product design with a full component library, interactive prototype, and polished mockup video demonstrating the complete user experience.",
    liveEl: null,
    liveLabel: null,
    liveLinks: [{ label: "View Figma Prototype", url: "https://www.figma.com/proto/iAPTqzuI9usRAlqtt1u81L/Pilpeled?page-id=0%3A1&node-id=463-1331&starting-point-node-id=463%3A1331&t=EHUWwOYYKmRcBdg2-1" }],
    coverImage: "/assets/pilpeled-cover.png",
    mediaVideos: ["/assets/Pilpeledmockp.mp4"],
    mediaImages: ["/assets/pilpeled.png"],
  },
  {
    id: 8,
    icon: <Ghost size={17} />,
    tags: [{ l: "Game UX" }, { l: "Interactive" }, { l: "QA" }],
    title: "Get The Ghost",
    tagline: "A playful interactive experience built at the intersection of game design and UX.",
    role: "Game UX Designer + QA Lead",
    tools: ["Unity", "C#", "Figma", "QA Testing"],
    problem: "Many casual game experiences suffer from unclear mechanics and poor onboarding, leading to immediate player drop-off before the core loop is understood.",
    solution: "A tightly-designed interactive experience with intuitive game mechanics, a clear onboarding flow, and satisfying feedback loops -informed by systematic QA testing and iterative gameplay design.",
    process: [
      "Designed the core game loop with clear win/lose states and progression hooks",
      "Built the complete UI flow in Figma -menus, HUD, game over screens, rewards",
      "Developed in Unity with C# scripting for game logic and interaction handling",
      "Led systematic QA testing: edge cases, accessibility checks, cross-device validation",
      "Iterated on difficulty curve and visual feedback based on playtesting sessions",
    ],
    outcome: "A fully playable interactive experience showcasing the power of combining game design thinking, UX precision, and rigorous QA methodology.",
    liveEl: null,
    liveLabel: null,
    liveLinks: [{ label: "Play the Game", url: "https://triangle.telem-hit.net/2025/CatchAGhost_NofarRoniShir" }],
    coverImage: "/assets/get-the-ghost-cover.png",
    mediaVideos: ["/assets/GetTheGhost.mp4"],
    mediaImages: ["/assets/GetTheGhost.png"],
  },
];

/* ─────────────────── NAV ─────────────────── */
const Nav = () => {
  const { dark, setDark } = useTheme();
  return (
    <nav className="nav">
      <Link className="nav-logo" to="/">
        {/* invisible spacer keeps the container width stable */}
        <img src="/assets/logo.png" alt="" aria-hidden="true" style={{ visibility: "hidden" }} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={dark ? "logo-dark" : "logo-light"}
            src={dark ? "/assets/logo-dark.png" : "/assets/logo.png"}
            alt="Nofar Baram Logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </Link>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="nav-links">
          <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/" end>Work</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/about">About</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/contact">Contact</NavLink>
        </div>
        <button className="theme-btn" onClick={() => setDark(d => !d)}>
          {dark ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>
    </nav>
  );
};

/* ─────────────────── FOOTER ─────────────────── */
const Footer = () => (
  <footer className="foot">
    <span>© 2025 Nofar Baram</span>
    <span style={{ letterSpacing: "0.04em" }}>Creative Technologist & UX/UI Designer</span>
  </footer>
);


/* ─────────────────── HOME PAGE ─────────────────── */
const HomePage = () => {
  const navigate = useNavigate();
  const parallax = useMouseParallax(16);
  return (
    <div className="page">
      {/* ─ Hero ─ */}
      <div className="hero" style={{ position: "relative" }}>
        <div className="hero-left" style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
          <FadeUp>
            <div className="hero-badge">
              <span className="badge-dot" />
              Available for opportunities
            </div>
          </FadeUp>
          <FadeUp delay={0.04}>
            <p className="hero-intro">Hi 👋, I'm Nofar</p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="hero-h1">
              <span className="dim">Creative</span><br />
              <span className="hero-accent">Technologist</span>
              <span className="sub-line">& UX / UI Designer</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="hero-body">
              I design and build end-to-end digital products where <strong>AI-driven thinking</strong> meets pixel-perfect craft. UX research, Figma systems, full-stack implementation - from concept to launch.
            </p>
          </FadeUp>
          <FadeUp delay={0.18}>
            <div className="hero-btns">
              <Link className="btn-primary" to="#projects" onClick={e => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}>
                View My Work <ChevronRight size={14} />
              </Link>
              <Link className="btn-secondary" to="/contact">Get in Touch</Link>
            </div>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="hero-stats">
              {[{ n: "10+", l: "Projects" }, { n: "B.A.", l: "Learning Tech" }, { n: "Code", l: "Frontend Skills" }, { n: "AI", l: "Native Designer" }].map(s => (
                <div key={s.l}>
                  <div className="hstat-n"><CountUp value={s.n} /></div>
                  <div className="hstat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.1} style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
          <div style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)`, transition: "transform 0.5s cubic-bezier(0.17,0.67,0.45,1)", willChange: "transform" }}>
            <div className="orbit-wrap">
              <div className="orbit-ring orbit-ring-1">
                <OBadge label="JS"  bg="#F7DF1E" color="#2B2B2B"               pos={{ left:"40.5%", top:"-9.5%" }} />
                <OBadge label="Fg"  bg="#1E0533" color="#A259FF" fs="0.6rem"   pos={{ left:"84%",   top:"65.5%" }} />
                <OBadge label="Py"  bg="#1C3557" color="#F7D23E" fs="0.58rem"  pos={{ left:"-3%",   top:"65.5%" }} />
              </div>
              <div className="orbit-ring orbit-ring-2">
                <OBadge label="Ps"  bg="#001E36" color="#31A8FF" fs="0.6rem"   pos={{ left:"86.4%", top:"18.2%" }} />
                <OBadge label="Ai"  bg="#300000" color="#FF9A00" fs="0.6rem"   pos={{ left:"43.2%", top:"93.2%" }} />
                <OBadge label="C#"  bg="#512BD4" color="#ffffff"               pos={{ left:"0%",    top:"18.2%" }} />
              </div>
              <div className="orbit-ring orbit-ring-3">
                <OBadge label="Unity" bg="#1A1A1A" color="#ffffff" fs="0.5rem"  pos={{ left:"44.4%", top:"-5.6%"  }} />
                <OBadge label="GPT"   bg="#10A37F" color="#ffffff" fs="0.54rem" pos={{ left:"87.6%", top:"69.4%"  }} />
                <OBadge label="A360"  bg="#E8591A" color="#ffffff" fs="0.45rem" pos={{ left:"1.2%",  top:"69.4%"  }} />
              </div>
              <div className="orbit-core" />
            </div>
          </div>
        </FadeUp>
      </div>

      {/* ─ Projects Bento Grid ─ */}
      <div className="hdiv" />
      <div id="projects" className="wrap sec">
        <FadeUp><div className="kicker">Selected Work</div></FadeUp>
        <FadeUp delay={0.05}><h2 className="sec-h">Projects</h2></FadeUp>
        <FadeUp delay={0.08}><p className="sec-sub">Eight projects across UX/UI design, AI integration, full-stack development, and instructional design.</p></FadeUp>

        <div className="bento">
          {PROJECTS.map((p, i) => (
            <FadeUp key={p.id} delay={0.04 * i} style={{ display: "contents" }}>
              <Link
                to={`/project/${p.id}`}
                className={`bcard${i === 0 ? " bcard-feat" : ""}`}
              >
                <div className="bcard-cover">
                  <BCardCover p={p} />
                  <div className="bcard-cover-overlay" />
                  {p.wip && (
                    <div className="wip-badge">
                      <div className="wip-dot" />
                      In Development
                    </div>
                  )}
                </div>
                <div className="bcard-content">
                  <div className="bcard-num">0{p.id}</div>
                  <div className="bcard-tags">{p.tags.map(t => <span key={t.l} className="btag">{t.l}</span>)}</div>
                  <div className="bcard-title">{p.title}</div>
                  <div className="bcard-line">{p.tagline}</div>
                  <div className="bcard-arrow"><ChevronRight size={16} /></div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

/* ─────────────────── PROJECT DETAIL PAGE ─────────────────── */
const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = PROJECTS.find(x => x.id === parseInt(id));

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!p) return <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>Project not found.</div>;

  return (
    <div className="page">
      {/* Header */}
      <div className="proj-hero">
        <FadeUp>
          <button className="back-btn" onClick={() => navigate({ pathname: "/", hash: "#projects" })}>
            <ArrowLeft size={14} /> Back
          </button>
        </FadeUp>
        <FadeUp delay={0.04}>
          <div className="proj-tags">{p.tags.map(t => <span key={t.l} className="ptag">{t.l}</span>)}</div>
          {p.wip && (
            <div className="wip-notice">
              <div className="wip-dot" style={{ width: 7, height: 7 }} />
              Work in Progress - actively in development
            </div>
          )}
          <h1 className="proj-title">{p.title}</h1>
          <p className="proj-tagline">{p.tagline}</p>
        </FadeUp>
        <FadeUp delay={0.08}>
          <div className="proj-meta">
            <div className="pmeta"><div className="pmeta-label">Role</div><div className="pmeta-val">{p.role}</div></div>
            <div className="pmeta">
              <div className="pmeta-label">Tools</div>
              <div className="pmeta-val" style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.1rem" }}>
                {p.tools.map(t => <span key={t} className="tool-chip">{t}</span>)}
              </div>
            </div>
          </div>
          {p.liveLinks?.length > 0 && (
            <div className="live-links">
              {p.liveLinks.map(({ label, url }) => (
                <a key={label} className="live-link-btn" href={url} target="_blank" rel="noreferrer">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {label}
                </a>
              ))}
            </div>
          )}
        </FadeUp>
      </div>

      {/* Body */}
      <div className="proj-body">

        {/* Live Element */}
        {p.liveEl && (
          <FadeUp>
            <div className="live-box">
              <div className="live-label">Live -{p.liveLabel}</div>
              {p.liveEl}
            </div>
          </FadeUp>
        )}

        {/* Video Sections (split labelled views, e.g. Cognyte) */}
        {p.videoSections?.length > 0 && (
          <FadeUp>
            <div className="proj-section-label">Project Videos</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
              {p.videoSections.map((sec, i) => (
                <div key={i} className="video-section">
                  <div className="video-section-label">{sec.label}</div>
                  <p className="video-section-desc">{sec.desc}</p>
                  <LaptopFrame src={sec.video} />
                </div>
              ))}
            </div>
          </FadeUp>
        )}

        {/* Videos */}
        {p.mediaVideos.length > 0 && !(p.liveEl && p.phoneFrame) && (
          <FadeUp>
            <div className="proj-section-label">Project Videos</div>
            {p.phoneFrame ? (
              <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
                {p.mediaVideos.map((v, i) => (
                  <div className="iphone-wrap" key={i} style={{ padding: 0 }}>
                    <div className="iphone-outer">
                      <div className="iphone-side-btn" />
                      <div className="iphone-side-vol" />
                      <div className="iphone-side-vol iphone-side-vol2" />
                      <div className="iphone-island" />
                      <div className="iphone-screen">
                        <video src={v} autoPlay loop muted playsInline />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : p.laptopFrame ? (
              <div className="media-col">
                {p.mediaVideos.map((v, i) => <LaptopFrame key={i} src={v} />)}
              </div>
            ) : (
              <div className="media-col">
                {p.mediaVideos.map((v, i) => (
                  <video key={i} src={v} autoPlay loop muted playsInline
                    style={{ width: "100%", maxWidth: "780px", margin: "0 auto", borderRadius: "16px", display: "block", border: "1px solid var(--border)" }} />
                ))}
              </div>
            )}
          </FadeUp>
        )}

        {/* Images Gallery */}
        {p.mediaImages.length > 0 && (
          <FadeUp>
            <div className="proj-section-label">Gallery</div>
            <div className="proj-gallery">
              {p.mediaImages.map((img, i) => (
                <img key={i} src={img} alt={`${p.title} screen ${i + 1}`} />
              ))}
            </div>
          </FadeUp>
        )}

        <div className="hdiv" />

        {/* Problem */}
        <FadeUp>
          <div className="proj-section-label">Problem</div>
          <p className="proj-p">{p.problem}</p>
        </FadeUp>

        <div className="hdiv" />

        {/* Solution */}
        <FadeUp>
          <div className="proj-section-label">Solution</div>
          <p className="proj-p">{p.solution}</p>
        </FadeUp>

        <div className="hdiv" />

        {/* Process */}
        <FadeUp>
          <div className="proj-section-label">Process</div>
          <ul className="proj-steps">
            {p.process.map((s, i) => (
              <li key={i} className="proj-step"><div className="step-dot" /><span>{s}</span></li>
            ))}
          </ul>
        </FadeUp>

        <div className="hdiv" />

        {/* Outcome */}
        <FadeUp>
          <div className="proj-section-label">Outcome</div>
          <p className="proj-p">{p.outcome}</p>
        </FadeUp>

        {/* Navigation between projects */}
        <FadeUp>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            {p.id > 1 ? (
              <Link to={`/project/${p.id - 1}`} className="btn-secondary" style={{ textDecoration: "none" }}>
                <ArrowLeft size={14} /> {PROJECTS[p.id - 2]?.title}
              </Link>
            ) : <div />}
            {p.id < PROJECTS.length ? (
              <Link to={`/project/${p.id + 1}`} className="btn-primary" style={{ textDecoration: "none" }}>
                {PROJECTS[p.id]?.title} <ChevronRight size={14} />
              </Link>
            ) : <div />}
          </div>
        </FadeUp>
      </div>

      <Footer />
    </div>
  );
};

/* ─────────────────── ABOUT PAGE ─────────────────── */
const AboutPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="page page-glow">
      <div className="wrap sec">
        <FadeUp><div className="kicker">Background</div></FadeUp>
        <FadeUp delay={0.04}><h1 className="sec-h"><span className="grad-heading">About</span> & Tech Stack</h1></FadeUp>

        <div className="about-grid">
          <div>
            <FadeUp delay={0.08}>
              <p className="about-p">I'm a <strong>Creative Technologist & UX/UI Designer</strong> in my 3rd year of Instructional Technologies at HIT -blending design thinking, AI integration, and full-stack development into products that are both beautiful and bulletproof.</p>
              <p className="about-p">My <strong>QA Game Testing background</strong> gives me a systematic, edge-case-obsessed approach that most designers don't have. I've broken more products than I've built -and that makes me build far better ones.</p>
              <p className="about-p"><strong>2+ years at Wolt</strong> (Senior Operations) trained me to make high-stakes decisions under pressure, navigate complex data systems, and always keep the user at the centre of operational complexity.</p>
              <p className="about-p">I'm at my best at the intersection of <strong>AI innovation, visual design, and technical precision</strong> -where systems are designed to be both elegant and resilient.</p>
            </FadeUp>
            <FadeUp delay={0.12}>
              <div className="xp-list">
                {[
                  { t: "B.A. Instructional Technologies -HIT", m: "Oct 2023 – Present" },
                  { t: "Senior Support Associate -Wolt Enterprises", m: "Oct 2023 – Present · Tel Aviv" },
                  { t: "Graphic Designer & Manager -Shugis", m: "Feb 2021 – Sep 2022 · Tel Aviv" },
                  { t: "Technical Operations Specialist -IDF Elite Unit", m: "2019 – 2021" },
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
                  { icon: <Code2 size={14} />, l: "HTML · CSS · JS", s: "Frontend" },
                  { icon: <Gamepad2 size={14} />, l: "Unity + C#", s: "Game Dev & UI" },
                  { icon: <Brain size={14} />, l: "LLM / GenAI", s: "AI Integration" },
                  { icon: <CpuIcon size={14} />, l: "Computer Vision", s: "ml5.js · Kindwise" },
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

/* ─────────────────── CONTACT PAGE ─────────────────── */
const ContactPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="page page-glow">
      <FadeUp>
        <div className="contact-inner">
          <h1 className="contact-h contact-accent">Let's build<br /><em>something great.</em></h1>
          <p className="contact-sub">Open to UX design roles, creative tech collaborations, and AI-driven product challenges. Let's make something worth using.</p>
          <div className="clinks">
            <a className="clink" href="mailto:Nofbar344@gmail.com"><Mail size={14} /> Nofbar344@gmail.com</a>
            <a className="clink" href="https://www.linkedin.com/in/nofar-baram/" target="_blank" rel="noreferrer"><ExternalLink size={14} /> LinkedIn</a>
          </div>
        </div>
      </FadeUp>
      <Footer />
    </div>
  );
};

/* ─────────────────── APP ─────────────────── */
export default function Portfolio() {
  const [dark, setDark] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);

  return (
    <ThemeCtx.Provider value={{ dark, setDark }}>
      <G />
      <BrowserRouter>
        <div className={`pr ${dark ? "dark" : "light"}`}>
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeCtx.Provider>
  );
}
