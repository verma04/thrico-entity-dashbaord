"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ASSIGN_MEMBERS_TO_TIER } from "@/graphql/membership-tier";
import { useGetAllUser } from "@/graphql/actions/membership/membership-queries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface TierAssignMembersProps {
  tierId: string;
  onAssigned: () => void;
}

export default function TierAssignMembers({
  tierId,
  onAssigned,
}: TierAssignMembersProps) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const { data, loading } = useGetAllUser({
    status: "ALL",
    limit: 50,
    search: search.length > 2 ? search : null,
  });

  const [assignMembers, { loading: isAssigning }] = useMutation(
    ASSIGN_MEMBERS_TO_TIER,
  );

  const users = data?.getAllUser?.data || [];
  const availableUsers = users.filter(
    (u: any) => u.membershipTierId !== tierId,
  );

  const handleAssign = async () => {
    if (selectedIds.length === 0) return;

    try {
      await assignMembers({
        variables: {
          tierId,
          memberIds: selectedIds,
        },
      });
      toast.success(`${selectedIds.length} member(s) assigned to tier`);
      setOpen(false);
      setSelectedIds([]);
      onAssigned();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign members");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-[28px] text-[11.5px] px-2.5 font-semibold gap-1.5 border-[#aeb4b9] dark:border-zinc-700 rounded-[4px] cursor-pointer"
        >
          <UserPlus className="h-3 w-3" />
          Assign Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 p-4">
        <DialogHeader className="pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
          <DialogTitle className="text-[13.5px] font-bold text-[#303030] dark:text-zinc-100">
            Assign Members to Tier
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-1">
          <Command
            className="border border-[#d2d5d9] dark:border-zinc-800 rounded-[6px] overflow-hidden"
            shouldFilter={false}
          >
            <CommandInput
              placeholder="Search members by name or email..."
              value={search}
              onValueChange={setSearch}
              className="h-[34px] text-[12.5px]"
            />
            <CommandList className="max-h-[260px]">
              <CommandEmpty className="py-4 text-[12px] text-[#8c9196] text-center">
                {loading ? "Searching..." : "No available members found."}
              </CommandEmpty>
              <CommandGroup>
                {availableUsers.map((row: any) => {
                  const user = row.user;
                  const isSelected = selectedIds.includes(row.id);
                  return (
                    <CommandItem
                      key={row.id}
                      value={row.id}
                      onSelect={() => toggleSelect(row.id)}
                      className="flex items-center justify-between px-3 py-1.5 cursor-pointer text-[12px]"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-[#d2d5d9] dark:border-zinc-700">
                          <AvatarImage
                            src={
                              user?.avatar
                                ? `https://cdn.thrico.network/${user.avatar}`
                                : ""
                            }
                          />
                          <AvatarFallback className="text-[9px]">
                            {user?.firstName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-[12px] text-[#303030] dark:text-zinc-100 leading-tight">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-[10.5px] text-[#616161] dark:text-zinc-400">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-[3px] border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-[#303030] border-[#303030] text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900"
                            : "border-[#aeb4b9] dark:border-zinc-700"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 stroke-[3px]" />}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11.5px] text-[#616161]">
              {selectedIds.length} member{selectedIds.length === 1 ? "" : "s"}{" "}
              selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-[30px] text-[12px] rounded-[4px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAssign}
                disabled={selectedIds.length === 0 || isAssigning}
                className="h-[30px] text-[12px] px-3 font-semibold bg-[#303030] text-white rounded-[4px] cursor-pointer hover:bg-[#202020]"
              >
                {isAssigning ? "Assigning..." : "Assign"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
