import React from "react";

export const SectionCard = ({
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  children,
  action,
}: {
  title: string;
  description?: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
      <div className="flex items-center gap-3">
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);
