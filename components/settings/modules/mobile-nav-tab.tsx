"use client";

import React from "react";
import MobileNavigation from "./mobile-navigation";
import { useModulesContext } from "./modules-context";

export default function MobileNavTab() {
  const {
    modules,
    navigationModules,
    userRole,
    saving,
    saveChanges,
    onDragEnd,
    moveNavigationModule,
    toggleNavigation,
    hideMenuMobile,
    setHideMenuMobile,
  } = useModulesContext();

  return (
    <div className="p-5">
      <MobileNavigation
        modules={modules}
        navigationModules={navigationModules}
        userRole={userRole}
        saving={saving}
        saveChanges={saveChanges}
        onDragEnd={onDragEnd}
        moveModule={moveNavigationModule}
        toggleNavigation={toggleNavigation}
        hideMenuMobile={hideMenuMobile}
        onToggleHideMenuMobile={setHideMenuMobile}
      />
    </div>
  );
}
