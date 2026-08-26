"use client";

import { motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";

const STATS = [
  { value: "99.97%", label: "Pureza HPLC verificada" },
  { value: "3.4×", label: "Biodisponibilidad liposomal" },
  { value: "ISO 7", label: "Sala limpia de ensamblaje" },
];

const fade = {
  initial: { opacity: 0, y: 26 },
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
            HUD corner brackets give the zone a lab-scan feel. */}
        <div className="pointer-events-none relative hidden h-[560px] lg:block" aria-hidden>
          {[
            "left-6 top-8 border-l-2 border-t-2",
            "right-6 top-8 border-r-2 border-t-2",
            "left-6 bottom-8 border-b-2 border-l-2",
            "right-6 bottom-8 border-b-2 border-r-2",
          ].map((pos) => (
            <span key={pos} className={`absolute h-9 w-9 border-gold/35 ${pos}`} />
          ))}
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="absolute -top-3 left-16 font-mono text-[9px] uppercase tracking-[0.3em] text-gold/50"
          >
            FIG 01 — NUTRAGEN PURITY · 500 ml ℮
          </motion.span>
        </div>

        {/* content column */}
        <div className="pointer-events-none flex flex-col justify-center lg:pl-4">
          <motion.p
            {...fade}
            transition={{ duration: 0.8 }}
            className="kicker text-gold"
          >
            Spotlight · Producto insignia
          </motion.p>

          <motion.h2
            {...fade}
            transition={{ duration: 0.85, delay: 0.08 }}
            className="mt-5 text-balance text-4xl font-light leading-[1.04] tracking-tight text-clinic sm:text-5xl lg:text-[3.4rem]"
          >
            Nutragen Purity.
            <br />
            El estándar clínico{" "}
            <em className="gold-text not-italic">en 500 ml.</em>
          </motion.h2>

          <motion.p
            {...fade}
            transition={{ duration: 0.85, delay: 0.16 }}
            className="mt-6 max-w-md text-pretty text-sm leading-relaxed text-white/55 sm:text-[15px]"
          >
            Nuestra matriz mineral de referencia: hidratación intracelular
            profunda, señalización metabólica optimizada y estabilidad
            absoluta gracias al sellado en atmósfera inerte. Cada frasco
            integra su certificado cromatográfico individual.
          </motion.p>

          {/* stat strip */}
          <motion.dl
            {...fade}
            transition={{ duration: 0.85, delay: 0.24 }}
            className="pointer-events-auto mt-9 grid max-w-lg grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-md"
          >
            {STATS.map((s) => (
              <div key={s.label} className="group px-4 py-5 first:rounded-l-2xl last:rounded-r-2xl transition-colors hover:bg-gold/[0.05]">
                <dt className="gold-text text-xl font-semibold tracking-tight sm:text-2xl">
                  {s.value}
                </dt>
                <dd className="mt-1.5 text-[9px] uppercase leading-snug tracking-[0.14em] text-white/40">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.div
            {...fade}
            transition={{ duration: 0.85, delay: 0.32 }}
            className="pointer-events-auto mt-7 inline-flex w-fit cursor-default items-center gap-3 rounded-full border border-white/10 bg-graphite/60 px-4 py-2.5 backdrop-blur-md"
          >
            <MousePointerClick size={13} className="shrink-0 text-gold" />
            <p className="text-[11px] leading-snug tracking-wide text-white/60">
              Toca los{" "}
              <span className="text-gold">nodos dorados</span> sobre la pieza
              para revelar el expediente clínico.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
