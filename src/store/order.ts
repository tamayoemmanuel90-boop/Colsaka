"use client";

import { create } from "zustand";

/** Receipt of the order confirmed at /checkout, read by /confirmacion. */
export interface OrderReceipt {
  ok: boolean;
  orderId: string;
  total: number;
  currency: string;
  /** shipping option chosen at checkout */
  shipping: { label: string; price: number };
  /** product subtotal (server recomputes item totals) */
  subtotal: number;
  customer: { name: string; city: string };
  /** display label of the payment gateway used (e.g. "Google Pay · Visa ••42") */
  method?: string;
}

interface OrderState {
  receipt: OrderReceipt | null;
  setReceipt: (r: OrderReceipt | null) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  receipt: null,
  setReceipt: (r) => set({ receipt: r }),
}));
