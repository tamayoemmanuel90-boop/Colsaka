"use client";

import Link from "next/link";
import { Globe, Mail } from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "@/components/cosalka/Navbar";

const FOOT_LINKS = [
  { label: "Tienda", href: "/tienda" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contacto" },
];

const CERTS = [
  "HECHO EN MÉXICO",
  "NO TESTEADO EN ANIMALES",
  "TECNOLOGÍA NUTRAGENÉTICA",
];

/** Store footer — clinical paper, gold wordmark, hairline legal bar. */
export function StoreFooter() {
  return (
    <footer className="relative z-10 mt-auto w-full border-t border-black/[0.08] bg-[#eaeaec]/90 px-5 pb-8 pt-20 sm:px-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <BrandMark size={30} />

        <p className="gold-text glow-gold mt-5 text-[clamp(2rem,6vw,4.6rem)] font-semibold leading-none tracking-[-0.03em]">
          COSALKA
        </p>

        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-black/40">
          Escucha tu piel · Respétala · Transfórmala
        </p>

        <nav aria-label="Enlaces de la tienda" className="mt-9">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {FOOT_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group relative block rounded-sm py-1 text-[10.5px] uppercase tracking-[0.24em] text-black/55 transition-colors hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          aria-label="Certificaciones"
        >
          {CERTS.map((c) => (
            <li
              key={c}
              className="rounded-full border border-gold/30 bg-white/60 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-gold-deep"
            >
              {c}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col items-center gap-2 sm:flex-row">
          <a
            href="mailto:clinica@cosalka.com"
            className="inline-flex items-center gap-2 rounded-sm text-[13px] tracking-wide text-black/70 transition-colors hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            <Mail size={13} className="text-gold-deep" />
            clinica@cosalka.com
          </a>
          <span aria-hidden className="hidden h-3 w-px bg-black/15 sm:block" />
          <a
            href="https://www.cosalkainternational.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm font-mono text-[9.5px] uppercase tracking-[0.22em] text-black/50 transition-colors hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            <Globe size={12} className="text-gold-deep" />
            cosalkainternational.com
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-black/[0.07] pt-6 sm:flex-row">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/35">
          © 2025 Cosalka International S. de R.L. de C.V. — Nutragen® · Hecho en México
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
