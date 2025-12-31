"use client";

import { useDrawerStore } from "@/store/drawerStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles } from "lucide-react";
import BuyPlan from "../subscription/buy-plan/buy-plan";
import { usePathname, useRouter } from "next/navigation";

export const PlanDrawer = () => {
  const { isOpen: drawerOpen, closeDrawer } = useDrawerStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleClose = async () => {
    router.replace(pathname, { scroll: false });
    closeDrawer();
    router.push("/?firstLogin=true&intensity=high");
  };

  if (!drawerOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background h-screen overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b">
        <div className="text-center flex-1">
          <Badge
            variant="secondary"
            className="mb-2 bg-primary/10 text-primary border-0"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Upgrade Your Plan
          </Badge>
          <h2 className="text-2xl font-bold text-foreground text-balance">
            Choose the perfect plan for your team
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-6 right-4 h-8 w-8 p-0 z-10"
        >
          <X className="h-8 w-8" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <BuyPlan />
      </div>
    </div>
  );
};
