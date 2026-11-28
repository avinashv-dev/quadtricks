import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function LogoLoader({ label = "Loading" }: { label?: string }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const regions = Array.from(document.querySelectorAll<HTMLElement>("header, main, footer"));
    const previous = regions.map((region) => region.inert);
    regions.forEach((region) => {
      region.inert = true;
    });
    return () => {
      regions.forEach((region, index) => {
        region.inert = previous[index] ?? false;
      });
    };
  }, []);

  const loader = (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid min-h-dvh place-items-center bg-background"
    >
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className="relative grid size-44 place-items-center"
        style={{ perspective: 800 }}
      >
        <motion.span
          className="absolute bottom-5 h-3 w-20 rounded-full bg-primary/30 blur-md"
          {...(!reducedMotion && { animate: { scale: [1, 0.65, 1], opacity: [0.5, 0.2, 0.5] } })}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="relative size-24"
          style={{ transformStyle: "preserve-3d" }}
          {...(!reducedMotion && {
            animate: { y: [0, -24, 0], rotateY: [0, 180, 360], rotateZ: [-8, 8, -8] },
          })}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        >
          <span
            className="absolute inset-0 rounded-full border-[5px] border-primary/60 bg-primary/60"
            style={{ transform: "translateZ(-2px)" }}
          />
          {[0, 180].map((rotation) => (
            <span
              key={rotation}
              className="absolute inset-0 grid place-items-center rounded-full border-4 border-primary/75 bg-logo-chip shadow-[0_0_35px_-10px_var(--primary)]"
              style={{
                backfaceVisibility: "hidden",
                transform: `rotateY(${rotation}deg) translateZ(3px)`,
              }}
            >
              <img
                src="/quadtricks-emblem.webp"
                alt=""
                width="72"
                height="72"
                className="size-[4.5rem] object-contain"
              />
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );

  return typeof document === "undefined" ? loader : createPortal(loader, document.body);
}
