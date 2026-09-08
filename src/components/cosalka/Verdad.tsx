"use client";

import { motion } from "framer-motion";
import { VERDAD } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 01 · La verdad — nutragen.mx's "no es un apagafuegos químico" beat.
 * The bottle performs on the LEFT half; giant copy owns the right column
 * behind the canvas, chips float on the interactive layer.
 */
export function Verdad() {
  return (
    <section
      id="verdad"
      data-stage="verdad"
      className="relative flex min-h-[108svh] w-full items-center px-5 py-[12svh] sm:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1700px] grid-cols-1 lg:grid-cols-2">
        {/* left half intentionally empty — the 3D protagonist performs here */}
        <div aria-hidden className="hidden lg:block" />

        <div className="flex flex-col items-start lg:pl-8">
          <SectionHead
            kicker={VERDAD.kicker}
            className="self-end text-right"
            lines={[
              [
                { t: "sin " },
                { t: "corticoides.", c: "gold-text glow-gold" },
              ],
              [{ t: "sin rebote." }],
            ]}
          />

          <motion.p
            {...fade}
            transition={{ duration: 0.85, delay: 0.25 }}
            className="relative z-10 mt-8 max-w-md text-right text-[13px] leading-relaxed tracking-wide text-black/50"
          >
            {VERDAD.line}
          </motion.p>

          {/* clinical chips — interactive layer */}
          <motion.ul
            {...fade}
            transition={{ duration: 0.85, delay: 0.4 }}
            className="pointer-events-auto relative z-30 mt-9 flex flex-wrap justify-end gap-2"
          >
            {VERDAD.chips.map((c) => (
              <li
                key={c}
                className="rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-gold-deep backdrop-blur-sm transition-colors duration-300 hover:bg-gold hover:text-graphite"
              >
                {c}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
