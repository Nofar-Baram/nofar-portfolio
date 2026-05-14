import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

const CountUp = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const num = parseInt(value);
  const suffix = isNaN(num) ? "" : value.replace(/[0-9]/g, "");
  const [display, setDisplay] = useState(isNaN(num) ? value : "0" + suffix);

  useEffect(() => {
    let frameId;
    if (!inView) return;
    if (isNaN(num)) { setDisplay(value); return; }
    const start = performance.now();
    const dur = 1300;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * num) + suffix);
      if (t < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [inView]);

  return <span ref={ref}>{display}</span>;
};

export default CountUp;
