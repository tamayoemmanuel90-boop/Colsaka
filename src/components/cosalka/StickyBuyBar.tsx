"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { FLAGSHIP_SLUG } from "@/lib/cosalka/content";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

/**
 * StickyBuyBar — Amazon-style always-available buy bar for mobile.
 * Appears after the hero, keeps the flagship offer one thumb-tap away
 * for the whole page. Hidden on ≥lg where the buy box is reachable.
 */
export function StickyBuyBar() {
  const [show, setShow] = useState(false);
  const add = useCart((s) => s.add);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const buy = () => {
    add(FLAGSHIP_SLUG);
    toast.success("Añadido a la cesta — revisa tu pedido aquí");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 260 }}
          className="fixed inset-x-3 bottom-3 z-[60] lg:hidden"
          data-testid="sticky-buy-bar"
        >
          <div
            className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-graphite/95 py-2.5 pl-5 pr-2.5 shadow-[0_18px_50px_rgba(13,13,13,0.45)] backdrop-blur-xl"
            style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
          >
            <p className="min-w-0">
              <span className="block truncate text-[11px] font-semibold tracking-tight text-white">
                Paquete Doble Acción
              </span>
              <span className="block font-mono text-[8.5px] uppercase tracking-[0.18em] text-gold">
                $1,590 MXN · envío gratis
              </span>
            </p>
            <button
              onClick={buy}
              data-testid="sticky-buy"
              className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-gold px-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-graphite outline-none transition-transform active:scale-95"
            >
              <ShoppingBag size={13} />
              Comprar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
