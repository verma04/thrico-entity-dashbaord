"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_ANNOUNCEMENT, CREATE_SUPPORT_TICKET, REPLY_SUPPORT_TICKET, UPDATE_SUPPORT_TICKET } from "@/graphql/quries/trust-center";
import { TrustCenterActionBar } from "./trust-center-action-bar";
import MemberInboxPortal from "./member-inbox";
import ModeratorWorkspace from "./moderator-workspace";
import { AnnouncementsManager } from "./announcements-manager";

// ===========================================================================
// SHARED TYPES
// ===========================================================================

export interface Message {
  id: string;
  sender: "user" | "staff" | "system";
  senderName: string;
  body: string;
  timestamp: string;
  attachments?: string[];
}

export interface Ticket {
  id: string;
  subject: string;
  category:
    | "General Inquiry"
    | "Entity Support"
    | "Moderation"
    | "Appeals"
    | "Security Notices"
    | "Policy Updates"
    | "Announcement";
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  lastActivity: string;
  creator: string;
  creatorAvatar?: string;
  creatorId?: string;
  creatorData?: any;
  type: "conversation" | "appeal" | "alert" | "policy" | "announcement";
  replyMode?: "interactive" | "read-only";
  allowedReplies?: boolean;
  messages?: Message[];
  signed?: boolean;
  signedAt?: string;
  signatureText?: string;
  description?: string;
  linkedUser?: string;
  subCategory?: string;
}

export interface ModerationReport {
  id: string;
  contentType: "POST" | "COMMENT" | "PROFILE";
  contentPreview: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  confidence: number;
  category: "Spam" | "Harassment" | "Offensive Language" | "Malicious Links";
  createdAt: string;
}

export interface Strike {
  id: string;
  type: "Warning" | "Restriction" | "Suspension" | "Ban Review";
  reason: string;
  date: string;
  status: "Active" | "Resolved" | "Appealed";
  issuedBy: string;
  internalNote?: string;
}

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================

export default function TrustCenterDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  let currentRole: "member" | "moderator" | "announcements" = "member";
  if (pathname.includes("/moderator")) currentRole = "moderator";
  if (pathname.includes("/announcements")) currentRole = "announcements";

  const [role, setRole] = useState<"member" | "moderator" | "announcements">(currentRole);

  const [createTicketMutation] = useMutation(CREATE_SUPPORT_TICKET);
  const [createAnnouncementMutation] = useMutation(CREATE_ANNOUNCEMENT);
  const [replyTicketMutation] = useMutation(REPLY_SUPPORT_TICKET);
  const [updateTicketMutation] = useMutation(UPDATE_SUPPORT_TICKET);

  const handleRoleChange = (newRole: "member" | "moderator" | "announcements") => {
    setRole(newRole);
    router.push(`/trust-center/${newRole}`);
  };

  const handleCreateTicket = async (
    subject: string,
    category: any,
    subCategory: string | undefined,
    description: string,
    targetUserId?: string,
    targetUserIds?: string[],
    allowReplies: boolean = true,
    recipientType: "all" | "one" | "multiple" = "one"
  ) => {
    const isBroadcast = recipientType === "all";

    try {
      if (isBroadcast) {
        await createAnnouncementMutation({
          variables: {
            input: {
              subject,
              description,
              category: category === "Policy Updates" ? "POLICY_UPDATES" : category === "Security Notices" ? "SECURITY_NOTICES" : "ANNOUNCEMENT",
              allowReplies,
              ttl: "no"
            }
          }
        });
      } else {
        await createTicketMutation({
          variables: {
            input: {
              subject,
              description,
              category: category.toUpperCase().replace(" ", "_"),
              subCategory: subCategory ? subCategory.toUpperCase().replace(" ", "_") : null,
              recipientType: recipientType === "multiple" ? "MULTIPLE" : "ONE",
              allowReplies,
              targetUserId,
              targetUserIds
            }
          }
        });
      }
    } catch (e) {
      console.error("Failed to create:", e);
    }
  };

  const handleReplyTicket = async (ticketId: string, body: string) => {
    try {
      await replyTicketMutation({
        variables: { ticketId, body },
        refetchQueries: ["GetTicketMessages", "GetSupportTickets"],
      });
    } catch (e) {
      console.error("Failed to reply:", e);
    }
  };

  const handleUpdateTicket = async (ticketId: string, input: { status?: string; priority?: string; allowReplies?: boolean }) => {
    try {
      await updateTicketMutation({
        variables: { id: ticketId, input },
      });
    } catch (e) {
      console.error("Failed to update ticket:", e);
    }
  };

  const handleAdminBroadcast = async (
    subject: string,
    body: string,
    audience: string,
    requiresSign: boolean,
    blockReplies: boolean
  ) => {
    try {
      await createAnnouncementMutation({
        variables: {
          input: {
            subject,
            description: body,
            category: requiresSign ? "POLICY_UPDATES" : "SECURITY_NOTICES",
            allowReplies: !blockReplies,
            ttl: "no"
          }
        }
      });
    } catch (e) {
      console.error("Failed to broadcast:", e);
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Trust Center"
        badgeText="Safety Hub"
        description="Centralized moderation, support tickets, policy acknowledgements, and broadcast telemetry."
        icon={ShieldCheck}
      />

      <TrustCenterActionBar
        nextSyncSeconds={30}
        syncing={false}
        role={role}
        onSync={() => {}}
        onRoleChange={handleRoleChange}
      />

      <div className="relative">
        {role === "member" && (
          <MemberInboxPortal
            onSignPolicy={(id, signature) => console.log("Sign policy", id, signature)}
            onReply={handleReplyTicket}
            onUpdateTicket={handleUpdateTicket}
            onCreateTicket={handleCreateTicket}
            onCreateAppeal={(subject, description) => console.log("Create appeal", subject, description)}
          />
        )}

        {role === "moderator" && (
          <ModeratorWorkspace
            reports={[]}
            tickets={[]}
            onResolveReport={(id, action, targetUser, comment) => console.log("Resolve report", id, action, targetUser, comment)}
            onReplyAppeal={(id, body) => console.log("Reply appeal", id, body)}
          />
        )}

        {role === "announcements" && (
          <AnnouncementsManager />
        )}
      </div>
    </EcosystemWrapper>
  );
}
