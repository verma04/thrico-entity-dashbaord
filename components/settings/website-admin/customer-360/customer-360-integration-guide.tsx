"use client";

import React, { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  Terminal,
  FileCode,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PolarisFormCard, PolarisTipCard } from "@/components/gamification/shared/polaris-form-ui";
import { toast } from "sonner";

interface Customer360IntegrationGuideProps {
  apiKey?: string;
}

type LangTab = "curl" | "fetch" | "node";

export function Customer360IntegrationGuide({
  apiKey = "YOUR_CUSTOMER_360_KEY",
}: Customer360IntegrationGuideProps) {
  const [activeTab, setActiveTab] = useState<LangTab>("curl");
  const [copied, setCopied] = useState(false);

  const snippets: Record<LangTab, string> = {
    curl: `# Query unified Customer 360 profile
curl -X POST https://api.thrico.io/v1/customer-360 \\
  -H "Content-Type: application/json" \\
  -H "X-Customer-360-Key: ${apiKey}" \\
  -d '{
    "query": "query { getCustomer360(userId: \\"user_123\\") { id name email metrics { attendanceRate forumPosts } } }"
  }'`,

    fetch: `// Client / Server TypeScript Integration
const response = await fetch("https://api.thrico.io/v1/customer-360", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Customer-360-Key": "${apiKey}",
  },
  body: JSON.stringify({
    userId: "user_123",
    includeMetrics: true,
  }),
});

const customer360 = await response.json();
console.log("Customer Intelligence:", customer360);`,

    node: `// Node.js Backend Microservice
import axios from "axios";

const client = axios.create({
  baseURL: "https://api.thrico.io/v1",
  headers: {
    "X-Customer-360-Key": "${apiKey}",
  },
});

export async function fetchMemberSummary(userId: string) {
  const { data } = await client.get(\`/customer-360/\${userId}\`);
  return data;
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    toast.success("Code snippet copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PolarisFormCard
      icon={Code2}
      title="Developer Integration Guide"
      description="Quick integration snippets for authenticating with the Customer 360 GraphQL & REST gateways."
    >
      <div className="space-y-3 pt-1">
        {/* Language Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-[#e1e3e5] dark:border-zinc-800 pb-2">
          <div className="flex items-center gap-1.5">
            <Button
              variant={activeTab === "curl" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("curl")}
              className="h-7 text-xs font-medium px-2.5 gap-1.5"
            >
              <Terminal className="h-3 w-3" />
              cURL
            </Button>
            <Button
              variant={activeTab === "fetch" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("fetch")}
              className="h-7 text-xs font-medium px-2.5 gap-1.5"
            >
              <FileCode className="h-3 w-3" />
              Fetch (JS / TS)
            </Button>
            <Button
              variant={activeTab === "node" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("node")}
              className="h-7 text-xs font-medium px-2.5 gap-1.5"
            >
              <Code2 className="h-3 w-3" />
              Node.js Axios
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 gap-1 px-2.5 text-xs bg-white dark:bg-zinc-900 shadow-2xs font-sans"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy Code</span>
              </>
            )}
          </Button>
        </div>

        {/* Code View */}
        <div className="relative">
          <pre className="p-3.5 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
            <code>{snippets[activeTab]}</code>
          </pre>
        </div>

        {/* Security Note */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Security Reminder:</strong> Never expose your secret Customer 360 key in public repositories, frontend single-page application bundles, or mobile app source code.
          </span>
        </div>
      </div>
    </PolarisFormCard>
  );
}
