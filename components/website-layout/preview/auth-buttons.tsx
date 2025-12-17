import { cn } from "@/lib/utils";

export const AuthButtons = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <button className="px-3 py-1.5 text-xs font-semibold hover:text-primary">
      Log in
    </button>
    <button className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
      Sign up
    </button>
  </div>
);
