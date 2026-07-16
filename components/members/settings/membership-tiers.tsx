"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_MEMBERSHIP_TIERS,
  CREATE_MEMBERSHIP_TIER,
  UPDATE_MEMBERSHIP_TIER,
  DELETE_MEMBERSHIP_TIER,
} from "@/graphql/membership-tier";
import { Plus, Edit2, Trash2, Award, MoreHorizontal, Users, ChevronDown, ChevronUp } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
export default function MembershipTiers() {
  const { data, loading, refetch } = useQuery(GET_MEMBERSHIP_TIERS);
  const [createTier] = useMutation(CREATE_MEMBERSHIP_TIER);
  const [updateTier] = useMutation(UPDATE_MEMBERSHIP_TIER);
  const [deleteTier] = useMutation(DELETE_MEMBERSHIP_TIER);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<any>(null);
  const [expandedTierId, setExpandedTierId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    badgeColor: "#fbbf24",
    benefits: "",
  });

  const tiers = data?.getMembershipTiers || [];

  const handleOpenModal = (tier: any = null) => {
    if (tier) {
      setEditingTier(tier);
      setFormData({
        name: tier.name,
        description: tier.description || "",
        badgeColor: tier.badgeColor || "#fbbf24",
        benefits: tier.benefits ? tier.benefits.join("<br />") : "",
      });
    } else {
      setEditingTier(null);
      setFormData({
        name: "",
        description: "",
        badgeColor: "#fbbf24",
        benefits: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const input = {
        name: formData.name,
        description: formData.description,
        badgeColor: formData.badgeColor,
        benefits: [formData.benefits].filter(Boolean),
      };

      if (editingTier) {
        await updateTier({
          variables: {
            id: editingTier.id,
            input,
          },
        });
        toast.success("Membership tier updated successfully");
      } else {
        await createTier({
          variables: {
            input,
          },
        });
        toast.success("Membership tier created successfully");
      }
      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tier?")) return;
    try {
      await deleteTier({ variables: { id } });
      toast.success("Membership tier deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Membership Tiers</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Create and manage membership tiers and their associated benefits.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Tier
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
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
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No membership tiers created yet.
                </TableCell>
              </TableRow>
            ) : (
              tiers.map((tier: any) => (
                <React.Fragment key={tier.id}>
                  <TableRow>
                    <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-opacity-20"
                        style={{ backgroundColor: `${tier.badgeColor}20` }}
                      >
                        <Award
                          className="h-4 w-4"
                          style={{ color: tier.badgeColor }}
                        />
                      </div>
                      <span style={{ color: tier.badgeColor }}>{tier.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {tier.description || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tier.benefits?.length === 1 && tier.benefits[0].includes("<") ? (
                        <Badge variant="secondary" className="text-xs">
                          Custom Benefits
                        </Badge>
                      ) : (
                        <>
                          {tier.benefits?.slice(0, 2).map((b: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedTierId(expandedTierId === tier.id ? null : tier.id)}
                        className="h-8"
                      >
                        {expandedTierId === tier.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" /> Hide Members
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" /> View Members
                          </>
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenModal(tier)}>
                            <Edit2 className="h-4 w-4 mr-2" /> Edit Tier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(tier.id)}
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
                  <TableRow key={`${tier.id}-members`} className="bg-muted/30">
                    <TableCell colSpan={4} className="p-0 border-b">
                      <div className="p-4 px-6 border-l-4" style={{ borderLeftColor: tier.badgeColor }}>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTier ? "Edit Membership Tier" : "Create Membership Tier"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Tier Name</Label>
              <Input
                required
                placeholder="e.g. Platinum Member"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Short description of this tier"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Badge Color (Hex)</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="w-12 p-1 h-10"
                  value={formData.badgeColor}
                  onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                />
                <Input
                  placeholder="#fbbf24"
                  value={formData.badgeColor}
                  onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Benefits</Label>
              <RichTextEditor
                value={formData.benefits}
                onChange={(content) => setFormData({ ...formData, benefits: content })}
                placeholder="List the benefits of this tier..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTier ? "Save Changes" : "Create Tier"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
