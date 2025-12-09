"use client";

import React from "react";
import { UserDetails } from "../layout/sidebar/menu-items";
import Visit from "../layout/sidebar/visit";

const HomeHeader = () => {
  return (
    <div className="w-full h-16 bg-background sticky top-0 z-10 flex items-center justify-between shadow-sm">
      <h3 className="text-xl font-semibold capitalize pl-6 pt-5 text-black">
        Welcome <UserDetails /> <span className="ml-1">👋</span>
      </h3>
      <Visit />
    </div>
  );
};

export default HomeHeader;
