"use client";

import React, { useState } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Rank } from "./ts-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Trophy, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const RANK_ICONS = [
  "🐣",
  "👶",
  "🔍",
  "📝",
  "🎯",
  "👑",
  "💎",
  "🏆",
  "⭐",
  "🌟",
  "🚀",
  "💪",
  "🎓",
  "🔥",
  "⚡",
  "🦁",
  "🦅",
  "🐲",
  "🌈",
  "🎖️",
];

export function RanksManager() {
  const { ranks, addRank, updateRank, deleteRank, reorderRanks } =
    useGamificationStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<Rank | null>(null);
  const [formData, setFormData] = useState<Partial<Rank>>({
    name: "",
    icon: "⭐",
    type: "POINTS",
    isActive: true,
    requirements: {},
  });

  const sortedRanks = [...ranks].sort((a, b) => a.order - b.order);

  const handleOpenDialog = (rank?: Rank) => {
    if (rank) {
      setEditingRank(rank);
      setFormData(rank);
    } else {
      setEditingRank(null);
      setFormData({
        name: "",
        icon: "⭐",
        type: "POINTS",
        order: ranks.length + 1,
        isActive: true,
        requirements: {},
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingRank) {
      updateRank(editingRank.id, formData);
    } else {
      addRank(formData as Omit<Rank, "id">);
    }
    setIsDialogOpen(false);
  };

  const moveRank = (index: number, direction: "up" | "down") => {
    const newRanks = [...sortedRanks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newRanks.length) return;

    // Swap orders
    const tempOrder = newRanks[index].order;
    newRanks[index] = {
      ...newRanks[index],
      order: newRanks[targetIndex].order,
    };
    newRanks[targetIndex] = { ...newRanks[targetIndex], order: tempOrder };

    reorderRanks(newRanks);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Ranks</p>
                <p className="text-2xl font-bold">{ranks.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Points-Based</p>
                <p className="text-2xl font-bold">
                  {ranks.filter((r) => r.type === "POINTS").length}
                </p>
              </div>
              <Badge>Points</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hybrid</p>
                <p className="text-2xl font-bold">
                  {ranks.filter((r) => r.type === "HYBRID").length}
                </p>
              </div>
              <Badge variant="secondary">Mixed</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Rank Button */}
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Rank
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRank ? "Edit Rank" : "Create Rank"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
                  {RANK_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={cn(
                        "w-10 h-10 text-xl rounded-lg border-2 transition-all",
                        formData.icon === icon
                          ? "border-primary bg-primary/10"
                          : "border-transparent hover:bg-gray-100"
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Expert"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      type: v as "POINTS" | "BADGES" | "HYBRID",
                      requirements: {},
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POINTS">Points-Based</SelectItem>
                    <SelectItem value="BADGES">Badge-Based</SelectItem>
                    <SelectItem value="HYBRID">
                      Hybrid (Points + Badges)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.type === "POINTS" || formData.type === "HYBRID") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min Points</Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.requirements?.minPoints || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: {
                            ...formData.requirements,
                            minPoints: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Points</Label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={formData.requirements?.maxPoints || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: {
                            ...formData.requirements,
                            maxPoints: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {(formData.type === "BADGES" || formData.type === "HYBRID") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min Badges</Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.requirements?.minBadges || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: {
                            ...formData.requirements,
                            minBadges: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Badges</Label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={formData.requirements?.maxBadges || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: {
                            ...formData.requirements,
                            maxBadges: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, isActive: v })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingRank ? "Save Changes" : "Create Rank"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rank Progression */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rank Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedRanks.map((rank, index) => (
              <div
                key={rank.id}
                className={cn(
                  "flex items-center gap-4 p-4 border rounded-lg transition-all",
                  !rank.isActive && "opacity-50 bg-muted"
                )}
              >
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={index === 0}
                    onClick={() => moveRank(index, "up")}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={index === sortedRanks.length - 1}
                    onClick={() => moveRank(index, "down")}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-center w-12 h-12 text-2xl bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  {rank.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{rank.name}</span>
                    <Badge variant="outline" className="text-xs">
                      Level {index + 1}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {rank.type === "POINTS" && (
                      <>
                        {rank.requirements.minPoints?.toLocaleString() || 0} -{" "}
                        {rank.requirements.maxPoints?.toLocaleString() || "∞"}{" "}
                        points
                      </>
                    )}
                    {rank.type === "BADGES" && (
                      <>
                        {rank.requirements.minBadges || 0} -{" "}
                        {rank.requirements.maxBadges || "∞"} badges
                      </>
                    )}
                    {rank.type === "HYBRID" && (
                      <>
                        {rank.requirements.minPoints?.toLocaleString() || 0}+
                        pts & {rank.requirements.minBadges || 0}+ badges
                      </>
                    )}
                  </div>
                </div>

                <Badge
                  variant={
                    rank.type === "POINTS"
                      ? "default"
                      : rank.type === "BADGES"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {rank.type}
                </Badge>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(rank)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => deleteRank(rank.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {sortedRanks.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No ranks defined. Create your first rank!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
