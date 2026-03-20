"use client";

import React, { useState, useMemo } from "react";
import List from "./communities-list";
import { getCommunities } from "@/graphql/actions/group";
import TableLoading from "../layout/table-loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Search,
  Users,
  Plus,
  RefreshCw,
  Filter,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
        c.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [communities, search]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader 
        title="Communities"
        badgeText="Ecosystem Registry"
        description={loading ? "Synchronizing community registry..." : `Manage and monitor ${communities.length} connected network spaces.`}
        icon={Users}
        actions={
          <div className="flex items-center gap-3">
             <Button
                variant="outline"
                size="icon"
                onClick={() => refetch?.()}
                className="h-11 w-11 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>

              <Tabs
                value={view}
                onValueChange={(val: string) => setView(val as "grid" | "table")}
                className="bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/50"
              >
                <TabsList className="bg-transparent border-none">
                  <TabsTrigger
                    value="grid"
                    className="h-9 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 transition-all font-bold text-xs"
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value="table"
                    className="h-9 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 transition-all font-bold text-xs"
                  >
                    <ListIcon className="h-4 w-4 mr-2" />
                    Table
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Create />
          </div>
        }
      />

      <EcosystemActionBar showLiveIndicator={false}>
          <div className="relative w-full md:w-96 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <Input
              placeholder="Search by community name, tagline or ID..."
              className="pl-12 h-12 bg-slate-50/50 border-slate-100 rounded-2xl focus-visible:ring-4 focus-visible:ring-indigo-500/10 transition-all font-semibold text-slate-700 placeholder:text-slate-400 placeholder:font-medium border-2 focus:border-indigo-500/20"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>

          <div className="h-8 w-px bg-slate-100 hidden md:block" />

          <div className="flex items-center gap-3">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[200px] h-12 rounded-2xl border-2 border-slate-50 bg-white hover:bg-slate-50 transition-colors shadow-sm font-bold text-slate-600 focus:ring-4 focus:ring-indigo-500/5">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm",
                      status === "APPROVED"
                        ? "bg-emerald-500"
                        : status === "PENDING"
                          ? "bg-amber-500"
                          : status === "BLOCKED"
                            ? "bg-rose-500"
                            : status === "DISABLED" || status === "PAUSED"
                              ? "bg-orange-500"
                              : "bg-slate-300",
                    )}
                  />
                  <SelectValue placeholder="Status Filter" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-1">
                <SelectItem value="ALL" className="font-bold rounded-lg py-2.5">
                  All Ecosystem
                </SelectItem>
                <div className="h-px bg-slate-50 my-1" />
                <SelectItem
                  value="APPROVED"
                  className="font-bold text-emerald-600 rounded-lg py-2.5"
                >
                  Approved
                </SelectItem>
                <SelectItem
                  value="PENDING"
                  className="font-bold text-amber-600 rounded-lg py-2.5"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="DISABLED"
                  className="font-bold text-orange-600 rounded-lg py-2.5"
                >
                  Disabled
                </SelectItem>
                <SelectItem
                  value="REJECTED"
                  className="font-bold text-rose-600 rounded-lg py-2.5"
                >
                  Rejected
                </SelectItem>
                <SelectItem
                  value="PAUSED"
                  className="font-bold text-slate-600 rounded-lg py-2.5"
                >
                  Paused
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
              <Filter className="h-3 w-3" />
              Advanced
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10 ml-auto mr-4">
            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/10 text-xs font-black text-white uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {filteredCommunities.length} Active Spaces
            </div>
          </div>
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {view === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCommunities.map((community: any) => (
                  <CommunityCard key={community.id} record={community} />
                ))}
                {filteredCommunities.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl">
                     <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Search className="h-8 w-8" />
                     </div>
                     <h3 className="text-xl font-bold text-slate-700">No results found</h3>
                     <p className="text-slate-400">Try adjusting your search query or filters.</p>
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

const Badge = ({ children, variant, className }: any) => (
  <span
    className={cn(
      "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest",
      variant === "outline" ? "border" : "bg-slate-100",
      className,
    )}
  >
    {children}
  </span>
);
