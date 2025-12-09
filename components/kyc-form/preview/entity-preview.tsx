"use client";

import React, { forwardRef, useRef } from "react";
import Image from "next/image";
import {
  FileText,
  Users,
  MessageSquare,
  Home,
  ShoppingBag,
  Briefcase,
  PartyPopper,
  Heart,
  Trophy,
  Gamepad2,
  HandHeart,
  Users2,
  GraduationCap,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";

/* -------------------------------- Circle -------------------------------- */

type CircleProps = {
  className?: string;
  children?: React.ReactNode;
};

const Circle = forwardRef<HTMLDivElement, CircleProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white shadow-md",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Circle.displayName = "Circle";

/* ---------------------------- Main Component ----------------------------- */

export function EntityPreview({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const hubRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // feature refs
  const contentRef = useRef<HTMLDivElement>(null);
  const connectionsRef = useRef<HTMLDivElement>(null);
  const conversationsRef = useRef<HTMLDivElement>(null);
  const communitiesRef = useRef<HTMLDivElement>(null);
  const commerceRef = useRef<HTMLDivElement>(null);
  const careersRef = useRef<HTMLDivElement>(null);
  const celebrationsRef = useRef<HTMLDivElement>(null);
  const careRef = useRef<HTMLDivElement>(null);
  const championRef = useRef<HTMLDivElement>(null);
  const gamificationRef = useRef<HTMLDivElement>(null);
  const charityRef = useRef<HTMLDivElement>(null);
  const collaborationRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      ref: contentRef,
      icon: <FileText className="h-6 w-6" />,
      label: "Content",
      color: "text-blue-600",
    },
    {
      ref: connectionsRef,
      icon: <Users className="h-6 w-6" />,
      label: "Connections",
      color: "text-purple-600",
    },
    {
      ref: conversationsRef,
      icon: <MessageSquare className="h-6 w-6" />,
      label: "Conversations",
      color: "text-green-600",
    },
    {
      ref: communitiesRef,
      icon: <Home className="h-6 w-6" />,
      label: "Communities",
      color: "text-orange-600",
    },
    {
      ref: commerceRef,
      icon: <ShoppingBag className="h-6 w-6" />,
      label: "Commerce",
      color: "text-pink-600",
    },
    {
      ref: careersRef,
      icon: <Briefcase className="h-6 w-6" />,
      label: "Careers",
      color: "text-indigo-600",
    },

    {
      ref: gamificationRef,
      icon: <Gamepad2 className="h-6 w-6" />,
      label: "Gamification",
      color: "text-cyan-600",
    },
  ];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-[520px] w-full items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* layout */}
      <div className="flex w-full max-w-4xl items-center justify-between px-10">
        {/* user */}
        <div className="flex flex-col items-center gap-2">
          <Circle ref={userRef} className="size-12">
            <User className="h-6 w-6" />
          </Circle>
          <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
            Community Owner
          </span>
        </div>

        {/* hub */}
        <Circle ref={hubRef} className="size-16">
          <Image
            src="/thrico-mini.png"
            alt="Hub"
            width={40}
            height={40}
            className="object-contain"
          />
        </Circle>

        {/* features */}
        <div className="flex flex-col gap-3">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <Circle ref={f.ref}>
                <span className={f.color}>{f.icon}</span>
              </Circle>
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* beams: features → hub */}
      {features.map((f) => (
        <AnimatedBeam
          key={f.label}
          containerRef={containerRef}
          fromRef={f.ref}
          toRef={hubRef}
          duration={3}
        />
      ))}

      {/* hub → user */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={userRef}
        duration={3}
      />
    </div>
  );
}
export default EntityPreview;
