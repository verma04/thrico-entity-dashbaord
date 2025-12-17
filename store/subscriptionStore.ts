import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SubscriptionState {
  isModalOpen: boolean;
  showBuyPlanDialog: boolean;
  openModal: () => void;
  closeModal: () => void;
  setShowBuyPlanDialog: (show: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  devtools(
    (set) => ({
      isModalOpen: true,
      showBuyPlanDialog: true,
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
      setShowBuyPlanDialog: (show: boolean) => set({ showBuyPlanDialog: show }),
    }),
    {
      name: "subscription-store",
    }
  )
);
