"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { REMOVE_MEMBER_FROM_TIER } from "@/graphql/membership-tier";
import { useGetAllUser } from "@/graphql/actions/membership/membership-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { UserX, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import TierAssignMembers from "./tier-assign-members";

interface TierMembersListProps {
  tierId: string;
}

export default function TierMembersList({ tierId }: TierMembersListProps) {
  const [page, setPage] = useState(0);
  const [memberToRemove, setMemberToRemove] = useState<any>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const limit = 10;
  const offset = page * limit;

  const { data, loading, refetch } = useGetAllUser({
    status: "ALL",
    limit,
    offset,
    membershipTierId: tierId,
  });

  const [removeMember] = useMutation(REMOVE_MEMBER_FROM_TIER);

  const handleRemove = async () => {
    if (!memberToRemove) return;
    try {
      await removeMember({
        variables: { memberId: memberToRemove.id },
      });
      toast.success("Member removed from tier");
      setIsRemoveModalOpen(false);
      setMemberToRemove(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member");
    }
  };

  const users = data?.getAllUser?.data || [];
  const totalCount = data?.getAllUser?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-3 pt-3 border-t border-[#e1e3e5] dark:border-zinc-800 mt-3">
      <div className="flex justify-between items-center">
        <h4 className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
          Tier Members ({totalCount})
        </h4>
        <TierAssignMembers tierId={tierId} onAssigned={() => refetch()} />
      </div>

      <div className="border border-[#d2d5d9] dark:border-zinc-800 rounded-[6px] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f6f7]/50 dark:bg-zinc-900/50">
              <TableHead className="py-2 text-[11px] font-bold text-[#616161]">Member</TableHead>
              <TableHead className="py-2 text-[11px] font-bold text-[#616161]">Email</TableHead>
              <TableHead className="py-2 text-right text-[11px] font-bold text-[#616161]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`member-skeleton-${index}`}>
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Skeleton className="h-3 w-[140px]" />
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <div className="flex justify-end">
                      <Skeleton className="h-6 w-[60px] rounded-[4px]" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-4 text-[12px] text-[#8c9196]"
                >
                  No members in this tier.
                </TableCell>
              </TableRow>
            ) : (
              users.map((row: any) => (
                <TableRow key={row.id} className="hover:bg-[#f6f6f7]/50 dark:hover:bg-zinc-800/30">
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-[#d2d5d9] dark:border-zinc-700">
                        <AvatarImage
                          src={
                            row.user?.avatar
                              ? `https://cdn.thrico.network/${row.user.avatar}`
                              : ""
                          }
                        />
                        <AvatarFallback className="text-[9px]">
                          {row.user?.firstName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[12px] font-medium text-[#303030] dark:text-zinc-100">
                        {row.user?.firstName} {row.user?.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-[11.5px] text-[#616161] dark:text-zinc-400">
                    {row.user?.email}
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMemberToRemove(row);
                        setIsRemoveModalOpen(true);
                      }}
                      className="h-[26px] text-[11px] px-2 text-[#d72c0d] hover:text-[#b02209] hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 rounded-[4px] cursor-pointer"
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-1.5 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="h-[26px] w-[26px] p-0 rounded-[4px]"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <span className="text-[11px] text-[#616161] dark:text-zinc-400">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="h-[26px] w-[26px] p-0 rounded-[4px]"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}

      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent className="rounded-[8px]">
          <DialogHeader>
            <DialogTitle className="text-[14px]">Remove Member</DialogTitle>
            <DialogDescription className="text-[12px]">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-[#303030] dark:text-zinc-100">
                {memberToRemove?.user?.firstName}{" "}
                {memberToRemove?.user?.lastName}
              </span>{" "}
              from this membership tier? They will lose all associated benefits.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsRemoveModalOpen(false);
                setMemberToRemove(null);
              }}
              className="h-[32px] text-[12px] rounded-[4px]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="h-[32px] text-[12px] rounded-[4px] bg-[#d72c0d] hover:bg-[#b02209]"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
