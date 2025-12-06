// store/useCounterStore.ts
"use client"

import { create } from "zustand";

export const useHoverStore = create((set) => ({
    hovered: "",                         // what you're hovering
    setHovered: (value: string) => set({ hovered: value }),
}));