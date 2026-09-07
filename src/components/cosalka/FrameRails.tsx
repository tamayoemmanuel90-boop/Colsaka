import { motion } from "framer-motion";

/**
 * FrameRails — Mantis-style fixed editorial chrome:
 * vertical mono rails on both edges, corner micro-copy, a mono "weather"
 * line under the nav and a small tilted gold shard (brand accent) floating
 * at the bottom-left. Pure decoration: pointer-events-none everywhere.
 */

const RAIL =
  "pointer-events-none fixed z-40 select-none font-mono text-[8.5px] uppercase tracking-[0.34em] text-black/40";

export function FrameRails() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.9 }}
    >
      {/* top-center "weather" line — shipping & guarantee announce */}
      <div className={`${RAIL} left-1/2 top-[96px] hidden -translate-x-1/2 sm:block`}>
        Envíos 24/72 h — garantía 30 días — rutina dos pasos
      </div>

      {/* vertical side rails */}
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

      {/* bottom corners */}
      <div className={`${RAIL} bottom-5 left-5 hidden lg:block`}>
        Hecho en laboratorio ♦
      </div>
      <div className={`${RAIL} bottom-5 right-5 hidden lg:block`}>
        © 2025 — Cosalka®
      </div>

      {/* tilted gold shard — brand accent behind the 3D layer */}
      <div
        className="pointer-events-none fixed bottom-[15%] left-[3.5%] z-[15] hidden lg:block"
        style={{
          width: 132,
          height: 56,
          transform: "rotate(-9deg)",
          clipPath: "polygon(0 42%, 100% 0, 52% 100%, 10% 80%)",
          background:
            "linear-gradient(135deg, #f0dfa8 0%, #d4af37 55%, #8a6d1f 100%)",
          filter: "drop-shadow(0 10px 24px rgba(212,175,55,.35))",
          opacity: 0.92,
        }}
      />
    </motion.div>
  );
}
