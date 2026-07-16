"use client";

import React, { createContext, useContext, useState } from "react";
import type { ActivePartner } from "./active-partners-table";
import type { BrandRequest } from "./pending-requests";
import type { BrandReward } from "./brand-rewards-dialog";

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const INITIAL_PARTNERS: ActivePartner[] = [
  {
    id: "1",
    name: "Nike",
    logo: "https://logo.clearbit.com/nike.com",
    offers: 12,
    redemptions: 1420,
    status: "Active",
    joinedDate: "Jan 15, 2024",
    acceptedRewards: [
      { id: "n1", title: "20% off Footwear", value: "20% off", type: "discount", directLink: "https://nike.com/offers/footwear" },
      { id: "n2", title: "Members Run Club Access", value: "Free", type: "freebie", directLink: "https://nike.com/run-club" },
    ],
  },
  {
    id: "2",
    name: "Starbucks",
    logo: "https://logo.clearbit.com/starbucks.com",
    offers: 5,
    redemptions: 850,
    status: "Active",
    joinedDate: "Feb 10, 2024",
    acceptedRewards: [
      { id: "s1", title: "Buy 1 Get 1 Free", value: "BOGO", type: "freebie", directLink: "https://starbucks.com/rewards/bogo" },
    ],
  },
  {
    id: "3",
    name: "Aman",
    logo: "https://logo.clearbit.com/aman.com",
    offers: 2,
    redemptions: 120,
    status: "Paused",
    joinedDate: "Mar 05, 2024",
    acceptedRewards: [],
  },
];

const INITIAL_REQUESTS: BrandRequest[] = [
  {
    id: "r1",
    name: "Adidas",
    logo: "https://logo.clearbit.com/adidas.com",
    requestedDate: "2 hours ago",
    potentialOffers: 8,
    message: "We want to launch a 20% discount coupon for your verified members.",
  },
  {
    id: "r2",
    name: "Apple",
    logo: "https://logo.clearbit.com/apple.com",
    requestedDate: "1 day ago",
    potentialOffers: 3,
    message: "Requesting to publish exclusive educational offers.",
  },
];

export const BRAND_REWARD_CATALOGUE: Record<string, BrandReward[]> = {
  r1: [
    { id: "a1", title: "20% off All Footwear", description: "Valid on full-price footwear for verified members.", type: "discount", value: "20% off", expiresAt: "Dec 31, 2025", directLink: "https://adidas.com/offers/footwear-20" },
    { id: "a2", title: "₹500 Cashback on Sportswear", description: "Min. purchase ₹3000. Credited within 7 business days.", type: "cashback", value: "₹500 back", expiresAt: "Sep 30, 2025", directLink: "https://adidas.com/offers/cashback-sport" },
    { id: "a3", title: "Free Training App Premium", description: "3-month free access to Adidas Training+ premium tier.", type: "freebie", value: "3 months free", expiresAt: "Jun 30, 2025", directLink: "https://adidas.com/training-app" },
    { id: "a4", title: "Exclusive Members Gift Kit", description: "First 100 redeemers get a limited-edition gift kit.", type: "gift", value: "Valued ₹1500", expiresAt: "Mar 31, 2025", directLink: "https://adidas.com/gift-kit" },
    { id: "a5", title: "₹200 Voucher on Next Purchase", description: "Auto-applied at checkout on orders above ₹1500.", type: "voucher", value: "₹200 off", expiresAt: "Dec 31, 2025", directLink: "https://adidas.com/voucher-200" },
  ],
  r2: [
    { id: "ap1", title: "Apple Education Discount", description: "Up to ₹8000 off MacBook and iPad for students & educators.", type: "discount", value: "Up to ₹8000 off", expiresAt: "Aug 31, 2025", directLink: "https://apple.com/in/shop/go/product/educationpricing" },
    { id: "ap2", title: "Free 3-Month Apple One", description: "Includes Apple Music, TV+, Arcade & iCloud+.", type: "freebie", value: "3 months free", expiresAt: "Jun 30, 2025", directLink: "https://apple.com/apple-one" },
    { id: "ap3", title: "Trade-In Bonus ₹3000", description: "Extra ₹3000 on eligible device trade-in towards any iPhone.", type: "voucher", value: "₹3000 bonus", expiresAt: "Sep 30, 2025", directLink: "https://apple.com/in/shop/trade-in" },
  ],
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface PartnerNetworkContextValue {
  acceptExternal: boolean;
  setAcceptExternal: (v: boolean) => void;
  partners: ActivePartner[];
  requests: BrandRequest[];
  pendingCount: number;
  /** Approve: moves request → partner after reward selection */
  confirmPartnership: (requestId: string, selectedRewardIds: string[]) => void;
  declineRequest: (requestId: string) => void;
}

const PartnerNetworkContext = createContext<PartnerNetworkContextValue | null>(null);

export function usePartnerNetwork() {
  const ctx = useContext(PartnerNetworkContext);
  if (!ctx) throw new Error("usePartnerNetwork must be used within PartnerNetworkProvider");
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function PartnerNetworkProvider({ children }: { children: React.ReactNode }) {
  const [acceptExternal, setAcceptExternal] = useState(true);
  const [partners, setPartners] = useState<ActivePartner[]>(INITIAL_PARTNERS);
  const [requests, setRequests] = useState<BrandRequest[]>(INITIAL_REQUESTS);

  function confirmPartnership(requestId: string, selectedRewardIds: string[]) {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const allRewards = BRAND_REWARD_CATALOGUE[requestId] ?? [];
    const acceptedRewards = allRewards
      .filter((r) => selectedRewardIds.includes(r.id))
      .map(({ id, title, value, type, directLink }) => ({ id, title, value, type, directLink }));

    const newPartner: ActivePartner = {
      id: req.id,
      name: req.name,
      logo: req.logo,
      offers: acceptedRewards.length,
      redemptions: 0,
      status: "Active",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      acceptedRewards,
    };

    setPartners((prev) => [newPartner, ...prev]);
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  }

  function declineRequest(requestId: string) {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  }

  return (
    <PartnerNetworkContext.Provider
      value={{
        acceptExternal,
        setAcceptExternal,
        partners,
        requests,
        pendingCount: requests.length,
        confirmPartnership,
        declineRequest,
      }}
    >
      {children}
    </PartnerNetworkContext.Provider>
  );
}
