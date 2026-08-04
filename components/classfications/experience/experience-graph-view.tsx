"use client";

import React, { useMemo, useState } from "react";
import {
  useGetUserExperienceGraph,
  ExperienceGraphUser,
  ExperienceGraphCompany,
} from "@/graphql/quries/experience/experience-queries";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Building } from "lucide-react";
import { EcosystemGraphView } from "@/components/shared/ecosystem-graph-view";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";

const GRAPH_STYLESHEET: any[] = [
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
    selector: "node[type='company']",
    style: {
      "background-color": "#ffedd5",
      label: "data(label)",
      color: "#c2410c",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "11px",
      "font-weight": "600",
      width: "data(size)",
      height: "data(size)",
      shape: "round-rectangle",
      "border-width": 1.5,
      "border-color": "#fed7aa",
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
  | { type: "user"; data: ExperienceGraphUser; connectedCompanies: string[] }
  | {
      type: "company";
      data: ExperienceGraphCompany;
      connectedUsers: ExperienceGraphUser[];
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
          {info.connectedCompanies.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Experience ({info.connectedCompanies.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {info.connectedCompanies.map((company) => (
                  <span
                    key={company}
                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-50 text-slate-600 border border-slate-200"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const company = info.data;
  return (
    <div className="absolute top-4 left-4 z-20 w-72 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
      <div className="h-12 bg-slate-50 border-b border-slate-100 relative flex items-center px-4">
        <Building className="h-4 w-4 text-slate-400 mr-2" />
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          Company
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
          {company.title}
        </h3>
        {info.connectedUsers.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Employees ({info.connectedUsers.length})
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

export function ExperienceGraphView() {
  const { data, loading } = useGetUserExperienceGraph({
    variables: { limit: 100 },
  });
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(
    null,
  );

  const elements = useMemo(() => {
    const edges = data?.getUserExperienceGraph || [];
    if (edges.length === 0) return [];

    const userNodes = new Map<string, any>();
    const companyNodes = new Map<string, { count: number; data: any }>();
    const graphEdges: any[] = [];

    edges.forEach((edge) => {
      const userId = `user-${edge.user.id}`;
      const companyId = `company-${edge.company.id}`;

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

      if (!companyNodes.has(companyId)) {
        companyNodes.set(companyId, {
          count: 1,
          data: edge.company,
        });
      } else {
        companyNodes.get(companyId)!.count++;
      }

      graphEdges.push({
        data: {
          id: `edge-${edge.user.id}-${edge.company.id}`,
          source: userId,
          target: companyId,
        },
      });
    });

    const companyElements = Array.from(companyNodes.entries()).map(
      ([id, { count, data: companyData }]) => {
        const size = Math.max(40, Math.min(80, 30 + count * 10));
        return {
          data: {
            id,
            label: companyData.title,
            type: "company",
            size,
            count,
            raw: companyData,
          },
        };
      },
    );

    return [
      ...Array.from(userNodes.values()),
      ...companyElements,
      ...graphEdges,
    ];
  }, [data]);

  const graphData = useMemo(() => {
    const edges = data?.getUserExperienceGraph || [];
    const userCompanies = new Map<string, string[]>();
    const companyUsers = new Map<string, ExperienceGraphUser[]>();

    edges.forEach((edge) => {
      const uid = edge.user.id;
      const cid = edge.company.id;

      if (!userCompanies.has(uid)) userCompanies.set(uid, []);
      if (!userCompanies.get(uid)!.includes(edge.company.title)) {
        userCompanies.get(uid)!.push(edge.company.title);
      }

      if (!companyUsers.has(cid)) companyUsers.set(cid, []);
      if (!companyUsers.get(cid)!.find((u) => u.id === uid)) {
        companyUsers.get(cid)!.push(edge.user);
      }
    });

    return { userCompanies, companyUsers };
  }, [data]);

  const handleNodeSelect = (nodeData: any) => {
    if (nodeData.type === "user") {
      const rawUser = nodeData.raw as ExperienceGraphUser;
      const connectedCompanies = graphData.userCompanies.get(rawUser.id) || [];
      setSelectedNode({ type: "user", data: rawUser, connectedCompanies });
    } else if (nodeData.type === "company") {
      const rawCompany = nodeData.raw as ExperienceGraphCompany;
      const connectedUsers = graphData.companyUsers.get(rawCompany.id) || [];
      setSelectedNode({ type: "company", data: rawCompany, connectedUsers });
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
        <div className="h-3 w-3 rounded bg-orange-100 border border-orange-200" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Companies
        </span>
      </div>
    </>
  );

  return (
    <EcosystemGraphView
      elements={elements}
      stylesheet={GRAPH_STYLESHEET}
      loading={loading}
      loadingText="Loading experience graph..."
      emptyTitle="No graph data available"
      emptyDescription="There are no user-experience relationships to visualize yet."
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
