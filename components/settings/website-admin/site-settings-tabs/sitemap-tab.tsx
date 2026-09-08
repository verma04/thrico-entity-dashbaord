"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Map,
  Globe,
  Info,
} from "lucide-react";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  Pagination,
} from "@/components/shared/admin-table/admin-table";
import { PremiumLock } from "./premium-lock";

interface SitemapTabProps {
  isPremium: boolean;
  pages: any[];
  loadingSeo: boolean;
  search: string;
  sitemapFilter: "ALL" | "INDEXED" | "EXCLUDED";
  pageNumber: number;
  onPageChange: (page: number) => void;
  visibleColumns: Record<string, boolean>;
  onTogglePageSitemap: (pageId: string, currentVal: boolean) => void;
}

export function SitemapTab({
  isPremium,
  pages,
  loadingSeo,
  search,
  sitemapFilter,
  pageNumber,
  onPageChange,
  visibleColumns,
  onTogglePageSitemap,
}: SitemapTabProps) {
  const pageSize = 15;

  const filteredPages = useMemo(() => {
    return pages.filter((page: any) => {
      const matchesSearch =
        search === "" ||
        page.name?.toLowerCase().includes(search.toLowerCase()) ||
        page.slug?.toLowerCase().includes(search.toLowerCase()) ||
        page.seo?.title?.toLowerCase().includes(search.toLowerCase());

      const isIndexed = page.seo?.includeInSitemap ?? true;
      const matchesStatus =
        sitemapFilter === "ALL"
          ? true
          : sitemapFilter === "INDEXED"
            ? isIndexed
            : !isIndexed;

      return matchesSearch && matchesStatus;
    });
  }, [pages, search, sitemapFilter]);

  const paginatedPages = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return filteredPages.slice(start, start + pageSize);
  }, [filteredPages, pageNumber, pageSize]);

  const totalPagesCount = Math.ceil(filteredPages.length / pageSize) || 1;
  const indexedCount = pages.filter((p: any) => (p.seo?.includeInSitemap ?? true)).length;

  const columns: AdminTableColumn<any>[] = useMemo(() => {
    const cols: AdminTableColumn<any>[] = [];

    if (visibleColumns.serial) {
      cols.push({
        key: "serial",
        header: "#",
        className: "w-12 text-center text-xs text-muted-foreground",
        cell: (_row, idx) => (pageNumber - 1) * pageSize + idx + 1,
      });
    }

    if (visibleColumns.name) {
      cols.push({
        key: "name",
        header: "Page Title",
        cell: (row) => (
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-foreground">
              {row.name}
            </span>
            <span className="text-[11px] text-muted-foreground/80 font-mono">
              /{row.slug}
            </span>
          </div>
        ),
      });
    }

    if (visibleColumns.indexing) {
      cols.push({
        key: "indexing",
        header: "Sitemap Status",
        cell: (row) => {
          const isIndexed = row.seo?.includeInSitemap ?? true;
          return (
            <AdminStatusBadge status={isIndexed ? "active" : "inactive"}>
              {isIndexed ? "Indexed" : "Excluded"}
            </AdminStatusBadge>
          );
        },
      });
    }

    if (visibleColumns.sitemapToggle) {
      cols.push({
        key: "sitemapToggle",
        header: "Include in Sitemap",
        headerClassName: "text-center",
        className: "text-center",
        cell: (row) => {
          const isIndexed = row.seo?.includeInSitemap ?? true;
          return (
            <div className="flex justify-center items-center">
              <Switch
                checked={isIndexed}
                onCheckedChange={() => onTogglePageSitemap(row.id, isIndexed)}
              />
            </div>
          );
        },
      });
    }

    if (visibleColumns.seoTitle) {
      cols.push({
        key: "seoTitle",
        header: "Meta Title",
        cell: (row) => (
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
            {row.seo?.title || <span className="italic text-muted-foreground/60">—</span>}
          </span>
        ),
      });
    }

    return cols;
  }, [visibleColumns, pageNumber, pageSize, onTogglePageSitemap]);

  if (!isPremium) {
    return (
      <PremiumLock
        title="Sitemap Manager"
        icon={Map}
        description="Optimize your site's discovery architecture. Control search engine indexing and hierarchical visibility mapping."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Table Area */}
      <div className="lg:col-span-8 space-y-4">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
          <AdminTable
            columns={columns}
            data={paginatedPages}
            loading={loadingSeo}
            keyExtractor={(row) => row.id || row.slug}
            emptyTitle="No pages found"
            emptyDescription={
              search
                ? `No pages matched your search "${search}".`
                : "No pages available in your website."
            }
          />
        </div>

        {/* Pagination */}
        {!loadingSeo && filteredPages.length > pageSize && (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
            <Pagination
              currentPage={pageNumber}
              totalPages={totalPagesCount}
              totalItems={filteredPages.length}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

      {/* Sidebar Cards */}
      <div className="lg:col-span-4 space-y-6">
        {/* Platform Overview */}
        <Card className="border-border bg-card shadow-2xs overflow-hidden">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/60">
            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Globe className="h-3.5 w-3.5 text-primary" />
              Platform Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-2 gap-3 divide-x divide-border/60">
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <span className="text-2xl font-bold text-foreground">{pages.length}</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">
                Total Pages
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-2 text-center pl-3">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((indexedCount / (pages.length || 1)) * 100)}%
              </span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">
                Index Coverage
              </span>
            </div>
          </CardContent>
        </Card>

        {/* SEO & Sitemap Tips */}
        <Card className="border-border bg-card shadow-2xs">
          <CardHeader className="pb-3 border-b border-border/60 bg-muted/30">
            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Info className="h-3.5 w-3.5 text-primary" />
              Sitemap Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Excluded pages remain visible to direct link visitors, but will have the <code>noindex</code> tag injected into the page header.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  The public XML sitemap updates automatically on publishing at <code>/sitemap.xml</code>.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Submit your sitemap URL directly to Google Search Console for accelerated discovery.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
