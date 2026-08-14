import React from "react";
import { Edit, Trash2, Info, Coins, Ticket, XCircle } from "lucide-react";
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
  currencyName?: string;
  onEdit: (tier: ScratchRewardTier) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
}

export function TiersTable({
  tiers,
  currencyName = "Points",
  onEdit,
  onDelete,
  onToggleActive,
}: TiersTableProps) {
  return (
    <TooltipProvider>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/70 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800">
              <TableHead className="h-10 text-xs font-semibold w-[40px]">
                #
              </TableHead>
              <TableHead className="h-10 text-xs font-semibold">
                Tier Label
              </TableHead>
              <TableHead className="h-10 text-xs font-semibold">
                Reward Type
              </TableHead>
              <TableHead className="h-10 text-xs font-semibold">
                Value
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
                  colSpan={6}
                  className="h-24 text-center text-xs text-zinc-400"
                >
                  No reward tiers configured yet. Click "Add Tier" to create one.
                </TableCell>
              </TableRow>
            ) : (
              tiers.map((tier, i) => (
                <TableRow
                  key={tier.id}
                  className="group h-12 border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                >
                  <TableCell className="font-mono text-xs text-zinc-400">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                        {tier.label}
                      </span>
                      {tier.eligibilityDescription && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs p-3 text-xs bg-zinc-900 text-white rounded-xl border border-zinc-800 shadow-lg">
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
                        "text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-fit border",
                        REWARD_BADGE[tier.rewardType],
                      )}
                    >
                      {REWARD_ICON[tier.rewardType]}
                      {REWARD_LABELS[tier.rewardType]}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {tier.rewardType === "COINS" &&
                      `${tier.rewardValue} ${currencyName}`}
                    {tier.rewardType === "VOUCHER" && "Voucher Coupon"}
                    {tier.rewardType === "NO_REWARDS" && (
                      <span className="text-zinc-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={tier.isActive !== false}
                      onCheckedChange={(v) => onToggleActive(tier.id, v)}
                      className="scale-75 data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => onEdit(tier)}
                      >
                        <Edit className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600"
                        onClick={() => onDelete(tier.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-zinc-400 hover:text-rose-600" />
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
