"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "./Navbar";
import { NAV_LINKS } from "@/lib/cosalka/content";
import { scrollToSection } from "@/hooks/use-smooth-scroll";
import { GlowTitle } from "./GlowTitle";

/**
 * Footer — clinical paper, colossal gold wordmark, hairline legal bar.
 * Sits on the interactive layer (z-30) above the canvas; by the time it
 * fills the viewport the bottle has already ascended off-screen.
 */
export function Footer() {
  return (
    <footer
      id="contacto"
      data-stage="contact"
      className="pointer-events-none relative z-30 mt-auto w-full border-t border-black/[0.08] bg-[#eaeaec]/90 px-5 pb-8 pt-24 backdrop-blur-sm sm:px-10"
    >
      <div className="pointer-events-auto mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex items-center gap-3"
        >
          <BrandMark size={32} />
        </motion.div>

        <GlowTitle
          as="p"
          mode="inview"
          delay={0.08}
          charClassName=""
          className="mt-5 text-[clamp(2.6rem,8.5vw,7.5rem)] font-semibold leading-none tracking-[-0.03em]"
          lines={[[{ t: "COSALKA", c: "gold-text glow-gold" }]]}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-5 font-mono text-[9px] uppercase tracking-[0.3em] text-black/40"
        >
          Laboratorio nutragenético — pureza como único compromiso
        </motion.p>

        {/* nav */}
        <motion.nav
          aria-label="Enlaces del sitio"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-10"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.target}>
                <button
                  onClick={() => scrollToSection(l.target)}
                  className="group relative cursor-pointer rounded-sm py-1 text-[10.5px] uppercase tracking-[0.24em] text-black/55 transition-colors hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>
        </motion.nav>

        {/* certs + contact */}
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-2"
          aria-label="Certificaciones"
        >
          {["ISO CLASE 7", "GMP FARMACÉUTICO", "HPLC VERIFICADO"].map((c) => (
            <li
              key={c}
              className="rounded-full border border-gold/30 bg-white/60 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-gold-deep"
            >
              {c}
            </li>
          ))}
        </motion.ul>

        <a
          href="mailto:clinica@cosalka.com"
          className="mt-7 inline-flex items-center gap-2 rounded-sm text-[13px] tracking-wide text-black/70 transition-colors hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          <Mail size={13} className="text-gold-deep" />
          clinica@cosalka.com
        </a>
      </div>

      {/* legal bar */}
      <div className="pointer-events-auto mx-auto mt-14 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-black/[0.07] pt-6 sm:flex-row">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/35">
          © 2025 Cosalka Labs S.L. — Nutragen®
        </p>
        <ul className="flex items-center gap-6 font-mono text-[9px] uppercase tracking-[0.18em] text-black/35">
          {["Aviso legal", "Privacidad", "Cookies"].map((x) => (
            <li key={x}>
              <button
                onClick={() =>
                  toast.info(`${x}: documento disponible bajo solicitud.`)
                }
                className="cursor-pointer rounded-sm transition-colors hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              >
                {x}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
