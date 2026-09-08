"use client";

import { motion } from "framer-motion";
import { GlowTitle, type TitlePiece } from "./GlowTitle";

/**
 * SectionHead — shared editorial header for every narrative section:
 * mono kicker + colossal GlowTitle. Text sits at z-10 (behind the 3D
 * protagonist canvas at z-20) exactly like the mantis-style contract.
 */
export function SectionHead({
  kicker,
  lines,
  className = "",
  titleClassName = "mt-7 text-[clamp(2.4rem,5.4vw,5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink",
  align = "left",
}: {
  kicker: string;
  lines: Array<Array<TitlePiece>>;
  className?: string;
  titleClassName?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`relative z-10 ${align === "center" ? "text-center" : ""} ${className}`}
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.8 }}
        className="font-mono text-[9px] uppercase tracking-[0.36em] text-black/45"
      >
        {kicker}
      </motion.p>

      <GlowTitle
        as="h2"
        delay={0.06}
        charClassName=""
        className={titleClassName}
        lines={lines}
      />
    </div>
  );
}

/** Shared whileInView fade for section content. */
export const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
} as const;
