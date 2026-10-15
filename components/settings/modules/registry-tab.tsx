"use client";

import React from "react";
import ModuleRegistry from "./module-registry";
import { useModulesContext } from "./modules-context";

export default function RegistryTab() {
  const {
    modules,
    filteredModules,
    searchTerm,
    userRole,
    publicCount,
    internalCount,
    setSearchTerm,
    toggleModule,
    togglePopular,
    toggleNavigation,
    toggleWebNavigation,
    changeCustomName,
    changeCustomIcon,
    changeSubtitle,
  } = useModulesContext();

  return (
    <ModuleRegistry
      modules={modules}
      filteredModules={filteredModules}
      searchTerm={searchTerm}
      userRole={userRole}
      publicCount={publicCount}
      internalCount={internalCount}
      onSearchChange={setSearchTerm}
      onToggleModule={toggleModule}
      onTogglePopular={togglePopular}
      onToggleNavigation={toggleNavigation}
      onToggleWebNavigation={toggleWebNavigation}
      onChangeCustomName={changeCustomName}
      onChangeCustomIcon={changeCustomIcon}
      onChangeSubtitle={changeSubtitle}
    />
  );
}
