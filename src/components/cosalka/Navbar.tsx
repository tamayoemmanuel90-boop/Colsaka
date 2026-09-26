"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, Truck, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/cosalka/content";
import { cartCount, useCart } from "@/store/cart";

const ANNOUNCEMENTS = [
  "Envío GRATIS en pedidos desde $1,500 MXN · 24–72 h",
  "Garantía de resultados: 30 días o 100% de vuelta",
  "Paga con Google Pay · Apple Pay · Tarjeta — 100% seguro",
];

/** Cosalka golden monogram — pure SVG, no assets. */
export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="37" height="37" rx="9" stroke="#D4AF37" strokeWidth="2" />
      <path
        d="M27.5 14.6c-1.8-2.3-4.4-3.6-7.5-3.6-5.4 0-9.4 4-9.4 9s4 9 9.4 9c3.1 0 5.7-1.3 7.5-3.6"
        stroke="#9d7c26"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="28.5" cy="20" r="2" fill="#D4AF37" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [msg, setMsg] = useState(0);
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const router = useRouter();
  const count = cartCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // rotate the announcements — Amazon-style value strip
  useEffect(() => {
    const id = window.setInterval(
      () => setMsg((m) => (m + 1) % ANNOUNCEMENTS.length),
      4200
    );
    return () => window.clearInterval(id);
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <header className="pointer-events-auto fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      {/* announcement strip — collapses on scroll */}
      <motion.div
        initial={false}
        animate={{ height: scrolled ? 0 : 34, opacity: scrolled ? 0 : 1, marginBottom: scrolled ? 0 : 10 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-6xl overflow-hidden"
        aria-hidden={scrolled}
      >
        <div className="flex h-[34px] items-center justify-center gap-2.5 rounded-full bg-graphite px-5 shadow-[0_10px_30px_rgba(13,13,13,0.25)]">
          <Truck size={12} className="shrink-0 text-gold" />
          <AnimatePresence mode="wait">
            <motion.p
              key={msg}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="truncate font-mono text-[8.5px] uppercase tracking-[0.22em] text-gold/95"
              data-testid="announcement"
            >
              {ANNOUNCEMENTS[msg]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        className={
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-5 " +
          (scrolled
            ? "border-black/10 bg-white/85 shadow-[0_18px_50px_rgba(13,13,13,0.1)] backdrop-blur-xl"
            : "border-black/[0.07] bg-white/50 backdrop-blur-md")
        }
      >
        {/* brand */}
        <button
          onClick={() => go("/")}
          className="group flex cursor-pointer items-center gap-2.5 rounded-full pr-2 outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          aria-label="Cosalka — ir al inicio"
        >
          <BrandMark />
          <span className="text-[13px] font-semibold tracking-[0.42em] text-ink transition-colors group-hover:text-gold-deep">
            COSALKA
          </span>
          <span className="hidden text-[9px] font-medium tracking-[0.3em] text-gold-deep/80 sm:block">
            NUTRAGEN
          </span>
        </button>

        {/* desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => go(l.href)}
                className="group relative cursor-pointer py-1 text-[10.5px] font-medium uppercase tracking-[0.24em] text-black/55 transition-colors hover:text-ink outline-none focus-visible:text-gold-deep"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>

        {/* actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-black/10 bg-white/60 text-black/70 outline-none transition-all hover:border-gold/60 hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
            aria-label={`Abrir cesta (${count} artículos)`}
          >
            <ShoppingBag size={16} strokeWidth={1.75} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-graphite shadow-[0_0_12px_rgba(212,175,55,.55)]"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-black/10 bg-white/60 text-black/70 outline-none transition-all hover:border-gold/60 hover:text-gold-deep lg:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden"
            >
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => go(l.href)}
                    className="w-full cursor-pointer rounded-xl px-4 py-3 text-left text-[11px] uppercase tracking-[0.22em] text-black/65 transition-colors hover:bg-gold/[0.08] hover:text-gold-deep"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
