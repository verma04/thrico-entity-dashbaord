"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  CheckCircle,
  UserCheck,
  FolderTree,
  Settings,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";

interface MentorNavigationProps {
  adminCount?: number;
  userCount?: number;
}

export function MentorNavigation({
  adminCount = 0,
  userCount = 0,
}: MentorNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/mentorship",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/mentorship/all",
      label: "All Mentors",
      icon: Users,
    },
    {
      href: "/mentorship/admin",
      label: "Admin Mentors",
      icon: CheckCircle,
      count: adminCount,
    },
    {
      href: "/mentorship/requests",
      label: "User Requests",
      icon: UserCheck,
      count: userCount,
    },
    {
      href: "/mentorship/categories",
      label: "Categories",
      icon: FolderTree,
    },
    {
      href: "/mentorship/skills",
      label: "Skills",
      icon: GraduationCap,
    },
    {
      href: "/mentorship/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="border-b mb-6">
      <nav className="flex gap-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {item.count !== undefined && item.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-muted">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
