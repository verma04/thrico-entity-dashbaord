"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-accent transition-colors duration-150 outline-none"
        >
          <Sun className="h-[15px] w-[15px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[15px] w-[15px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 rounded-lg p-1">
        <DropdownMenuItem
          className={cn(
            "rounded-md px-2 py-1.5 cursor-pointer gap-2",
            theme === "light" && "bg-accent text-foreground"
          )}
          onClick={() => setTheme("light")}
        >
          <Sun size={14} className="text-muted-foreground/60" />
          <span className="text-[12.5px]">Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "rounded-md px-2 py-1.5 cursor-pointer gap-2",
            theme === "dark" && "bg-accent text-foreground"
          )}
          onClick={() => setTheme("dark")}
        >
          <Moon size={14} className="text-muted-foreground/60" />
          <span className="text-[12.5px]">Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "rounded-md px-2 py-1.5 cursor-pointer gap-2",
            theme === "system" && "bg-accent text-foreground"
          )}
          onClick={() => setTheme("system")}
        >
          <Monitor size={14} className="text-muted-foreground/60" />
          <span className="text-[12.5px]">System</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "rounded-md px-2 py-1.5 cursor-pointer gap-2",
            theme === "brand" && "bg-accent text-foreground"
          )}
          onClick={() => setTheme("brand")}
        >
          <Palette size={14} className="text-muted-foreground/60" />
          <span className="text-[12.5px]">Brand</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
