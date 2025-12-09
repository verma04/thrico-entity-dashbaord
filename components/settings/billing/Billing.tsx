"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useGetAllEntityInvoice } from "../../../graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BillingRecord {
  key: string;
  date: string;
  description: string | React.ReactElement;
  amount: string;
  status: string;
}

export default function Billing() {
  const { data, loading, error } = useGetAllEntityInvoice();

  // Transform API data to table format
  const invoiceData: BillingRecord[] =
    data?.getAllEntityInvoice?.map((inv, idx) => ({
      key: inv.billingId || idx.toString(),
      date: new Date(inv.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      description: inv.invoiceUrl ? (
        <a
          href={inv.invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Invoice for {inv.planName}
        </a>
      ) : (
        inv.notes || inv.planName
      ),
      amount: `${inv.currency} ${inv.amount.toFixed(2)}`,
      status: inv.status,
    })) || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Billing</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-8" />
              </div>
            ))}
            <div className="text-center text-muted-foreground">
              Loading invoices...
            </div>
          </div>
        ) : error ? (
          <div className="text-destructive text-center py-8">
            Error loading invoices
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3 text-left font-semibold w-1/6">
                    Date
                  </th>
                  <th className="py-2 px-3 text-left font-semibold w-1/3">
                    Description
                  </th>
                  <th className="py-2 px-3 text-left font-semibold w-1/6">
                    Amount
                  </th>
                  <th className="py-2 px-3 text-left font-semibold w-1/6">
                    Status
                  </th>
                  <th className="py-2 px-3 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.map((record, idx) => (
                  <tr
                    key={record.key}
                    className={cn(
                      idx % 2 === 0 ? "bg-muted/40" : "",
                      "border-b last:border-0"
                    )}
                  >
                    <td className="py-2 px-3">{record.date}</td>
                    <td className="py-2 px-3">{record.description}</td>
                    <td className="py-2 px-3">{record.amount}</td>
                    <td className="py-2 px-3">
                      <span
                        className={cn(
                          "font-medium",
                          record.status === "paid"
                            ? "text-green-600"
                            : record.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        )}
                      >
                        {record.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {typeof record.description === "object" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                if (
                                  React.isValidElement(record.description) &&
                                  record.description.props?.href
                                ) {
                                  window.open(
                                    record.description.props.href,
                                    "_blank"
                                  );
                                }
                              }}
                            >
                              Download Invoice
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {invoiceData.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
