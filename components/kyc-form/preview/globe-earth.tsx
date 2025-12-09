import { Globe } from "@/components/ui/globe";
import React from "react";

const GlobeEarth = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <Globe className="w-200" />
    </div>
  );
};

export default GlobeEarth;
