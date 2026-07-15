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
    <div className="space-y-4 pt-4 border-t border-border mt-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold">Tier Members ({totalCount})</h4>
        <TierAssignMembers tierId={tierId} onAssigned={() => refetch()} />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`member-skeleton-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[180px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Skeleton className="h-8 w-[80px] rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                  No members in this tier.
                </TableCell>
              </TableRow>
            ) : (
              users.map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={row.user?.avatar ? `https://cdn.thrico.network/${row.user.avatar}` : ""} />
                        <AvatarFallback>{row.user?.firstName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {row.user?.firstName} {row.user?.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.user?.email}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMemberToRemove(row);
                        setIsRemoveModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <UserX className="h-4 w-4 mr-1" />
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
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {memberToRemove?.user?.firstName} {memberToRemove?.user?.lastName}
              </span>{" "}
              from this membership tier? They will lose all associated benefits.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRemoveModalOpen(false);
                setMemberToRemove(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
