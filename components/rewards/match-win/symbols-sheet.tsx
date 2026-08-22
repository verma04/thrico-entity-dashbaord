"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  Check,
  Loader2,
  Search,
  Palette,
  Smile,
} from "lucide-react";
import { MatchWinSymbol } from "./types";
import { toast } from "sonner";
import {
  useUpdateMatchWinSymbol,
  useDeleteMatchWinSymbol,
} from "@/graphql/actions/rewards";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Emoji & Color Presets for Slot Machines
// ─────────────────────────────────────────────────────────────────────────────

export const EMOJI_CATEGORIES = [
  {
    name: "Classic Slots",
    icon: "🎰",
    emojis: [
      "🍒", "🍋", "🍊", "🍇", "🍉", "🍓", "🍎", "🍌", "🍍", "🍑",
      "🔔", "7️⃣", "💎", "👑", "⭐", "🌟", "💰", "💵", "🪙", "🃏",
      "🎲", "🏆", "🍀", "🔥", "⚡", "🎯", "✨", " BAR ",
    ],
  },
  {
    name: "Gems & Luxury",
    icon: "💎",
    emojis: [
      "💎", "👑", "💍", "🪙", "💰", "🏆", "🥇", "🥈", "🥉", "🔮",
      "✨", "🌟", "💫", "🪐", "🛸", "🛡️", "🗝️", "🪄", "🪞", "⏳",
    ],
  },
  {
    name: "Gifts & Rewards",
    icon: "🎁",
    emojis: [
      "🎁", "🎟️", "🎫", "🏷️", "🛍️", "🛒", "📦", "💳", "🎯", "🎉",
      "🎊", "🎈", "🥳", "🍾", "🥂", "🍿", "🍩", "🍪", "🍫", "🍬",
    ],
  },
  {
    name: "Food & Treats",
    icon: "🍔",
    emojis: [
      "🍕", "🍔", "🍟", "🌭", "🍿", "🍩", "🍪", "🎂", "🍰", "🧁",
      "🍫", "🍬", "🍭", "☕", "🧃", "🥤", "🍦", "🍧", "🥞", "🧇",
    ],
  },
  {
    name: "Lucky Mascots",
    icon: "🦄",
    emojis: [
      "🦄", "🐲", "🐉", "🦁", "🐯", "🐼", "🦊", "🐰", "🐶", "🐱",
      "🦉", "🦅", "🦋", "🐝", "🐞", "🍀", "🌸", "🌻", "🌴", "🌵",
    ],
  },
  {
    name: "Arcade & Gaming",
    icon: "🕹️",
    emojis: [
      "🕹️", "🎮", "👾", "🤖", "🚀", "⚡", "💥", "🔥", "💣", "💻",
      "📱", "⚙️", "🔋", "❤️", "🖤", "💯", "🔊", "🏁", "🚩", "🛑",
    ],
  },
];

export const COLOR_SWATCHES = [
  { name: "Ruby Red", hex: "#EF4444" },
  { name: "Sunset Orange", hex: "#F97316" },
  { name: "Golden Amber", hex: "#F59E0B" },
  { name: "Emerald Green", hex: "#10B981" },
  { name: "Diamond Cyan", hex: "#06B6D4" },
  { name: "Sapphire Blue", hex: "#3B82F6" },
  { name: "Royal Indigo", hex: "#6366F1" },
  { name: "Electric Purple", hex: "#8B5CF6" },
  { name: "Neon Pink", hex: "#EC4899" },
  { name: "Onyx Slate", hex: "#475569" },
];

interface SymbolsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbols: MatchWinSymbol[];
  configId?: string;
  onRefetch?: () => void;
}

export function SymbolsSheet({
  open,
  onOpenChange,
  symbols,
  configId,
  onRefetch,
}: SymbolsSheetProps) {
  const [updateSymbol, { loading }] = useUpdateMatchWinSymbol();
  const [deleteSymbol] = useDeleteMatchWinSymbol();
  const [editingSymbol, setEditingSymbol] = useState<MatchWinSymbol | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [emojiSearch, setEmojiSearch] = useState("");

  const handleEdit = (sym: MatchWinSymbol) => {
    setIsCreating(false);
    setEditingSymbol({ ...sym });
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingSymbol({
      key: `symbol_${symbols.length + 1}`,
      label: "New Symbol",
      icon: "🍒",
      color: "#6366F1",
      sortOrder: symbols.length + 1,
    });
  };

  const handleSave = async () => {
    if (!editingSymbol || !editingSymbol.key || !configId) {
      toast.error("Symbol key and game config are required");
      return;
    }

    try {
      await updateSymbol({
        variables: {
          configId,
          input: {
            key: editingSymbol.key.trim().toLowerCase().replace(/\s+/g, "_"),
            label: editingSymbol.label || editingSymbol.key,
            icon: editingSymbol.icon || "🍒",
            color: editingSymbol.color || "#4F46E5",
            sortOrder: Number(editingSymbol.sortOrder || 1),
          },
        },
      });
      toast.success(
        isCreating ? "New reel symbol created" : "Reel symbol updated",
      );
      setEditingSymbol(null);
      setIsCreating(false);
      if (onRefetch) onRefetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save symbol");
    }
  };

  const handleDelete = async (sym: MatchWinSymbol) => {
    if (!sym.id) {
      toast.error("Default built-in symbols cannot be removed.");
      return;
    }

    try {
      await deleteSymbol({
        variables: { id: sym.id },
      });
      toast.success(`Symbol "${sym.label || sym.key}" removed`);
      if (onRefetch) onRefetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete symbol");
    }
  };

  const filteredEmojis = useMemo(() => {
    if (!emojiSearch.trim()) {
      return EMOJI_CATEGORIES[selectedCategoryIdx].emojis;
    }
    const q = emojiSearch.toLowerCase().trim();
    return EMOJI_CATEGORIES.flatMap((c) => c.emojis).filter((emoji) =>
      emoji.includes(q),
    );
  }, [emojiSearch, selectedCategoryIdx]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg rounded-2xl border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base font-bold text-foreground truncate">
                  Slot Reel Symbols & Emojis
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground truncate">
                  Customize reel symbols, emojis, and colors.
                </DialogDescription>
              </div>
            </div>
            {!editingSymbol && (
              <Button
                size="sm"
                onClick={handleStartCreate}
                className="h-8 gap-1.5 text-xs font-bold shadow-2xs shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> Add Symbol
              </Button>
            )}
          </div>
        </DialogHeader>

        {editingSymbol ? (
          <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/20 animate-in fade-in-50 duration-200 w-full min-w-0 overflow-x-hidden">
            {/* Header & Live Preview Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border/50 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center text-2xl border-2 shadow-md transition-all shrink-0"
                  style={{
                    borderColor: editingSymbol.color || "#6366F1",
                    backgroundColor: editingSymbol.color
                      ? `${editingSymbol.color}18`
                      : undefined,
                  }}
                >
                  <span>{editingSymbol.icon || "🍒"}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {editingSymbol.label || "Untitled Symbol"}
                  </h4>
                  <p className="text-[11px] font-mono text-muted-foreground truncate">
                    Key: {editingSymbol.key || "—"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingSymbol(null);
                  setIsCreating(false);
                }}
                className="h-7 text-xs px-2 shrink-0"
              >
                Cancel
              </Button>
            </div>

            {/* Inputs: Key and Display Label */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-1.5 min-w-0">
                <Label className="text-xs font-semibold">Symbol Key *</Label>
                <Input
                  value={editingSymbol.key}
                  disabled={!isCreating}
                  onChange={(e) =>
                    setEditingSymbol({ ...editingSymbol, key: e.target.value })
                  }
                  placeholder="e.g. cherry, diamond, seven"
                  className="h-9 text-xs font-mono w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <Label className="text-xs font-semibold">Display Label *</Label>
                <Input
                  value={editingSymbol.label}
                  onChange={(e) =>
                    setEditingSymbol({ ...editingSymbol, label: e.target.value })
                  }
                  placeholder="e.g. Juicy Cherry, Golden 7"
                  className="h-9 text-xs font-medium w-full"
                />
              </div>
            </div>

            {/* Emoji Selector Section */}
            <div className="space-y-2 pt-1 w-full min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-semibold flex items-center gap-1.5 shrink-0">
                  <Smile className="h-3.5 w-3.5 text-primary" />
                  Select Symbol Emoji
                </Label>
                <div className="relative w-32 sm:w-36 shrink-0">
                  <Search className="h-3 w-3 absolute left-2 top-2.5 text-muted-foreground" />
                  <Input
                    value={emojiSearch}
                    onChange={(e) => setEmojiSearch(e.target.value)}
                    placeholder="Search..."
                    className="h-7 pl-6 text-[11px] w-full"
                  />
                </div>
              </div>

              {/* Emoji Category Tabs */}
              {!emojiSearch && (
                <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full w-full">
                  {EMOJI_CATEGORIES.map((cat, idx) => {
                    const isSelected = selectedCategoryIdx === idx;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setSelectedCategoryIdx(idx)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1 shrink-0",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                            : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        )}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Emoji Grid */}
              <div className="p-2.5 bg-background border border-border rounded-xl max-h-[140px] overflow-y-auto overflow-x-hidden w-full min-w-0">
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 w-full">
                  {filteredEmojis.map((emoji) => {
                    const isSelected = editingSymbol.icon === emoji;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() =>
                          setEditingSymbol({ ...editingSymbol, icon: emoji })
                        }
                        className={cn(
                          "h-8 w-full rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer",
                          isSelected
                            ? "bg-primary text-primary-foreground scale-105 shadow-xs ring-2 ring-primary/30"
                            : "hover:bg-muted hover:scale-105",
                        )}
                      >
                        <span>{emoji}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-2 pt-1 w-full min-w-0">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-primary" />
                Reel Theme Color
              </Label>
              <div className="flex items-center gap-1.5 flex-wrap w-full">
                {COLOR_SWATCHES.map((swatch) => {
                  const isSelected =
                    editingSymbol.color?.toLowerCase() ===
                    swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() =>
                        setEditingSymbol({
                          ...editingSymbol,
                          color: swatch.hex,
                        })
                      }
                      title={swatch.name}
                      className={cn(
                        "h-6 w-6 sm:h-7 sm:w-7 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center shadow-2xs shrink-0",
                        isSelected
                          ? "scale-110 border-foreground shadow-md ring-2 ring-primary/40"
                          : "border-transparent hover:scale-105 opacity-80 hover:opacity-100",
                      )}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 text-white drop-shadow" />
                      )}
                    </button>
                  );
                })}
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="color"
                    value={editingSymbol.color || "#6366F1"}
                    onChange={(e) =>
                      setEditingSymbol({
                        ...editingSymbol,
                        color: e.target.value,
                      })
                    }
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg border border-border cursor-pointer p-0.5 shrink-0"
                  />
                  <Input
                    value={editingSymbol.color}
                    onChange={(e) =>
                      setEditingSymbol({
                        ...editingSymbol,
                        color: e.target.value,
                      })
                    }
                    className="h-7 w-20 font-mono text-[11px] uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Action Save Button */}
            <Button
              onClick={handleSave}
              disabled={loading || !editingSymbol.key}
              className="w-full h-9 text-xs font-bold gap-1.5 mt-2 shadow-2xs"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              {isCreating ? "Create Symbol" : "Save Symbol Changes"}
            </Button>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto overflow-x-hidden pr-0.5 w-full min-w-0">
            {symbols.map((sym) => (
              <div
                key={sym.key}
                className="p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors flex items-center justify-between shadow-2xs gap-3 w-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-xl border shadow-inner transition-transform shrink-0"
                    style={{
                      borderColor: sym.color ? `${sym.color}60` : undefined,
                      backgroundColor: sym.color ? `${sym.color}15` : undefined,
                    }}
                  >
                    <span>{sym.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-foreground truncate">
                      {sym.label || sym.key}
                    </h5>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground truncate">
                        Key: {sym.key}
                      </span>
                      {sym.color && (
                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: sym.color }}
                          />
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">
                            {sym.color}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(sym)}
                    className="h-8 text-xs gap-1 font-medium bg-card"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  {sym.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sym)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete Symbol"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="w-full">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full text-xs font-semibold"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SymbolsSheet;
