"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  CheckCircle, 
  Trash2, 
  AlertTriangle, 
  FileText,
  Reply,
  Scale,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { ModerationReport, Ticket } from "./trust-center-dashboard";

interface ModeratorWorkspaceProps {
  reports: ModerationReport[];
  tickets: Ticket[];
  onResolveReport: (id: string, action: "DISMISS" | "STRIKE" | "WARN", targetUser: string, comment?: string) => void;
  onReplyAppeal: (id: string, body: string) => void;
}

export default function ModeratorWorkspace({
  reports,
  tickets,
  onResolveReport,
  onReplyAppeal
}: ModeratorWorkspaceProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(reports[0]?.id || null);
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(
    tickets.find((t) => t.type === "appeal")?.id || null
  );
  
  const [internalNote, setInternalNote] = useState("");
  const [appealReply, setAppealReply] = useState("");

  const pendingReports = reports.filter((r) => r.status === "PENDING");
  const activeAppeals = tickets.filter((t) => t.type === "appeal" && t.status !== "resolved");

  const selectedReport = reports.find((r) => r.id === selectedReportId) || pendingReports[0] || null;
  const selectedAppeal = tickets.find((t) => t.id === selectedAppealId) || activeAppeals[0] || null;

  const handleResolve = (action: "DISMISS" | "STRIKE" | "WARN") => {
    if (!selectedReport) return;
    onResolveReport(selectedReport.id, action, selectedReport.reportedUser, internalNote);
    setInternalNote("");
    const nextPending = pendingReports.find((r) => r.id !== selectedReport.id);
    setSelectedReportId(nextPending?.id || null);
  };

  const handleSendAppealReply = () => {
    if (!appealReply.trim() || !selectedAppeal) return;
    onReplyAppeal(selectedAppeal.id, appealReply.trim());
    setAppealReply("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EcosystemCard>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Reports Queue</span>
              <p className="text-2xl font-bold text-foreground mt-1">{pendingReports.length}</p>
            </div>
            <ShieldAlert className="h-5 w-5 text-muted-foreground" />
          </div>
        </EcosystemCard>
        <EcosystemCard>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Active Appeals</span>
              <p className="text-2xl font-bold text-foreground mt-1">{activeAppeals.length}</p>
            </div>
            <Scale className="h-5 w-5 text-muted-foreground" />
          </div>
        </EcosystemCard>
        <EcosystemCard>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Auto-Shield Stats</span>
              <p className="text-2xl font-bold text-foreground mt-1">94.8%</p>
            </div>
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </div>
        </EcosystemCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module A: Report Triage Workspace */}
        <EcosystemCard className="lg:col-span-7 flex flex-col h-[600px] p-0" innerClassName="p-0 h-full flex flex-col">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="text-sm font-semibold text-foreground">Safety Triage Console</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0">
            {/* Sidebar pending items */}
            <div className="md:col-span-5 flex flex-col h-full border-r border-border">
              <div className="p-3 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Awaiting Evaluation</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {pendingReports.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Queue is clear.</p>
                  </div>
                ) : (
                  pendingReports.map((r) => {
                    const isActive = selectedReport?.id === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedReportId(r.id)}
                        className={cn(
                          "p-3 cursor-pointer transition-colors",
                          isActive ? "bg-muted/60" : "hover:bg-muted/30"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-[9px] px-1.5 h-4">
                            {r.category}
                          </Badge>
                          <span className="text-[9px] text-muted-foreground">{r.id}</span>
                        </div>
                        <p className="text-[13px] font-medium text-foreground truncate">{r.contentPreview}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-muted-foreground">By: {r.reportedUser}</span>
                          <span className="text-[10px] text-muted-foreground">AI: {r.confidence}%</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Evaluation workspace */}
            <div className="md:col-span-7 p-4 flex flex-col h-full overflow-y-auto">
              {selectedReport ? (
                <div className="space-y-4 flex flex-col h-full">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[9px] px-1.5 h-4 mb-1">
                      {selectedReport.category}
                    </Badge>
                    <h4 className="text-sm font-semibold text-foreground">Report: {selectedReport.id}</h4>
                  </div>

                  <div className="p-4 border border-border rounded-lg bg-muted/10 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Target: <strong className="text-foreground">{selectedReport.reportedUser}</strong></span>
                      <span>Reporter: <strong className="text-foreground">{selectedReport.reportedBy}</strong></span>
                    </div>
                    <blockquote className="border-l-2 border-border pl-3 py-1 text-sm text-foreground">
                      "{selectedReport.contentPreview}"
                    </blockquote>
                    <p className="text-xs text-muted-foreground">Reason: <strong className="text-foreground">{selectedReport.reason}</strong></p>
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" /> Internal Note
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add moderation observations..."
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring/20"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border mt-auto">
                    <Button variant="outline" size="sm" onClick={() => handleResolve("DISMISS")} className="text-xs">
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Dismiss
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleResolve("WARN")} className="text-xs">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-amber-500" /> Warn
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleResolve("STRIKE")} className="text-xs">
                      <ShieldAlert className="h-3.5 w-3.5 mr-1.5" /> Strike
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Select a report to evaluate.</p>
                </div>
              )}
            </div>
          </div>
        </EcosystemCard>

        {/* Module B: Appeals Dispute Solver */}
        <EcosystemCard className="lg:col-span-5 flex flex-col h-[600px] p-0" innerClassName="p-0 h-full flex flex-col">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="text-sm font-semibold text-foreground">Active Appeals Desk</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0">
            <div className="md:col-span-5 flex flex-col h-full border-r border-border">
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {activeAppeals.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No pending appeals</p>
                  </div>
                ) : (
                  activeAppeals.map((a) => {
                    const isActive = selectedAppeal?.id === a.id;
                    return (
                      <div
                        key={a.id}
                        onClick={() => setSelectedAppealId(a.id)}
                        className={cn(
                          "p-3 cursor-pointer transition-colors border-l-2",
                          isActive ? "bg-muted/60 border-primary" : "hover:bg-muted/30 border-transparent"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-[9px] px-1.5 h-4">
                            {a.category}
                          </Badge>
                          <span className="text-[9px] text-muted-foreground">{a.id}</span>
                        </div>
                        <p className="text-[12px] font-medium text-foreground truncate">{a.subject}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">By: {a.creator}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="md:col-span-7 p-4 flex flex-col h-full overflow-y-auto">
              {selectedAppeal ? (
                <div className="space-y-4 flex flex-col h-full">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Appellant: {selectedAppeal.creator}</span>
                      <span>{selectedAppeal.id}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">{selectedAppeal.subject}</h4>
                    
                    <div className="p-3 bg-muted/10 border border-border rounded-lg space-y-2">
                      <p className="text-xs text-muted-foreground">Initial Defense Statement:</p>
                      <p className="text-sm text-foreground">
                        "{selectedAppeal.messages[0]?.body}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 flex flex-col">
                    <div className="border-t border-border pt-3 flex-1 overflow-y-auto">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Historical Thread</p>
                      <div className="space-y-2">
                        {selectedAppeal.messages.slice(1).map((m) => (
                          <div key={m.id} className="p-3 bg-card border border-border rounded-lg space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>{m.senderName} ({m.sender})</span>
                              <span>{m.timestamp}</span>
                            </div>
                            <p className="text-xs text-foreground">{m.body}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 mt-auto border-t border-border">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Reply className="h-3.5 w-3.5" /> Appeal Response
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type response..."
                          value={appealReply}
                          onChange={(e) => setAppealReply(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendAppealReply()}
                          className="flex-1 px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring/20"
                        />
                        <Button size="sm" onClick={handleSendAppealReply}>
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Appeals queue is clear.</p>
                </div>
              )}
            </div>
          </div>
        </EcosystemCard>
      </div>
    </div>
  );
}
