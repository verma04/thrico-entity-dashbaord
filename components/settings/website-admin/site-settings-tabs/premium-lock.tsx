"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";
import { useDrawerStore } from "@/store/drawerStore";

interface PremiumLockProps {
  title: string;
  description: string;
  icon: any;
}

export const PremiumLock = ({
  title,
  description,
  icon: Icon,
}: PremiumLockProps) => {
  const { openDrawer } = useDrawerStore();

  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden relative group bg-card">
      <div className="absolute top-0 right-0 p-6">
        <Lock className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto py-14">
        <div className="p-5 bg-muted/60 rounded-2xl relative border border-border/60">
          <Icon className="h-8 w-8 text-muted-foreground" />
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background flex items-center justify-center shadow-md border border-border">
            <Lock className="h-3 w-3 text-primary" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {title} Restricted
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <Button
          onClick={() => openDrawer()}
          className="h-9 px-5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm transition-all active:scale-95 gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  );
};
