"use client";

import React, { useState, useMemo } from "react";
import List from "./communities-list";
import { getCommunities } from "@/graphql/actions/group";
import TableLoading from "../layout/table-loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Users,
  RefreshCw,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CommunityCard from "./community-card";
import Create from "./add/Create";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";

// ─────────────────────────────────────────────────────────────────────────────
// Status options
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "ALL",      label: "All",      dot: "" },
  { value: "APPROVED", label: "Approved", dot: "bg-emerald-500" },
  { value: "PENDING",  label: "Pending",  dot: "bg-amber-500" },
  { value: "DISABLED", label: "Disabled", dot: "bg-orange-500" },
  { value: "REJECTED", label: "Rejected", dot: "bg-red-500" },
  { value: "PAUSED",   label: "Paused",   dot: "bg-slate-400" },
];

interface CommunitiesProps {
  status?: string;
}

export default function Communities({ status: initialStatus }: CommunitiesProps) {
  const [view, setView] = useState<"grid" | "table">("table");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(initialStatus || "ALL");

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

  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Communities"
        badgeText="Community List"
        description={
          loading
            ? "Loading communities…"
            : `Manage and view all ${communities.length} communities.`
        }
        icon={Users}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </Button>

            {/* View toggle */}
            <Tabs
              value={view}
              onValueChange={(val: string) => setView(val as "grid" | "table")}
              className="bg-muted p-0.5 rounded-lg border border-border"
            >
              <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
                <TabsTrigger
                  value="grid"
                  className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
                >
                  <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
                >
                  <ListIcon className="h-3.5 w-3.5 mr-1.5" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Create />
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
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[160px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <div className="flex items-center gap-2">
                  {currentStatus.dot && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        currentStatus.dot,
                      )}
                    />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-lg text-sm font-medium py-2"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span
                          className={cn("h-1.5 w-1.5 rounded-full shrink-0", opt.dot)}
                        />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={filteredCommunities.length > 0}>
            {filteredCommunities.length} Communities
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
                      <p className="text-sm font-semibold text-foreground">No results found</p>
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
