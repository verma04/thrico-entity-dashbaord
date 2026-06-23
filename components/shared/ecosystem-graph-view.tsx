"use client";

import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
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

// We import cytoscape and fcose dynamically to avoid SSR issues
let cytoscape: any = null;
let fcose: any = null;
let cytoscapeLoaded = false;

function ensureCytoscape(): Promise<void> {
  if (cytoscapeLoaded) return Promise.resolve();
  return Promise.all([
    import("cytoscape"),
    import("cytoscape-fcose"),
  ]).then(([cyModule, fcoseModule]) => {
    cytoscape = cyModule.default || cyModule;
    fcose = fcoseModule.default || fcoseModule;
    cytoscape.use(fcose);
    cytoscapeLoaded = true;
  });
}

export interface EcosystemGraphViewProps {
  elements: any[];
  stylesheet: any[];
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

// LOD threshold — below this zoom level, labels are hidden
const LOD_ZOOM_THRESHOLD = 0.4;

// Batch size for adding elements (prevents frame drops on huge graphs)
const BATCH_SIZE = 5000;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cyReady, setCyReady] = useState(false);

  // Track previous elements length to detect data changes
  const prevElementsLenRef = useRef(0);

  // ── Initialize Cytoscape ──────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    ensureCytoscape().then(() => {
      if (cancelled || !containerRef.current) return;

      const cy = cytoscape({
        container: containerRef.current,
        elements: [],
        style: stylesheet,

        // ── Canvas renderer performance options ──
        // Render to a texture when panning/zooming — huge perf win
        textureOnViewport: true,
        // Hide edges during pan/zoom for smoothness
        hideEdgesOnViewport: true,
        // Hide labels during pan/zoom
        hideLabelsOnViewport: true,
        // Use lower pixel ratio during interaction for speed
        pixelRatio: "auto",
        // Disable selection box (not needed)
        selectionType: "single",
        // Reduce motion blur quality for speed
        motionBlur: false,

        // Interaction
        wheelSensitivity: 0.3,
        minZoom: 0.02,
        maxZoom: 5,
      });

      cyRef.current = cy;

      // ── Node click → highlight neighborhood ──
      cy.on("tap", "node", (evt: any) => {
        const node = evt.target;
        const nodeData = node.data();

        cy.elements().removeClass("highlighted faded");
        const neighborhood = node.neighborhood().add(node);
        neighborhood.addClass("highlighted");
        cy.elements().not(neighborhood).addClass("faded");

        onNodeSelect?.(nodeData);
      });

      // ── Background click → clear selection ──
      cy.on("tap", (evt: any) => {
        if (evt.target === cy) {
          cy.elements().removeClass("highlighted faded");
          onNodeDeselect?.();
        }
      });

      // ── LOD: hide labels when zoomed out ──
      cy.on("zoom", () => {
        const zoom = cy.zoom();
        if (zoom < LOD_ZOOM_THRESHOLD) {
          cy.style()
            .selector("node")
            .style({ "font-size": 0, "text-opacity": 0 })
            .update();
        } else {
          // Restore from stylesheet
          cy.style().fromJson(stylesheet).update();
          // Re-apply highlight classes if any
          const highlighted = cy.elements(".highlighted");
          if (highlighted.length > 0) {
            cy.elements().not(highlighted).addClass("faded");
          }
        }
      });

      setCyReady(true);
    });

    return () => {
      cancelled = true;
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
      setCyReady(false);
    };
    // Only run on mount/unmount — stylesheet changes handled separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Update stylesheet when it changes ──────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !cyReady) return;
    cy.style().fromJson(stylesheet).update();
  }, [stylesheet, cyReady]);

  // ── Sync onNodeSelect / onNodeDeselect callbacks ───────────────
  const onNodeSelectRef = useRef(onNodeSelect);
  const onNodeDeselectRef = useRef(onNodeDeselect);
  useEffect(() => {
    onNodeSelectRef.current = onNodeSelect;
    onNodeDeselectRef.current = onNodeDeselect;
  }, [onNodeSelect, onNodeDeselect]);

  // ── Load elements in batches & run layout ──────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !cyReady) return;

    // Prevent re-running if elements haven't actually changed
    if (elements.length === prevElementsLenRef.current && elements.length > 0) {
      return;
    }
    prevElementsLenRef.current = elements.length;

    // Clear existing
    cy.elements().remove();

    if (elements.length === 0) return;

    // Batch add elements to prevent frame drops
    const totalElements = elements.length;
    let added = 0;

    function addBatch() {
      const batch = elements.slice(added, added + BATCH_SIZE);
      if (batch.length === 0) {
        // All elements added — run layout
        runLayout(cy, totalElements);
        return;
      }
      cy.add(batch);
      added += batch.length;

      if (added < totalElements) {
        // Schedule next batch
        requestAnimationFrame(addBatch);
      } else {
        runLayout(cy, totalElements);
      }
    }

    addBatch();
  }, [elements, cyReady]);

  // ── Clear highlight when selection cleared externally ───────────
  useEffect(() => {
    if (!selectedNodeId && cyRef.current) {
      cyRef.current.elements().removeClass("highlighted faded");
    }
  }, [selectedNodeId]);

  // ── Handle fullscreen resize ───────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const timer = setTimeout(() => {
      cy.resize();
      cy.fit(undefined, 40);
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // ── Controls ───────────────────────────────────────────────────
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
    runLayout(cy, cy.elements().length);
  };

  return (
    <div
      className={`w-full bg-gradient-to-br from-white via-slate-50 to-indigo-50/50 border border-border overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-[100] h-screen m-0 rounded-none"
          : "relative h-[calc(100vh-320px)] min-h-[500px] rounded-xl m-4"
      }`}
    >
      {/* ── Loading Overlay ── */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <Network className="h-6 w-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">
            {loadingText}
          </p>
        </div>
      )}

      {/* ── Empty Overlay ── */}
      {!loading && elements.length === 0 && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-muted/30">
          <Network className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground tracking-tight">
            {emptyTitle}
          </h3>
          <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
            {emptyDescription}
          </p>
        </div>
      )}
      {/* Detail Panel */}
      {detailPanel}

      {/* Graph Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setIsFullscreen(!isFullscreen);
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

      {/* Canvas container — Cytoscape renders directly into this div */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ position: "absolute", inset: 0 }}
      />
    </div>
  );
}

// ── Layout runner ──────────────────────────────────────────────────
function runLayout(cy: any, totalElements: number) {
  // For very large graphs, use a simpler/faster layout config
  const isLarge = totalElements > 2000;
  const isHuge = totalElements > 10000;

  const layoutOptions: any = {
    name: "fcose",
    animate: !isHuge, // Skip animation for huge graphs
    animationDuration: isLarge ? 500 : 1000,
    randomize: true,
    padding: 40,
    // fcose-specific options
    quality: isHuge ? "draft" : isLarge ? "default" : "proof",
    nodeDimensionsIncludeLabels: !isHuge,
    uniformNodeDimensions: isHuge, // Faster when true
    nodeRepulsion: () => (isLarge ? 8000 : 6000),
    idealEdgeLength: () => (isLarge ? 80 : 120),
    edgeElasticity: () => (isLarge ? 50 : 100),
    gravity: isLarge ? 0.5 : 0.3,
    gravityRange: isLarge ? 2.0 : 3.8,
    numIter: isHuge ? 1000 : isLarge ? 2000 : 2500,
    tilingPaddingVertical: 10,
    tilingPaddingHorizontal: 10,
  };

  const layout = cy.layout(layoutOptions);

  layout.on("layoutstop", () => {
    cy.fit(undefined, 40);
  });

  layout.run();
}
