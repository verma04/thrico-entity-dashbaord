"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  Plus,
  Users,
  LayoutDashboard,
  List,
  Search,
  ArrowRight,
  Check,
  Building2,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetEntity, useGetMyOtherAccounts } from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { useWorkspaceSwitch } from "@/hooks/use-workspace-switch";

export function WorkspaceSwitcher() {
  const { data: currentEntityData } = useGetEntity();
  const { data: otherAccountsData } = useGetMyOtherAccounts();
  const { isSwitching, handleSwitch } = useWorkspaceSwitch();
  const [open, setOpen] = React.useState(false);

  const currentEntity = currentEntityData?.getEntity;
  const otherTeams = otherAccountsData?.getMyOtherAccounts || [];

  const onSwitch = (entityId: string, name: string) => {
    setOpen(false);
    handleSwitch(entityId, name);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-accent group h-10 rounded-lg transition-colors duration-150 hover:bg-accent/80"
            >
              <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-muted border border-border/50">
                {currentEntity?.logo ? (
                  <img
                    src={`https://cdn.thrico.network/${currentEntity.logo}`}
                    alt={currentEntity.name}
                    className="size-full object-contain p-1"
                  />
                ) : (
                  <LayoutDashboard className="size-4 text-muted-foreground/60" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1.5 truncate group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-[13px] text-foreground tracking-[-0.01em]">
                  {currentEntity?.name || "Loading..."}
                </span>
                <span className="truncate text-[11px] text-muted-foreground/60">
                  Workspace
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-3.5 text-muted-foreground/40 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-background border-border shadow-lg rounded-xl">
            <Command className="border-none rounded-none">
              <div className="flex items-center px-4 pt-3.5 pb-2.5 border-b border-border/50">
                <Building2 className="size-3.5 text-muted-foreground/50 mr-2" />
                <h2 className="text-[12.5px] font-semibold text-foreground/80 tracking-[-0.01em]">
                  Switch Workspace
                </h2>
              </div>

              <CommandInput
                placeholder="Search across all workspaces..."
                className="h-14 border-none focus:ring-0 text-base"
              />

              <CommandList className="max-h-[360px] p-1.5">
                <CommandEmpty className="py-8 text-center text-[12.5px] text-muted-foreground/60">
                  No workspaces found.
                </CommandEmpty>

                {/* ACTIVE WORKSPACE */}
                <CommandGroup heading="Current">
                  <CommandItem
                    onSelect={() => setOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-accent/60 border border-border/40 mb-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-md bg-background border border-border/60 flex items-center justify-center p-1">
                        {currentEntity?.logo ? (
                          <img
                            src={`https://cdn.thrico.network/${currentEntity.logo}`}
                            alt={currentEntity?.name}
                            className="size-full object-contain"
                          />
                        ) : (
                          <LayoutDashboard className="size-3.5 text-muted-foreground/60" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-foreground">
                          {currentEntity?.name}
                        </span>
                        <span className="text-[10.5px] text-muted-foreground/60">
                          Active workspace
                        </span>
                      </div>
                    </div>
                    <Check size={13} className="text-primary mr-1" />
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator className="my-2" />

                {/* OTHER WORKSPACES */}
                <CommandGroup heading="All Workspaces">
                  {otherTeams.map((team) => (
                    <CommandItem
                      key={team?.id}
                      onSelect={() => onSwitch(team?.entityId, team?.name)}
                      className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer hover:bg-accent/60 transition-colors mb-px group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-md bg-muted border border-border/50 flex items-center justify-center p-1">
                          {team?.logo ? (
                            <img
                              src={`https://cdn.thrico.network/${team?.logo}`}
                              alt={team?.name}
                              className="size-full object-contain"
                            />
                          ) : (
                            <Users className="size-3.5 text-muted-foreground/50" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-foreground">
                            {team?.name}
                          </span>
                          <span className="text-[10.5px] text-muted-foreground/60 uppercase font-medium tracking-tight">
                            {team?.role || "Admin"}
                          </span>
                        </div>
                      </div>
                      <ArrowRight
                        size={12}
                        className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors"
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandSeparator className="my-2" />

                {/* ACTIONS */}
                <CommandGroup heading="Actions">
                  <a
                    href="http://accounts.thrico.com/my-accounts/"
                    className="block w-full"
                    target="_blank"
                  >
                    <CommandItem className="p-2.5 rounded-lg cursor-pointer hover:bg-accent/60 transition-colors group">
                      <ExternalLink className="size-3.5 text-muted-foreground/50 mr-2.5" />
                      <span className="text-[12.5px] font-medium text-muted-foreground">
                        Workspace Management Portal
                      </span>
                    </CommandItem>
                  </a>
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
