"use client";

import React from "react";
import { PolarisCard } from "../primitives/polaris-card";
import { PolarisCheckbox } from "../primitives/polaris-checkbox";

export interface SalesChannelCardProps {
  salesChannelAccess: boolean;
  onSalesChannelAccessChange: (val: boolean) => void;
  channels: {
    onlineStore: boolean;
    pos: boolean;
    mobileApp: boolean;
    buyButton: boolean;
  };
  onChannelToggle: (channelKey: "onlineStore" | "pos" | "mobileApp" | "buyButton", val: boolean) => void;
}

export function SalesChannelCard({
  salesChannelAccess,
  onSalesChannelAccessChange,
  channels,
  onChannelToggle,
}: SalesChannelCardProps) {
  return (
    <PolarisCard title="Sales channel access">
      <PolarisCheckbox
        id="sales-channel-access"
        checked={salesChannelAccess}
        onChange={onSalesChannelAccessChange}
        label="Allow discount to be featured on selected channels"
      >
        <div className="space-y-1.5 pt-1">
          <PolarisCheckbox
            id="channel-online-store"
            checked={channels.onlineStore}
            onChange={(val) => onChannelToggle("onlineStore", val)}
            label="Online Store"
          />
          <PolarisCheckbox
            id="channel-pos"
            checked={channels.pos}
            onChange={(val) => onChannelToggle("pos", val)}
            label="Point of Sale (POS)"
          />
          <PolarisCheckbox
            id="channel-mobile-app"
            checked={channels.mobileApp}
            onChange={(val) => onChannelToggle("mobileApp", val)}
            label="Mobile App"
          />
          <PolarisCheckbox
            id="channel-buy-button"
            checked={channels.buyButton}
            onChange={(val) => onChannelToggle("buyButton", val)}
            label="Buy Button"
          />
        </div>
      </PolarisCheckbox>
    </PolarisCard>
  );
}
