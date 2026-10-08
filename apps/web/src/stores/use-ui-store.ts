import { create } from "zustand";

interface UiState {
  banner: string | null;
  setBanner: (msg: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  banner: null,
  setBanner: (msg) => set({ banner: msg }),
}));
