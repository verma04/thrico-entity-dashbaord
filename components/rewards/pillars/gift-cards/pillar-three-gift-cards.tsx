"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GiftCardBanner } from "./gift-card-banner";
import { GiftCardsManage } from "./table";
import { GiftCardDrawer } from "./drawer";
import { GiftCardHowItWorksDrawer } from "./help";
import { TopUpWalletModal } from "./top-up-wallet-modal";
import { useGetEntityRewardWallet } from "@/graphql/actions/rewards/gift-cards";

import { GiftCardRuleItem } from "./types";

interface PillarThreeGiftCardsProps {
  isExternalDrawerOpen?: boolean;
  setIsExternalDrawerOpen?: (open: boolean) => void;
  isExternalHowItWorksOpen?: boolean;
  setIsExternalHowItWorksOpen?: (open: boolean) => void;
  isExternalTopUpOpen?: boolean;
  setIsExternalTopUpOpen?: (open: boolean) => void;
}

export const PillarThreeGiftCards: React.FC<PillarThreeGiftCardsProps> = ({
  isExternalDrawerOpen,
  setIsExternalDrawerOpen,
  isExternalHowItWorksOpen,
  setIsExternalHowItWorksOpen,
  isExternalTopUpOpen,
  setIsExternalTopUpOpen,
}) => {
  const router = useRouter();
  const { data: walletData, refetch: refetchWallet } = useGetEntityRewardWallet();
  const wallet = walletData?.getEntityRewardWallet;
  const [localDelta, setLocalDelta] = useState<number>(0);

  const walletBalance = (wallet?.balance ?? 0) + localDelta;
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GiftCardRuleItem | null>(null);
  const [internalHowItWorksOpen, setInternalHowItWorksOpen] = useState(false);
  const [internalTopUpOpen, setInternalTopUpOpen] = useState(false);

  const isDrawerOpen = isExternalDrawerOpen !== undefined ? isExternalDrawerOpen : internalDrawerOpen;
  const setIsDrawerOpen = (open: boolean) => {
    if (setIsExternalDrawerOpen) setIsExternalDrawerOpen(open);
    setInternalDrawerOpen(open);
  };

  const isHowItWorksOpen = isExternalHowItWorksOpen !== undefined ? isExternalHowItWorksOpen : internalHowItWorksOpen;
  const setIsHowItWorksOpen = (open: boolean) => {
    if (setIsExternalHowItWorksOpen) setIsExternalHowItWorksOpen(open);
    setInternalHowItWorksOpen(open);
  };

  const isTopUpOpen = isExternalTopUpOpen !== undefined ? isExternalTopUpOpen : internalTopUpOpen;
  const setIsTopUpOpen = (open: boolean) => {
    if (setIsExternalTopUpOpen) setIsExternalTopUpOpen(open);
    setInternalTopUpOpen(open);
  };

  const handleOpenCreate = () => {
    router.push("/gamification/rewards/pillars/gift-cards/add");
  };

  const handleOpenEdit = (item: GiftCardRuleItem) => {
    router.push(`/gamification/rewards/pillars/gift-cards/${item.id}/edit`);
  };

  const handleTopUpSuccess = (amount: number) => {
    setLocalDelta((prev) => prev + amount);
    refetchWallet?.();
  };

  const handleDeductBalance = (amount: number) => {
    setLocalDelta((prev) => prev - amount);
    refetchWallet?.();
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Header Banner with Wallet Balance & Quick Triggers */}
      <GiftCardBanner
        walletBalance={walletBalance}
        onTopUpClick={() => setIsTopUpOpen(true)}
        onCreateClick={handleOpenCreate}
        onHowItWorksClick={() => setIsHowItWorksOpen(true)}
      />

      {/* Master Directory & Table/Grid/Ledger View */}
      <div className="space-y-3">
        <GiftCardsManage
          walletBalance={walletBalance}
          onDeductBalance={handleDeductBalance}
          onTopUpClick={() => setIsTopUpOpen(true)}
          onCreateClick={handleOpenCreate}
          onEditClick={handleOpenEdit}
        />
      </div>

      {/* Gift Card Configuration Drawer */}
      <GiftCardDrawer
        isOpen={isDrawerOpen}
        initialItem={editingItem}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingItem(null);
        }}
        onSuccess={() => {
          setIsDrawerOpen(false);
          setEditingItem(null);
          refetchWallet?.();
        }}
        walletBalance={walletBalance}
      />

      {/* Step-by-Step "How Digital Gift Cards Work" Help Drawer */}
      <GiftCardHowItWorksDrawer
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onCreateClick={handleOpenCreate}
        onTopUpClick={() => setIsTopUpOpen(true)}
      />

      {/* Top-Up Prepaid Wallet Modal */}
      <TopUpWalletModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        currentBalance={walletBalance}
        onTopUpSuccess={handleTopUpSuccess}
      />
    </div>
  );
};

