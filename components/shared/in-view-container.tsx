"use client";

import React, { useEffect, useRef, useState } from "react";

interface InViewContainerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  minHeight?: string | number;
  className?: string;
}

export function InViewContainer({
  children,
  fallback = null,
  rootMargin = "250px",
  minHeight,
  className,
}: InViewContainerProps) {
  const [isInView, setIsInView] = useState(() => {
    if (typeof window === "undefined") return false;
    return !("IntersectionObserver" in window);
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isInView) return;

    const currentElem = containerRef.current;
    if (!currentElem || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(currentElem);

    return () => {
      observer.disconnect();
    };
  }, [isInView, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={minHeight ? { minHeight } : undefined}
    >
      {isInView ? children : fallback}
    </div>
  );
}
