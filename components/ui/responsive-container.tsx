"use client";

import React from "react";
import { ResponsiveContainer as RechartsResponsiveContainer } from "recharts";

export function ResponsiveContainer({
  children,
  className,
  width = "100%",
  height = "100%",
  ...props
}: any) {
  return (
    <RechartsResponsiveContainer
      width={width}
      height={height}
      className={className || ""}
      {...props}
    >
      {children}
    </RechartsResponsiveContainer>
  );
}
