import React, { useRef, useEffect, useCallback } from "react";
import { WheelSegment } from "./types";

export function WheelPreview({ segments }: { segments: WheelSegment[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 4;

    ctx.clearRect(0, 0, size, size);

    const active = segments.filter((s) => s.isActive);
    const totalProb = active.reduce((s, seg) => s + seg.probability, 0);

    if (active.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#e5e7eb";
      ctx.fill();
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.textAlign = "center";
      ctx.fillText("No segments", center, center);
      return;
    }

    let startAngle = -Math.PI / 2;
    active.forEach((seg) => {
      const sliceAngle = (seg.probability / totalProb) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const midAngle = startAngle + sliceAngle / 2;
      const labelR = radius * 0.65;
      const x = center + Math.cos(midAngle) * labelR;
      const y = center + Math.sin(midAngle) * labelR;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(midAngle + Math.PI / 2);
      ctx.font = "bold 8px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        seg.label.length > 9 ? seg.label.slice(0, 9) + "…" : seg.label,
        0,
        0,
      );
      ctx.restore();
      startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(center, center, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#1f2937";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = "bold 7px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", center, center);

    ctx.beginPath();
    ctx.moveTo(center - 7, 2);
    ctx.lineTo(center + 7, 2);
    ctx.lineTo(center, 13);
    ctx.closePath();
    ctx.fillStyle = "#fbbf24";
    ctx.fill();
  }, [segments]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  return (
    <canvas ref={canvasRef} width={180} height={180} className="mx-auto" />
  );
}
