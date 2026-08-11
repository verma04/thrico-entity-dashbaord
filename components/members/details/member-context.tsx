"use client";

import React, { createContext, useContext } from "react";

interface MemberContextType {
  member: any; // Type can be refined if we know it
  user: any; // Type can be refined if we know it
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({
  children,
  member,
  user,
}: {
  children: React.ReactNode;
  member: any;
  user: any;
}) {
  return (
    <MemberContext.Provider value={{ member, user }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMemberDetails() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error("useMemberDetails must be used within a MemberProvider");
  }
  return context;
}
