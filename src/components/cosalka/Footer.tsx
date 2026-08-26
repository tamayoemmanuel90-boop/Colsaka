"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "./Navbar";
import { NAV_LINKS } from "@/lib/cosalka/content";
import { scrollToSection } from "@/hooks/use-smooth-scroll";

const CERTS = ["ISO CLASE 7", "GMP FARMACÉUTICO", "HPLC VERIFICADO", "VEGANO"];

export function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Introduce un email clínico válido");
      return;
    }
    toast.success("Suscripción confirmada. Bienvenido al protocolo Cosalka.");
    setEmail("");
  };

  return (
    <footer
      id="contacto"
      data-stage="contact"
      className="relative mt-auto w-full border-t border-white/[0.07] bg-gradient-to-b from-transparent via-black/40 to-black px-5 pb-10 pt-24 sm:px-10"
    >
      <div className="pointer-events-auto mx-auto max-w-7xl">
        {/* top grid */}
        <div className="grid gap-12 md:grid-cols-[1.3fr_0.8fr_1fr] lg:gap-16">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark size={34} />
              <span className="text-lg font-semibold tracking-[0.42em] text-clinic">
                COSALKA
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/45">
              Laboratorio nutragenético independiente. Formulamos la próxima
              generación de nutrición celular en formato clínico sellado de
              500 ml — con la pureza como único compromiso.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {CERTS.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-gold/25 bg-gold/[0.05] px-3 py-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-gold/80"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* nav */}
          <nav aria-label="Enlaces del sitio">
            <p className="kicker text-white/35">Navegación</p>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.target}>
                  <button
                    onClick={() => scrollToSection(l.target)}
                    className="group inline-flex cursor-pointer items-center gap-2 text-[13px] tracking-wide text-white/55 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-sm"
                  >
                    <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-4" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact + newsletter */}
          <div>
            <p className="kicker text-white/35">Contacto</p>
            <ul className="mt-5 space-y-2.5 text-[13px] tracking-wide text-white/55">
              <li className="flex items-center gap-2.5">
                <Mail size={13} className="text-gold/70" />
                <a
                  href="mailto:clinica@cosalka.com"
                  className="transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-sm"
                >
                  clinica@cosalka.com
                </a>
              </li>
              <li className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                Paseo del Laboratorio 42 · Madrid, ES
              </li>
            </ul>

            <p className="kicker mt-8 !text-[9px] text-white/35">
              Boletín nutragenético
            </p>
            <form
              className="mt-4 flex max-w-sm overflow-hidden rounded-full border border-white/12 bg-white/[0.03] backdrop-blur-md transition-colors focus-within:border-gold/50"
              onSubmit={(e) => {
                e.preventDefault();
                subscribe();
              }}
            >
              <label htmlFor="footer-email" className="sr-only">
                Tu correo electrónico
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="h-11 w-full bg-transparent pl-5 pr-2 text-[12.5px] tracking-wide text-clinic placeholder:text-white/25 outline-none"
              />
              <button
                type="submit"
                aria-label="Suscribirme al boletín"
                className="grid h-11 w-12 shrink-0 cursor-pointer place-items-center bg-gold/90 text-graphite outline-none transition-all hover:bg-gold focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50"
              >
                <ArrowRight size={15} strokeWidth={2} />
              </button>
            </form>
          </div>
        </div>

        {/* legal bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
            © 2025 Cosalka Labs S.L. — Nutragen® es una marca registrada.
          </p>
          <ul className="flex items-center gap-6 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
            {["Aviso legal", "Privacidad", "Cookies"].map((x) => (
              <li key={x}>
                <a
                  href="#contacto"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info(`${x}: documento disponible bajo solicitud.`);
                  }}
                  className="transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 rounded-sm"
                >
                  {x}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
