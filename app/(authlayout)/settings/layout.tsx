"use client";

import React from "react";
import {
  ArrowUpRight,
  Blocks,
  Earth,
  FileStack,
  HandCoins,
  Headset,
  Fingerprint,
  Languages,
  ListTodo,
  Lock,
  PaintBucket,
  UserCheck,
  Terminal,
} from "lucide-react";
import SettingsMenuLayout from "@/components/settings/settings-menu-layout";

function SettingsLayout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      key: "profile",
      label: "Your Profile",
      icon: <UserCheck />,
      section: "Account",
    },
    {
      key: "dashboard",
      label: "General Workspace",
      icon: <Fingerprint />,
      section: "Account",
    },
    {
      key: "appearance",
      label: "Appearance",
      icon: <PaintBucket />,
      section: "Platform",
    },
    { key: "domains", label: "Domains", icon: <Earth />, section: "Platform" },
    {
      key: "modules",
      label: "Modules",
      icon: <ListTodo />,
      section: "Platform",
    },
    {
      key: "languages",
      label: "Languages",
      icon: <Languages />,
      section: "Platform",
    },
    {
      key: "integrations",
      label: "Integrations",
      icon: <Blocks />,
      section: "Platform",
    },
    { key: "mcp", label: "MCP", icon: <Terminal />, section: "Platform" },
    {
      key: "subscription",
      label: "Subscription",
      icon: <ArrowUpRight />,
      section: "Commerce",
    },
    {
      key: "taxes",
      label: "Taxes & Duties",
      icon: <HandCoins />,
      section: "Commerce",
    },
    {
      key: "privacy",
      label: "Customer Privacy",
      icon: <Lock />,
      section: "Legal",
    },
    {
      key: "policies",
      label: "Policies",
      icon: <FileStack />,
      section: "Legal",
    },
    {
      key: "users",
      label: "Users & Permissions",
      icon: <UserCheck />,
      section: "Team",
    },
    {
      key: "contact",
      label: "Contact Support",
      icon: <Headset />,
      section: "Support",
    },
  ];

  return children;
}

export default SettingsLayout;
