import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Download } from "lucide-react";
import FadeUp from "../components/FadeUp";
import OBadge from "../components/OBadge";
import BCardCover from "../components/BCardCover";
import Footer from "../components/Footer";
import { useMouseParallax } from "../hooks/useMouseParallax";
import PROJECTS from "../data/projects";

const HomePage = () => {
  const parallax = useMouseParallax(16);
  const orbitRef = useRef(null);
  const rateRef = useRef(1);
  const rafRef = useRef(null);

  const animateRate = useCallback((to) => {
    const from = rateRef.current;
    const startTime = performance.now();
    const duration = 600;

    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      // ease-in-out cubic
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const rate = from + (to - from) * eased;
      rateRef.current = rate;

      if (orbitRef.current) {
        orbitRef.current.querySelectorAll(".orbit-ring, .orbit-dot").forEach((el) => {
          el.getAnimations().forEach((anim) => { anim.playbackRate = rate; });
        });
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rateRef.current = to;
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleOrbitEnter = useCallback(() => animateRate(0.25), [animateRate]);
  const handleOrbitLeave = useCallback(() => animateRate(1), [animateRate]);

  return (
    <div className="page">
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
              <span className="dim">UX/UI &amp;</span><br />
              <span className="hero-accent">Product Designer</span>
              <span className="sub-line">Building thoughtful digital products with a focus on UX, product thinking, and AI.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="hero-body">
              I design and prototype end-to-end experiences, from user flows to high-fidelity interfaces.
              With a background in both design and development, I create intuitive products that integrate AI in meaningful, user-centered ways.
            </p>
          </FadeUp>
          <FadeUp delay={0.18}>
            <div className="hero-btns">
              <Link className="btn-primary" to="#projects" onClick={e => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}>
                View My Work <ChevronRight size={14} />
              </Link>
              <a className="btn-secondary" href="/assets/nofar-baram-cv.pdf" download="Nofar_Baram_CV.pdf" target="_blank" rel="noreferrer">
                <Download size={14} /> Download CV
              </a>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.1} style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
          <div style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)`, transition: "transform 0.5s cubic-bezier(0.17,0.67,0.45,1)", willChange: "transform" }}>
            <div
              className="orbit-wrap"
              ref={orbitRef}
              onMouseEnter={handleOrbitEnter}
              onMouseLeave={handleOrbitLeave}
            >
              <div className="orbit-ring orbit-ring-1">
                <OBadge label="JS" bg="#F7DF1E" color="#2B2B2B" pos={{ left:"81px", top:"-19px" }} />
                <OBadge label="Fg" bg="#1E0533" color="#A259FF" fs="0.6rem" pos={{ left:"168px", top:"131px" }} />
                <OBadge label="Py" bg="#1C3557" color="#F7D23E" fs="0.58rem" pos={{ left:"-6px", top:"131px" }} />
              </div>
              <div className="orbit-ring orbit-ring-2">
                <OBadge label="Ps" bg="#001E36" color="#31A8FF" fs="0.6rem" pos={{ left:"242px", top:"51px" }} />
                <OBadge label="Ai" bg="#300000" color="#FF9A00" fs="0.6rem" pos={{ left:"121px", top:"261px" }} />
                <OBadge label="C#" bg="#512BD4" color="#ffffff" pos={{ left:"0px", top:"51px" }} />
              </div>
              <div className="orbit-ring orbit-ring-3">
                <OBadge label="Unity" bg="#1A1A1A" color="#ffffff" fs="0.5rem" pos={{ left:"151px", top:"-19px" }} />
                <OBadge label="GPT" bg="#10A37F" color="#ffffff" fs="0.54rem" pos={{ left:"298px", top:"236px" }} />
                <OBadge label="A360" bg="#E8591A" color="#ffffff" fs="0.45rem" pos={{ left:"4px", top:"236px" }} />
              </div>
              <div className="orbit-core" />
            </div>
          </div>
        </FadeUp>
      </div>

      <div className="hdiv" />
      <div id="projects" className="wrap sec">
        <FadeUp><div className="kicker">Selected Work</div></FadeUp>
        <FadeUp delay={0.05}><h2 className="sec-h">Projects</h2></FadeUp>
        <FadeUp delay={0.08}><p className="sec-sub">Eight projects across UX/UI design, AI integration, full-stack development, and instructional design.</p></FadeUp>

        <div className="bento">
          {PROJECTS.map((p, i) => (
            <FadeUp key={p.id} delay={0.04 * i} style={{ display: "contents" }}>
              <Link to={`/project/${p.id}`} className={`bcard${i === 0 ? " bcard-feat" : ""}`}>
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

export default HomePage;
