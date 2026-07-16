"use client";

import type React from "react";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";

import { Grid } from "react-window";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as Icons from "lucide-react";

// Get all icon names dynamically
const allIconNames = Object.keys(Icons)
  .filter((key) => {
    const item = (Icons as any)[key];
    return (
      (key !== "default" &&
        typeof item === "function" &&
        item.displayName !== undefined) ||
      key.charAt(0) === key.charAt(0).toUpperCase()
    );
  })
  .sort();

const createIconCategories = () => {
  const categories: Record<string, string[]> = {
    popular: [
      "Settings",
      "Users",
      "MessageCircle",
      "Bell",
      "Heart",
      "Star",
      "Shield",
      "Zap",
      "Target",
      "Gauge",
      "Activity",
      "BarChart3",
      "PieChart",
      "TrendingUp",
      "Calendar",
      "Clock",
      "Mail",
      "Phone",
      "Camera",
      "Image",
      "Video",
      "Music",
      "Home",
      "User",
      "Search",
      "Plus",
      "Minus",
      "Check",
      "X",
      "Edit",
      "Trash2",
      "Download",
      "Upload",
      "Save",
      "Copy",
      "Share",
      "Lock",
      "Unlock",
      "Eye",
      "EyeOff",
      "ThumbsUp",
      "ThumbsDown",
      "Bookmark",
      "Flag",
      "Tag",
      "Filter",
    ],
    arrows: [],
    ui: [],
    communication: [],
    media: [],
    business: [],
    tech: [],
    files: [],
    navigation: [],
    weather: [],
    transport: [],
    medical: [],
    gaming: [],
    social: [],
    security: [],
    development: [],
    uncategorized: [],
  };

  allIconNames.forEach((iconName) => {
    const lowerName = iconName.toLowerCase();
    let categorized = false;

    if (categories.popular.includes(iconName)) {
      categorized = true;
    } else if (
      lowerName.includes("arrow") ||
      lowerName.includes("chevron") ||
      lowerName.includes("corner") ||
      lowerName.includes("move") ||
      lowerName.includes("flip")
    ) {
      categories.arrows.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("menu") ||
      lowerName.includes("button") ||
      lowerName.includes("toggle") ||
      lowerName.includes("slider") ||
      lowerName.includes("panel") ||
      lowerName.includes("sidebar") ||
      lowerName.includes("layout") ||
      lowerName.includes("grid") ||
      lowerName.includes("list") ||
      lowerName.includes("table") ||
      lowerName.includes("tabs") ||
      lowerName.includes("dialog") ||
      lowerName.includes("modal") ||
      lowerName.includes("popup") ||
      lowerName.includes("tooltip") ||
      lowerName.includes("badge") ||
      lowerName.includes("separator") ||
      lowerName.includes("divider")
    ) {
      categories.ui.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("mail") ||
      lowerName.includes("message") ||
      lowerName.includes("chat") ||
      lowerName.includes("phone") ||
      lowerName.includes("call") ||
      lowerName.includes("send") ||
      lowerName.includes("inbox") ||
      lowerName.includes("bell") ||
      lowerName.includes("notification") ||
      lowerName.includes("at") ||
      lowerName.includes("reply") ||
      lowerName.includes("forward")
    ) {
      categories.communication.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("image") ||
      lowerName.includes("video") ||
      lowerName.includes("music") ||
      lowerName.includes("audio") ||
      lowerName.includes("camera") ||
      lowerName.includes("film") ||
      lowerName.includes("play") ||
      lowerName.includes("pause") ||
      lowerName.includes("stop") ||
      lowerName.includes("record") ||
      lowerName.includes("volume") ||
      lowerName.includes("speaker") ||
      lowerName.includes("headphone") ||
      lowerName.includes("mic") ||
      lowerName.includes("radio")
    ) {
      categories.media.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("shop") ||
      lowerName.includes("cart") ||
      lowerName.includes("credit") ||
      lowerName.includes("dollar") ||
      lowerName.includes("euro") ||
      lowerName.includes("pound") ||
      lowerName.includes("yen") ||
      lowerName.includes("bitcoin") ||
      lowerName.includes("coin") ||
      lowerName.includes("wallet") ||
      lowerName.includes("bank") ||
      lowerName.includes("receipt") ||
      lowerName.includes("invoice") ||
      lowerName.includes("tag") ||
      lowerName.includes("price") ||
      lowerName.includes("package") ||
      lowerName.includes("box") ||
      lowerName.includes("truck") ||
      lowerName.includes("shipping")
    ) {
      categories.business.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("computer") ||
      lowerName.includes("laptop") ||
      lowerName.includes("desktop") ||
      lowerName.includes("tablet") ||
      lowerName.includes("smartphone") ||
      lowerName.includes("monitor") ||
      lowerName.includes("server") ||
      lowerName.includes("database") ||
      lowerName.includes("cloud") ||
      lowerName.includes("wifi") ||
      lowerName.includes("bluetooth") ||
      lowerName.includes("usb") ||
      lowerName.includes("cable") ||
      lowerName.includes("plug") ||
      lowerName.includes("battery") ||
      lowerName.includes("cpu") ||
      lowerName.includes("memory") ||
      lowerName.includes("hard") ||
      lowerName.includes("disk")
    ) {
      categories.tech.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("file") ||
      lowerName.includes("folder") ||
      lowerName.includes("document") ||
      lowerName.includes("page") ||
      lowerName.includes("text") ||
      lowerName.includes("pdf") ||
      lowerName.includes("archive") ||
      lowerName.includes("zip") ||
      lowerName.includes("download") ||
      lowerName.includes("upload") ||
      lowerName.includes("save") ||
      lowerName.includes("copy") ||
      lowerName.includes("paste") ||
      lowerName.includes("cut")
    ) {
      categories.files.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("map") ||
      lowerName.includes("navigation") ||
      lowerName.includes("compass") ||
      lowerName.includes("location") ||
      lowerName.includes("pin") ||
      lowerName.includes("marker") ||
      lowerName.includes("route") ||
      lowerName.includes("direction") ||
      lowerName.includes("gps") ||
      lowerName.includes("globe") ||
      lowerName.includes("world")
    ) {
      categories.navigation.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("sun") ||
      lowerName.includes("moon") ||
      lowerName.includes("cloud") ||
      lowerName.includes("rain") ||
      lowerName.includes("snow") ||
      lowerName.includes("storm") ||
      lowerName.includes("wind") ||
      lowerName.includes("temperature") ||
      lowerName.includes("thermometer") ||
      lowerName.includes("umbrella")
    ) {
      categories.weather.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("car") ||
      lowerName.includes("bus") ||
      lowerName.includes("train") ||
      lowerName.includes("plane") ||
      lowerName.includes("ship") ||
      lowerName.includes("bike") ||
      lowerName.includes("motorcycle") ||
      lowerName.includes("taxi") ||
      lowerName.includes("fuel") ||
      lowerName.includes("parking")
    ) {
      categories.transport.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("heart") ||
      lowerName.includes("medical") ||
      lowerName.includes("health") ||
      lowerName.includes("hospital") ||
      lowerName.includes("pill") ||
      lowerName.includes("syringe") ||
      lowerName.includes("stethoscope") ||
      lowerName.includes("bandage") ||
      lowerName.includes("cross") ||
      lowerName.includes("pulse")
    ) {
      categories.medical.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("game") ||
      lowerName.includes("joystick") ||
      lowerName.includes("controller") ||
      lowerName.includes("dice") ||
      lowerName.includes("puzzle") ||
      lowerName.includes("trophy") ||
      lowerName.includes("award") ||
      lowerName.includes("medal") ||
      lowerName.includes("crown") ||
      lowerName.includes("gift") ||
      lowerName.includes("party")
    ) {
      categories.gaming.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("user") ||
      lowerName.includes("person") ||
      lowerName.includes("people") ||
      lowerName.includes("group") ||
      lowerName.includes("team") ||
      lowerName.includes("contact") ||
      lowerName.includes("profile") ||
      lowerName.includes("avatar") ||
      lowerName.includes("face") ||
      lowerName.includes("smile") ||
      lowerName.includes("laugh") ||
      lowerName.includes("frown")
    ) {
      categories.social.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("lock") ||
      lowerName.includes("unlock") ||
      lowerName.includes("key") ||
      lowerName.includes("shield") ||
      lowerName.includes("security") ||
      lowerName.includes("password") ||
      lowerName.includes("fingerprint") ||
      lowerName.includes("scan") ||
      lowerName.includes("verify") ||
      lowerName.includes("auth")
    ) {
      categories.security.push(iconName);
      categorized = true;
    } else if (
      lowerName.includes("code") ||
      lowerName.includes("terminal") ||
      lowerName.includes("console") ||
      lowerName.includes("command") ||
      lowerName.includes("git") ||
      lowerName.includes("branch") ||
      lowerName.includes("merge") ||
      lowerName.includes("commit") ||
      lowerName.includes("bug") ||
      lowerName.includes("debug") ||
      lowerName.includes("api") ||
      lowerName.includes("webhook") ||
      lowerName.includes("function")
    ) {
      categories.development.push(iconName);
      categorized = true;
    }

    if (!categorized) {
      categories.uncategorized.push(iconName);
    }
  });

  categories.all = [...allIconNames];
  Object.keys(categories).forEach((key) => {
    categories[key].sort();
  });
  return categories;
};

const iconCategories = createIconCategories();

export interface IconSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (iconName: string) => void;
  selectedIcon?: string;
}

interface IconCellData {
  icons: string[];
  columnsPerRow: number;
  onSelect: (iconName: string) => void;
  selectedIcon?: string;
  onCopyName: (iconName: string) => void;
}

interface IconCellProps extends IconCellData {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
}

const IconCell = ({
  columnIndex,
  rowIndex,
  style,
  icons,
  columnsPerRow,
  onSelect,
  selectedIcon,
  onCopyName,
}: IconCellProps & { ariaAttributes?: any }) => {
  const index = rowIndex * columnsPerRow + columnIndex;
  const iconName = icons[index];

  if (!iconName) return <div style={style} />;
  const IconComponent = (Icons as any)[iconName];
  if (!IconComponent) return <div style={style} />;

  const isSelected = selectedIcon === iconName;

  return (
    <div style={style} className="p-1">
      <div
        className={`group relative flex flex-col items-center p-2 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 h-full ${
          isSelected
            ? "border-primary bg-primary/10 ring-1 ring-primary/20"
            : "hover:border-muted-foreground/20"
        }`}
        onClick={() => onSelect(iconName)}
        title={iconName}
      >
        <div className="mb-1 flex items-center justify-center h-6">
          <IconComponent className="w-5 h-5" />
        </div>
        <span className="text-xs text-center font-mono break-all leading-tight">
          {iconName.length > 8 ? `${iconName.slice(0, 8)}...` : iconName}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onCopyName(iconName);
          }}
          title="Copy icon name"
        >
          <Copy className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export function IconSelector({
  open,
  onOpenChange,
  onSelect,
  selectedIcon,
}: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("popular");
  const [recentIcons, setRecentIcons] = useState<string[]>([]);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recent-icons");
    if (saved) {
      try {
        setRecentIcons(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (recentIcons.length > 0) {
      localStorage.setItem("recent-icons", JSON.stringify(recentIcons));
    }
  }, [recentIcons]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(searchTerm), 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  const filteredIcons = useMemo(() => {
    let icons =
      iconCategories[activeCategory as keyof typeof iconCategories] || [];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      icons = icons.filter((iconName) => {
        const nameLower = iconName.toLowerCase();
        if (nameLower.includes(searchLower)) return true;
        let searchIndex = 0;
        for (
          let i = 0;
          i < nameLower.length && searchIndex < searchLower.length;
          i++
        ) {
          if (nameLower[i] === searchLower[searchIndex]) searchIndex++;
        }
        return searchIndex === searchLower.length;
      });

      icons.sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const sl = debouncedSearch.toLowerCase();
        if (aLower === sl && bLower !== sl) return -1;
        if (bLower === sl && aLower !== sl) return 1;
        if (aLower.startsWith(sl) && !bLower.startsWith(sl)) return -1;
        if (bLower.startsWith(sl) && !aLower.startsWith(sl)) return 1;
        if (aLower.includes(sl) && !bLower.includes(sl)) return -1;
        if (bLower.includes(sl) && !aLower.includes(sl)) return 1;
        return a.localeCompare(b);
      });
    }

    return icons;
  }, [debouncedSearch, activeCategory]);

  const getGridConfig = () => {
    const containerWidth = Math.min(window.innerWidth * 0.8, 1000);
    const cellWidth = 90;
    const columnsPerRow = Math.max(4, Math.floor(containerWidth / cellWidth));
    return { columnsPerRow, cellWidth, cellHeight: 90, containerWidth };
  };

  const [gridConfig, setGridConfig] = useState(getGridConfig);

  useEffect(() => {
    const handleResize = () => setGridConfig(getGridConfig());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rowCount = Math.ceil(filteredIcons.length / gridConfig.columnsPerRow);

  const handleSelect = useCallback(
    (iconName: string) => {
      onSelect(iconName);
      setRecentIcons((prev) =>
        [iconName, ...prev.filter((n) => n !== iconName)].slice(0, 20),
      );
      onOpenChange(false);
    },
    [onSelect, onOpenChange],
  );

  const handleCopyName = useCallback((iconName: string) => {
    navigator.clipboard.writeText(iconName);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  }, []);

  const gridData: IconCellData = useMemo(
    () => ({
      icons: filteredIcons,
      columnsPerRow: gridConfig.columnsPerRow,
      onSelect: handleSelect,
      selectedIcon,
      onCopyName: handleCopyName,
    }),
    [
      filteredIcons,
      gridConfig.columnsPerRow,
      handleSelect,
      selectedIcon,
      handleCopyName,
    ],
  );

  const categoryStats = useMemo(() => {
    return Object.entries(iconCategories)
      .map(([key, icons]) => ({
        key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        count: icons.length,
      }))
      .sort((a, b) => (a.key === "all" ? -1 : b.key === "all" ? 1 : 0));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Select Icon</span>
            <Badge variant="outline" className="text-xs">
              {allIconNames.length} total icons
            </Badge>
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Choose from {allIconNames.length} Lucide React icons. Click to
            select, hover to copy name.
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search icons... (fuzzy: 'usr' → 'User')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {copiedIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-green-600">
                <Check className="w-4 h-4 mr-1" />
                <span className="text-xs">Copied {copiedIcon}</span>
              </div>
            )}
          </div>

          {/* Recent Icons */}
          {recentIcons.length > 0 &&
            activeCategory === "popular" &&
            !searchTerm && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium">Recently Used</h4>
                  <Badge variant="secondary" className="text-xs">
                    {recentIcons.length}
                  </Badge>
                </div>
                <ScrollArea className="w-full">
                  <div className="flex space-x-2 pb-2">
                    {recentIcons.slice(0, 15).map((iconName) => {
                      const IconComponent = (Icons as any)[iconName];
                      if (!IconComponent) return null;
                      return (
                        <div
                          key={iconName}
                          className={`flex flex-col items-center p-2 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors min-w-[60px] ${
                            selectedIcon === iconName
                              ? "border-primary bg-primary/10"
                              : ""
                          }`}
                          onClick={() => handleSelect(iconName)}
                          title={iconName}
                        >
                          <IconComponent className="w-5 h-5 mb-1" />
                          <span className="text-xs text-center">
                            {iconName.slice(0, 6)}...
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}

          {/* Category Tabs */}
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="relative">
              <ScrollArea
                className="w-full whitespace-nowrap"
                orientation="horizontal"
              >
                <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max">
                  {categoryStats.map(({ key, name, count }) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      {name}
                      <Badge
                        variant="secondary"
                        className="ml-2 text-xs px-1.5 py-0.5 h-5"
                      >
                        {count}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>

            {categoryStats.map(({ key }) => (
              <TabsContent
                key={key}
                value={key}
                className="flex-1 min-h-0 mt-4"
              >
                <div className="h-full">
                  {filteredIcons.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm
                            ? `No icons found matching "${searchTerm}"`
                            : "No icons in this category"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Grid
                      columnCount={gridConfig.columnsPerRow}
                      columnWidth={gridConfig.cellWidth}
                      rowCount={rowCount}
                      rowHeight={gridConfig.cellHeight}
                      cellComponent={IconCell as any}
                      cellProps={gridData as any}
                      style={{
                        height: 500,
                        width: gridConfig.containerWidth,
                      }}
                    />
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Stats */}
          <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
            <div className="flex space-x-4">
              <span>
                Showing {filteredIcons.length} of{" "}
                {iconCategories[activeCategory as keyof typeof iconCategories]
                  ?.length || 0}{" "}
                icons
              </span>
              {searchTerm && (
                <span className="text-blue-600">Search: "{searchTerm}"</span>
              )}
            </div>
            <div className="flex space-x-4">
              <span>Total: {allIconNames.length} icons</span>
              <span>Recent: {recentIcons.length}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
