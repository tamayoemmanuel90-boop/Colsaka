"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Menu, ShoppingBag, X } from "lucide-react";
import { BrandMark } from "@/components/cosalka/Navbar";
import { cartCount, useCart } from "@/store/cart";

const STORE_LINKS = [
  { label: "Tienda", href: "/tienda" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "FAQ", href: "/faq" },
  { label: "Contacto", href: "/contacto" },
];

/** Sticky glass navbar shared by every store route. */
export function StoreNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCart((s) => s.items);
  const pathname = usePathname();
  const count = cartCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-auto fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-5 " +
          (scrolled
            ? "border-black/10 bg-white/90 shadow-[0_18px_50px_rgba(13,13,13,0.1)] backdrop-blur-xl"
            : "border-black/[0.07] bg-white/55 backdrop-blur-md")
        }
      >
        {/* home → 3D presentation */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-full pr-2 outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          aria-label="Volver a la presentación Cosalka"
        >
          <BrandMark />
          <span className="text-[13px] font-semibold tracking-[0.42em] text-ink transition-colors group-hover:text-gold-deep">
            COSALKA
          </span>
          <span className="hidden text-[9px] font-medium tracking-[0.3em] text-gold-deep/80 sm:block">
            TIENDA
          </span>
        </Link>

        {/* desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {STORE_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "group relative block py-1 text-[10.5px] font-medium uppercase tracking-[0.24em] outline-none transition-colors focus-visible:text-gold-deep " +
                    (active
                      ? "text-gold-deep"
                      : "text-black/55 hover:text-ink")
                  }
                >
                  {l.label}
                  <span
                    className={
                      "absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 " +
                      (active ? "w-full" : "w-0 group-hover:w-full")
                    }
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/carrito"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/60 text-black/70 outline-none transition-all hover:border-gold/60 hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
            aria-label={`Ir a la cesta (${count} artículos)`}
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
          </Link>

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
              {STORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-black/65 transition-colors hover:bg-gold/[0.08] hover:text-gold-deep"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}

/** Breadcrumb + back link used by inner store pages. */
export function StoreCrumb({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/tienda"
        className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-black/60 outline-none transition-all hover:border-gold/60 hover:text-gold-deep focus-visible:ring-2 focus-visible:ring-gold/60"
        aria-label="Volver a la tienda"
      >
        <ArrowLeft size={14} />
      </Link>
      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/40">
        Tienda <span className="text-gold-deep">/</span> {label}
      </p>
    </div>
  );
}

/** Convenience helper for CTA buttons inside client views. */
export function useStoreRouter() {
  return useRouter();
}
