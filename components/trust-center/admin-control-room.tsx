"use client";

import React, { useState } from "react";
import { 
  Megaphone, 
  TrendingUp, 
  Star, 
  History,
  CheckCircle,
  FileText,
  AlertCircle,
  PenTool,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { Ticket, ModerationReport } from "./trust-center-dashboard";

interface AdminControlRoomProps {
  broadcastStats: {
    totalAnnouncements: number;
    policyComplianceRate: number;
  };
  tickets: Ticket[];
  reports: ModerationReport[];
  onSendBroadcast: (
    subject: string,
    body: string,
    audience: string,
    requiresSign: boolean,
    blockReplies: boolean
  ) => void;
}

export default function AdminControlRoom({
  broadcastStats,
  tickets,
  reports,
  onSendBroadcast
}: AdminControlRoomProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("All Users");
  const [requiresSign, setRequiresSign] = useState(false);
  const [blockReplies, setBlockReplies] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    
    onSendBroadcast(subject.trim(), body.trim(), audience, requiresSign, blockReplies);
    
    setSubject("");
    setBody("");
    setRequiresSign(false);
    setBlockReplies(false);

    setNotificationMsg("Broadcast Announcement deployed successfully!");
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcosystemCard>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Support SLA</span>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">2.1h</p>
            <p className="text-[10px] font-medium text-emerald-600 mt-1">18m faster than SLA</p>
          </div>
        </EcosystemCard>

        <EcosystemCard>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Signature Compliance</span>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <p className="text-2xl font-bold text-foreground">{broadcastStats.policyComplianceRate}%</p>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${broadcastStats.policyComplianceRate}%` }}
              />
            </div>
          </div>
        </EcosystemCard>

        <EcosystemCard>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Ecosystem CSAT</span>
            <Star className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">4.7 / 5.0</p>
            <p className="text-[10px] text-muted-foreground mt-1">Global satisfaction index</p>
          </div>
        </EcosystemCard>

        <EcosystemCard>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Broadcast Reach</span>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{broadcastStats.totalAnnouncements}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Announcements published</p>
          </div>
        </EcosystemCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Composer */}
        <EcosystemCard className="lg:col-span-5 flex flex-col p-0" innerClassName="p-0 h-full flex flex-col">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="text-sm font-semibold text-foreground">Broadcast Composer</h3>
          </div>

          <div className="p-4 space-y-4">
            {notificationMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {notificationMsg}
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground">Announcement Title</label>
                <Input
                  required
                  placeholder="e.g. Policy Update"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full h-9 px-3 text-sm bg-background border border-input rounded-md"
                >
                  <option value="All Users">All Users</option>
                  <option value="Moderator Desks">Moderator Desks Only</option>
                  <option value="Flagged Accounts">Flagged Accounts Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-foreground">Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write the announcement..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiresSign}
                    onChange={(e) => setRequiresSign(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-xs font-medium text-foreground">Require Acknowledgement</span>
                    <p className="text-[10px] text-muted-foreground">Force users to digitally sign and accept before continuing.</p>
                  </div>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blockReplies}
                    onChange={(e) => setBlockReplies(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-xs font-medium text-foreground">Block Replies</span>
                    <p className="text-[10px] text-muted-foreground">Deliver as informational only.</p>
                  </div>
                </label>
              </div>

              <Button type="submit" className="w-full">
                Publish Announcement
              </Button>
            </form>
          </div>
        </EcosystemCard>

        {/* Audit Logs */}
        <EcosystemCard className="lg:col-span-7 flex flex-col h-[600px] p-0" innerClassName="p-0 h-full flex flex-col">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="text-sm font-semibold text-foreground">Audit & Ticket Logs</h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5" /> Tickets & Policies
              </div>
              
              <div className="divide-y divide-border border border-border rounded-lg bg-card overflow-hidden">
                {tickets.map((t) => (
                  <div key={t.id} className="p-3 flex items-start justify-between gap-4 bg-muted/10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] px-1.5 h-4">
                          {t.type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{t.id}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{t.subject}</p>
                      <p className="text-[10px] text-muted-foreground">By: {t.creator} • {t.lastActivity}</p>
                    </div>

                    <div className="text-right">
                      <Badge variant="secondary" className="text-[9px] h-5 mb-1">
                        {t.status.replace("_", " ")}
                      </Badge>
                      {t.signed && (
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block font-medium">
                          Signed: {t.signatureText}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                <AlertCircle className="h-3.5 w-3.5" /> Safety Signals
              </div>

              <div className="divide-y divide-border border border-border rounded-lg bg-card overflow-hidden">
                {reports.map((r) => (
                  <div key={r.id} className="p-3 flex items-center justify-between gap-4 bg-muted/10">
                    <div className="space-y-1 truncate">
                      <p className="text-sm font-medium text-foreground truncate">"{r.contentPreview}"</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{r.id}</span>
                        <span>•</span>
                        <span>User: {r.reportedUser}</span>
                        <span>•</span>
                        <span className={cn(r.status === "PENDING" ? "text-amber-500" : "text-emerald-500")}>{r.status}</span>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-[9px] h-5 shrink-0 bg-background">
                      AI {r.confidence}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </EcosystemCard>
      </div>
    </div>
  );
}
