"use client";

import React, { createContext, useContext, useState } from "react";
import { Ticket, ModerationReport, Strike, Message } from "./trust-center-dashboard";

interface TrustCenterContextType {
  tickets: Ticket[];
  reports: ModerationReport[];
  strikes: Strike[];
  broadcastStats: any;
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  setReports: React.Dispatch<React.SetStateAction<ModerationReport[]>>;
  setStrikes: React.Dispatch<React.SetStateAction<Strike[]>>;
}

const TrustCenterContext = createContext<TrustCenterContextType | undefined>(undefined);

export function TrustCenterProvider({ children, initialData }: { children: React.ReactNode, initialData: any }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialData.tickets);
  const [reports, setReports] = useState<ModerationReport[]>(initialData.reports);
  const [strikes, setStrikes] = useState<Strike[]>(initialData.strikes);

  return (
    <TrustCenterContext.Provider value={{
      tickets, setTickets,
      reports, setReports,
      strikes, setStrikes,
      broadcastStats: initialData.broadcastStats
    }}>
      {children}
    </TrustCenterContext.Provider>
  );
}

export function useTrustCenter() {
  const context = useContext(TrustCenterContext);
  if (!context) throw new Error("useTrustCenter must be used within TrustCenterProvider");
  return context;
}
