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
import { Receipt, FileText, Download, Loader2, MoreHorizontal, AlertCircle } from "lucide-react";
import { useGetAllEntityInvoice } from "../../../graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";

interface BillingRecord {
  key: string;
  date: string;
  description: string | React.ReactElement;
  amount: string;
  status: string;
  url?: string;
  planName: string;
}

export default function Billing() {
  const { data, loading, error } = useGetAllEntityInvoice();

  // Transform API data to table format
  const invoiceData: BillingRecord[] =
    data?.getAllEntityInvoice?.map((inv, idx) => ({
      key: inv.billingId || idx.toString(),
      date: new Date(inv.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      description: inv.invoiceUrl ? (
        <span className="font-medium text-slate-800">
          Invoice for {inv.planName}
        </span>
      ) : (
        <span className="font-medium text-slate-800">
          {inv.notes || inv.planName}
        </span>
      ),
      amount: `${inv.currency} ${inv.amount.toFixed(2)}`,
      status: inv.status,
      url: inv.invoiceUrl || undefined,
      planName: inv.planName,
    })) || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Billing History"
        description="Monitor your subscription invoices, payment history, and financial transactions across the platform."
        breadcrumb="Financial Operations"
        icon={Receipt}
        badgeText="Billing"
        showLiveIndicator={false}
      />

      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
              <Receipt className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-slate-900 leading-none tracking-tight">
                Invoices & Receipts
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">
                A ledger of all settled and pending transactions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
              {invoiceData.length} records
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="w-full">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              <p className="text-[12px] font-medium text-slate-500">
                Retrieving Financial Records...
              </p>
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="flex items-start gap-3 px-4 py-3 border bg-red-50 border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-red-800">Connection to Ledger Failed</p>
                  <p className="text-[12px] text-red-700/80 mt-0.5 max-w-md">
                    Please contact support or try again later.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-white">
                    <th className="py-3 px-5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      Date
                    </th>
                    <th className="py-3 px-5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      Detail
                    </th>
                    <th className="py-3 px-5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      Amount
                    </th>
                    <th className="py-3 px-5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      Status
                    </th>
                    <th className="py-3 px-5 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceData.map((record) => (
                    <tr
                      key={record.key}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="text-[12px] font-medium text-slate-600">
                          {record.date}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-6 w-6 rounded border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                            <FileText className="h-3 w-3 text-slate-400" />
                          </div>
                          <div className="text-[13px] truncate max-w-xs md:max-w-md">
                            {record.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="text-[13px] font-semibold text-slate-900 tabular-nums">
                          {record.amount}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-widest",
                            record.status.toLowerCase() === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : record.status.toLowerCase() === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full shrink-0",
                              record.status.toLowerCase() === "paid"
                                ? "bg-emerald-500"
                                : record.status.toLowerCase() === "pending"
                                ? "bg-amber-500 animate-pulse"
                                : "bg-red-500"
                            )}
                          />
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl">
                            {record.url ? (
                              <DropdownMenuItem
                                className="text-[12px] font-medium gap-2 cursor-pointer"
                                onClick={() => window.open(record.url, "_blank")}
                              >
                                <Download className="h-3.5 w-3.5 text-slate-400" />
                                Download PDF
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-[12px] font-medium gap-2 cursor-pointer">
                                <FileText className="h-3.5 w-3.5 text-slate-400" />
                                View Receipt
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {invoiceData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Receipt className="h-8 w-8 mb-3 opacity-20" />
                          <p className="text-[13px] font-medium text-slate-900">
                            No transactions
                          </p>
                          <p className="text-[12px] text-slate-500 mt-1">
                            You have no invoicing records yet.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </EcosystemWrapper>
  );
}
