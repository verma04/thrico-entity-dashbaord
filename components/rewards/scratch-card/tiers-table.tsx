import React from "react";
import { Edit, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScratchRewardTier, REWARD_BADGE, REWARD_ICON, REWARD_LABELS } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TiersTableProps {
  tiers: ScratchRewardTier[];
  onEdit: (tier: ScratchRewardTier) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
}

export function TiersTable({
  tiers,
  onEdit,
  onDelete,
  onToggleActive,
}: TiersTableProps) {
  return (
    <TooltipProvider>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="h-10 text-xs font-semibold w-[40px]">
                #
              </TableHead>
              <TableHead className="h-10 text-xs font-semibold">
                Label
              </TableHead>
              <TableHead className="h-10 text-xs font-semibold">
                Type
              </TableHead>
              <TableHead className="h-10 text-xs font-semibold text-center">
                Active
              </TableHead>
              <TableHead className="h-10 text-xs font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-20 text-center text-sm text-muted-foreground"
                >
                  No reward tiers yet. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              tiers.map((tier, i) => (
                <TableRow key={tier.id} className="group h-12">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {tier.label}
                      </span>
                      {tier.eligibilityDescription && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-3">
                            <div
                              className="text-xs prose prose-sm dark:prose-invert"
                              dangerouslySetInnerHTML={{
                                __html: tier.eligibilityDescription,
                              }}
                            />
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 w-fit",
                        REWARD_BADGE[tier.rewardType],
                      )}
                    >
                      {REWARD_ICON[tier.rewardType]}
                      {REWARD_LABELS[tier.rewardType]}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={tier.isActive !== false}
                      onCheckedChange={(v) => onToggleActive(tier.id, v)}
                      className="scale-75"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => onEdit(tier)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg hover:text-rose-600"
                        onClick={() => onDelete(tier.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
