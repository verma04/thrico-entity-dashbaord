"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  Box,
  Link as LinkIcon,
  Copy,
  Check,
  ChevronsUpDown,
  RefreshCw,
  Image as ImageIcon,
  Settings2,
  ChevronDown,
  Hash,
  Palette,
  Ruler,
  Package,
  Layers,
  AlertCircle,
} from "lucide-react";
import { resolveCdnUrl } from "@/lib/shop-utils";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { COMMON_OPTIONS } from "./category-config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useShopStore } from "@/store/useShopStore";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageUploadWithCrop } from "../ui/image-upload-with-crop";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VariantManagerProps {
  basePrice: string;
  baseLink?: string; // Main product link to copy from
  showOnly?: "options" | "table" | "all";
  onTabChange?: (tab: string) => void;
}

export function VariantManager({
  basePrice,
  baseLink,
  showOnly = "all",
  onTabChange,
}: VariantManagerProps) {
  const {
    variants,
    options,
    addOption,
    removeOption,
    addValueToOption,
    removeValueFromOption,
    updateVariant,
    batchUpdateVariants,

    updateOptionValue,
  } = useShopStore();

  const [newOptionName, setNewOptionName] = useState("");
  const [newValues, setNewValues] = useState<Record<string, string>>({});
  const [openOptionList, setOpenOptionList] = useState(false);

  // useEffect(() => {
  //   generateVariants(basePrice, baseLink);
  // }, [options, basePrice, generateVariants]); // Remove baseLink from dep if we don't want constant overwrites, but for init it's ok

  const handleAddOption = () => {
    if (!newOptionName.trim()) return;
    addOption(newOptionName);
    setNewOptionName("");
  };

  const handleAddValue = (optionId: string) => {
    const val = newValues[optionId];
    if (!val || !val.trim()) return;
    addValueToOption(optionId, val);
    setNewValues({ ...newValues, [optionId]: "" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {(showOnly === "all" || showOnly === "options") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Box className="w-4 h-4 text-primary" />
                Product Options
              </h3>
              <p className="text-sm text-muted-foreground">
                Add options like size, color, or material.
              </p>
            </div>
          </div>

          <Alert
            variant="default"
            className="bg-amber-50 border-amber-200 text-amber-800"
          >
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900 font-bold">
              High Impact Action
            </AlertTitle>
            <AlertDescription className="text-amber-800/80 leading-relaxed">
              Adding or removing options will automatically{" "}
              <b>regenerate your variant combinations</b>. This will reset any
              custom prices or inventory set for existing variants.
            </AlertDescription>
          </Alert>

          <AnimatePresence mode="popLayout">
            {options.map((option, index) => {
              // Pick an icon based on option name
              const lowerName = option.name.toLowerCase();
              let Icon = Box;
              if (lowerName.includes("color")) Icon = Palette;
              if (lowerName.includes("size")) Icon = Ruler;
              if (lowerName.includes("material")) Icon = Package;
              if (lowerName.includes("sku") || lowerName.includes("id"))
                Icon = Hash;

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border shadow-none bg-muted/20 hover:bg-muted/30 transition-colors">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-background border flex items-center justify-center shadow-sm">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold tracking-tight uppercase text-muted-foreground/70 text-[10px]">
                              Option {index + 1}
                            </Label>
                            <div className="text-sm font-bold flex items-center gap-2">
                              {option.name}
                              <Badge
                                variant="outline"
                                className="text-[10px] h-4 px-1 font-normal opacity-70"
                              >
                                {option.values.length} values
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(option.id)}
                          className="text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-3 pl-11">
                        <div className="flex flex-wrap gap-2">
                          <AnimatePresence mode="popLayout">
                            {option.values.map((val) => (
                              <motion.div
                                key={val.id}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                              >
                                <ValueBadge
                                  value={val.value}
                                  onRemove={() =>
                                    removeValueFromOption(option.id, val.id)
                                  }
                                  onUpdate={(newValue) =>
                                    updateOptionValue(
                                      option.id,
                                      val.id,
                                      newValue,
                                    )
                                  }
                                />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        <div className="flex gap-2 group pt-1">
                          <div className="relative flex-1">
                            <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground opacity-50 group-focus-within:text-primary group-focus-within:opacity-100 transition-all" />
                            <Input
                              placeholder={`Add value for ${option.name}...`}
                              value={newValues[option.id] || ""}
                              onChange={(e) =>
                                setNewValues({
                                  ...newValues,
                                  [option.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddValue(option.id);
                                }
                              }}
                              className="bg-background h-9 pl-8 text-sm focus-visible:ring-primary/20"
                            />
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAddValue(option.id)}
                            type="button"
                            disabled={!newValues[option.id]}
                            className="h-9 px-3"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <motion.div
            layout
            className="flex gap-2 items-center p-4 border border-dashed rounded-lg bg-muted/10"
          >
            <div className="flex-1">
              <Popover
                open={openOptionList}
                onOpenChange={setOpenOptionList}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openOptionList}
                    className="w-full justify-between bg-background border-input hover:bg-background hover:text-foreground"
                  >
                    {newOptionName
                      ? newOptionName
                      : "Select or type option name..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[300px] p-0 overflow-visible z-500 "
                  align="start"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search options..."
                      value={newOptionName}
                      onValueChange={setNewOptionName}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <button
                          className="w-full text-left px-2 py-1 text-sm text-primary hover:underline"
                          onClick={() => {
                            handleAddOption();
                            setOpenOptionList(false);
                          }}
                        >
                          Create "{newOptionName}"
                        </button>
                      </CommandEmpty>
                      <CommandGroup heading="Suggestions">
                        {COMMON_OPTIONS.map((opt) => (
                          <CommandItem
                            key={opt}
                            value={opt}
                            onSelect={(currentValue) => {
                              setNewOptionName(
                                currentValue === newOptionName
                                  ? ""
                                  : currentValue,
                              );
                              setOpenOptionList(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                newOptionName === opt
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {opt}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button
              onClick={handleAddOption}
              type="button"
              disabled={!newOptionName}
              size="sm"
              variant="ghost"
              className="text-primary hover:text-primary/90 hover:bg-primary/10"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Option
            </Button>
          </motion.div>
        </div>
      )}

      {variants.length === 0 && showOnly === "table" && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-muted/10 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
            <Layers className="w-8 h-8 text-primary/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No Variants Found</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
            Please add variants option to maintain inventory. Head over to the{" "}
            <b>Options</b> tab to get started.
          </p>
          <Button
            onClick={() => onTabChange?.("options")}
            className="gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Your First Option
          </Button>
        </div>
      )}

      {variants.length > 0 && (showOnly === "all" || showOnly === "table") && (
        <div
          className={cn(
            "space-y-4",
            showOnly === "table" ? "" : "pt-6 border-t",
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Product Variants
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 h-5 font-medium text-[10px] uppercase tracking-wider"
                >
                  {variants.length} Combinations
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage price, inventory, and individual variant details.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Settings2 className="w-4 h-4" />
                    Bulk Actions
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="grid gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start font-normal"
                      onClick={() =>
                        batchUpdateVariants("externalLink", baseLink)
                      }
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Sync all links
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start font-normal"
                      onClick={() => batchUpdateVariants("isOutOfStock", false)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark all in stock
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start font-normal text-destructive hover:text-destructive"
                      onClick={() => batchUpdateVariants("isOutOfStock", true)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Mark all out of stock
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="border rounded-xl overflow-hidden bg-background shadow-sm ring-1 ring-border/50">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="w-[80px] text-center">Image</TableHead>
                  <TableHead>Variant Details</TableHead>
                  <TableHead className="w-[120px]">Price</TableHead>
                  <TableHead className="w-[160px]">
                    <div className="flex items-center gap-2">
                      SKU
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-primary/10 hover:text-primary transition-colors"
                        title="Regenerate all SKUs"
                        onClick={() => {
                          variants.forEach((v) => {
                            const autoSku = v.title
                              .toUpperCase()
                              .replace(/ \/ /g, "-")
                              .replace(/[^A-Z0-9-]/g, "");
                            updateVariant(v.id, "sku", autoSku);
                          });
                          toast.success(
                            "SKUs regenerated based on variant titles",
                          );
                        }}
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span className="sr-only">Regenerate SKUs</span>
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="w-[180px]">
                    Inventory & Status
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant) => (
                  <TableRow key={variant.id} className="group hover:bg-muted/5">
                    <TableCell className="text-center">
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 overflow-hidden rounded-lg border shadow-sm p-0 group-hover:border-primary/50 transition-colors"
                          >
                            {variant.image ? (
                              <img
                                src={resolveCdnUrl(variant.image)}
                                alt={variant.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full w-full bg-muted/30">
                                <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                              </div>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-80 p-0 z-100"
                          align="start"
                        >
                          <div className="p-4 space-y-3">
                            <div>
                              <h4 className="font-semibold text-sm">
                                Variant Image
                              </h4>
                              <p className="text-[10px] text-muted-foreground">
                                Upload a specific image for {variant.title}
                              </p>
                            </div>
                            <ImageUploadWithCrop
                              currentImage={variant.image}
                              onImageUpdate={(url) =>
                                updateVariant(variant.id, "image", url)
                              }
                              aspectRatio={1}
                              recommendedWidth={2048}
                              recommendedHeight={2048}
                              label=""
                              returnKeyOnly={true}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <div className="font-semibold text-sm flex items-center gap-2">
                          {variant.title}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(variant.options).map(([key, val]) => (
                            <Badge
                              key={key}
                              variant="secondary"
                              className="text-[9px] px-1 py-0 h-3.5 font-normal bg-muted/40"
                            >
                              {key}: {val}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="relative group/price">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground group-focus-within/price:text-primary">
                          $
                        </span>
                        <Input
                          className="h-9 pl-6 pr-2 bg-transparent border-transparent hover:border-border focus:border-primary transition-all font-medium text-sm"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(variant.id, "price", e.target.value)
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        className="h-9 bg-transparent border-transparent hover:border-border focus:border-primary transition-all text-xs font-mono tracking-tight"
                        placeholder="SKU"
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(variant.id, "sku", e.target.value)
                        }
                        disabled={variant.isOutOfStock}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-20">
                          <Input
                            type="number"
                            className="h-9 pr-7 bg-transparent border-transparent hover:border-border focus:border-primary text-sm font-medium transition-all"
                            value={variant.inventory || 0}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "inventory",
                                parseInt(e.target.value) || 0,
                              )
                            }
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground font-semibold uppercase tracking-tighter opacity-50">
                            QTY
                          </span>
                        </div>
                        <div className="flex items-center gap-2 border-l pl-3 py-1">
                          <Switch
                            checked={!variant.isOutOfStock}
                            onCheckedChange={(checked) =>
                              updateVariant(
                                variant.id,
                                "isOutOfStock",
                                !checked,
                              )
                            }
                            className="scale-90"
                          />
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase transition-colors",
                              variant.isOutOfStock
                                ? "text-destructive"
                                : "text-emerald-500",
                            )}
                          >
                            {variant.isOutOfStock ? "Out" : "In"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-full"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          className="w-80 p-4 z-100 rounded-xl shadow-xl"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-primary/10">
                                <LinkIcon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">
                                  Variant Link
                                </h4>
                                <p className="text-[10px] text-muted-foreground">
                                  Redirect users to a specific page
                                </p>
                              </div>
                            </div>
                            <Input
                              value={variant.externalLink || ""}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "externalLink",
                                  e.target.value,
                                )
                              }
                              placeholder="https://store.com/product-red"
                              className="h-9 text-xs focus-visible:ring-primary/20"
                            />
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 text-[10px] text-muted-foreground leading-relaxed">
                              <Box className="w-4 h-4 shrink-0 opacity-50" />
                              If left blank, this variant will share the primary
                              product link.
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

function ValueBadge({
  value,
  onRemove,
  onUpdate,
}: {
  value: string;
  onRemove: () => void;
  onUpdate: (val: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (tempValue.trim() && tempValue !== value) {
      onUpdate(tempValue.trim());
    } else {
      setTempValue(value); // Revert if empty or unchanged
    }
    setIsEditing(false);
  };

  if (isEditing) {
    // eslint-disable-next-line
    return (
      <Input
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") {
            setTempValue(value);
            setIsEditing(false);
          }
        }}
        className="h-7 w-20 px-2 py-0 text-sm bg-background"
      />
    );
  }

  return (
    <Badge
      variant="secondary"
      className="px-3 py-1 text-sm font-normal border bg-background hover:bg-muted cursor-pointer group transition-all duration-200 hover:shadow-sm"
      onClick={() => setIsEditing(true)}
    >
      <span className="max-w-[120px] truncate">{value}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-2 -mr-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95"
        type="button"
      >
        <X className="w-3 h-3" />
      </button>
    </Badge>
  );
}
