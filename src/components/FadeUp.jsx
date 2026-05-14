import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
          ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
          : { opacity: 0, y: 22, filter: "blur(5px)", scale: 0.97 }
      }
      transition={
        inView
          ? {
              opacity: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
              filter: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
              y: { type: "spring", stiffness: 300, damping: 26, delay },
              scale: { type: "spring", stiffness: 300, damping: 26, delay },
            }
          : { duration: 0.38, ease: [0.4, 0, 0.6, 1] }
      }
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;
