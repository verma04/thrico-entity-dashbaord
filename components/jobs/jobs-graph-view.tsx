"use client";

import React, { useMemo, useState } from "react";
import {
  useGetJobsUsersGraph,
  JobsGraphUser,
  JobsGraphJob,
} from "@/graphql/quries/jobs/jobs-graph-queries";
import type cytoscape from "cytoscape";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { X, Briefcase, Search } from "lucide-react";
import { EcosystemGraphView } from "@/components/shared/ecosystem-graph-view";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";

const GRAPH_STYLESHEET: cytoscape.Stylesheet[] = [
  {
    selector: "node[type='user']",
    style: {
      "background-color": "#f1f5f9",
      label: "data(label)",
      color: "#334155",
      "text-valign": "bottom",
      "text-halign": "center",
      "font-size": "10px",
      "font-weight": "500",
      width: 40,
      height: 40,
      shape: "ellipse",
      "border-width": 1.5,
      "border-color": "#cbd5e1",
      "text-margin-y": 8,
      "text-outline-width": 0,
      "overlay-padding": 6,
      "background-image": "data(avatar)",
      "background-fit": "cover",
      "background-clip": "node",
    } as any,
  },
  {
    selector: "node[type='user'][!avatar]",
    style: {
      "background-color": "#f1f5f9",
      "background-image": "none",
    } as any,
  },
  {
    selector: "node[type='job']",
    style: {
      "background-color": "#fef3c7",
      label: "data(label)",
      color: "#92400e",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "11px",
      "font-weight": "600",
      width: "data(size)",
      height: "data(size)",
      shape: "round-rectangle",
      "border-width": 1.5,
      "border-color": "#fde68a",
      "text-outline-width": 0,
      "overlay-padding": 8,
      "text-max-width": "80px",
      "text-wrap": "wrap",
    } as any,
  },
  {
    selector: "edge",
    style: {
      width: 1,
      label: "data(label)",
      "font-size": "8px",
      "text-rotation": "autorotate",
      "text-background-color": "#ffffff",
      "text-background-opacity": 0.8,
      "text-background-padding": 2,
      color: "#94a3b8",
      "line-color": "#e2e8f0",
      "target-arrow-color": "#e2e8f0",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      opacity: 0.8,
      "arrow-scale": 0.6,
    } as any,
  },
  {
    selector: "node:active",
    style: {
      "overlay-color": "#0f172a",
      "overlay-padding": 10,
      "overlay-opacity": 0.05,
    } as any,
  },
  {
    selector: "node.highlighted",
    style: {
      "border-color": "#0f172a",
      "border-width": 1.5,
      "z-index": 999,
    } as any,
  },
  {
    selector: "edge.highlighted",
    style: {
      width: 1.5,
      "line-color": "#94a3b8",
      "target-arrow-color": "#94a3b8",
      color: "#475569",
      opacity: 1,
      "z-index": 999,
    } as any,
  },
  {
    selector: "node.faded",
    style: {
      opacity: 0.2,
    } as any,
  },
  {
    selector: "edge.faded",
    style: {
      opacity: 0.1,
    } as any,
  },
];

type SelectedNodeInfo =
  | {
      type: "user";
      data: JobsGraphUser;
      connectedJobs: Array<{ title: string; relationType: string }>;
    }
  | {
      type: "job";
      data: JobsGraphJob;
      connectedUsers: Array<{ user: JobsGraphUser; relationType: string }>;
    };

function NodeDetailPanel({
  info,
  onClose,
}: {
  info: SelectedNodeInfo;
  onClose: () => void;
}) {
  if (info.type === "user") {
    const user = info.data;
    const avatarUrl = user.avatar
      ? `https://cdn.thrico.network/${user.avatar}`
      : "";
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";

    return (
      <div className="absolute top-4 left-4 z-20 w-72 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
        <div className="h-16 bg-slate-50 border-b border-slate-100 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 h-6 w-6 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200/50"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="-mt-8 px-4">
          <UserProfileHoverCard
            user={{
              id: user.globalUserId,
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.avatar,
              headline: user.headline,
            }}
          >
            <Avatar className="h-16 w-16 border-[3px] border-white shadow-sm bg-white cursor-pointer">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-slate-100 text-slate-600 text-lg font-medium">
                {user.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </UserProfileHoverCard>
        </div>
        <div className="px-4 pt-2 pb-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {name}
            </h3>
            {user.headline && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                {user.headline}
              </p>
            )}
          </div>
          {info.connectedJobs.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Jobs ({info.connectedJobs.length})
              </p>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {info.connectedJobs.map((job, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col px-2 py-1.5 rounded-md bg-slate-50 border border-slate-200"
                  >
                    <span className="text-xs font-medium text-slate-700">
                      {job.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {job.relationType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const job = info.data;
  return (
    <div className="absolute top-4 left-4 z-20 w-72 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
      <div className="h-12 bg-slate-50 border-b border-slate-100 relative flex items-center px-4">
        <Briefcase className="h-4 w-4 text-slate-400 mr-2" />
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          Job
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 h-6 w-6 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200/50"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="px-4 py-4 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">{job.title}</h3>
        {info.connectedUsers.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Users ({info.connectedUsers.length})
            </p>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {info.connectedUsers.map(({ user, relationType }, idx) => {
                const avatarUrl = user.avatar
                  ? `https://cdn.thrico.network/${user.avatar}`
                  : "";
                const uname =
                  [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                  "User";
                return (
                  <UserProfileHoverCard
                    key={idx}
                    user={{
                      id: user.globalUserId,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      avatar: user.avatar,
                      headline: user.headline,
                    }}
                  >
                    <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                      <Avatar className="h-7 w-7 border border-slate-200 bg-white">
                        <AvatarImage src={avatarUrl} alt={uname} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {user.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">
                          {uname}
                        </p>
                        <p className="text-[10px] text-amber-600 font-medium">
                          {relationType}
                        </p>
                      </div>
                    </div>
                  </UserProfileHoverCard>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function JobsGraphView() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, loading } = useGetJobsUsersGraph({
    variables: { limit: 100, search: search.length > 0 ? search : undefined },
  });
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(
    null,
  );

  const elements = useMemo(() => {
    const edges = data?.getJobsUsersGraph || [];
    if (edges.length === 0) return [];

    const userNodes = new Map<string, any>();
    const jobNodes = new Map<string, { count: number; data: any }>();
    const graphEdges: any[] = [];

    edges.forEach((edge) => {
      const userId = `user-${edge.user.id}`;
      const jobId = `job-${edge.job.id}`;

      if (!userNodes.has(userId)) {
        const name =
          [edge.user.firstName, edge.user.lastName].filter(Boolean).join(" ") ||
          "User";
        const avatarUrl = edge.user.avatar
          ? `https://cdn.thrico.network/${edge.user.avatar}`
          : "";
        userNodes.set(userId, {
          data: {
            id: userId,
            label: name,
            type: "user",
            avatar: avatarUrl || undefined,
            raw: edge.user,
          },
        });
      }

      if (!jobNodes.has(jobId)) {
        jobNodes.set(jobId, {
          count: 1,
          data: edge.job,
        });
      } else {
        jobNodes.get(jobId)!.count++;
      }

      graphEdges.push({
        data: {
          id: `edge-${edge.user.id}-${edge.job.id}`,
          source: userId,
          target: jobId,
          label: edge.relationType || "",
        },
      });
    });

    const jobElements = Array.from(jobNodes.entries()).map(
      ([id, { count, data: jobData }]) => {
        const size = Math.max(40, Math.min(80, 30 + count * 10));
        return {
          data: {
            id,
            label: jobData.title,
            type: "job",
            size,
            count,
            raw: jobData,
          },
        };
      },
    );

    return [...Array.from(userNodes.values()), ...jobElements, ...graphEdges];
  }, [data]);

  const graphData = useMemo(() => {
    const edges = data?.getJobsUsersGraph || [];
    const userJobs = new Map<
      string,
      Array<{ title: string; relationType: string }>
    >();
    const jobUsers = new Map<
      string,
      Array<{ user: JobsGraphUser; relationType: string }>
    >();

    edges.forEach((edge) => {
      const uid = edge.user.id;
      const jid = edge.job.id;

      if (!userJobs.has(uid)) userJobs.set(uid, []);
      userJobs
        .get(uid)!
        .push({ title: edge.job.title, relationType: edge.relationType || "" });

      if (!jobUsers.has(jid)) jobUsers.set(jid, []);
      jobUsers
        .get(jid)!
        .push({ user: edge.user, relationType: edge.relationType || "" });
    });

    return { userJobs, jobUsers };
  }, [data]);

  const handleNodeSelect = (nodeData: any) => {
    if (nodeData.type === "user") {
      const rawUser = nodeData.raw as JobsGraphUser;
      const connectedJobs = graphData.userJobs.get(rawUser.id) || [];
      setSelectedNode({ type: "user", data: rawUser, connectedJobs });
    } else if (nodeData.type === "job") {
      const rawJob = nodeData.raw as JobsGraphJob;
      const connectedUsers = graphData.jobUsers.get(rawJob.id) || [];
      setSelectedNode({
        type: "job",
        data: rawJob,
        connectedUsers,
      });
    }
  };

  const legend = (
    <>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-slate-100 border border-slate-300" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Users
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded bg-amber-100 border border-amber-200" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Jobs
        </span>
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 max-w-sm ml-4 mt-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search jobs or users..."
            className="pl-9 bg-white"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>
      <EcosystemGraphView
        elements={elements}
        stylesheet={GRAPH_STYLESHEET}
        loading={loading}
        loadingText="Loading jobs graph..."
        emptyTitle="No graph data available"
        emptyDescription="There are no user-job relationships to visualize yet."
        legend={legend}
        selectedNodeId={selectedNode ? selectedNode.data.id : null}
        onNodeSelect={handleNodeSelect}
        onNodeDeselect={() => setSelectedNode(null)}
        detailPanel={
          selectedNode ? (
            <NodeDetailPanel
              info={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          ) : null
        }
      />
    </div>
  );
}
