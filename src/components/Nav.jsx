import { Link, NavLink } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Nav = () => {
  const { dark, setDark } = useTheme();
  return (
    <nav className="nav">
      <Link className="nav-logo" to="/">
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
        <button className="theme-btn" aria-label="Toggle Dark Mode" onClick={() => setDark(d => !d)}>
          {dark ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
