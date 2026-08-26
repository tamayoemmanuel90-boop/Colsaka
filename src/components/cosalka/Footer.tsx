"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "./Navbar";
import { NAV_LINKS } from "@/lib/cosalka/content";
import { scrollToSection } from "@/hooks/use-smooth-scroll";

export function Footer() {
  return (
    <footer
      id="contacto"
      data-stage="contact"
      className="pointer-events-none relative mt-auto w-full border-t border-white/[0.06] bg-gradient-to-b from-transparent via-black/45 to-black px-5 pb-8 pt-24 sm:px-10"
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
          <span className="glow-white text-xl font-semibold tracking-[0.5em] text-clinic">
            COSALKA
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mt-4 text-[12px] font-light tracking-wide text-white/40"
        >
          Laboratorio nutragenético · Pureza como único compromiso
        </motion.p>

        {/* nav */}
        <motion.nav
          aria-label="Enlaces del sitio"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-9"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.target}>
                <button
                  onClick={() => scrollToSection(l.target)}
                  className="group relative cursor-pointer py-1 text-[10.5px] uppercase tracking-[0.24em] text-white/55 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-sm"
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
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          aria-label="Certificaciones"
        >
          {["ISO CLASE 7", "GMP FARMACÉUTICO", "HPLC VERIFICADO"].map((c) => (
            <li
              key={c}
              className="rounded-full border border-gold/20 bg-gold/[0.04] px-3 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-gold/70"
            >
              {c}
            </li>
          ))}
        </motion.ul>

        <a
          href="mailto:clinica@cosalka.com"
          className="mt-6 inline-flex items-center gap-2 rounded-sm text-[13px] tracking-wide text-silver transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          <Mail size={13} className="text-gold/70" />
          clinica@cosalka.com
        </a>
      </div>

      {/* legal bar */}
      <div className="pointer-events-auto mx-auto mt-14 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/[0.05] pt-6 sm:flex-row">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
          © 2025 Cosalka Labs S.L. — Nutragen®
        </p>
        <ul className="flex items-center gap-6 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
          {["Aviso legal", "Privacidad", "Cookies"].map((x) => (
            <li key={x}>
              <button
                onClick={() =>
                  toast.info(`${x}: documento disponible bajo solicitud.`)
                }
                className="cursor-pointer transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-sm"
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
