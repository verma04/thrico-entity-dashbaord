/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  RotateCcw,
  FlipHorizontal,
  Mic,
  MicOff,
  Sparkles,
  AlertCircle,
  Check,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MobilePortraitRecorderProps {
  frameUrl?: string | null;
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
  onRecordingComplete: (videoBlob: Blob, previewUrl: string) => void;
  className?: string;
}

export function MobilePortraitRecorder({
  frameUrl,
  minDurationSeconds = 3,
  maxDurationSeconds = 60,
  onRecordingComplete,
  className,
}: MobilePortraitRecorderProps) {
  // ── States ────────────────────────────────────────────────────────────────
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isMuted, setIsMuted] = useState(false);
  const [cameraAttempt, setCameraAttempt] = useState(0);

  // Recording lifecycle: "idle" -> "countdown" -> "recording" -> "review"
  const [recordingState, setRecordingState] = useState<
    "idle" | "countdown" | "recording" | "review"
  >("idle");
  const [countdown, setCountdown] = useState(3);
  const [recordedSeconds, setRecordedSeconds] = useState(0);

  // Review take
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const reviewVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ── Camera Stream Synchronization ─────────────────────────────────────────
  useEffect(() => {
    let isCancelled = false;

    async function initCamera() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode,
            width: { ideal: 1080 },
            height: { ideal: 1920 },
            aspectRatio: { ideal: 9 / 16 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = stream;
          await liveVideoRef.current.play().catch(() => {});
        }

        setHasPermission(true);
        setErrorMessage(null);
      } catch (err: unknown) {
        if (isCancelled) return;
        console.error("Camera access error:", err);
        setHasPermission(false);
        setErrorMessage(
          (err as Error).name === "NotAllowedError"
            ? "Camera/Microphone access was denied. Please allow permissions in your browser to record."
            : "Unable to access camera or microphone on this device."
        );
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [facingMode, cameraAttempt]);

  // Flip Camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Toggle Mic
  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  // ── Start Recording with 3s Countdown ─────────────────────────────────────
  const initiateRecording = () => {
    if (!streamRef.current) return;
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    setRecordingState("countdown");
    setCountdown(3);

    let count = 3;
    countdownIntervalRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        startMediaRecording();
      }
    }, 1000);
  };

  const startMediaRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];

    // Determine supported mimeType
    const candidates = [
      "video/mp4;codecs=avc1,mp4a.40.2",
      "video/mp4",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    let selectedMime = "";
    if (typeof MediaRecorder !== "undefined") {
      for (const t of candidates) {
        if (MediaRecorder.isTypeSupported(t)) {
          selectedMime = t;
          break;
        }
      }
    }

    try {
      const options: MediaRecorderOptions = {
        videoBitsPerSecond: 3500000,
      };
      if (selectedMime) {
        options.mimeType = selectedMime;
      }

      const recorder = new MediaRecorder(streamRef.current, options);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const finalType = recorder.mimeType || selectedMime || "video/mp4";
        const blob = new Blob(chunksRef.current, { type: finalType });
        const url = URL.createObjectURL(blob);
        setRecordedBlob(blob);
        setPreviewUrl(url);
        setRecordingState("review");
      };

      mediaRecorderRef.current = recorder;
      recorder.start(500);

      setRecordingState("recording");
      setRecordedSeconds(0);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordedSeconds((prev) => {
          if (prev + 1 >= maxDurationSeconds) {
            stopMediaRecording();
            return maxDurationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      console.error("MediaRecorder start error:", err);
      setRecordingState("idle");
    }
  };

  const stopMediaRecording = () => {
    if (recordedSeconds < minDurationSeconds) {
      toast.warning(`Recording must be at least ${minDurationSeconds} seconds.`);
      return;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  // ── Retake Action ─────────────────────────────────────────────────────────
  const handleRetake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setRecordedBlob(null);
    setPreviewUrl(null);
    setRecordedSeconds(0);
    setRecordingState("idle");

    // Reconnect video stream to live element or request new stream
    setTimeout(() => {
      if (liveVideoRef.current && streamRef.current && streamRef.current.active) {
        liveVideoRef.current.srcObject = streamRef.current;
        liveVideoRef.current.play().catch(() => {});
      } else {
        setCameraAttempt((prev) => prev + 1);
      }
    }, 50);
  };

  // ── Confirm Take ──────────────────────────────────────────────────────────
  const handleConfirmTake = () => {
    if (recordedBlob && previewUrl) {
      onRecordingComplete(recordedBlob, previewUrl);
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={cn("flex flex-col items-center select-none", className)}>
      {/* Smartphone Chassis Container */}
      <div className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/16] rounded-[44px] p-2.5 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 shadow-2xl border-4 border-zinc-700/80 overflow-hidden flex flex-col justify-between">
        {/* Dynamic Island / Camera Notch */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 h-4 w-28 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="h-2 w-2 rounded-full bg-zinc-800" />
          <div className="h-1.5 w-1.5 rounded-full bg-blue-900/60" />
        </div>

        {/* Viewfinder Screen */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-black flex items-center justify-center">
          {/* CAMERA ERROR / PERMISSION DENIED */}
          {hasPermission === false && (
            <div className="p-6 text-center text-white space-y-3 z-30">
              <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
              <h4 className="text-sm font-semibold">Camera Access Required</h4>
              <p className="text-xs text-zinc-400 leading-snug">{errorMessage}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCameraAttempt((v) => v + 1)}
                className="text-xs mt-2 text-zinc-900 dark:text-zinc-100 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry Camera
              </Button>
            </div>
          )}

          {/* 1. LIVE CAMERA FEED (when not in review) */}
          {recordingState !== "review" && (
            <video
              ref={liveVideoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "absolute inset-0 w-full h-full object-cover",
                facingMode === "user" && "scale-x-[-1]"
              )}
            />
          )}

          {/* 2. RECORDED TAKE REVIEW FEED */}
          {recordingState === "review" && previewUrl && (
            <video
              ref={reviewVideoRef}
              src={previewUrl}
              autoPlay
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* 3. TRANSPARENT PNG FRAME FILTER OVERLAY (Always on top of video!) */}
          {frameUrl && (
            <img
              src={frameUrl}
              alt="Live Campaign Filter Frame"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 select-none"
            />
          )}

          {/* 4. TOP HUD BAR */}
          <div className="absolute top-9 left-4 right-4 z-30 flex items-center justify-between">
            {recordingState === "recording" ? (
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/30">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  {formatTime(recordedSeconds)} / {formatTime(maxDurationSeconds)}
                </span>
              </div>
            ) : recordingState === "review" ? (
              <Badge className="bg-emerald-500/80 text-white backdrop-blur-md text-[10px] uppercase font-bold">
                Reviewing Take
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-black/40 text-white/90 border-white/20 backdrop-blur-md text-[10px]">
                <Sparkles className="h-3 w-3 mr-1 text-yellow-400" />
                Portrait Lens
              </Badge>
            )}

            {/* Camera Flipping & Mute Controls */}
            {recordingState === "idle" && (
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10">
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  title="Flip camera"
                  className="h-7 w-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleMic}
                  title="Mute/unmute microphone"
                  className="h-7 w-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {isMuted ? (
                    <MicOff className="h-3.5 w-3.5 text-destructive" />
                  ) : (
                    <Mic className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 5. COUNTDOWN OVERLAY (3... 2... 1...) */}
          {recordingState === "countdown" && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-40">
              <div className="h-24 w-24 rounded-full bg-red-600/90 border-4 border-white flex items-center justify-center text-5xl font-black text-white shadow-2xl animate-bounce">
                {countdown}
              </div>
            </div>
          )}

          {/* 6. BOTTOM HUD: CONTROLS & SHUTTER */}
          <div className="absolute bottom-6 left-4 right-4 z-30 flex flex-col items-center gap-3">
            {recordingState === "idle" && (
              <button
                type="button"
                onClick={initiateRecording}
                disabled={hasPermission === false}
                className="group relative h-16 w-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-xl disabled:opacity-50"
              >
                <div className="h-12 w-12 rounded-full bg-red-600 group-hover:bg-red-500 transition-colors" />
              </button>
            )}

            {recordingState === "recording" && (
              <button
                type="button"
                onClick={stopMediaRecording}
                className="h-16 w-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-xl"
              >
                <div className="h-6 w-6 rounded-md bg-red-600 animate-pulse" />
              </button>
            )}

            {recordingState === "review" && (
              <div className="w-full flex items-center justify-between gap-2 bg-black/70 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRetake}
                  className="flex-1 h-9 text-xs text-white hover:bg-white/20 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Retake
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmTake}
                  className="flex-1 h-9 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer shadow-md"
                >
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Use Video
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-28 bg-zinc-600 rounded-full z-40" />
      </div>

      {/* Helper text */}
      <p className="text-[11px] text-muted-foreground mt-3 text-center max-w-[280px]">
        {recordingState === "review"
          ? "Preview your take with the transparent PNG frame. Click 'Use Video' to render or 'Retake' to try again."
          : "Position yourself inside the frame cutout and hit the red button to record."}
      </p>
    </div>
  );
}
