import { motion } from "framer-motion";

/**
 * FrameRails — Mantis-style fixed editorial chrome.
 * Cleaned layout: only the two vertical mono rails remain — they are the
 * signature editorial texture. The fixed "weather" line under the nav and
 * the bottom-corner labels were removed: they duplicated the navbar
 * announcement / footer legal and collided with cards, media and CTAs
 * while scrolling. (The tilted gold shard was removed earlier — user
 * request: no triangle floating under the hero CTAs.)
 */

const RAIL =
  "pointer-events-none fixed z-40 select-none font-mono text-[8.5px] uppercase tracking-[0.34em] text-black/[0.16]";

export function FrameRails() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.9 }}
    >
      {/* vertical side rails — subtle texture at the page edges */}
      <div
        className={`${RAIL} left-5 top-1/2 hidden -translate-y-1/2 md:block`}
        style={{ writingMode: "vertical-rl" }}
      >
        Nutragen — Cosalka — rutina dos pasos — 500 ml
      </div>
      <div
        className={`${RAIL} right-5 top-1/2 hidden -translate-y-1/2 md:block`}
        style={{ writingMode: "vertical-rl" }}
      >
        Sin corticoides — Sin esteroides — Vegano
      </div>
    </motion.div>
  );
}
