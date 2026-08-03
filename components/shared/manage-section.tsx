"use client";

import React from "react";
import { Loader2, Plus, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────
 * ManageSection — The top-level card wrapper
 * ───────────────────────────────────────────── */
interface ManageSectionProps {
  children: React.ReactNode;
}

export function ManageSection({ children }: ManageSectionProps) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
 * ManageSectionHeader — Title + description + optional action button
 * ───────────────────────────────────────────── */
interface ManageSectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

export function ManageSectionHeader({
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon = Plus,
  onAction,
  badge,
  children,
}: ManageSectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {actionLabel && onAction && (
          <Button onClick={onAction} size="sm" className="shrink-0">
            <ActionIcon className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * ManageSectionContent — The body area with loading / error / empty states
 * ───────────────────────────────────────────── */
interface ManageSectionContentProps {
  loading?: boolean;
  error?: { message: string } | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  emptyIcon?: LucideIcon;
  children: React.ReactNode;
}

export function ManageSectionContent({
  loading,
  error,
  isEmpty,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  emptyIcon: EmptyIcon,
  children,
}: ManageSectionContentProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <p className="text-sm text-red-600">{error.message}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-lg border-2 border-dashed border-border bg-muted/20">
        {EmptyIcon && (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <EmptyIcon className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        <p className="text-sm font-medium text-foreground mb-1">{emptyTitle}</p>
        {emptyDescription && (
          <p className="text-sm text-muted-foreground mb-4 max-w-sm text-center">
            {emptyDescription}
          </p>
        )}
        {emptyActionLabel && onEmptyAction && (
          <Button variant="outline" size="sm" onClick={onEmptyAction}>
            <Plus className="w-4 h-4 mr-2" />
            {emptyActionLabel}
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

/* ─────────────────────────────────────────────
 * ManageSectionCard — A bordered card wrapper for section content
 * ───────────────────────────────────────────── */
interface ManageSectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ManageSectionCard({ children, className = "" }: ManageSectionCardProps) {
  return (
    <div className={`bg-card rounded-lg border border-border shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}
