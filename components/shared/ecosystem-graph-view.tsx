"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type cytoscape from "cytoscape";
import { Button } from "@/components/ui/button";
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Expand,
  Shrink,
} from "lucide-react";

const CytoscapeComponent = dynamic(() => import("react-cytoscapejs"), {
  ssr: false,
});

export interface EcosystemGraphViewProps {
  elements: cytoscape.ElementDefinition[];
  stylesheet: cytoscape.Stylesheet[];
  loading?: boolean;
  loadingText?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  legend?: React.ReactNode;
  detailPanel?: React.ReactNode;
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeData: any) => void;
  onNodeDeselect?: () => void;
}

export function EcosystemGraphView({
  elements,
  stylesheet,
  loading = false,
  loadingText = "Loading graph...",
  emptyTitle = "No graph data available",
  emptyDescription = "There are no relationships to visualize yet.",
  legend,
  detailPanel,
  selectedNodeId,
  onNodeSelect,
  onNodeDeselect,
}: EcosystemGraphViewProps) {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCy = useCallback(
    (cy: cytoscape.Core) => {
      cyRef.current = cy;

      cy.on("layoutstop", () => {
        cy.fit(undefined, 40);
      });

      // Click on node → notify parent + highlight connected
      cy.on("tap", "node", (evt) => {
        const node = evt.target;
        const nodeData = node.data();

        // Clear previous highlight
        cy.elements().removeClass("highlighted faded");

        // Highlight this node and connected edges/nodes
        const neighborhood = node.neighborhood().add(node);
        neighborhood.addClass("highlighted");
        cy.elements().not(neighborhood).addClass("faded");

        onNodeSelect?.(nodeData);
      });

      // Click on background → clear selection
      cy.on("tap", (evt) => {
        if (evt.target === cy) {
          cy.elements().removeClass("highlighted faded");
          onNodeDeselect?.();
        }
      });
    },
    [onNodeSelect, onNodeDeselect],
  );

  // If selection is cleared externally, remove classes
  useEffect(() => {
    if (!selectedNodeId && cyRef.current) {
      cyRef.current.elements().removeClass("highlighted faded");
    }
  }, [selectedNodeId]);

  const handleZoomIn = () => {
    const cy = cyRef.current;
    if (cy)
      cy.zoom({
        level: cy.zoom() * 1.3,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      });
  };

  const handleZoomOut = () => {
    const cy = cyRef.current;
    if (cy)
      cy.zoom({
        level: cy.zoom() / 1.3,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      });
  };

  const handleFit = () => {
    cyRef.current?.fit(undefined, 40);
  };

  const handleResetLayout = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.layout({
      name: "cose",
      animate: true,
      animationDuration: 800,
      randomize: true,
      nodeRepulsion: () => 6000,
      idealEdgeLength: () => 120,
      edgeElasticity: () => 100,
      gravity: 0.3,
      numIter: 1000,
      padding: 40,
    } as any).run();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Network className="h-6 w-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          {loadingText}
        </p>
      </div>
    );
  }

  if (elements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border border-border border-dashed m-4">
        <Network className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          {emptyTitle}
        </h3>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full bg-gradient-to-br from-white via-slate-50 to-indigo-50/50 border border-border overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-[100] h-screen m-0 rounded-none"
          : "relative h-[calc(100vh-320px)] min-h-[500px] rounded-xl m-4"
      }`}
    >
      {/* Detail Panel */}
      {detailPanel}

      {/* Graph Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setIsFullscreen(!isFullscreen);
            setTimeout(() => cyRef.current?.resize(), 100);
          }}
          className="h-8 w-8 rounded-lg bg-white/80 border-slate-200/50 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 backdrop-blur-sm shadow-sm"
        >
          {isFullscreen ? (
            <Shrink className="h-3.5 w-3.5" />
          ) : (
            <Expand className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="h-8 w-8 rounded-lg bg-white/80 border-slate-200/50 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 backdrop-blur-sm shadow-sm"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="h-8 w-8 rounded-lg bg-white/80 border-slate-200/50 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 backdrop-blur-sm shadow-sm"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleFit}
          className="h-8 w-8 rounded-lg bg-white/80 border-slate-200/50 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 backdrop-blur-sm shadow-sm"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleResetLayout}
          className="h-8 w-8 rounded-lg bg-white/80 border-slate-200/50 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 backdrop-blur-sm shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Legend */}
      {legend && (
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-4 px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200/50 backdrop-blur-sm shadow-sm">
          {legend}
        </div>
      )}

      {/* Stats badge */}
      {!selectedNodeId && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-white/80 border border-slate-200/50 backdrop-blur-sm shadow-sm">
          <span className="text-xs font-semibold text-slate-600">
            {elements.filter((e) => e.data && !("source" in e.data)).length}{" "}
            nodes
            {" · "}
            {elements.filter((e) => e.data && "source" in e.data).length} edges
          </span>
        </div>
      )}

      <CytoscapeComponent
        elements={elements}
        stylesheet={stylesheet}
        layout={
          {
            name: "cose",
            animate: true,
            animationDuration: 1000,
            randomize: true,
            nodeRepulsion: () => 6000,
            idealEdgeLength: () => 120,
            edgeElasticity: () => 100,
            gravity: 0.3,
            numIter: 1000,
            padding: 40,
          } as any
        }
        style={{ width: "100%", height: "100%" }}
        cy={handleCy}
        wheelSensitivity={0.3}
      />
    </div>
  );
}
