import React from "react";
import { cn } from "@/lib/utils";

import Visit from "./sidebar/visit";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import Logo from "./sidebar/logo";
import { useGetEntity, useGetUser } from "@/graphql/actions";
// Adjust import paths as needed
import { Menu, Bell, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface NavbarProps {
  onMenuClick: () => void;
}
export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { data } = useGetEntity();
  const { data: { getUser } = {} } = useGetUser();

  return (
    // <header
    //   className={cn("sticky top-0 z-10 w-full bg-background shadow-md mb-2")}
    // >
    //   <div className="flex justify-between items-center w-full px-5 py-2">
    //     <div className="flex items-center gap-4 w-1/2">
    //       <Logo name={data?.getEntity?.name} logo={data?.getEntity?.logo} />
    //       <Separator orientation="vertical" className="h-8" />
    //       {/*
    //       <div className="flex gap-5 w-3/4">
    //         <Popover>
    //           <Popover.Trigger asChild>
    //             <Button variant="outline">Modules</Button>
    //           </Popover.Trigger>
    //           <Popover.Content>
    //             <MenuNavigation />
    //           </Popover.Content>
    //         </Popover>
    //         <GlobalSearch />
    //       </div>
    //       */}
    //     </div>
    //     <div className="flex items-center gap-4">
    //       <Visit />
    //       <Button variant="ghost" className="h-12 flex items-center gap-2">
    //         <Avatar className="bg-green-400 rounded-md">
    //           {getUser?.firstName?.[0]}
    //         </Avatar>
    //         {/* <Typography className="ml-4">
    //           {getUser?.firstName} {getUser?.lastName}
    //         </Typography> */}
    //       </Button>
    //     </div>
    //   </div>
    // </header>
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 h-16">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu size={20} />
          </Button>
          <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            <Logo name={data?.getEntity?.name} logo={data?.getEntity?.logo} />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Visit />

          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Activity & Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Theme</DropdownMenuItem>
              <DropdownMenuItem>Upgrade Plan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>
        </div>
      </nav>
    </>
  );
};
