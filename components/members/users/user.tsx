import React, { useState, useMemo } from "react";
import { UserList } from "./user-list";
import { useGetAllUser } from "@/graphql/actions/membership/membership-queries";
import TableLoading from "@/components/layout/table-loading";
import { MembersListCards } from "../dashboard/members-listcards";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  Users,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";

const User = ({ status: initialStatus }: any) => {
  const [view, setView] = useState<"grid" | "table">("table");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(initialStatus || "ALL");

  const { data, loading, refetch } = useGetAllUser({
    status: status === "ALL" ? "ALL" : status,
  });

  const filteredUsers = useMemo(() => {
    return (
      data?.getAllUser?.filter(
        (u) =>
          `${u.user?.firstName} ${u.user?.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          u.user?.email.toLowerCase().includes(search.toLowerCase()),
      ) || []
    );
  }, [data, search]);

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
        title={
          status === "ALL"
            ? "Members"
            : `${status.charAt(0) + status.slice(1).toLowerCase()} Members`
        }
        badgeText="Network Registry"
        description={
          loading
            ? "Synchronizing directory records..."
            : `Manage and monitor ${data?.getAllUser?.length || 0} community participants.`
        }
        icon={Users}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
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
                  className="h-9 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all font-semibold text-xs"
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="h-9 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all font-semibold text-xs"
                >
                  <ListIcon className="h-4 w-4 mr-2" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      />

      <EcosystemActionBar>
        <div className="relative w-full md:w-96 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <Input
            placeholder="Search by name, email or ID..."
            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400 border shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="h-8 w-px bg-slate-100 hidden md:block" />

        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px] h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-600 focus:ring-4 focus:ring-indigo-500/5">
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    status === "APPROVED"
                      ? "bg-emerald-500"
                      : status === "PENDING"
                        ? "bg-amber-500"
                        : "bg-slate-300",
                  )}
                />
                <SelectValue placeholder="Status Filter" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
              <SelectItem
                value="ALL"
                className="font-semibold rounded-lg py-2.5"
              >
                All Members
              </SelectItem>
              <SelectItem
                value="APPROVED"
                className="font-semibold rounded-lg py-2.5"
              >
                Approved
              </SelectItem>
              <SelectItem
                value="PENDING"
                className="font-semibold rounded-lg py-2.5"
              >
                Pending
              </SelectItem>
              <SelectItem
                value="BLOCKED"
                className="font-semibold rounded-lg py-2.5"
              >
                Blocked
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            <Filter className="h-3 w-3" />
            Advanced
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10 ml-auto mr-4">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {filteredUsers.length} Members
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
                <MembersListCards manualData={filteredUsers} />
              ) : (
                <UserList users={filteredUsers} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

const Badge = ({ children, variant, className }: any) => (
  <span
    className={cn(
      "px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider",
      variant === "outline" ? "border" : "bg-slate-100",
      className,
    )}
  >
    {children}
  </span>
);

export default User;
