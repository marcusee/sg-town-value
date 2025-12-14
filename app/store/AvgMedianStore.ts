import { create, useStore } from "zustand";


interface AvgMedianState {
  isAvg: Boolean;
  toggle: () => void;
}


export const useAvgMedianStore = create<AvgMedianState>((set) => ({
    isAvg: true,
    toggle: () => set((state) => ({
        isAvg: !state.isAvg
    }))
}));