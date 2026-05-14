import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeCtx } from "./context/ThemeContext";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const [dark, setDark] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);

  return (
    <ThemeCtx.Provider value={{ dark, setDark }}>
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
