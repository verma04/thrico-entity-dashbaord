import { cn } from "@/lib/utils";

interface LayoutSettings {
  flexDirection?: "row" | "column";
  justifyContent?: "start" | "center" | "end" | "between" | "around";
  alignItems?: "start" | "center" | "end" | "stretch";
}

interface ModuleHeaderProps {
  title?: string;
  description?: string;
  label?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
  alignment?: "left" | "center" | "right";
  showIcon?: boolean;
  icon?: React.ReactNode;
  titleColor?: string;
  descriptionColor?: string;
  hideTitle?: boolean;
  hideDescription?: boolean;
  layoutSettings?: LayoutSettings;
}

export const ModuleHeader = ({
  title,
  description,
  label,
  titleClassName,
  descriptionClassName,
  labelClassName,
  containerClassName,
  alignment = "left",
  showIcon = false,
  icon,
  layoutSettings,
  titleColor,
  descriptionColor,
  hideTitle,
  hideDescription,
}: ModuleHeaderProps) => {
  const hasVisibleTitle = title && !hideTitle;
  const hasVisibleDescription = description && !hideDescription;
  const hasVisibleLabel = label;
  const hasVisibleIcon = showIcon && icon;

  if (
    !hasVisibleTitle &&
    !hasVisibleDescription &&
    !hasVisibleLabel &&
    !hasVisibleIcon
  ) {
    return null;
  }

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Map layout settings to Tailwind classes
  const flexDirectionClass =
    layoutSettings?.flexDirection === "row" ? "flex-row" : "flex-col";

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
      {label && (
        <span
          className={cn(
            "inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4",
            labelClassName
          )}
        >
          {label}
        </span>
      )}
      {!hideTitle && title && (
        <h2
          className={cn("text-4xl font-bold mb-3", titleClassName)}
          style={{ color: titleColor ? titleColor : "#000000" }}
        >
          {title}
        </h2>
      )}
      {!hideDescription && description && (
        <p
          className={cn("text-muted-foreground text-lg", descriptionClassName)}
          style={{ color: descriptionColor ? descriptionColor : "#000000" }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
