"use client";

import { create } from "zustand";

interface SpotlightState {
  activeId: string | null;
  setActive: (id: string | null) => void;
}

/** Which clinical hotspot card is open (shared DOM ⇄ Canvas). */
export const useSpotlightStore = create<SpotlightState>((set) => ({
  activeId: null,
  setActive: (id) => set({ activeId: id }),
}));
