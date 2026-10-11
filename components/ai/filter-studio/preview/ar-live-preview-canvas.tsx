"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Camera,
  Play,
  Pause,
  Grid3X3,
  MapPin,
  VideoOff,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFilterStudioStore } from "@/store/useFilterStudioStore";
import {
  SAMPLE_FACE_PRESETS,
  getAnchorCoordinates,
} from "./sample-faces";
import { cn } from "@/lib/utils";

export function ARLivePreviewCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    manifest,
    activeLayerId,
    previewMode,
    activeFacePresetId,
    showFaceMesh,
    showAnchorPoints,
    isPlayingAnimation,
    lightingIntensity,
    setPreviewMode,
    setActiveFacePresetId,
    setShowFaceMesh,
    setShowAnchorPoints,
    setIsPlayingAnimation,
    updateLayer,
  } = useFilterStudioStore();

  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [fps, setFps] = useState(60);

  const activePreset =
    SAMPLE_FACE_PRESETS.find((p) => p.id === activeFacePresetId) ||
    SAMPLE_FACE_PRESETS[0];

  // Preload Images for Canvas rendering
  const imagesCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const avatarImageRef = useRef<HTMLImageElement | null>(null);

  // Load avatar SVG
  useEffect(() => {
    const img = new Image();
    const encoded = `data:image/svg+xml;utf8,${encodeURIComponent(activePreset.avatarSvg)}`;
    img.src = encoded;
    img.onload = () => {
      avatarImageRef.current = img;
    };
  }, [activePreset]);

  // Load layer images
  useEffect(() => {
    manifest.layers.forEach((layer) => {
      if (!imagesCacheRef.current.has(layer.id)) {
        const img = new Image();
        img.src = layer.assetUrl;
        img.onload = () => {
          imagesCacheRef.current.set(layer.id, img);
        };
      }
    });
  }, [manifest.layers]);

  // Webcam stream lifecycle
  const startWebcam = useCallback(async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 800 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsWebcamActive(true);
        setPreviewMode("live_webcam");
      }
    } catch (err: unknown) {
      const message = (err as Error).message || "Camera access denied or unavailable";
      setWebcamError(message);
      setIsWebcamActive(false);
      setPreviewMode("preset_face");
    }
  }, [setPreviewMode]);

  const stopWebcam = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
    setPreviewMode("preset_face");
  }, [setPreviewMode]);

  // Main Render Loop
  useEffect(() => {
    let animationFrameId: number;
    let frameCount = 0;
    let fpsTimer = performance.now();

    const render = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Track FPS
      frameCount++;
      if (time - fpsTimer >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - fpsTimer)));
        frameCount = 0;
        fpsTimer = time;
      }

      const width = canvas.width;
      const height = canvas.height;
      const elapsed = isPlayingAnimation ? time / 1000 : 0;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Background / Video / Avatar
      if (previewMode === "live_webcam" && videoRef.current && isWebcamActive) {
        // Mirrored webcam
        ctx.save();
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        ctx.restore();
      } else if (avatarImageRef.current) {
        ctx.drawImage(avatarImageRef.current, 0, 0, width, height);
      } else {
        // Fallback Dark Canvas
        ctx.fillStyle = "#18181B";
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Lighting filter effect
      if (lightingIntensity !== 1.0) {
        ctx.save();
        ctx.fillStyle = lightingIntensity > 1 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 3. Draw MediaPipe-Style 468 Mesh Simulation (Tessellation)
      if (showFaceMesh) {
        ctx.save();
        ctx.strokeStyle = "rgba(56, 189, 248, 0.28)";
        ctx.lineWidth = 0.8;
        ctx.fillStyle = "rgba(56, 189, 248, 0.6)";

        const lms = activePreset.landmarks;
        const pts = [
          { x: lms.forehead.x * width, y: lms.forehead.y * height },
          { x: (lms.forehead.x - 0.12) * width, y: (lms.forehead.y + 0.05) * height },
          { x: (lms.forehead.x + 0.12) * width, y: (lms.forehead.y + 0.05) * height },
          { x: lms.left_eye.x * width, y: lms.left_eye.y * height },
          { x: lms.right_eye.x * width, y: lms.right_eye.y * height },
          { x: lms.nose_bridge.x * width, y: lms.nose_bridge.y * height },
          { x: (lms.cheeks.x - 0.15) * width, y: lms.cheeks.y * height },
          { x: (lms.cheeks.x + 0.15) * width, y: lms.cheeks.y * height },
          { x: lms.mouth.x * width, y: lms.mouth.y * height },
          { x: lms.chin.x * width, y: lms.chin.y * height },
        ];

        // Draw triangulation lines
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dist = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (dist < width * 0.32) {
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
            }
          }
        }
        ctx.stroke();

        // Draw landmark dots
        pts.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 4. Draw Anchor Points Markers
      if (showAnchorPoints) {
        ctx.save();
        Object.entries(activePreset.landmarks).forEach(([name, coord]) => {
          const px = coord.x * width;
          const py = coord.y * height;

          // Crosshair ring
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.stroke();

          // Center dot
          ctx.fillStyle = "#FBBF24";
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();

          // Label
          ctx.font = "9px monospace";
          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.fillText(name.replace("_", " "), px + 7, py - 3);
        });
        ctx.restore();
      }

      // 5. Draw Filter Layers
      manifest.layers.forEach((layer) => {
        if (!layer.visible) return;

        const anchorCoord = getAnchorCoordinates(layer.anchor, activePreset.landmarks);
        const anchorX = anchorCoord.x * width;
        const anchorY = anchorCoord.y * height;

        // Position offset
        let posX = anchorX + (layer.transform.x / 100) * (width * 0.5);
        let posY = anchorY + (layer.transform.y / 100) * (height * 0.5);

        // Animation Modifiers
        let animScaleMod = 1;
        let animRotationMod = 0;
        let animAlphaMod = 1;

        if (isPlayingAnimation && layer.animation.preset !== "none") {
          const speed = layer.animation.speed;
          const amp = layer.animation.amplitude;

          if (layer.animation.preset === "floating") {
            posY += Math.sin(elapsed * speed * 3) * (amp * 0.5);
          } else if (layer.animation.preset === "pulse") {
            animScaleMod = 1 + Math.sin(elapsed * speed * 3.5) * (amp * 0.01);
          } else if (layer.animation.preset === "shimmer") {
            animAlphaMod = 0.85 + Math.sin(elapsed * speed * 4) * 0.15;
          } else if (layer.animation.preset === "particle_drift") {
            animRotationMod = Math.sin(elapsed * speed * 2) * (amp * 0.3);
            posX += Math.cos(elapsed * speed * 2) * (amp * 0.3);
          } else if (layer.animation.preset === "orbit") {
            posX += Math.cos(elapsed * speed * 2.5) * amp;
            posY += Math.sin(elapsed * speed * 2.5) * (amp * 0.5);
          }
        }

        const totalScaleX = layer.transform.scaleX * animScaleMod;
        const totalScaleY = layer.transform.scaleY * animScaleMod;
        const totalRotation =
          ((layer.transform.rotation + animRotationMod) * Math.PI) / 180;
        const totalOpacity = Math.min(1, Math.max(0, layer.transform.opacity * animAlphaMod));

        ctx.save();
        ctx.translate(posX, posY);
        ctx.rotate(totalRotation);
        ctx.scale(totalScaleX, totalScaleY);
        ctx.globalAlpha = totalOpacity;

        // Blend mode
        if (layer.blendMode === "screen") {
          ctx.globalCompositeOperation = "screen";
        } else if (layer.blendMode === "multiply") {
          ctx.globalCompositeOperation = "multiply";
        } else if (layer.blendMode === "overlay") {
          ctx.globalCompositeOperation = "overlay";
        } else if (layer.blendMode === "additive") {
          ctx.globalCompositeOperation = "lighter";
        } else {
          ctx.globalCompositeOperation = "source-over";
        }

        // Draw Image from cache
        const img = imagesCacheRef.current.get(layer.id);
        const baseLayerSize = width * 0.55;

        if (img && img.complete) {
          const aspect = img.width > 0 ? img.height / img.width : 0.6;
          const drawW = baseLayerSize;
          const drawH = baseLayerSize * aspect;

          // Glow effect
          if (layer.glowIntensity > 0) {
            ctx.shadowColor = layer.tintColor || "#F59E0B";
            ctx.shadowBlur = (layer.glowIntensity / 100) * 20;
          }

          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
          // Fallback procedural placeholder
          ctx.fillStyle = layer.tintColor || "#F59E0B";
          ctx.fillRect(-40, -20, 80, 40);
        }

        // 6. Active Layer Transform Gizmo (Selected bounding box)
        if (layer.id === activeLayerId) {
          ctx.save();
          ctx.strokeStyle = "#6366F1";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);

          const boxW = baseLayerSize + 12;
          const boxH = baseLayerSize * 0.6 + 12;

          ctx.strokeRect(-boxW / 2, -boxH / 2, boxW, boxH);

          // Corner handles
          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = "#4F46E5";
          ctx.setLineDash([]);
          const handleSize = 6;
          const corners = [
            [-boxW / 2, -boxH / 2],
            [boxW / 2, -boxH / 2],
            [boxW / 2, boxH / 2],
            [-boxW / 2, boxH / 2],
          ];
          corners.forEach(([cx, cy]) => {
            ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
            ctx.strokeRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
          });
          ctx.restore();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    manifest.layers,
    activeLayerId,
    previewMode,
    activePreset,
    showFaceMesh,
    showAnchorPoints,
    isPlayingAnimation,
    lightingIntensity,
    isWebcamActive,
  ]);

  // Interactive Drag & Move on Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeLayerId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStart || !activeLayerId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const deltaX = ((currentX - dragStart.x) / canvas.width) * 100 * 2;
    const deltaY = ((currentY - dragStart.y) / canvas.height) * 100 * 2;

    const activeLayer = manifest.layers.find((l) => l.id === activeLayerId);
    if (activeLayer && !activeLayer.locked) {
      updateLayer(activeLayerId, {
        transform: {
          ...activeLayer.transform,
          x: Math.round(activeLayer.transform.x + deltaX),
          y: Math.round(activeLayer.transform.y + deltaY),
        },
      });
    }

    setDragStart({ x: currentX, y: currentY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-between h-full w-full bg-zinc-950 rounded-xl overflow-hidden border border-border/80 shadow-inner select-none"
    >
      {/* Hidden Video for Webcam */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="hidden"
      />

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Engine & FPS Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Badge
            variant="outline"
            className="bg-black/60 backdrop-blur-md border-zinc-700/80 text-zinc-200 text-[11px] font-mono px-2.5 py-1 gap-1.5"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            MediaPipe AR • {fps} FPS
          </Badge>
          <Badge
            variant="outline"
            className="bg-black/60 backdrop-blur-md border-zinc-700/80 text-zinc-300 text-[11px] capitalize px-2 py-1 hidden sm:inline-flex"
          >
            {activePreset.name.split("—")[0]}
          </Badge>
        </div>

        {/* Right: Mode Toggles */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-zinc-800 pointer-events-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (previewMode === "live_webcam") {
                stopWebcam();
              } else {
                startWebcam();
              }
            }}
            className={cn(
              "h-7 px-2 text-[11px] gap-1 font-medium text-zinc-300 hover:text-white transition-all",
              previewMode === "live_webcam" &&
                "bg-indigo-600 text-white hover:bg-indigo-700"
            )}
            title="Toggle Live Camera"
          >
            {previewMode === "live_webcam" ? (
              <>
                <VideoOff className="h-3 w-3" />
                Stop Cam
              </>
            ) : (
              <>
                <Camera className="h-3 w-3" />
                Webcam
              </>
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowFaceMesh(!showFaceMesh)}
            className={cn(
              "h-7 w-7 text-zinc-400 hover:text-white transition-all",
              showFaceMesh && "bg-sky-500/20 text-sky-400 hover:text-sky-300"
            )}
            title="Toggle Face Mesh Wireframe"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowAnchorPoints(!showAnchorPoints)}
            className={cn(
              "h-7 w-7 text-zinc-400 hover:text-white transition-all",
              showAnchorPoints && "bg-amber-500/20 text-amber-400 hover:text-amber-300"
            )}
            title="Toggle Face Anchors"
          >
            <MapPin className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
            className={cn(
              "h-7 w-7 text-zinc-400 hover:text-white transition-all",
              isPlayingAnimation && "text-emerald-400"
            )}
            title={isPlayingAnimation ? "Pause Motion" : "Play Motion"}
          >
            {isPlayingAnimation ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Webcam Error Banner */}
      {webcamError && (
        <div className="absolute top-14 left-4 right-4 z-20 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-2 rounded-lg backdrop-blur-md flex items-center justify-between">
          <span>{webcamError}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setWebcamError(null)}
            className="h-6 text-[10px] text-rose-300"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center w-full h-full p-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={cn(
            "rounded-lg shadow-2xl max-w-full max-h-[580px] aspect-[4/5] object-contain transition-transform",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
        />
      </div>

      {/* Bottom Floating Face Selector Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-zinc-800 pointer-events-auto">
          {SAMPLE_FACE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                if (previewMode === "live_webcam") stopWebcam();
                setActiveFacePresetId(preset.id);
              }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all text-zinc-400 hover:text-white",
                activeFacePresetId === preset.id &&
                  previewMode === "preset_face" &&
                  "bg-zinc-800 text-white shadow-xs"
              )}
            >
              <User className="h-3 w-3" />
              <span>{preset.name.split("—")[0].trim()}</span>
            </button>
          ))}
        </div>

        <div className="text-[11px] text-zinc-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 hidden sm:block">
          Drag layer on canvas to reposition
        </div>
      </div>
    </div>
  );
}
