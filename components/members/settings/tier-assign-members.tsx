"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
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
import { Check, Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  // Filter out members that are already in this tier
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
        <Button size="sm" variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Assign Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Members to Tier</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Command
            className="border rounded-md overflow-hidden"
            shouldFilter={false}
          >
            <CommandInput
              placeholder="Search members by name or email..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
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
                      className="flex items-center justify-between px-4 py-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              user?.avatar
                                ? `https://cdn.thrico.network/${user.avatar}`
                                : ""
                            }
                          />
                          <AvatarFallback>
                            {user?.firstName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded border",
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-input",
                        )}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={selectedIds.length === 0 || isAssigning}
            >
              {isAssigning
                ? "Assigning..."
                : `Assign ${selectedIds.length > 0 ? `(${selectedIds.length})` : ""}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
