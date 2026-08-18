"use client";

import React, { useMemo, useState } from "react";
import {
  useGetAllOpportunitiesGraph,
  OpportunityGraphOpportunity,
  OpportunityGraphCreator,
  OpportunityGraphSkill,
  OpportunityGraphNode,
  OpportunityGraphInterestedUser,
} from "@/graphql/actions/opportunities";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Briefcase, Award, Users } from "lucide-react";
import { EcosystemGraphView } from "@/components/shared/ecosystem-graph-view";

const GRAPH_STYLESHEET: any[] = [
  {
    selector: "node[type='opportunity']",
    style: {
      "background-color": "#fef3c7",
      label: "data(label)",
      color: "#d97706",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "11px",
      "font-weight": "600",
      width: 50,
      height: 50,
      shape: "hexagon",
      "border-width": 1.5,
      "border-color": "#fde68a",
      "text-outline-width": 0,
      "overlay-padding": 8,
      "text-max-width": "90px",
      "text-wrap": "wrap",
    } as any,
  },
  {
    selector: "node[type='interestedUser']",
    style: {
      "background-color": "#dcfce7",
      label: "data(label)",
      color: "#166534",
      "text-valign": "bottom",
      "text-halign": "center",
      "font-size": "10px",
      "font-weight": "500",
      width: 40,
      height: 40,
      shape: "ellipse",
      "border-width": 1.5,
      "border-color": "#bbf7d0",
      "text-margin-y": 8,
      "text-outline-width": 0,
      "overlay-padding": 6,
    } as any,
  },
  {
    selector: "node[type='creator']",
    style: {
      "background-color": "#dbeafe",
      label: "data(label)",
      color: "#1e40af",
      "text-valign": "bottom",
      "text-halign": "center",
      "font-size": "10px",
      "font-weight": "500",
      width: 40,
      height: 40,
      shape: "ellipse",
      "border-width": 1.5,
      "border-color": "#bfdbfe",
      "text-margin-y": 8,
      "text-outline-width": 0,
      "overlay-padding": 6,
    } as any,
  },
  {
    selector: "node[type='skill']",
    style: {
      "background-color": "#f3e8ff",
      label: "data(label)",
      color: "#6b21a8",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "10px",
      "font-weight": "600",
      width: 40,
      height: 40,
      shape: "round-rectangle",
      "border-width": 1.5,
      "border-color": "#e9d5ff",
      "text-outline-width": 0,
      "overlay-padding": 6,
      "text-max-width": "70px",
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
  | {
      type: "opportunity";
      data: OpportunityGraphOpportunity;
      creator?: OpportunityGraphCreator | null;
      skills: OpportunityGraphSkill[];
      interestedUsers: OpportunityGraphInterestedUser[];
    }
  | {
      type: "creator";
      data: OpportunityGraphCreator;
      opportunities: OpportunityGraphOpportunity[];
    }
  | {
      type: "skill";
      data: OpportunityGraphSkill;
      opportunities: OpportunityGraphOpportunity[];
    }
  | {
      type: "interestedUser";
      data: OpportunityGraphInterestedUser;
      opportunities: OpportunityGraphOpportunity[];
    };

function NodeDetailPanel({
  info,
  onClose,
}: {
  info: SelectedNodeInfo;
  onClose: () => void;
}) {
  if (info.type === "creator" || info.type === "interestedUser") {
    const user = info.data as any;
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      (info.type === "creator" ? "Unknown Creator" : "Unknown User");
    const label = info.type === "creator" ? "Created Opportunities" : "Interested Opportunities";

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
          <Avatar className="h-16 w-16 border-[3px] border-white shadow-sm bg-white">
            <AvatarFallback className="bg-slate-100 text-slate-600 text-lg font-medium">
              {user.firstName?.charAt(0) || (info.type === "creator" ? "C" : "U")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="px-4 pt-2 pb-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {name}
            </h3>
          </div>
          {info.opportunities.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                {label} ({info.opportunities.length})
              </p>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {info.opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="px-3 py-2 text-xs font-medium rounded-md bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    {opp.title || "Untitled Opportunity"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (info.type === "opportunity") {
    const opp = info.data;
    return (
      <div className="absolute top-4 left-4 z-20 w-72 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
        <div className="h-12 bg-slate-50 border-b border-slate-100 relative flex items-center px-4">
          <Briefcase className="h-4 w-4 text-amber-500 mr-2" />
          <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Opportunity
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
            {opp.title || "Untitled Opportunity"}
          </h3>
          {opp.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-3">
              {opp.description}
            </p>
          )}

          {info.creator && (
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Creator
              </p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-slate-100 text-[10px]">
                    {info.creator.firstName?.charAt(0) || "C"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-slate-700 font-medium">
                  {[info.creator.firstName, info.creator.lastName]
                    .filter(Boolean)
                    .join(" ") || "Unknown"}
                </span>
              </div>
            </div>
          )}

          {info.skills.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Required Skills ({info.skills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {info.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-100"
                  >
                    {skill.name || (skill as any).title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {info.interestedUsers && info.interestedUsers.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Interested Users ({info.interestedUsers.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {info.interestedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-100">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="bg-green-200 text-green-800 text-[8px]">
                        {user.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] font-medium">
                      {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown"}
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

  // Skill panel
  const skill = info.data;
  return (
    <div className="absolute top-4 left-4 z-20 w-72 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
      <div className="h-12 bg-slate-50 border-b border-slate-100 relative flex items-center px-4">
        <Award className="h-4 w-4 text-purple-500 mr-2" />
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          Skill
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
        <h3 className="text-sm font-semibold text-slate-900">{skill.name || (skill as any).title}</h3>

        {info.opportunities.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Opportunities ({info.opportunities.length})
            </p>
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
              {info.opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="px-3 py-2 text-xs font-medium rounded-md bg-slate-50 text-slate-700 border border-slate-200"
                >
                  {opp.title || "Untitled"}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function OpportunitiesGraphView() {
  const { data, loading } = useGetAllOpportunitiesGraph({
    variables: { limit: 100 },
    fetchPolicy: "network-only",
  });

  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(
    null,
  );

  const elements = useMemo(() => {
    const nodesData = data?.getAllOpportunitiesGraph || [];
    if (nodesData.length === 0) return [];

    const oppNodes = new Map<string, any>();
    const creatorNodes = new Map<string, any>();
    const skillNodes = new Map<string, any>();
    const interestedUserNodes = new Map<string, any>();
    const graphEdges: any[] = [];

    nodesData.forEach((node: OpportunityGraphNode) => {
      const oppId = `opp-${node.opportunity.id}`;

      if (!oppNodes.has(oppId)) {
        oppNodes.set(oppId, {
          data: {
            id: oppId,
            label: node.opportunity.title || "Opportunity",
            type: "opportunity",
            raw: node.opportunity,
          },
        });
      }

      if (node.creator) {
        const creatorId = `creator-${node.creator.id}`;
        if (!creatorNodes.has(creatorId)) {
          const name =
            [node.creator.firstName, node.creator.lastName]
              .filter(Boolean)
              .join(" ") || "Creator";
          creatorNodes.set(creatorId, {
            data: {
              id: creatorId,
              label: name,
              type: "creator",
              raw: node.creator,
            },
          });
        }

        graphEdges.push({
          data: {
            id: `edge-${creatorId}-${oppId}`,
            source: creatorId,
            target: oppId,
          },
        });
      }

      if (node.skills && node.skills.length > 0) {
        node.skills.forEach((skill) => {
          const skillId = `skill-${skill.id}`;
          if (!skillNodes.has(skillId)) {
            skillNodes.set(skillId, {
              data: {
                id: skillId,
                label: skill.name || (skill as any).title || "Skill",
                type: "skill",
                raw: skill,
              },
            });
          }

          graphEdges.push({
            data: {
              id: `edge-${oppId}-${skillId}`,
              source: oppId,
              target: skillId,
            },
          });
        });
      }

      if (node.interestedUsers && node.interestedUsers.length > 0) {
        node.interestedUsers.forEach((user) => {
          const userId = `interested-${user.id}`;
          if (!interestedUserNodes.has(userId)) {
            const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";
            interestedUserNodes.set(userId, {
              data: {
                id: userId,
                label: name,
                type: "interestedUser",
                raw: user,
              },
            });
          }

          graphEdges.push({
            data: {
              id: `edge-${userId}-${oppId}`,
              source: userId,
              target: oppId,
            },
          });
        });
      }
    });

    return [
      ...Array.from(oppNodes.values()),
      ...Array.from(creatorNodes.values()),
      ...Array.from(skillNodes.values()),
      ...Array.from(interestedUserNodes.values()),
      ...graphEdges,
    ];
  }, [data]);

  const graphData = useMemo(() => {
    const nodesData = data?.getAllOpportunitiesGraph || [];
    const creatorOpps = new Map<string, OpportunityGraphOpportunity[]>();
    const skillOpps = new Map<string, OpportunityGraphOpportunity[]>();
    const interestedUserOpps = new Map<string, OpportunityGraphOpportunity[]>();
    const oppCreators = new Map<string, OpportunityGraphCreator | null>();
    const oppSkills = new Map<string, OpportunityGraphSkill[]>();
    const oppInterestedUsers = new Map<string, OpportunityGraphInterestedUser[]>();

    nodesData.forEach((node: any) => {
      const opp = node.opportunity;

      if (node.creator) {
        const cid = node.creator.id;
        if (!creatorOpps.has(cid)) creatorOpps.set(cid, []);
        creatorOpps.get(cid)!.push(opp);
        oppCreators.set(opp.id, node.creator);
      }

      if (node.skills) {
        oppSkills.set(opp.id, node.skills);
        node.skills.forEach((skill: any) => {
          const sid = skill.id;
          if (!skillOpps.has(sid)) skillOpps.set(sid, []);
          skillOpps.get(sid)!.push(opp);
        });
      } else {
        oppSkills.set(opp.id, []);
      }

      if (node.interestedUsers) {
        oppInterestedUsers.set(opp.id, node.interestedUsers);
        node.interestedUsers.forEach((user: any) => {
          const uid = user.id;
          if (!interestedUserOpps.has(uid)) interestedUserOpps.set(uid, []);
          interestedUserOpps.get(uid)!.push(opp);
        });
      } else {
        oppInterestedUsers.set(opp.id, []);
      }
    });

    return { creatorOpps, skillOpps, interestedUserOpps, oppCreators, oppSkills, oppInterestedUsers };
  }, [data]);

  const handleNodeSelect = (nodeData: any) => {
    if (nodeData.type === "opportunity") {
      const raw = nodeData.raw as OpportunityGraphOpportunity;
      const creator = graphData.oppCreators.get(raw.id);
      const skills = graphData.oppSkills.get(raw.id) || [];
      const interestedUsers = graphData.oppInterestedUsers.get(raw.id) || [];
      setSelectedNode({ type: "opportunity", data: raw, creator, skills, interestedUsers });
    } else if (nodeData.type === "creator") {
      const raw = nodeData.raw as OpportunityGraphCreator;
      const opps = graphData.creatorOpps.get(raw.id) || [];
      setSelectedNode({ type: "creator", data: raw, opportunities: opps });
    } else if (nodeData.type === "skill") {
      const raw = nodeData.raw as OpportunityGraphSkill;
      const opps = graphData.skillOpps.get(raw.id) || [];
      setSelectedNode({ type: "skill", data: raw, opportunities: opps });
    } else if (nodeData.type === "interestedUser") {
      const raw = nodeData.raw as OpportunityGraphInterestedUser;
      const opps = graphData.interestedUserOpps.get(raw.id) || [];
      setSelectedNode({ type: "interestedUser", data: raw, opportunities: opps });
    }
  };

  const legend = (
    <>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-amber-100 border border-amber-200" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Opportunities
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-blue-100 border border-blue-200" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Creators
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-green-100 border border-green-200" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Interested Users
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded bg-purple-100 border border-purple-200" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Skills
        </span>
      </div>
    </>
  );

  return (
    <EcosystemGraphView
      elements={elements}
      stylesheet={GRAPH_STYLESHEET}
      loading={loading}
      loadingText="Loading opportunity graph..."
      emptyTitle="No graph data available"
      emptyDescription="There are no opportunities to visualize yet."
      legend={legend}
      selectedNodeId={
        selectedNode ? `${selectedNode.type}-${selectedNode.data.id}` : null
      }
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
