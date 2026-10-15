"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Building2, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Moment, useAdminChangeMomentUploadType } from "@/graphql/actions/moments";
import { useGetAllUser } from "@/graphql/actions/membership/membership-queries";

interface ChangeUploadTypeDialogProps {
  moment: Moment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updated: Moment) => void;
}

export function ChangeUploadTypeDialog({
  moment,
  open,
  onOpenChange,
  onSuccess,
}: ChangeUploadTypeDialogProps) {
  const currentType = (moment?.addedBy === "ENTITY" ? "ENTITY" : "USER") as "ENTITY" | "USER";
  const [selectedType, setSelectedType] = useState<"ENTITY" | "USER">(
    currentType === "ENTITY" ? "USER" : "ENTITY"
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    moment?.owner?.id || null
  );
  const [selectedUserName, setSelectedUserName] = useState<string>(
    moment?.owner ? `${moment.owner.firstName || ""} ${moment.owner.lastName || ""}`.trim() : ""
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      const type = (moment?.addedBy === "ENTITY" ? "ENTITY" : "USER") as "ENTITY" | "USER";
      setSelectedType(type === "ENTITY" ? "USER" : "ENTITY");
      setSelectedUserId(moment?.owner?.id || null);
      setSelectedUserName(
        moment?.owner ? `${moment.owner.firstName || ""} ${moment.owner.lastName || ""}`.trim() : ""
      );
      setSearch("");
    }
  }, [open, moment]);

  const { data, loading: loadingUsers } = useGetAllUser({
    status: "ALL",
    limit: 40,
    search: search.length >= 2 ? search : null,
  });

  const [changeUploadType, { loading: isSubmitting }] = useAdminChangeMomentUploadType({
    onCompleted: (res) => {
      const updated = res.adminChangeMomentUploadType;
      toast.success(
        selectedType === "ENTITY"
          ? "Moment converted to Entity upload successfully"
          : `Moment assigned to ${selectedUserName || "user"} successfully`
      );
      onOpenChange(false);
      onSuccess?.(updated);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to change upload type");
    },
  });

  const users = data?.getAllUser?.data || [];

  const handleSubmit = async () => {
    if (selectedType === "USER" && !selectedUserId) {
      toast.error("Please select a user to assign this moment to");
      return;
    }

    await changeUploadType({
      variables: {
        id: moment.id,
        input: {
          addedBy: selectedType,
          userId: selectedType === "USER" && selectedUserId ? selectedUserId : undefined,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-xl p-5 border-border gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-foreground">
            Change Upload Type
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure whether this moment is attributed to the official Entity or an individual Member.
          </DialogDescription>
        </DialogHeader>

        {/* Mode Selector Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedType("ENTITY")}
            className={cn(
              "p-3 rounded-lg border text-left flex flex-col gap-1.5 transition-all cursor-pointer relative",
              selectedType === "ENTITY"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border/60 hover:border-border hover:bg-muted/40"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                Entity
              </div>
              {selectedType === "ENTITY" && (
                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Official community post. Creator profile will appear as Entity.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType("USER")}
            className={cn(
              "p-3 rounded-lg border text-left flex flex-col gap-1.5 transition-all cursor-pointer relative",
              selectedType === "USER"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border/60 hover:border-border hover:bg-muted/40"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                <User className="h-4 w-4 text-primary" />
                Member
              </div>
              {selectedType === "USER" && (
                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Attributed to a member. Choose an individual user to assign.
            </p>
          </button>
        </div>

        {/* Member Picker when USER is selected */}
        {selectedType === "USER" && (
          <div className="flex flex-col gap-2 pt-1">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Assign to Member</span>
              {selectedUserName && (
                <span className="text-[11px] text-primary font-normal">
                  Selected: {selectedUserName}
                </span>
              )}
            </label>

            <Command className="border border-border/80 rounded-lg overflow-hidden bg-card" shouldFilter={false}>
              <CommandInput
                placeholder="Search member by name or email..."
                value={search}
                onValueChange={setSearch}
                className="h-9 text-xs"
              />
              <CommandList className="max-h-52">
                <CommandEmpty className="py-4 text-xs text-muted-foreground text-center">
                  {loadingUsers ? "Searching members..." : "No members found."}
                </CommandEmpty>
                <CommandGroup>
                  {users.map((row: any) => {
                    const u = row.user || row;
                    const userId = row.user?.id || row.userId || row.id;
                    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Member";
                    const isSelected = selectedUserId === userId;

                    return (
                      <CommandItem
                        key={userId}
                        value={userId}
                        onSelect={() => {
                          setSelectedUserId(userId);
                          setSelectedUserName(fullName);
                        }}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-2 cursor-pointer text-xs rounded-md",
                          isSelected && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-6 w-6 rounded-full border shrink-0">
                            <AvatarImage
                              src={
                                u.avatar?.startsWith("http")
                                  ? u.avatar
                                  : u.avatar
                                  ? `https://cdn.thrico.network/${u.avatar}`
                                  : undefined
                              }
                              alt={fullName}
                            />
                            <AvatarFallback className="text-[9px] font-bold bg-muted">
                              {fullName[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate text-xs font-medium text-foreground">
                              {fullName}
                            </span>
                            {u.email && (
                              <span className="truncate text-[10px] text-muted-foreground">
                                {u.email}
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || (selectedType === "USER" && !selectedUserId)}
            className="text-xs gap-1.5 font-semibold"
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {selectedType === "ENTITY"
              ? "Convert to Entity"
              : selectedUserName
              ? `Assign to ${selectedUserName}`
              : "Assign to Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
