// store/useCounterStore.ts
"use client"

import { create } from "zustand";
import { TownInfo } from "../data/towndata";

interface HoveredState {
  hoveredTownInfo: TownInfo | null;
  setHovered: (partial: TownInfo) => void;
}

export const useHoverStore = create<HoveredState>((set) => ({
  hoveredTownInfo: null,                         // what you're hovering
  setHovered: (townInfo: TownInfo) => set({ hoveredTownInfo: townInfo }),
}));