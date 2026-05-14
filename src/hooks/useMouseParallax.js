import { useState, useEffect, useRef, useCallback } from "react";

export const useMouseParallax = (strength = 16) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafId = useRef(null);

  const handle = useCallback((e) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      setPos({
        x: (e.clientX / window.innerWidth - 0.5) * strength,
        y: (e.clientY / window.innerHeight - 0.5) * strength,
      });
    });
  }, [strength]);

  useEffect(() => {
    window.addEventListener("mousemove", handle);
    return () => {
      window.removeEventListener("mousemove", handle);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handle]);

  return pos;
};
