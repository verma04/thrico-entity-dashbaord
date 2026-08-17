"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShopifyConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  shopDomainInput: string;
  setShopDomainInput: (val: string) => void;
  isConnecting: boolean;
  onConnect: () => void;
}

export function ShopifyConnectModal({
  isOpen,
  onClose,
  isConnected,
  shopDomainInput,
  setShopDomainInput,
  isConnecting,
  onConnect,
}: ShopifyConnectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] p-6 rounded-2xl border-border">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-base font-semibold">
            {isConnected ? "Reconnect Shopify Store" : "Connect Shopify Store"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Enter your Shopify merchant domain name (e.g.{" "}
            <code>mystore.myshopify.com</code>) to authenticate with Shopify
            OAuth.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="domainInput" className="text-xs font-medium">
              Store Domain
            </Label>
            <Input
              id="domainInput"
              placeholder="e.g. your-store.myshopify.com"
              value={shopDomainInput}
              onChange={(e) => setShopDomainInput(e.target.value)}
              className="font-mono text-xs h-9"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isConnecting && shopDomainInput) {
                  onConnect();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={onClose}
            disabled={isConnecting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            onClick={onConnect}
            disabled={isConnecting || !shopDomainInput}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Connecting…
              </>
            ) : (
              "Proceed to Shopify Auth"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
