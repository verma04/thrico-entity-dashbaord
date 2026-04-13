"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Receipt, FileText, Download, MoreHorizontal, Calendar, CreditCard, ExternalLink } from "lucide-react";
import { useGetAllEntityInvoice } from "../../../graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { AdminTable, AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import moment from "moment";

interface BillingRecord {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
  url?: string;
  planName: string;
  currency: string;
  rawAmount: number;
}

export default function Billing() {
  const { data, loading, error, refetch } = useGetAllEntityInvoice();

  const invoiceData: BillingRecord[] = React.useMemo(() => {
    return data?.getAllEntityInvoice?.map((inv, idx) => ({
      id: inv.billingId || idx.toString(),
      date: inv.createdAt,
      description: inv.notes || `Invoice for ${inv.planName}`,
      amount: `${inv.currency} ${inv.amount.toFixed(2)}`,
      status: inv.status,
      url: inv.invoiceUrl || undefined,
      planName: inv.planName,
      currency: inv.currency,
      rawAmount: inv.amount,
    })) || [];
  }, [data]);

  const columns = [
    {
      key: "date",
      header: "Date",
      cell: (record: BillingRecord) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
             <Calendar className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex flex-col">
             <span className="text-sm font-medium text-foreground leading-none">
                {moment(record.date).format("MMM D, YYYY")}
             </span>
             <span className="text-[10px] text-zinc-400 mt-1">
                Invoiced
             </span>
          </div>
        </div>
      ),
    },
    {
      key: "detail",
      header: "Description",
      cell: (record: BillingRecord) => (
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-slate-100 flex items-center justify-center shrink-0">
             <FileText className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="flex flex-col">
             <span className="text-sm font-medium text-foreground leading-tight">
                {record.description}
             </span>
             <span className="text-[10px] text-zinc-400 uppercase mt-0.5">
                {record.planName}
             </span>
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (record: BillingRecord) => (
        <div className="flex flex-col">
           <span className="text-sm font-semibold text-foreground tabular-nums">
             {record.amount}
           </span>
           <span className="text-[10px] text-zinc-400">
             Total
           </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (record: BillingRecord) => {
        const status = record.status.toUpperCase();
        const badgeStatus = status === "PAID" ? "APPROVED" : status === "PENDING" ? "PENDING" : "BLOCKED";
        return (
          <AdminStatusBadge status={badgeStatus}>
            {record.status}
          </AdminStatusBadge>
        );
      },
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (record: BillingRecord) => (
        <div className="flex justify-end pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-foreground hover:bg-zinc-100 rounded-lg transition-all">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl border-border shadow-lg">
              {record.url ? (
                <DropdownMenuItem
                  className="gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer"
                  onClick={() => window.open(record.url, "_blank")}
                >
                  <Download className="h-4 w-4 opacity-70" /> Download PDF
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer">
                  <ExternalLink className="h-4 w-4 opacity-70" /> View Receipt
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Billing History"
        description="View your recent invoices and transaction history."
        badgeText="Billing"
        icon={Receipt}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-2.5 text-xs text-zinc-400 px-1">
             <CreditCard className="h-3.5 w-3.5" />
             <span>Active Subscription</span>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={invoiceData.length > 0}>
             {invoiceData.length} Records
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
         <div className="px-6 py-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/50 mb-4">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-zinc-200">
                <Receipt className="h-4 w-4 text-zinc-400" />
              </div>
              <p className="text-[12px] text-zinc-500 leading-relaxed">
                Invoices are generated automatically at the end of each cycle. Contact support if you need help with your receipts.
              </p>
            </div>

            <AdminTable
              columns={columns}
              data={invoiceData}
              loading={loading}
              keyExtractor={(r) => r.id}
              emptyTitle="No invoices found"
              emptyDescription="Your billing history will appear here once your first cycle is processed."
            />
         </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
