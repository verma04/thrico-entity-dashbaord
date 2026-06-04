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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ForumCard from "./forum-card";
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
import Post from "@/components/forums/post/forum-post";

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
        title="Discussion Forums"
        badgeText="Community Dialogues"
        description={
          loading
            ? "Loading forums…"
            : `Monitor, moderate, and engage with ${forums.length} community conversations.`
        }
        icon={MessageSquare}
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
            <Post />
          </div>
        }
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
            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
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
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            opt.dot,
                          )}
                        />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Select
              value={verificationFilter}
              onValueChange={setVerificationFilter}
            >
              <SelectTrigger className="w-[160px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                {VERIFICATION_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-lg text-sm font-medium py-2"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={filteredForums.length > 0}>
            {filteredForums.length} Topics
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
