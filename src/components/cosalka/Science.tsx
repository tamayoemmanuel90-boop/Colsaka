"use client";

import { motion } from "framer-motion";
import { Atom, Dna, FlaskConical } from "lucide-react";
import { SCIENCE_CARDS } from "@/lib/cosalka/content";

const ICONS = {
  eficacia: Atom,
  laboratorio: FlaskConical,
  tecnologia: Dna,
} as const;

export function Science() {
  return (
    <section
      id="ciencia"
      data-stage="science"
      className="grain relative w-full px-5 py-32 sm:px-10"
    >
      {/* translucent backdrop so the exploded 3D layers read through */}
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto hidden max-w-6xl lg:block">
        <div className="glass-panel h-[520px] rounded-[2rem] opacity-60" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.8 }}
            className="kicker text-gold"
          >
            Sobre nosotros · Protocolo Cosalka
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.85, delay: 0.08 }}
            className="mt-5 text-balance text-4xl font-light leading-tight tracking-tight text-clinic sm:text-5xl"
          >
            Ciencia verificable,{" "}
            <em className="gold-text not-italic">no marketing.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.9, delay: 0.18 }}
            className="mt-5 text-sm leading-relaxed text-white/50 sm:text-[15px]"
          >
            Los tres pilares que gobiernan cada formulación nutragenética
            que sale de nuestro laboratorio.
          </motion.p>
        </div>

        {/* cards grid — glass over the exploded bottle behind */}
        <div className="pointer-events-auto mt-14 grid gap-5 md:grid-cols-3">
          {SCIENCE_CARDS.map((card, i) => {
            const Icon = ICONS[card.id as keyof typeof ICONS];
            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{
                  duration: 0.75,
                  delay: 0.1 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -7 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-carbon/80 p-7 backdrop-blur-xl transition-colors duration-300 hover:border-gold/35 sm:p-8"
              >
                {/* hover glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/[0.08] blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

                <div className="mb-6 grid h-12 w-12 place-items-center rounded-full border border-gold/30 bg-gold/[0.07] text-gold transition-transform duration-500 group-hover:rotate-[360deg]">
                  <Icon size={20} strokeWidth={1.6} />
                </div>

                <h3 className="text-lg font-medium tracking-tight text-clinic">
                  {card.title}
                </h3>
                <p className="mt-3 min-h-[84px] text-[13px] leading-relaxed text-white/50">
                  {card.body}
                </p>

                <div className="mt-4 flex items-baseline gap-2 border-t border-white/10 pt-4">
                  <span className="gold-text font-mono text-lg font-semibold tracking-tight">
                    {card.stat}
                  </span>
                  <span className="text-[9px] uppercase leading-snug tracking-[0.14em] text-white/35">
                    {card.statLabel}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
