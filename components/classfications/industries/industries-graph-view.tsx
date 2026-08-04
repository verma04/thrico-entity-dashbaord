"use client";

import React, { useMemo, useState } from "react";
import {
  useGetUserIndustriesGraph,
  IndustryGraphUser,
  IndustryGraphIndustry,
} from "@/graphql/quries/industries/industry-queries";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Briefcase } from "lucide-react";
import { EcosystemGraphView } from "@/components/shared/ecosystem-graph-view";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";

const GRAPH_STYLESHEET: any[] = [
  {
    selector: "node[type='user']",
    style: {
      "background-color": "#e0e7ff",
      label: "data(label)",
      color: "#3730a3",
      "text-valign": "bottom",
      "text-halign": "center",
      "font-size": "10px",
      "font-weight": "500",
      width: 40,
      height: 40,
      shape: "ellipse",
      "border-width": 1.5,
      "border-color": "#c7d2fe",
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
      "background-color": "#e0e7ff",
      "background-image": "none",
    } as any,
  },
  {
    selector: "node[type='industry']",
    style: {
      "background-color": "#dbeafe",
      label: "data(label)",
      color: "#1e40af",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "11px",
      "font-weight": "600",
      width: "data(size)",
      height: "data(size)",
      shape: "round-rectangle",
      "border-width": 1.5,
      "border-color": "#bfdbfe",
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
  | { type: "user"; data: IndustryGraphUser; connectedIndustries: string[] }
  | {
      type: "industry";
      data: IndustryGraphIndustry;
      connectedUsers: IndustryGraphUser[];
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
          {info.connectedIndustries.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Industries ({info.connectedIndustries.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {info.connectedIndustries.map((industry) => (
                  <span
                    key={industry}
                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-50 text-slate-600 border border-slate-200"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const industry = info.data;
  return (
    <div className="absolute top-4 left-4 z-20 w-72 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
      <div className="h-12 bg-slate-50 border-b border-slate-100 relative flex items-center px-4">
        <Briefcase className="h-4 w-4 text-slate-400 mr-2" />
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          Industry
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
        <h3 className="text-sm font-semibold text-slate-900">
          {industry.title}
        </h3>
        {info.connectedUsers.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Members ({info.connectedUsers.length})
            </p>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {info.connectedUsers.map((user) => {
                const avatarUrl = user.avatar
                  ? `https://cdn.thrico.network/${user.avatar}`
                  : "";
                const uname =
                  [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                  "User";
                return (
                  <UserProfileHoverCard
                    key={user.id}
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
                        {user.headline && (
                          <p className="text-[10px] text-slate-500 truncate">
                            {user.headline}
                          </p>
                        )}
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

export function IndustriesGraphView() {
  const { data, loading } = useGetUserIndustriesGraph({
    variables: { limit: 100 },
  });
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(
    null,
  );

  const elements = useMemo(() => {
    const edges = data?.getUserIndustriesGraph || [];
    if (edges.length === 0) return [];

    const userNodes = new Map<string, any>();
    const industryNodes = new Map<string, { count: number; data: any }>();
    const graphEdges: any[] = [];

    edges.forEach((edge) => {
      const userId = `user-${edge.user.id}`;
      const industryId = `industry-${edge.industry.id}`;

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

      if (!industryNodes.has(industryId)) {
        industryNodes.set(industryId, {
          count: 1,
          data: edge.industry,
        });
      } else {
        industryNodes.get(industryId)!.count++;
      }

      graphEdges.push({
        data: {
          id: `edge-${edge.user.id}-${edge.industry.id}`,
          source: userId,
          target: industryId,
        },
      });
    });

    const industryElements = Array.from(industryNodes.entries()).map(
      ([id, { count, data: industryData }]) => {
        const size = Math.max(40, Math.min(80, 30 + count * 10));
        return {
          data: {
            id,
            label: industryData.title,
            type: "industry",
            size,
            count,
            raw: industryData,
          },
        };
      },
    );

    return [
      ...Array.from(userNodes.values()),
      ...industryElements,
      ...graphEdges,
    ];
  }, [data]);

  const graphData = useMemo(() => {
    const edges = data?.getUserIndustriesGraph || [];
    const userIndustries = new Map<string, string[]>();
    const industryUsers = new Map<string, IndustryGraphUser[]>();

    edges.forEach((edge) => {
      const uid = edge.user.id;
      const iid = edge.industry.id;

      if (!userIndustries.has(uid)) userIndustries.set(uid, []);
      if (!userIndustries.get(uid)!.includes(edge.industry.title)) {
        userIndustries.get(uid)!.push(edge.industry.title);
      }

      if (!industryUsers.has(iid)) industryUsers.set(iid, []);
      if (!industryUsers.get(iid)!.find((u) => u.id === uid)) {
        industryUsers.get(iid)!.push(edge.user);
      }
    });

    return { userIndustries, industryUsers };
  }, [data]);

  const handleNodeSelect = (nodeData: any) => {
    if (nodeData.type === "user") {
      const rawUser = nodeData.raw as IndustryGraphUser;
      const connectedIndustries =
        graphData.userIndustries.get(rawUser.id) || [];
      setSelectedNode({ type: "user", data: rawUser, connectedIndustries });
    } else if (nodeData.type === "industry") {
      const rawIndustry = nodeData.raw as IndustryGraphIndustry;
      const connectedUsers = graphData.industryUsers.get(rawIndustry.id) || [];
      setSelectedNode({
        type: "industry",
        data: rawIndustry,
        connectedUsers,
      });
    }
  };

  const legend = (
    <>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-indigo-100 border border-indigo-200" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Users
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded bg-blue-100 border border-blue-200" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Industries
        </span>
      </div>
    </>
  );

  return (
    <EcosystemGraphView
      elements={elements}
      stylesheet={GRAPH_STYLESHEET}
      loading={loading}
      loadingText="Loading industry graph..."
      emptyTitle="No graph data available"
      emptyDescription="There are no user-industry relationships to visualize yet."
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
  );
}
