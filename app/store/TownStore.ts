"use client"

import { create } from "zustand";
import { initialTownInfo, TownInfo } from "../data/towndata";

interface TownInfoState {
  townInfos: TownInfo[];
  setTownInfo: (partial: TownInfo[]) => void;
}


export const useTownStore = create<TownInfoState>((set) => ({
  townInfos: initialTownInfo,                         // what you're hovering
  setTownInfo: (townInfo: TownInfo[]) => set({ townInfos: townInfo }),
}));