"use client";

import { useState, useMemo } from "react";
import {
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCw,
  Send,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  AdminTable,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import { CtaButton } from "@/components/ui/cta-button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock data – replace with real GraphQL query when available
// ---------------------------------------------------------------------------
type InviteStatus = "pending" | "accepted" | "expired";

interface EmailInvite {
  id: string;
  email: string;
  role: string;
  status: InviteStatus;
  sentAt: string;
  expiresAt: string;
}

const MOCK_INVITES: EmailInvite[] = [
  {
    id: "1",
    email: "alice@example.com",
    role: "Admin",
    status: "pending",
    sentAt: "2026-08-01T10:00:00Z",
    expiresAt: "2026-08-08T10:00:00Z",
  },
  {
    id: "2",
    email: "bob@example.com",
    role: "Member",
    status: "accepted",
    sentAt: "2026-07-28T09:00:00Z",
    expiresAt: "2026-08-04T09:00:00Z",
  },
  {
    id: "3",
    email: "carol@example.com",
    role: "Viewer",
    status: "expired",
    sentAt: "2026-07-15T08:00:00Z",
    expiresAt: "2026-07-22T08:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Status badge mapping
// ---------------------------------------------------------------------------
const statusConfig: Record<
  InviteStatus,
  {
    icon: React.ReactNode;
    label: string;
    badge: "ACTIVE" | "PENDING" | "EXPIRED";
  }
> = {
  pending: {
    icon: <Clock className="h-3 w-3" />,
    label: "Pending",
    badge: "PENDING",
  },
  accepted: {
    icon: <CheckCircle2 className="h-3 w-3" />,
    label: "Accepted",
    badge: "ACTIVE",
  },
  expired: {
    icon: <XCircle className="h-3 w-3" />,
    label: "Expired",
    badge: "EXPIRED",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function EmailInvitesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [invites] = useState<EmailInvite[]>(MOCK_INVITES);

  const filteredInvites = useMemo(
    () =>
      invites.filter(
        (inv) =>
          inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.role.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [invites, searchQuery],
  );

  const columns = [
    {
      key: "email",
      header: "Email Address",
      cell: (inv: EmailInvite) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate">
              {inv.email}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Invited {formatDate(inv.sentAt)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (inv: EmailInvite) => (
        <span className="text-sm font-medium text-foreground">{inv.role}</span>
      ),
    },
    {
      key: "expires",
      header: "Expires",
      cell: (inv: EmailInvite) => (
        <span
          className={cn(
            "text-xs font-medium",
            inv.status === "expired"
              ? "text-rose-500"
              : "text-muted-foreground",
          )}
        >
          {formatDate(inv.expiresAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (inv: EmailInvite) => {
        const cfg = statusConfig[inv.status];
        return (
          <AdminStatusBadge status={cfg.badge}>
            <span className="flex items-center gap-1">
              {cfg.icon}
              {cfg.label}
            </span>
          </AdminStatusBadge>
        );
      },
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (inv: EmailInvite) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-all"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 p-1 rounded-xl border-border"
            >
              {inv.status !== "accepted" && (
                <DropdownMenuItem className="gap-2.5 py-2 text-xs rounded-lg cursor-pointer">
                  <Send className="h-4 w-4 text-muted-foreground" /> Resend
                  Invite
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="gap-2.5 py-2 text-xs rounded-lg cursor-pointer text-rose-600 focus:bg-rose-50">
                <Trash2 className="h-4 w-4" /> Revoke
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Email Invites"
        description="Track and manage pending email invitations for your team."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Users", href: "/settings/users" },
          { label: "Email Invites" },
        ]}
        icon={Mail}
        badgeText="Invitations"
        showLiveIndicator={false}
        actions={
          <div className="flex items-center gap-2">
            <CtaButton onClick={() => {}}>
              <Send className="h-3 w-3" />
              Send Invite
            </CtaButton>
          </div>
        }
      />

      <div className="space-y-0">
        <EcosystemActionBar
          shadow="none"
          className="bg-transparent border-none py-2"
        >
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-sm">
              <EcosystemActionBar.Search
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search invites..."
              />
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>
          <EcosystemActionBar.Group align="right">
            <EcosystemActionBar.Item>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl text-muted-foreground border-border hover:text-foreground hover:bg-muted"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
          <div className="px-5">
            <AdminTable
              columns={columns}
              data={filteredInvites}
              loading={false}
              keyExtractor={(inv) => inv.id}
              emptyTitle="No invitations found"
              emptyDescription="No email invitations have been sent yet."
            />
          </div>
        </EcosystemContainer>
      </div>
    </EcosystemWrapper>
  );
}
