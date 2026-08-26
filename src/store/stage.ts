"use client";

import { create } from "zustand";
import type { StageName } from "@/lib/scroll-engine";

interface StageState {
  active: StageName;
  setActive: (s: StageName) => void;
}

export const useStageStore = create<StageState>((set) => ({
  active: "hero",
  setActive: (s) => set({ active: s }),
}));
