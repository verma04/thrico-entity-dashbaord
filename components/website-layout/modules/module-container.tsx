import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerSettings {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: string;
}

interface ModuleContainerProps {
  children: ReactNode;
  containerSettings?: ContainerSettings;
  className?: string;
}

export const ModuleContainer = ({
  children,
  containerSettings,
  className,
}: ModuleContainerProps) => {
  // Max width mapping
  const maxWidthClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[90rem]",
    "2xl": "max-w-[100rem]",
    full: "max-w-full",
  };

  // Padding mapping
  const paddingClasses = {
    none: "py-0 px-0",
    sm: "py-8 px-4 sm:px-6",
    md: "py-12 px-6 sm:px-8",
    lg: "py-16 px-8 sm:px-10",
    xl: "py-20 px-10 sm:px-12",
  };

  const maxWidth = containerSettings?.maxWidth || "lg";
  const padding = containerSettings?.padding || "lg";
  const background = containerSettings?.background || "bg-background";

  return (
    <div className={cn(paddingClasses[padding], background, className)}>
      <div className={cn("mx-auto", maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </div>
  );
};
