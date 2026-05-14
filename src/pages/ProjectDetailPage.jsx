import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import FadeUp from "../components/FadeUp";
import Footer from "../components/Footer";
import LaptopFrame from "../components/LaptopFrame";
import PROJECTS from "../data/projects";

const TEXT_WIDTH = { maxWidth: 760, margin: "0 auto" };

function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

const ProjectNotFound = () => (
  <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", minHeight: "calc(100vh - 58px)" }}>
    <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--mutedL)", lineHeight: 1 }}>404</h1>
    <p style={{ fontSize: "1.1rem", color: "var(--muted)", maxWidth: 400, textAlign: "center", lineHeight: 1.7 }}>
      This project doesn't exist or may have been removed.
    </p>
    <Link to="/" className="btn-primary" style={{ textDecoration: "none", marginTop: "0.5rem" }}>
      <ArrowLeft size={14} /> Back to Home
    </Link>
  </div>
);

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const p = PROJECTS.find(x => x.id === parseInt(id));

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!p) return <ProjectNotFound />;

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="proj-hero">
        <FadeUp>
          <button className="back-btn" onClick={() => navigate("/#projects")}>
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
            <div className="pmeta"><div className="pmeta-label">Role</div><div className="pmeta-val">{p.role}{p.context && <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "0.2rem" }}>{p.context}</div>}</div></div>
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
                  {label} <ExternalLink size={12} style={{ flexShrink: 0 }} />
                </a>
              ))}
            </div>
          )}
        </FadeUp>
      </div>

      <div className="proj-body">

        {/* ── 1. Problem ── */}
        <FadeUp>
          <div style={TEXT_WIDTH}>
            <div className="proj-section-label">Problem</div>
            <p className="proj-p">{p.problem}</p>
          </div>
        </FadeUp>
        <div className="hdiv" />

        {/* ── 2. Solution ── */}
        <FadeUp>
          <div style={TEXT_WIDTH}>
            <div className="proj-section-label">Solution</div>
            <p className="proj-p">{p.solution}</p>
          </div>
        </FadeUp>
        <div className="hdiv" />

        {/* ── 3. Process ── */}
        <FadeUp>
          <div style={TEXT_WIDTH}>
            <div className="proj-section-label">Process</div>
            <ul className="proj-steps">
              {p.process.map((s, i) => (
                <li key={i} className="proj-step"><div className="step-dot" /><span>{parseBold(s)}</span></li>
              ))}
            </ul>
          </div>
        </FadeUp>
        <div className="hdiv" />

        {/* ── 4. Media ── */}

        {/* Interactive live element (e.g. Synapse graph) */}
        {p.liveEl && (
          <FadeUp>
            <div className="live-box">
              <div className="live-label">Live &mdash; {p.liveLabel}</div>
              {p.liveEl}
            </div>
          </FadeUp>
        )}

        {/* Labelled video sections (e.g. Cognyte split views) */}
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

        {/* Regular video files */}
        {p.mediaVideos?.length > 0 && !(p.liveEl && p.phoneFrame) && (
          <FadeUp>
            <div className="proj-section-label">Project Videos</div>
            {p.phoneFrame ? (
              <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
                {p.mediaVideos.map((v, i) => (
                  <div className="iphone-wrap" key={i} style={{ padding: 0 }}>
                    <div className="iphone-frame">
                      <img className="iphone-frame-img" src="/assets/iphone-frame.png" alt="" />
                      <video src={v} autoPlay loop muted playsInline controls />
                    </div>
                  </div>
                ))}
              </div>
            ) : p.laptopFrame ? (
              p.mobileMockupVideo ? (
                <div className="device-duo">
                  <div className="device-duo-laptop">
                    {p.mediaVideos.map((v, i) => <LaptopFrame key={i} src={v} />)}
                  </div>
                  <div className="device-duo-phone">
                    <div className="iphone-frame">
                      <img className="iphone-frame-img" src="/assets/iphone-frame.png" alt="" />
                      <video src={p.mobileMockupVideo} autoPlay loop muted playsInline />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="media-col">
                  {p.mediaVideos.map((v, i) => <LaptopFrame key={i} src={v} />)}
                </div>
              )
            ) : (
              <div className="media-col">
                {p.mediaVideos.map((v, i) => (
                  <video key={i} src={v} autoPlay loop muted playsInline controls
                    style={{ width: "100%", maxWidth: "780px", margin: "0 auto", borderRadius: "16px", display: "block", border: "1px solid var(--border)" }} />
                ))}
              </div>
            )}
          </FadeUp>
        )}

        {/* Image gallery */}
        {p.mediaImages?.length > 0 && (
          <FadeUp>
            <div className="proj-section-label">Gallery</div>
            {p.mediaImages.length === 1 ? (
              <img
                src={p.mediaImages[0]}
                alt={`${p.title} UI`}
                loading="lazy"
                style={{
                  display: "block", width: "100%", maxWidth: 900,
                  maxHeight: "80vh", objectFit: "contain",
                  margin: "0 auto", borderRadius: "18px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                }}
              />
            ) : (
              <div className="proj-gallery">
                {p.mediaImages.map((img, i) => (
                  <img key={i} src={img} alt={`${p.title} screen ${i + 1}`} loading="lazy" />
                ))}
              </div>
            )}
          </FadeUp>
        )}

        <div className="hdiv" />

        {/* ── 5. Outcome ── */}
        <FadeUp>
          <div style={TEXT_WIDTH}>
            <div className="proj-section-label">Outcome</div>
            <p className="proj-p">{p.outcome}</p>
          </div>
        </FadeUp>

        {/* ── Project navigation ── */}
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

export default ProjectDetailPage;
