"use client";

import React from "react";
import { Link2, Cpu, CheckCircle2, ShieldCheck, Database, Zap, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AIConnectorsHealthProps {
  loading: boolean;
  adapter?: any;
}

export function AIConnectorsHealth({ loading, adapter }: AIConnectorsHealthProps) {
  const providers = [
    {
      name: "OpenAI Platform",
      models: "GPT-4o, o3-mini, text-embedding-3",
      status: "CONNECTED",
      ping: "124ms",
      quotaStatus: "Active Tier",
      icon: Cpu,
    },
    {
      name: "Anthropic Claude",
      models: "Claude 3.5 Sonnet, Claude 3 Opus",
      status: "CONNECTED",
      ping: "142ms",
      quotaStatus: "Active Tier",
      icon: Zap,
    },
    {
      name: "Google Gemini",
      models: "Gemini 1.5 Pro, Flash 8B",
      status: "CONNECTED",
      ping: "98ms",
      quotaStatus: "Active Tier",
      icon: Cpu,
    },
  ];

  const toolsAndMcp = [
    { name: "Model Context Protocol (MCP)", type: "Server Gateway", status: "Active (6 tools enabled)" },
    { name: "PostgreSQL Vector Store (pgvector)", type: "Knowledge Embeddings", status: "Synced (99.8% freshness)" },
    { name: "EventBridge Automation Worker", type: "Async Dispatcher", status: "Operational" },
    { name: "Shopify / Webhook Sync", type: "Commerce Connectors", status: "Connected" },
  ];

  return (
    <div id="kpi-section-connectors" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Link2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              5. Model Infrastructure & MCP Connectors
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Provider API gateways, Model Context Protocol (MCP) servers, and vector databases
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30">
          All Systems Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* LLM Providers */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardContent className="p-5 space-y-3">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Connected Foundation Models
            </span>

            <div className="space-y-2.5">
              {providers.map((prov, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{prov.name}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-[10.5px] text-muted-foreground">{prov.models}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                      {prov.ping}
                    </span>
                    <span className="text-[9.5px] text-muted-foreground">{prov.quotaStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MCP & Tool Connectors */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardContent className="p-5 space-y-3">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              MCP Tools & Knowledge Graph
            </span>

            <div className="space-y-2.5">
              {toolsAndMcp.map((tool, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">{tool.name}</span>
                    <p className="text-[10.5px] text-muted-foreground">{tool.type}</p>
                  </div>

                  <span className="text-[10px] font-semibold text-foreground px-2 py-0.5 rounded bg-background border border-border">
                    {tool.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
