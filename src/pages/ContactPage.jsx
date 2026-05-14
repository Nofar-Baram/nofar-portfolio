import { useEffect } from "react";
import { Mail, Download } from "lucide-react";
import FadeUp from "../components/FadeUp";
import Footer from "../components/Footer";

const ContactPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="page page-glow">
      <FadeUp>
        <div className="contact-inner">
          <h1 className="contact-h contact-accent">Let's build<br /><em>something great.</em></h1>
          <p className="contact-sub">Open to UX design roles, creative tech collaborations, and AI-driven product challenges. Let's make something worth using.</p>

          {/* Row 1 — Primary actions */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <a
              className="btn-primary"
              href="/assets/nofar-baram-cv.pdf"
              download="Nofar_Baram_CV.pdf"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Download size={15} /> Download CV
            </a>
            <a
              className="btn-secondary"
              href="mailto:nofar344@gmail.com"
              style={{ textDecoration: "none" }}
            >
              <Mail size={15} /> Send an Email
            </a>
          </div>


          {/* Row 3 — Social icons only */}
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", alignItems: "center" }}>
            {/* WhatsApp */}
            <a
              href="https://wa.me/972556640500"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp"
              style={{ color: "var(--mutedL)", transition: "color 0.2s, transform 0.2s", display: "flex" }}
              onMouseOver={e => { e.currentTarget.style.color = "#25D366"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { e.currentTarget.style.color = "var(--mutedL)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.015c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/nofar-baram/"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
              style={{ color: "var(--mutedL)", transition: "color 0.2s, transform 0.2s", display: "flex" }}
              onMouseOver={e => { e.currentTarget.style.color = "#0A66C2"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { e.currentTarget.style.color = "var(--mutedL)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </FadeUp>
      <Footer />
    </div>
  );
};

export default ContactPage;
