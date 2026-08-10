"use client";

import React, { useState, useMemo } from "react";
import List from "./communities-list";
import { getCommunities } from "@/graphql/actions/group";
import TableLoading from "../layout/table-loading";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List as ListIcon, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommunityCard from "./community-card";

import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Status options
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "ALL", label: "All", dot: "" },
  { value: "APPROVED", label: "Approved", dot: "bg-emerald-500" },
  { value: "PENDING", label: "Pending", dot: "bg-amber-500" },
  { value: "DISABLED", label: "Disabled", dot: "bg-orange-500" },
  { value: "REJECTED", label: "Rejected", dot: "bg-red-500" },
  { value: "PAUSED", label: "Paused", dot: "bg-slate-400" },
];

interface CommunitiesProps {
  status?: string;
}

export default function Communities({
  status: initialStatus,
}: CommunitiesProps) {
  const [view, setView] = useState<"grid" | "table">("table");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(initialStatus || "ALL");

  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const { data, loading, refetch } = getCommunities({
    variables: {
      input: {
        status: status === "ALL" ? undefined : status,
      },
    },
  });

  const communities = data?.getCommunities || [];

  const filteredCommunities = useMemo(() => {
    return communities.filter(
      (c: any) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.tagline?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [communities, search]);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText={`${singularName} List`}
        description={
          loading
            ? `Loading ${moduleName.toLowerCase()}…`
            : `Manage and view all ${communities.length} ${moduleName.toLowerCase()}.`
        }
        icon={Users}
        breadcrumbs={[
          { label: moduleName, href: "/communities/all" },
          { label: "All" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
              />
            </Button>
          </div>
        }
      />

      <EcosystemActionBar>
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by name, tagline…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={status}
              onValueChange={setStatus}
              placeholder="Status"
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
                dot: opt.dot || undefined,
              }))}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <EcosystemActionBar.ViewToggle
              value={view}
              onChange={(val) => setView(val as "grid" | "table")}
              options={[
                { id: "grid", label: "Grid", icon: LayoutGrid },
                { id: "table", label: "Table", icon: ListIcon },
              ]}
            />
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredCommunities.length > 0}>
            {filteredCommunities.length} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TableLoading />
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCommunities.map((community: any) => (
                    <CommunityCard key={community.id} record={community} />
                  ))}
                  {filteredCommunities.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl bg-muted/20">
                      <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3 text-muted-foreground/40">
                        <Users className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        No results found
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <List data={filteredCommunities} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
