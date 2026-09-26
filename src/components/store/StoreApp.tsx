"use client";

import { AnimatePresence, motion } from "framer-motion";
import { StoreNav, StoreCrumb } from "./StoreNav";
import { StoreFooter } from "./StoreFooter";
import { StoreHome } from "./StoreHome";
import { StoreProduct } from "./StoreProduct";
import { StoreCart } from "./StoreCart";
import { StoreCheckout } from "./StoreCheckout";
import { StoreConfirm } from "./StoreConfirm";
import { StoreAbout } from "./StoreAbout";
import { StoreFaq } from "./StoreFaq";
import { StoreContact } from "./StoreContact";
import { useViewStore } from "@/store/view";

/**
 * StoreApp — the complete Cosalka store, living inside the same "/"
 * route as full-screen client views (the sandbox preview only exposes
 * "/"). "/" itself is the 3D presentation; the store swaps the DOM
 * above it and unmounts the WebGL canvas so the product 3D never
 * competes with (or covers) store typography.
 *
 * Views: tienda · producto · carrito · checkout · confirmacion
 *        · nosotros · faq · contacto
 */
export function StoreApp() {
  const view = useViewStore((s) => s.view);
  const slug = useViewStore((s) => s.slug);

  const key = view === "producto" ? `producto-${slug}` : view;

  return (
    <div className="relative flex min-h-screen flex-col bg-paper text-ink selection:bg-gold selection:text-graphite">
      <StoreNav />

      <main className="relative flex min-h-screen flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col"
          >
            {view === "tienda" && <StoreHome />}
            {view === "producto" && <StoreProduct slug={slug} />}
            {view === "carrito" && <StoreCart />}
            {view === "checkout" && <StoreCheckout />}
            {view === "confirmacion" && <StoreConfirm />}
            {view === "nosotros" && <StoreAbout />}
            {view === "faq" && <StoreFaq />}
            {view === "contacto" && <StoreContact />}
          </motion.div>
        </AnimatePresence>
      </main>

      <StoreFooter />

      {/* film grain, same as the landing */}
      <div className="grain pointer-events-none fixed inset-0 z-[75]" aria-hidden />
    </div>
  );
}

export { StoreCrumb };
