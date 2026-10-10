"use client";

import { useState } from "react";
import {
  Home,
  Users,
  Calendar,
  Compass,
  LayoutDashboard,
  User,
  Bell,
  Search,
  MessageSquare,
  Settings,
  Briefcase,
  Store,
  GraduationCap,
  Sparkles,
  Wifi,
  Battery,
} from "lucide-react";
import type { EntityTheme } from "@/store/ts-types";
import { cn } from "@/lib/utils";

interface MobileDevicePreviewProps {
  theme: EntityTheme;
  activeView?: "tabbar" | "drawer" | "sheet";
}

export const MobileDevicePreview: React.FC<MobileDevicePreviewProps> = ({
  theme,
  activeView,
}) => {
  const [prevActiveView, setPrevActiveView] = useState(activeView);
  const [mobileView, setMobileView] = useState<"tabbar" | "drawer" | "sheet">(
    activeView || "tabbar"
  );
  const [activeTab, setActiveTab] = useState("home");

  if (activeView && activeView !== prevActiveView) {
    setPrevActiveView(activeView);
    setMobileView(activeView);
  }

  // Navigation tokens with fallbacks
  const navBg = theme.Navigation?.tabBg || "#ffffff";
  const navActiveColor = theme.Navigation?.tabActiveColor || theme.primaryColor || "#3b82f6";
  const navActiveBg = theme.Navigation?.tabActiveBg || "rgba(59, 130, 246, 0.1)";
  const navInactiveColor = theme.Navigation?.tabInactiveColor || "#64748b";
  const navBorderColor = theme.Navigation?.tabBorderColor || theme.borderColor || "#e2e8f0";
  const navStyle = theme.Navigation?.tabStyle || "pill";
  const navIndicatorColor = theme.Navigation?.tabIndicatorColor || navActiveColor;
  const navBadgeBg = theme.Navigation?.tabBadgeBg || "#ef4444";
  const navBadgeColor = theme.Navigation?.tabBadgeColor || "#ffffff";
  const tabSize = theme.Navigation?.tabSize || "md";

  // Sidebar tokens with fallbacks
  const sidebarBg = theme.Sidebar?.sidebarBg || "#ffffff";
  const sidebarTextColor = theme.Sidebar?.sidebarTextColor || "#334155";
  const sidebarActiveColor = theme.Sidebar?.sidebarActiveColor || theme.primaryColor || "#3b82f6";
  const sidebarActiveBg = theme.Sidebar?.sidebarActiveBg || "rgba(59, 130, 246, 0.08)";
  const sidebarBorderColor = theme.Sidebar?.sidebarBorderColor || theme.borderColor || "#e2e8f0";
  const sidebarHeaderBg = theme.Sidebar?.sidebarHeaderBg || "#f8fafc";

  // Bottom sheet tokens with fallbacks
  const sheetBg = theme.BottomSheet?.sheetBg || "#f8fafc";
  const sheetHandleColor = theme.BottomSheet?.sheetHandleColor || "#cbd5e1";
  const sheetRadius = theme.BottomSheet?.sheetBorderRadius ?? 28;
  const sheetHeaderBg = theme.BottomSheet?.sheetHeaderBg || "#ffffff";
  const sheetHeaderTextColor = theme.BottomSheet?.sheetHeaderTextColor || "#0f172a";
  const sheetBorderColor = theme.BottomSheet?.sheetBorderColor || "#f1f5f9";

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "networks", label: "Networks", icon: Compass },
    { id: "communities", label: "Communities", icon: Users, badge: 3 },
    { id: "events", label: "Events", icon: Calendar },
    { id: "menu", label: "Menu", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
  ];

  const modules = [
    { name: "Networks", icon: Compass },
    { name: "Communities", icon: Users },
    { name: "Events", icon: Calendar },
    { name: "Jobs", icon: Briefcase },
    { name: "Shop", icon: Store },
    { name: "Mentorship", icon: GraduationCap },
  ];

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Mobile View Mode Switcher Pills */}
      <div className="flex items-center gap-1 p-1 bg-muted/60 border border-border/50 rounded-lg shadow-2xs">
        {([
          { id: "tabbar" as const, label: "Tab Bar View" },
          { id: "drawer" as const, label: "Sidebar Drawer" },
          { id: "sheet" as const, label: "Bottom Sheet" },
        ]).map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setMobileView(v.id)}
            className={cn(
              "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer",
              mobileView === v.id
                ? "bg-card text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Realistic Smartphone Chassis */}
      <div className="w-full max-w-[320px] rounded-[40px] border-[5px] border-slate-900 bg-slate-950 p-2 shadow-2xl relative">
        {/* Screen Bezel */}
        <div
          className="w-full h-[540px] rounded-[32px] overflow-hidden flex flex-col relative"
          style={{ backgroundColor: theme.backgroundColor || "#ffffff" }}
        >
          {/* Status Bar */}
          <div className="pt-2 px-5 flex items-center justify-between text-[11px] font-semibold text-slate-800 shrink-0 select-none z-30">
            <span>9:41</span>
            {/* Dynamic Island Pill */}
            <div className="h-4 w-20 rounded-full bg-slate-900" />
            <div className="flex items-center gap-1.5 text-slate-700">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Mobile App Header */}
          <div
            className="flex items-center justify-between px-3.5 py-2.5 border-b shrink-0 z-20"
            style={{ borderColor: theme.borderColor || "#e2e8f0" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-2xs"
                style={{ backgroundColor: theme.primaryColor }}
              >
                T
              </div>
              <span
                className="text-xs font-bold truncate max-w-[120px]"
                style={{ color: theme.textColor }}
              >
                Thrico Mobile
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <button
                type="button"
                onClick={() => setMobileView("drawer")}
                className="p-1 rounded-full hover:bg-muted/50 cursor-pointer"
                title="Preview Sidebar Drawer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
              <div className="p-1 relative">
                <Bell className="w-3.5 h-3.5" />
                <span
                  className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: navBadgeBg }}
                />
              </div>
            </div>
          </div>

          {/* Screen Content (Feed) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {/* Banner Story Card */}
            <div
              className="p-3 rounded-xl border flex items-center gap-2.5 shadow-2xs"
              style={{
                backgroundColor: theme.inputBackground || "#f8fafc",
                borderColor: theme.borderColor || "#e2e8f0",
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold truncate" style={{ color: theme.textColor }}>
                  Community Highlights
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  Explore trending topics and new updates
                </p>
              </div>
            </div>

            {/* Sample Post Card */}
            <div
              className="p-3 rounded-xl border space-y-2 shadow-2xs"
              style={{
                backgroundColor: "#ffffff",
                borderColor: theme.borderColor || "#e2e8f0",
                boxShadow: theme.boxShadow || "none",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: theme.secondaryColor || theme.primaryColor }}
                >
                  JD
                </div>
                <div>
                  <p className="text-[11px] font-semibold" style={{ color: theme.textColor }}>
                    Jane Doe
                  </p>
                  <p className="text-[9px] text-muted-foreground">Product Designer • 2h ago</p>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: theme.textColor }}>
                Excited to share the updated design tokens for our mobile navigation!
              </p>
              <div className="flex gap-1.5 pt-1">
                <span
                  className="text-[9.5px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${theme.primaryColor}15`,
                    color: theme.primaryColor,
                  }}
                >
                  #design
                </span>
                <span
                  className="text-[9.5px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${theme.secondaryColor}15`,
                    color: theme.secondaryColor,
                  }}
                >
                  #mobile
                </span>
              </div>
            </div>

            {/* Quick module prompt */}
            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={() => setMobileView(mobileView === "sheet" ? "tabbar" : "sheet")}
                className="text-[10.5px] text-primary hover:underline font-medium cursor-pointer"
              >
                {mobileView === "sheet" ? "Close bottom sheet preview" : "Tap to test bottom sheet"}
              </button>
            </div>
          </div>

          {/* ── Tab Bar (Bottom Navbar) ── */}
          <div
            className={cn(
              "shrink-0 z-30 transition-all",
              navStyle === "floating" ? "p-2 pb-3" : "",
            )}
          >
            <div
              className={cn(
                "grid items-center px-1 border-t transition-all",
                tabSize === "sm" ? "h-12" : tabSize === "lg" ? "h-16" : "h-14",
                navStyle === "floating"
                  ? "rounded-2xl border shadow-lg mx-1"
                  : "",
              )}
              style={{
                gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))`,
                backgroundColor: navBg,
                borderColor: navBorderColor,
              }}
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.id === "menu") setMobileView("sheet");
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center space-y-0.5 text-xs transition-colors py-1 relative cursor-pointer",
                      isActive && navStyle === "pill" && "rounded-lg",
                    )}
                    style={{
                      color: isActive ? navActiveColor : navInactiveColor,
                      backgroundColor: isActive && navStyle === "pill" ? navActiveBg : "transparent",
                    }}
                  >
                    {/* Active Line Indicator for 'line' style */}
                    {isActive && navStyle === "line" && (
                      <span
                        className="absolute top-0 w-4 h-0.5 rounded-full"
                        style={{ backgroundColor: navIndicatorColor }}
                      />
                    )}

                    <div className="relative">
                      <Icon
                        className={cn(
                          "transition-transform",
                          tabSize === "sm" ? "w-3.5 h-3.5" : tabSize === "lg" ? "w-4.5 h-4.5" : "w-4 h-4",
                        )}
                        style={{
                          color: isActive ? navActiveColor : navInactiveColor,
                        }}
                      />
                      {"badge" in item && item.badge !== undefined && (
                        <span
                          className="absolute -top-1.5 -right-2 px-1 min-w-3.5 h-3.5 rounded-full text-[8.5px] font-bold flex items-center justify-center leading-none shadow-xs"
                          style={{
                            backgroundColor: navBadgeBg,
                            color: navBadgeColor,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "truncate max-w-full text-center leading-tight",
                        tabSize === "sm" ? "text-[8.5px]" : tabSize === "lg" ? "text-[10px]" : "text-[9.5px]",
                      )}
                      style={{
                        color: isActive ? navActiveColor : navInactiveColor,
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {item.label}
                    </span>

                    {/* Active dot indicator for 'minimal' style */}
                    {isActive && navStyle === "minimal" && (
                      <span
                        className="w-1 h-1 rounded-full mt-0.5"
                        style={{ backgroundColor: navIndicatorColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Slide-Over Sidebar Drawer Preview ── */}
          {mobileView === "drawer" && (
            <div className="absolute inset-0 bg-black/40 z-40 flex">
              <div
                className="w-4/5 h-full flex flex-col shadow-2xl border-r animate-in slide-in-from-left duration-200"
                style={{
                  backgroundColor: sidebarBg,
                  borderColor: sidebarBorderColor,
                }}
              >
                {/* User Profile Card */}
                <div
                  className="p-3.5 border-b"
                  style={{
                    backgroundColor: sidebarHeaderBg,
                    borderColor: sidebarBorderColor,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-2xs"
                      style={{ backgroundColor: sidebarActiveColor }}
                    >
                      JD
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold truncate" style={{ color: sidebarTextColor }}>
                        Jane Doe
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">jane@example.com</p>
                    </div>
                  </div>
                </div>

                {/* Nav Links */}
                <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                  {[
                    { label: "My Communities", icon: Users, active: true },
                    { label: "Events", icon: Calendar, active: false },
                    { label: "Messages", icon: MessageSquare, active: false },
                    { label: "Settings", icon: Settings, active: false },
                  ].map((m, idx) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer"
                        style={{
                          backgroundColor: m.active ? sidebarActiveBg : "transparent",
                          color: m.active ? sidebarActiveColor : sidebarTextColor,
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Close Drawer Button */}
                <div className="p-3 border-t" style={{ borderColor: sidebarBorderColor }}>
                  <button
                    type="button"
                    onClick={() => setMobileView("tabbar")}
                    className="w-full py-1.5 text-center text-[11px] font-medium rounded-md bg-muted/60 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Close Drawer
                  </button>
                </div>
              </div>

              {/* Backdrop Clicker */}
              <div
                className="flex-1 h-full cursor-pointer"
                onClick={() => setMobileView("tabbar")}
              />
            </div>
          )}

          {/* ── Slide-Up Bottom Sheet Preview ── */}
          {mobileView === "sheet" && (
            <div className="absolute inset-0 bg-black/40 z-40 flex flex-col justify-end">
              <div
                className="w-full h-[78%] flex flex-col overflow-hidden shadow-2xl border-t animate-in slide-in-from-bottom duration-200"
                style={{
                  backgroundColor: sheetBg,
                  borderTopLeftRadius: `${sheetRadius}px`,
                  borderTopRightRadius: `${sheetRadius}px`,
                  borderColor: sheetBorderColor,
                }}
              >
                {/* Handle & Header */}
                <div
                  className="flex flex-col items-center pt-2.5 pb-2 px-4 border-b shrink-0 relative"
                  style={{
                    backgroundColor: sheetHeaderBg,
                    borderColor: sheetBorderColor,
                  }}
                >
                  <div
                    className="w-9 h-1 rounded-full mb-2"
                    style={{ backgroundColor: sheetHandleColor }}
                  />
                  <div className="w-full flex items-center justify-between">
                    <h4
                      className="text-[12.5px] font-bold"
                      style={{ color: sheetHeaderTextColor }}
                    >
                      Explore Modules
                    </h4>
                    <button
                      type="button"
                      onClick={() => setMobileView("tabbar")}
                      className="text-[10.5px] text-muted-foreground hover:text-foreground cursor-pointer font-medium"
                    >
                      Done
                    </button>
                  </div>
                </div>

                {/* Module Grid inside Bottom Sheet */}
                <div className="flex-1 p-3 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-2">
                    {modules.map((mod, i) => {
                      const Icon = mod.icon;
                      return (
                        <div
                          key={i}
                          className="flex flex-col items-center justify-center p-2.5 rounded-xl border bg-white shadow-2xs hover:shadow-xs transition"
                          style={{ borderColor: sheetBorderColor }}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5"
                            style={{
                              backgroundColor: `${theme.primaryColor}15`,
                              color: theme.primaryColor,
                            }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-medium text-slate-700 truncate max-w-full">
                            {mod.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileDevicePreview;
