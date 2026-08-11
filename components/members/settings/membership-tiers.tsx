"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_MEMBERSHIP_TIERS,
  DELETE_MEMBERSHIP_TIER,
} from "@/graphql/membership-tier";
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  MoreHorizontal,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TierMembersList from "./tier-members-list";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { CtaButton } from "@/components/ui/cta-button";
import { TierModal } from "./tier-modal";

export default function MembershipTiers() {
  const { data, loading, refetch } = useQuery(GET_MEMBERSHIP_TIERS);
  const [deleteTier] = useMutation(DELETE_MEMBERSHIP_TIER);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [expandedTierId, setExpandedTierId] = useState<string | null>(null);
  const [tierToDelete, setTierToDelete] = useState<string | null>(null);

  const tiers = data?.getMembershipTiers || [];

  const handleOpenModal = (tier: any = null) => {
    setEditingTier(tier);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!tierToDelete) return;
    try {
      await deleteTier({ variables: { id: tierToDelete } });
      toast.success("Membership tier deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setTierToDelete(null);
    }
  };

  return (
    <EcosystemWrapper className="gap-6">
      <EcosystemHeader
        title="Membership Tiers"
        description="Create and manage membership tiers and their associated benefits."
        badgeText="Tiers"
        icon={Award}
        breadcrumbs={[
          { label: "Members", href: "/members/all" },
          { label: "Tiers" },
        ]}
        actions={
          <EcosystemActionBar
            shadow="none"
            className="p-0 border-none bg-transparent gap-2"
          >
            <EcosystemActionBar.Group align="right">
              <CtaButton onClick={() => handleOpenModal()}>
                <Plus className="h-3 w-3" />
                Create Tier
              </CtaButton>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />

      <EcosystemContainer className="p-0 border-none  bg-transparent shadow-none ring-0 space-y-6">
        <div className="border rounded-xl shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Benefits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-[60px] rounded-full" />
                        <Skeleton className="h-5 w-[60px] rounded-full" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-[100px] rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : tiers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No membership tiers created yet.
                  </TableCell>
                </TableRow>
              ) : (
                tiers.map((tier: any) => (
                  <React.Fragment key={tier.id}>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          {tier.badgeIcon ? (
                            <img
                              src={
                                tier.badgeIcon.startsWith("http")
                                  ? tier.badgeIcon
                                  : `https://cdn.thrico.network/${tier.badgeIcon}`
                              }
                              alt={tier.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-opacity-20"
                              style={{ backgroundColor: `${tier.badgeColor}20` }}
                            >
                              <Award
                                className="h-4 w-4"
                                style={{ color: tier.badgeColor }}
                              />
                            </div>
                          )}
                          <span style={{ color: tier.badgeColor }}>
                            {tier.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {tier.description || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tier.benefits?.length === 1 &&
                          tier.benefits[0].includes("<") ? (
                            <Badge variant="secondary" className="text-xs">
                              Custom Benefits
                            </Badge>
                          ) : (
                            <>
                              {tier.benefits
                                ?.slice(0, 2)
                                .map((b: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {b}
                                  </Badge>
                                ))}
                              {tier.benefits?.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{tier.benefits.length - 2} more
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <CtaButton
                            variant="outline"
                            onClick={() =>
                              setExpandedTierId(
                                expandedTierId === tier.id ? null : tier.id,
                              )
                            }
                          >
                            {expandedTierId === tier.id ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" /> Hide
                                Members
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" /> View
                                Members
                              </>
                            )}
                          </CtaButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleOpenModal(tier)}
                              >
                                <Edit2 className="h-4 w-4 mr-2" /> Edit Tier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setTierToDelete(tier.id)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Tier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedTierId === tier.id && (
                      <TableRow
                        key={`${tier.id}-members`}
                        className="bg-muted/30"
                      >
                        <TableCell colSpan={4} className="p-0 border-b">
                          <div
                            className="p-4 px-6 border-l-4"
                            style={{ borderLeftColor: tier.badgeColor }}
                          >
                            <TierMembersList tierId={tier.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <TierModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingTier={editingTier}
          onSuccess={refetch}
        />

        <AlertDialog open={!!tierToDelete} onOpenChange={(open) => !open && setTierToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Membership Tier?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this tier? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
