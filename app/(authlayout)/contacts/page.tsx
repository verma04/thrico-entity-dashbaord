"use client";

import React, { useState, useMemo } from "react";
import { ContactsList } from "@/components/contacts/contacts-list";
import { useGetAllContacts, useGetContactStats } from "@/graphql/actions";
import TableLoading from "@/components/layout/table-loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Mail,
  ArrowRight,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";

const ContactsPage = () => {
  const [search, setSearch] = useState("");
  const { data, loading, refetch } = useGetAllContacts({
    limit: 50,
  });
  const { data: statsData, loading: statsLoading } = useGetContactStats();

  const filteredContacts = useMemo(() => {
    return (
      data?.getAllContacts?.nodes?.filter(
        (c) =>
          c.subject?.toLowerCase().includes(search.toLowerCase()) ||
          c.message?.toLowerCase().includes(search.toLowerCase()) ||
          c.user?.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          c.user?.user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          c.user?.user?.email?.toLowerCase().includes(search.toLowerCase()),
      ) || []
    );
  }, [data, search]);

  const stats = statsData?.getContactStats;

  const kpis = [
    {
      title: "Total Inquiries",
      value: statsLoading ? "..." : (stats?.totalInquiries?.toLocaleString() ?? "0"),
      trend: 8,
      icon: MessageSquare,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Resolved Logs",
      value: statsLoading ? "..." : (stats?.resolvedInquiries?.toLocaleString() ?? "0"),
      trend: 14,
      icon: Zap,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Response Scale",
      value: statsLoading ? "..." : (stats?.responseRate ?? "0%"),
      trend: 2,
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="inquiry-registry">
      <EcosystemHeader
        title="Protocol Inquiries"
        badgeText="Contact Submissions"
        description={
          loading
            ? "Decoding inquiry transmissions..."
            : `Intercepting and managing ${data?.getAllContacts?.nodes?.length || 0} external communication logs.`
        }
        icon={Mail}
        actions={
          <div className="flex items-center gap-3 italic">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-11 w-11 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
               Export Protocol
               <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        }
      />

      <EcosystemActionBar shadow="none">
        <div className="relative w-full md:w-96 group italic">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <Input
            placeholder="Scan subject, message or identity..."
            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all font-black text-[10px] uppercase tracking-wider text-slate-700 placeholder:text-slate-400 border shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="h-8 w-px bg-slate-100 hidden md:block" />

        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
          <Filter className="h-3 w-3 text-indigo-500" />
          Active Filters
        </div>

        <div className="flex items-center gap-2 relative z-10 ml-auto mr-4 italic">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgb(16,185,129)]" />
            {filteredContacts.length} Logs Intercepted
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12 border-none bg-transparent shadow-none ring-0">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Registry" />
          ))}
        </div>

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
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 overflow-hidden relative"
            >
               <div className="absolute top-0 right-0 p-8">
                  <Mail className="h-24 w-24 text-slate-50/50 -rotate-12" />
               </div>
               <ContactsList contacts={filteredContacts} />
            </motion.div>
          )}
        </AnimatePresence>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default ContactsPage;
