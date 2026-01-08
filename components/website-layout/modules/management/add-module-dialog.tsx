import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsPremium } from "@/hooks/useIsPremium";
import { AVAILABLE_MODULES, BASIC_MODULE_TYPES } from "./constants";
import { useModuleCreation } from "../../hooks/use-module-creation";

interface AddModuleDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function AddModuleDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: AddModuleDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange = setControlledOpen || setInternalOpen;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { isPremium } = useIsPremium();
  const { handleAddModule, isCreating } = useModuleCreation();
  const [creatingModuleType, setCreatingModuleType] = useState<string | null>(
    null
  );

  const categories = useMemo(
    () => Array.from(new Set(AVAILABLE_MODULES.map((m) => m.category))).sort(),
    []
  );

  const filteredModules = useMemo(() => {
    return AVAILABLE_MODULES.filter((module) => {
      const matchesSearch =
        searchQuery === "" ||
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || module.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedModules = useMemo(() => {
    return categories.reduce((acc, category) => {
      const categoryModules = filteredModules.filter(
        (m) => m.category === category
      );
      if (categoryModules.length > 0) {
        acc[category] = categoryModules;
      }
      return acc;
    }, {} as Record<string, typeof filteredModules>);
  }, [categories, filteredModules]);

  const onAddModule = async (item: (typeof AVAILABLE_MODULES)[0]) => {
    if (isCreating) return;

    const isPremiumModule = !BASIC_MODULE_TYPES.includes(item.type);
    setCreatingModuleType(item.type);

    try {
      const success = await handleAddModule(
        item.type,
        item.name,
        item.defaultLayout,
        isPremiumModule
      );
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setCreatingModuleType(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
          >
            <PlusCircle className="h-3 w-3" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="z-[2000] max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
          <DialogDescription>
            Choose a module to add to this page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="h-7 text-xs"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="h-7 text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[50vh] space-y-6">
          {Object.entries(groupedModules).map(([category, modules]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background/95 backdrop-blur py-2 border-b">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modules.map((item) => {
                  const IconComponent = item.icon;
                  const isPremiumModule = !BASIC_MODULE_TYPES.includes(
                    item.type
                  );
                  const isLocked = isPremiumModule && !isPremium;

                  return (
                    <button
                      key={item.type}
                      onClick={() => onAddModule(item)}
                      disabled={isCreating}
                      className={cn(
                        "flex items-start gap-3 p-4 border rounded-xl transition-all text-left group relative",
                        isLocked
                          ? "opacity-60 cursor-not-allowed hover:border-muted-foreground/30"
                          : isCreating && creatingModuleType === item.type
                          ? "border-primary bg-primary/5 cursor-wait"
                          : "hover:border-primary hover:bg-primary/5",
                        isCreating &&
                          creatingModuleType !== item.type &&
                          "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isCreating && creatingModuleType === item.type && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl z-10">
                          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "flex-shrink-0 p-2 rounded-lg transition-colors",
                          isLocked
                            ? "bg-muted/50"
                            : "bg-muted group-hover:bg-primary/10"
                        )}
                      >
                        {React.createElement(IconComponent, {
                          className: cn(
                            "h-5 w-5 transition-colors",
                            isLocked
                              ? "text-muted-foreground/50"
                              : "text-muted-foreground group-hover:text-primary"
                          ),
                        })}
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "font-semibold text-sm transition-colors block",
                              isLocked
                                ? "text-muted-foreground"
                                : "group-hover:text-primary"
                            )}
                          >
                            {item.name}
                          </span>
                          {isPremiumModule && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1">
                              <Lock className="h-2.5 w-2.5" />
                              Premium
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground leading-relaxed block">
                          {item.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {Object.keys(groupedModules).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No modules found matching your search.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
