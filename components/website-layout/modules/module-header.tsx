import { cn } from "@/lib/utils";

interface LayoutSettings {
  flexDirection?: "row" | "column";
  justifyContent?: "start" | "center" | "end" | "between" | "around";
  alignItems?: "start" | "center" | "end" | "stretch";
}

interface ModuleHeaderProps {
  title?: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  alignment?: "left" | "center" | "right";
  showIcon?: boolean;
  icon?: React.ReactNode;
  layoutSettings?: LayoutSettings;
}

export const ModuleHeader = ({
  title,
  description,
  titleClassName,
  descriptionClassName,
  containerClassName,
  alignment = "left",
  showIcon = false,
  icon,
  layoutSettings,
}: ModuleHeaderProps) => {
  if (!title && !description) return null;

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Map layout settings to Tailwind classes
  const flexDirectionClass = layoutSettings?.flexDirection === "row" ? "flex-row" : "flex-col";
  
  const justifyContentClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };
  
  const alignItemsClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClass = layoutSettings?.justifyContent 
    ? justifyContentClasses[layoutSettings.justifyContent]
    : "";
    
  const alignClass = layoutSettings?.alignItems
    ? alignItemsClasses[layoutSettings.alignItems]
    : "";

  return (
    <div 
      className={cn(
        "mb-12",
        layoutSettings ? "flex gap-4" : "",
        flexDirectionClass,
        justifyClass,
        alignClass,
        !layoutSettings && alignmentClasses[alignment],
        containerClassName
      )}
    >
      {showIcon && icon && <div className="mb-4">{icon}</div>}
      {title && (
        <h2
          className={cn(
            "text-4xl font-bold mb-3",
            titleClassName
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className={cn(
            "text-muted-foreground text-lg",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};
