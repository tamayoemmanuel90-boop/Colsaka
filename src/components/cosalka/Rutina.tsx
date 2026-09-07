"use client";

import { motion } from "framer-motion";
import { RUTINA } from "@/lib/cosalka/content";
import { SectionHead, fade } from "./SectionHead";

/**
 * 02 · Doble acción — nutragen.mx's "Paquete Doble Acción / Paso 1 + Paso 2".
 * Symmetric editorial composition: step 01 left, step 02 right, and the
 * bottle standing center stage between them.
 */
export function Rutina() {
  return (
    <section
      id="rutina"
      data-stage="rutina"
      className="relative flex min-h-[112svh] w-full flex-col justify-center px-5 py-[12svh] sm:px-10"
    >
      <SectionHead
        kicker={RUTINA.kicker}
        align="center"
        lines={[
          [{ t: "dos pasos." }, { t: " una rutina.", c: "gold-text glow-gold" }],
        ]}
      />

      {/* steps — interactive layer, bottle stands between them */}
      <div className="relative z-30 mx-auto mt-16 grid w-full max-w-[1240px] gap-6 md:grid-cols-2 md:gap-[26vw]">
        {RUTINA.steps.map((s, i) => (
          <motion.article
            key={s.n}
            {...fade}
            transition={{ duration: 0.8, delay: 0.12 + i * 0.16 }}
            className="pointer-events-auto group rounded-2xl border border-black/10 bg-white/70 p-7 backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:bg-white/85 sm:p-8"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-deep">
                {s.n}
              </span>
              <span className="font-mono text-[9px] tracking-[0.26em] text-black/30">
                500 ML
              </span>
            </div>

            <h3 className="mt-6 text-2xl font-medium tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-gold-deep sm:text-3xl">
              {s.title}
            </h3>

            <p className="mt-4 text-[13px] leading-relaxed text-black/55">
              {s.body}
            </p>

            <div className="mt-7 border-t border-black/10 pt-4 font-mono text-[9px] uppercase tracking-[0.24em] text-black/35">
              {i === 0 ? "Mañana · aplicarlo limpio" : "Noche · círculos suaves"}
            </div>
          </motion.article>
        ))}
      </div>

      <motion.p
        {...fade}
        transition={{ duration: 0.85, delay: 0.45 }}
        className="relative z-10 mt-12 text-center font-mono text-[9.5px] uppercase tracking-[0.3em] text-black/40"
      >
        {RUTINA.meta}
      </motion.p>
    </section>
  );
}
