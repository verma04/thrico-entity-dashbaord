"use client";

import React from "react";
import WebNavigation from "./web-navigation";
import { useModulesContext } from "./modules-context";

export default function WebNavTab() {
  const {
    modules,
    webNavigationModules,
    userRole,
    saving,
    saveChanges,
    onDragEndWeb,
    toggleWebNavigation,
    changeCustomRoute,
  } = useModulesContext();

  return (
    <div className="p-5">
      <WebNavigation
        modules={modules}
        navigationModules={webNavigationModules}
        userRole={userRole}
        saving={saving}
        saveChanges={saveChanges}
        onDragEnd={onDragEndWeb}
        toggleNavigation={toggleWebNavigation}
        changeCustomRoute={changeCustomRoute}
      />
    </div>
  );
}
