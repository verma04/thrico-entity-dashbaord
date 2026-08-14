"use client";

import React, { useState } from "react";
import { useGetEntityCurrencyWallets } from "@/graphql/actions/gamification/gamification-quiries";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableMetric,
  Pagination,
} from "@/components/shared/admin-table/admin-table";
import { Wallet, Coins, Search, History } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { HistoryLogModal } from "@/components/gamification/currency/history-log-modal";

export default function MemberWalletPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, loading } = useGetEntityCurrencyWallets({
    variables: {
      limit,
      offset,
      search: debouncedSearch.trim() || null,
    },
  });

  const rawUsersList = data?.getEntityCurrencyWallets?.data || [];
  const totalCount = data?.getEntityCurrencyWallets?.totalCount || 0;

  const columns: AdminTableColumn<any>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-10 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => offset + index + 1,
    },
    {
      key: "user",
      header: "Member",
      cell: (row) => {
        const user = row.user;
        if (!user) return null;
        return (
          <Link href={`/members/${user?.id}`}>
            <AdminTableItem
              avatar={user?.avatar}
              title={`${user?.firstName || ""} ${user?.lastName || ""}`}
              subtitle={user?.email}
              fallbackText={user?.firstName?.charAt(0)}
            />
          </Link>
        );
      },
    },
    {
      key: "wallet",
      header: "Wallet Balance",
      cell: (row) => {
        const wallet = row;
        return (
          <AdminTableMetric
            icon={Coins}
            value={
              wallet?.balance
                ? parseFloat(wallet.balance).toLocaleString()
                : "0"
            }
            variant="amber"
          />
        );
      },
    },
    {
      key: "earned",
      header: "Total Earned",
      cell: (row) => {
        const wallet = row;
        return (
          <AdminTableMetric
            value={`+${wallet?.totalEarned ? parseFloat(wallet.totalEarned).toLocaleString() : "0"}`}
            variant="emerald"
          />
        );
      },
    },
    {
      key: "spent",
      header: "Total Spent",
      cell: (row) => {
        const wallet = row;
        return (
          <AdminTableMetric
            value={`-${wallet?.totalSpent ? parseFloat(wallet.totalSpent).toLocaleString() : "0"}`}
            variant="rose"
          />
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "w-28 text-right",
      className: "text-right",
      isFixedRight: true,
      cell: (row) => {
        const user = row.user;
        if (!user) return null;
        return (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-[11px] font-medium gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setSelectedUserId(user.id);
              setSelectedUserName(`${user.firstName} ${user.lastName}`);
            }}
          >
            <History className="h-3 w-3" />
            History Log
          </Button>
        );
      },
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Member Wallets"
        description="View and manage virtual currency wallets for all members."
        icon={Wallet}
        badgeText="Currency"
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Currency", href: "/gamification/currency" },
          { label: "Member Wallets" },
        ]}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-9 h-9 w-full sm:w-[300px]"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={rawUsersList.length > 0}>
            Showing {rawUsersList.length} of {totalCount} Members
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <AdminTable
            data={rawUsersList}
            columns={columns}
            loading={loading}
            pageSize={1000}
            keyExtractor={(row) =>
              row.id || row.userId || Math.random().toString()
            }
            emptyState={
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Wallet className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">
                  No members found
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  There are no members matching your search criteria.
                </p>
              </div>
            }
          />
        </div>

        {!loading && totalCount > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(totalCount / limit)}
              totalItems={totalCount}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      <HistoryLogModal
        userId={selectedUserId}
        userName={selectedUserName}
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </EcosystemWrapper>
  );
}
