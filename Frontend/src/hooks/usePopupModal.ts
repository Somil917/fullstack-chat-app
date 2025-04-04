import { create } from "zustand";

interface usePopupModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const usePopupModal = create<usePopupModalStore>((set) => ({
  isOpen: false,

  onOpen: () => {
    set({ isOpen: true });
  },

  onClose: () => {
    set({ isOpen: false });
  },
}));
