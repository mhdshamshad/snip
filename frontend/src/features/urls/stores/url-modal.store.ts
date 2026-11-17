import { create } from 'zustand';

interface CreateUrlModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCreateUrlModalStore = create<CreateUrlModalState>()(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
