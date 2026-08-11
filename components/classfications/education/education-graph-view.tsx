"use client";

import React, { useMemo, useState } from "react";
import {
  useGetUserEducationGraph,
  EducationGraphUser,
  EducationGraphSchool,
} from "@/graphql/quries/education/education-queries";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, GraduationCap } from "lucide-react";
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
    selector: "node[type='school']",
    style: {
      "background-color": "#d1fae5",
      label: "data(label)",
      color: "#065f46",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "11px",
      "font-weight": "600",
      width: "data(size)",
      height: "data(size)",
      shape: "round-rectangle",
      "border-width": 1.5,
      "border-color": "#a7f3d0",
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
  | { type: "user"; data: EducationGraphUser; connectedSchools: string[] }
  | {
      type: "school";
      data: EducationGraphSchool;
      connectedUsers: EducationGraphUser[];
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
          {info.connectedSchools.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Education ({info.connectedSchools.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {info.connectedSchools.map((school) => (
                  <span
                    key={school}
                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-50 text-slate-600 border border-slate-200"
                  >
                    {school}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const school = info.data;
  return (
    <div className="absolute top-4 left-4 z-20 w-72 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
      <div className="h-12 bg-slate-50 border-b border-slate-100 relative flex items-center px-4">
        <GraduationCap className="h-4 w-4 text-slate-400 mr-2" />
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          School
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
        <h3 className="text-sm font-semibold text-slate-900">{school.title}</h3>
        {info.connectedUsers.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Alumni ({info.connectedUsers.length})
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

import { GraphFilterCombobox } from "@/components/classfications/shared/graph-filter-combobox";
import { cn } from "@/lib/utils";

export function EducationGraphView() {
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(
    null,
  );
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: optionsData } = useGetUserEducationGraph({
    variables: { limit: 1000, search: searchQuery },
  });

  const availableSchools = useMemo(() => {
    const edges = optionsData?.getUserEducationGraph || [];
    const schoolsMap = new Map<string, any>();
    edges.forEach((e) => {
      // In neo4j education nodes, title is used as ID if the ID string isn't fully robust, 
      // but let's just use e.school.title as the ID since our backend query checks `coalesce(target.title, ...)`
      if (!schoolsMap.has(e.school.title)) {
        schoolsMap.set(e.school.title, { id: e.school.title, title: e.school.title });
      }
    });
    return Array.from(schoolsMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }, [optionsData]);

  const { data, loading } = useGetUserEducationGraph({
    variables: { 
      limit: 1000,
      schoolName: selectedSchoolId === "all" ? undefined : selectedSchoolId
    },
  });

  const elements = useMemo(() => {
    const edges = data?.getUserEducationGraph || [];
    if (edges.length === 0) return [];

    const userNodes = new Map<string, any>();
    const schoolNodes = new Map<string, { count: number; data: any }>();
    const graphEdges: any[] = [];

    edges.forEach((edge) => {
      const userId = `user-${edge.user.id}`;
      const schoolId = `school-${edge.school.id}`;

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

      if (!schoolNodes.has(schoolId)) {
        schoolNodes.set(schoolId, {
          count: 1,
          data: edge.school,
        });
      } else {
        schoolNodes.get(schoolId)!.count++;
      }

      graphEdges.push({
        data: {
          id: `edge-${edge.user.id}-${edge.school.id}`,
          source: userId,
          target: schoolId,
        },
      });
    });

    const schoolElements = Array.from(schoolNodes.entries()).map(
      ([id, { count, data: schoolData }]) => {
        const size = Math.max(40, Math.min(80, 30 + count * 10));
        return {
          data: {
            id,
            label: schoolData.title,
            type: "school",
            size,
            count,
            raw: schoolData,
          },
        };
      },
    );

    return [
      ...Array.from(userNodes.values()),
      ...schoolElements,
      ...graphEdges,
    ];
  }, [data]);

  const graphData = useMemo(() => {
    const edges = data?.getUserEducationGraph || [];
    const userSchools = new Map<string, string[]>();
    const schoolUsers = new Map<string, EducationGraphUser[]>();

    edges.forEach((edge) => {
      const uid = edge.user.id;
      const cid = edge.school.id;

      if (!userSchools.has(uid)) userSchools.set(uid, []);
      if (!userSchools.get(uid)!.includes(edge.school.title)) {
        userSchools.get(uid)!.push(edge.school.title);
      }

      if (!schoolUsers.has(cid)) schoolUsers.set(cid, []);
      if (!schoolUsers.get(cid)!.find((u) => u.id === uid)) {
        schoolUsers.get(cid)!.push(edge.user);
      }
    });

    return { userSchools, schoolUsers };
  }, [data]);

  const handleNodeSelect = (nodeData: any) => {
    if (nodeData.type === "user") {
      const rawUser = nodeData.raw as EducationGraphUser;
      const connectedSchools = graphData.userSchools.get(rawUser.id) || [];
      setSelectedNode({ type: "user", data: rawUser, connectedSchools });
    } else if (nodeData.type === "school") {
      const rawSchool = nodeData.raw as EducationGraphSchool;
      const connectedUsers = graphData.schoolUsers.get(rawSchool.id) || [];
      setSelectedNode({ type: "school", data: rawSchool, connectedUsers });
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
        <div className="h-3 w-3 rounded bg-emerald-100 border border-emerald-200" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Schools
        </span>
      </div>
    </>
  );

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px] overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* ─── LEFT: Filters Panel ──────────────────────────────── */}
      <div className="w-64 min-w-[256px] border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              Filters
            </h3>
            {selectedSchoolId !== "all" && (
              <button
                onClick={() => setSelectedSchoolId("all")}
                className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 hover:text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-2 py-1 rounded-md border border-zinc-200 transition-all duration-150 active:scale-95"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <GraphFilterCombobox
            value={selectedSchoolId}
            onChange={setSelectedSchoolId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            options={availableSchools}
            placeholder="Search schools..."
            allLabel="All Schools"
            label="Filter by School"
            icon={<GraduationCap className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* ─── CENTER: Graph (using EcosystemGraphView) ─────────── */}
      <div className="flex-1 flex flex-col relative">
        <EcosystemGraphView
          elements={elements}
          stylesheet={GRAPH_STYLESHEET}
          loading={loading}
          loadingText="Loading education graph..."
          emptyTitle="No graph data available"
          emptyDescription="There are no user-education relationships to visualize yet."
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
    </div>
  );
}
