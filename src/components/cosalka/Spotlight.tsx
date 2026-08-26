"use client";

import { motion } from "framer-motion";
import { GlowTitle } from "./GlowTitle";

const STATS = [
  { value: "99.97%", label: "Pureza HPLC" },
  { value: "3.4×", label: "Absorción" },
  { value: "ISO 7", label: "Sala limpia" },
];

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export function Spotlight() {
  return (
    <section
      id="spotlight"
      data-stage="spotlight"
      className="relative min-h-[112svh] w-full px-5 pb-24 pt-[42svh] sm:px-10 sm:pt-24 lg:pt-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:min-h-[92svh] lg:grid-cols-[1fr_1.05fr] lg:gap-6">
        {/* left half intentionally transparent → the 3D bottle performs here.
            HUD corner brackets frame the zone like a clinical scan. */}
        <div className="pointer-events-none relative hidden h-[560px] lg:block" aria-hidden>
          {[
            "left-6 top-8 border-l border-t",
            "right-6 top-8 border-r border-t",
            "left-6 bottom-8 border-b border-l",
            "right-6 bottom-8 border-b border-r",
          ].map((pos) => (
            <span key={pos} className={`absolute h-8 w-8 border-gold/30 ${pos}`} />
          ))}
        </div>

        {/* content column — three beats only */}
        <div className="pointer-events-none flex flex-col items-start justify-center lg:pl-4">
          <motion.p
            {...fade}
            transition={{ duration: 0.8 }}
            className="kicker !text-[9px] text-gold/80"
          >
            01 · Nutragen Purity
          </motion.p>

          <GlowTitle
            as="h2"
            delay={0.06}
            charClassName=""
            className="mt-5 text-balance text-4xl font-light leading-[1.05] tracking-[-0.02em] text-clinic sm:text-5xl lg:text-[3.4rem]"
            lines={[
              [{ t: "El estándar clínico" }],
              [
                { t: "en " },
                {
                  t: "500 ml.",
                  c: "gold-text glow-gold font-normal",
                },
              ],
            ]}
          />

          {/* stat strip */}
          <motion.dl
            {...fade}
            transition={{ duration: 0.85, delay: 0.35 }}
            className="pointer-events-auto mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-md"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="group px-4 py-5 first:rounded-l-2xl last:rounded-r-2xl transition-colors hover:bg-gold/[0.05]"
              >
                <dt className="gold-text glow-soft text-xl font-semibold tracking-tight sm:text-2xl">
                  {s.value}
                </dt>
                <dd className="mt-1.5 text-[7.5px] uppercase leading-snug tracking-[0.08em] text-white/40 sm:text-[9px] sm:tracking-[0.16em]">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.p
            {...fade}
            transition={{ duration: 0.85, delay: 0.5 }}
            className="mt-6 text-[11px] uppercase tracking-[0.22em] text-white/30"
          >
            Toca los <span className="text-gold/90">nodos dorados</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
