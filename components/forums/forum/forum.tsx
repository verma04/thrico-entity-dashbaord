"use client";

import React, { useState, useMemo } from "react";
import List from "./forum-list";
import { getDiscussionForum } from "../../../graphql/actions/discussion-form";
import { discussionForumStatus } from "../ts-types";
import TableLoading from "@/components/layout/table-loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import ForumCard from "./forum-card";
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import Post from "@/components/forums/post/forum-post";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Status & Filter options
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "ALL", label: "All", dot: "" },
  { value: "APPROVED", label: "Approved", dot: "bg-emerald-500" },
  { value: "PENDING", label: "Pending", dot: "bg-amber-500" },
  { value: "DISABLED", label: "Disabled", dot: "bg-orange-500" },
  { value: "REJECTED", label: "Rejected", dot: "bg-red-500" },
];

const VERIFICATION_OPTIONS = [
  { value: "ALL", label: "All Posts" },
  { value: "VERIFIED", label: "Verified" },
  { value: "UNVERIFIED", label: "Unverified" },
];

interface ForumProps {
  status?: discussionForumStatus;
}

export default function Forum({ status: initialStatus }: ForumProps) {
  const [view, setView] = useState<"grid" | "table">("table");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<discussionForumStatus>(
    initialStatus || "ALL",
  );
  const [verificationFilter, setVerificationFilter] = useState("ALL");
  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);

  const { data, loading, refetch } = getDiscussionForum({
    variables: {
      input: {
        status: status === "ALL" ? undefined : status,
      },
    },
  });

  const forums = data?.getDiscussionForum || [];

  const filteredForums = useMemo(() => {
    return forums.filter((f: any) => {
      // Apply Search Filter
      const matchesSearch =
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.content?.toLowerCase().includes(search.toLowerCase());

      // Apply Verification Filter
      const isVerified = f.verification?.isVerified || false;
      const matchesVerification =
        verificationFilter === "ALL"
          ? true
          : verificationFilter === "VERIFIED"
            ? isVerified
            : !isVerified;

      return matchesSearch && matchesVerification;
    });
  }, [forums, search, verificationFilter]);

  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText="Community Dialogues"
        description={
          loading
            ? `Loading ${moduleName.toLowerCase()}…`
            : `Monitor, moderate, and engage with ${forums.length} ${moduleName.toLowerCase()}.`
        }
        icon={MessageSquare}
        breadcrumbs={[{ label: moduleName, href: "/forums" }, { label: "All" }]}
      />

      <EcosystemActionBar>
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search posts..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={status}
              onValueChange={(val: any) => setStatus(val)}
              options={STATUS_OPTIONS}
              placeholder="Status"
            />
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={verificationFilter}
              onValueChange={setVerificationFilter}
              options={VERIFICATION_OPTIONS}
              placeholder="Verification"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <div className="flex items-center gap-2">
              <CtaButton
                variant="outline"
                onClick={() => refetch?.()}
                className="h-6 w-6 p-0 rounded-md border-border text-muted-foreground hover:text-foreground transition-all"
              >
                <RefreshCw
                  className={cn("h-3 w-3", loading && "animate-spin")}
                />
              </CtaButton>
              <EcosystemActionBar.ViewToggle
                value={view}
                onChange={(val: string) => setView(val as "grid" | "table")}
                options={[
                  { id: "grid", label: "Grid", icon: LayoutGrid },
                  { id: "table", label: "Table", icon: ListIcon },
                ]}
              />
              <Post />
            </div>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredForums.length > 0}>
            {filteredForums.length} {moduleName}
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
                  {filteredForums.map((forum: any) => (
                    <ForumCard key={forum.id} record={forum} />
                  ))}
                  {filteredForums.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl bg-muted/20">
                      <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3 text-muted-foreground/40">
                        <MessageSquare className="h-6 w-6" />
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
                <List data={filteredForums} loading={loading} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
