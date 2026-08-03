"use client";

import React, { useMemo, useState } from "react";
import {
  useGetListingUserGraph,
  ListingGraphUser,
  ListingGraphListing,
} from "@/graphql/quries/listing/listing-graph-queries";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { X, Store, Search } from "lucide-react";
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
    selector: "node[type='listing']",
    style: {
      "background-color": "#fee2e2",
      label: "data(label)",
      color: "#991b1b",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "11px",
      "font-weight": "600",
      width: "data(size)",
      height: "data(size)",
      shape: "round-rectangle",
      "border-width": 1.5,
      "border-color": "#fecaca",
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
      data: ListingGraphUser;
      connectedListings: Array<{ title: string; relationType: string }>;
    }
  | {
      type: "listing";
      data: ListingGraphListing;
      connectedUsers: Array<{ user: ListingGraphUser; relationType: string }>;
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
      ? `${process.env.NEXT_PUBLIC_CDN_URL}/${user.avatar}`
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
          {info.connectedListings.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Listings ({info.connectedListings.length})
              </p>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {info.connectedListings.map((listing, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col px-2 py-1.5 rounded-md bg-slate-50 border border-slate-200"
                  >
                    <span className="text-xs font-medium text-slate-700">
                      {listing.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {listing.relationType}
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

  const listing = info.data;
  return (
    <div className="absolute top-4 left-4 z-20 w-72 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
      <div className="h-12 bg-slate-50 border-b border-slate-100 relative flex items-center px-4">
        <Store className="h-4 w-4 text-slate-400 mr-2" />
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">
          Listing
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
          {listing.title}
        </h3>
        {info.connectedUsers.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Users ({info.connectedUsers.length})
            </p>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {info.connectedUsers.map(({ user, relationType }, idx) => {
                const avatarUrl = user.avatar
                  ? `${process.env.NEXT_PUBLIC_CDN_URL}/${user.avatar}`
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
                        <p className="text-[10px] text-red-600 font-medium">
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

export function ListingsGraphView() {
  const { data, loading } = useGetListingUserGraph({
    variables: { limit: 100 },
  });
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(
    null,
  );

  const elements = useMemo(() => {
    const edges = data?.getListingUserGraph || [];
    if (edges.length === 0) return [];

    const userNodes = new Map<string, any>();
    const listingNodes = new Map<string, { count: number; data: any }>();
    const graphEdges: any[] = [];

    edges.forEach((edge) => {
      if (!edge.creator || !edge.listing) return;

      const userId = `user-${edge.creator.id}`;
      const listingId = `listing-${edge.listing.id}`;

      if (!userNodes.has(userId)) {
        const name =
          [edge.creator.firstName, edge.creator.lastName]
            .filter(Boolean)
            .join(" ") || "User";
        const avatarUrl = edge.creator.avatar
          ? `${process.env.NEXT_PUBLIC_CDN_URL}/\${edge.creator.avatar}`
          : "";
        userNodes.set(userId, {
          data: {
            id: userId,
            label: name,
            type: "user",
            avatar: avatarUrl || undefined,
            raw: edge.creator,
          },
        });
      }

      if (!listingNodes.has(listingId)) {
        listingNodes.set(listingId, {
          count: 1,
          data: edge.listing,
        });
      } else {
        listingNodes.get(listingId)!.count++;
      }

      graphEdges.push({
        data: {
          id: `edge-${edge.creator.id}-${edge.listing.id}`,
          source: userId,
          target: listingId,
          label: "POSTED",
        },
      });
    });

    const listingElements = Array.from(listingNodes.entries()).map(
      ([id, { count, data: listingData }]) => {
        const size = Math.max(40, Math.min(80, 30 + count * 10));
        return {
          data: {
            id,
            label: listingData.title,
            type: "listing",
            size,
            count,
            raw: listingData,
          },
        };
      },
    );

    return [
      ...Array.from(userNodes.values()),
      ...listingElements,
      ...graphEdges,
    ];
  }, [data]);

  const graphData = useMemo(() => {
    const edges = data?.getListingUserGraph || [];
    const userListings = new Map<
      string,
      Array<{ title: string; relationType: string }>
    >();
    const listingUsers = new Map<
      string,
      Array<{ user: ListingGraphUser; relationType: string }>
    >();

    edges.forEach((edge) => {
      if (!edge.creator || !edge.listing) return;
      const uid = edge.creator.id;
      const lid = edge.listing.id;

      if (!userListings.has(uid)) userListings.set(uid, []);
      userListings
        .get(uid)!
        .push({ title: edge.listing.title, relationType: "POSTED" });

      if (!listingUsers.has(lid)) listingUsers.set(lid, []);
      listingUsers
        .get(lid)!
        .push({ user: edge.creator, relationType: "POSTED" });
    });

    return { userListings, listingUsers };
  }, [data]);

  const handleNodeSelect = (nodeData: any) => {
    if (nodeData.type === "user") {
      const rawUser = nodeData.raw as ListingGraphUser;
      const connectedListings = graphData.userListings.get(rawUser.id) || [];
      setSelectedNode({ type: "user", data: rawUser, connectedListings });
    } else if (nodeData.type === "listing") {
      const rawListing = nodeData.raw as ListingGraphListing;
      const connectedUsers = graphData.listingUsers.get(rawListing.id) || [];
      setSelectedNode({
        type: "listing",
        data: rawListing,
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
        <div className="h-3 w-3 rounded bg-red-100 border border-red-200" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Listings
        </span>
      </div>
    </>
  );

  return (
    <div className="space-y-4 mt-4">
      <EcosystemGraphView
        elements={elements}
        stylesheet={GRAPH_STYLESHEET}
        loading={loading}
        loadingText="Loading listings graph..."
        emptyTitle="No graph data available"
        emptyDescription="There are no user-listing relationships to visualize yet."
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
