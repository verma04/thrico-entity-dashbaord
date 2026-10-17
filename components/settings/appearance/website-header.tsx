"use client";

import type React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, Menu } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_ORGANIZATION } from "@/graphql/quries";
import type { EntityTheme } from "@/store/ts-types";

interface WebsiteHeaderProps {
  theme: EntityTheme;
}

const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({ theme }) => {
  const { data, loading } = useQuery(GET_ORGANIZATION);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[100px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-primary"></div>
      </div>
    );
  }

  const organization = data?.getEntity;
  const navbarBg =
    theme.Navbar?.navbarBg ||
    `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`;
  const navbarTextColor = theme.Navbar?.navbarTextColor || "#ffffff";
  const navbarBorderColor = theme.Navbar?.navbarBorderColor || "transparent";
  const navbarLogo = theme.Navbar?.navbarLogo;

  return (
    <div
      className="px-6 py-4 flex justify-between items-center transition-colors border-b"
      style={{
        background: navbarBg,
        borderColor: navbarBorderColor,
        color: navbarTextColor,
      }}
    >
      <div className="flex items-center gap-4">
        {navbarLogo ? (
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={navbarLogo}
              alt="Navbar Logo"
              className="h-8 max-w-[160px] object-contain"
            />
          </div>
        ) : (
          <div
            className="px-3 py-2 rounded-lg backdrop-blur-sm bg-card/20"
            style={{
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            <h1
              className="font-bold text-lg leading-tight"
              style={{ color: navbarTextColor }}
            >
              {organization?.name || "Organization"}
            </h1>
          </div>
        )}
        <button
          type="button"
          className="hover:opacity-80 p-2 rounded transition cursor-pointer"
          style={{ color: navbarTextColor }}
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex gap-3 items-center">
        {organization?.subscription && (
          <div
            className="px-2 py-1 text-xs font-semibold rounded backdrop-blur-sm opacity-90"
            style={{
              borderRadius: `${(theme.borderRadius ?? 8) / 2}px`,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: navbarTextColor,
            }}
          >
            {organization.subscription.planName}
          </div>
        )}
        <div className="relative">
          <Input
            placeholder="Search..."
            className="w-48 bg-card/90 placeholder:text-muted-foreground text-xs h-8"
            style={{
              borderRadius: `${theme.borderRadius}px`,
            }}
          />
          <SearchIcon
            className="absolute right-2.5 top-2 text-muted-foreground"
            size={16}
          />
        </div>
        <div className="relative">
          <Avatar className="w-8 h-8 border-2 border-white/30" />
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 py-0">
            3
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default WebsiteHeader;
