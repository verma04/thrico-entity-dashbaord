"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, ScanLine, Users, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface BrandRequest {
  id: string;
  name: string;
  logo: string;
  requestedDate: string;
  potentialOffers: number;
  message: string;
}

interface PendingRequestsProps {
  requests: BrandRequest[];
  /** Open the rewards-review dialog for this brand */
  onReview?: (id: string) => void;
  onDecline?: (id: string) => void;
}

export function PendingRequests({
  requests,
  onReview,
  onDecline,
}: PendingRequestsProps) {
  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2 px-0.5">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[11px] font-semibold text-foreground uppercase tracking-[0.18em]">
          Pending Requests
        </span>
        {requests.length > 0 && (
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        )}
      </div>

      {/* Request cards */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {requests.map((request, idx) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, delay: idx * 0.06 }}
            >
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  {/* Brand info row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-9 w-9 rounded-lg border border-border">
                        <AvatarImage src={request.logo} alt={request.name} />
                        <AvatarFallback className="text-xs font-semibold bg-muted">
                          {request.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground leading-none">
                          {request.name}
                        </p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                          {request.requestedDate}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold uppercase tracking-widest bg-primary/5 text-primary border-primary/15 shrink-0"
                    >
                      {request.potentialOffers} Offers
                    </Badge>
                  </div>

                  {/* Message */}
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      &ldquo;{request.message}&rdquo;
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Review → opens reward list dialog */}
                    <Button
                      size="sm"
                      className="h-8 text-[10px] font-semibold uppercase tracking-widest gap-1.5 bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => onReview?.(request.id)}
                    >
                      <ScanLine className="h-3 w-3" />
                      Review
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-[10px] font-semibold uppercase tracking-widest border-border gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      onClick={() => onDecline?.(request.id)}
                    >
                      <X className="h-3 w-3" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {requests.length === 0 && (
          <div className="py-12 text-center space-y-3 bg-muted/20 rounded-xl border border-dashed border-border">
            <div className="h-10 w-10 bg-background rounded-xl flex items-center justify-center mx-auto border border-border shadow-sm">
              <Info className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              No Pending Requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
