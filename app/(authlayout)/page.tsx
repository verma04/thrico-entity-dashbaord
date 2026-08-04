'use client";';

import Dashboard from "@/components/home/dashboard";
import MenuItemsLayout from "@/components/layout/menu-items-layout";

const page = () => {
  return (
    <>
      <MenuItemsLayout hideTabs={true}>
        <Dashboard />
      </MenuItemsLayout>
    </>
  );
};

export default page;
