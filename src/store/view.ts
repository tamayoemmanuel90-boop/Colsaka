"use client";

import { create } from "zustand";

/**
 * Cosalka · Nutragen — client-side view router.
 * The "/" route is the presentation (3D landing). The complete store
 * experience lives inside the same route as full-screen views, driven by
 * this store — the sandbox preview only exposes "/", so the store swaps
 * the DOM above it (canvas unmounts while shopping).
 */
export type ViewName =
  | "landing" // presentación 3D
  | "tienda" // catálogo completo
  | "producto" // detalle por slug
  | "carrito" // cesta de página completa
  | "checkout" // 3 pasos: datos → envío → pago
  | "confirmacion" // pedido confirmado (REF servidor)
  | "nosotros" // historia Cosalka International
  | "faq" // preguntas completas de la tienda
  | "contacto"; // formulario + canales

export interface OrderReceipt {
  ok: boolean;
  orderId: string;
  total: number;
  currency: string;
  /** client-side shipping option chosen at checkout */
  shipping: { label: string; price: number };
  /** subtotal of product lines (server recomputes items) */
  subtotal: number;
  customer: { name: string; city: string };
}

interface ViewState {
  view: ViewName;
  slug: string | null;
  receipt: OrderReceipt | null;
  go: (view: ViewName, opts?: { slug?: string }) => void;
  setReceipt: (r: OrderReceipt | null) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  view: "landing",
  slug: null,
  receipt: null,
  go: (view, opts) => {
    set({ view, slug: opts?.slug ?? null });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      document.body.style.overflow = "";
    }
  },
  setReceipt: (r) => set({ receipt: r }),
}));
