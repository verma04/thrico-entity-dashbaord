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
  const { data, loading, error } = useQuery(GET_ORGANIZATION);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[100px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600"></div>
      </div>
    );
  }

  const organization = data?.getEntity;

  return (
    <div
      className="px-6 py-4 flex justify-between items-center"
      style={{
        background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="px-3 py-2 rounded-lg backdrop-blur-sm bg-white/20"
          style={{
            borderRadius: `${theme.borderRadius}px`,
          }}
        >
          <h1 className="text-white font-bold text-lg">
            {organization?.name || "Organization"}
          </h1>
        </div>
        <button className="text-white hover:bg-white/20 p-2 rounded transition">
          <Menu size={20} />
        </button>
      </div>

      <div className="flex gap-3 items-center">
        {organization?.subscription && (
          <div
            className="px-2 py-1 text-xs font-semibold text-white bg-white/20 rounded backdrop-blur-sm"
            style={{
              borderRadius: `${(theme.borderRadius ?? 8) / 2}px`,
            }}
          >
            {organization.subscription.planName}
          </div>
        )}
        <div className="relative">
          <Input
            placeholder="Search..."
            className="w-48 bg-white/90 placeholder:text-slate-600"
            style={{
              borderRadius: `${theme.borderRadius}px`,
            }}
          />
          <SearchIcon
            className="absolute right-3 top-2.5 text-slate-400"
            size={18}
          />
        </div>
        <div className="relative">
          <Avatar className="w-9 h-9 border-2 border-white/30" />
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
            3
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default WebsiteHeader;
