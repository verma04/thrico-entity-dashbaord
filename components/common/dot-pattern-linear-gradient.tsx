"use client";

import { cn } from "@/lib/utils";
import { DotPattern } from "../ui/dot-pattern";

export function DotPatternLinearGradient() {
  return (
    <div className="bg-background absolute flex size-full items-center justify-center overflow-hidden rounded-lg border p-20 bg-light-200">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )}
      />
    </div>
  );
}
