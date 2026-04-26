interface PreviewTopBarProps {
  currentTheme: string;
  children: React.ReactNode;
}

export const PreviewTopBar = ({
  currentTheme,
  children,
}: PreviewTopBarProps) => {
  return (
    <div className="h-10 border-b bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-between px-3 sticky top-0 z-20 shrink-0">
      {children}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground/60 capitalize">
          {currentTheme}
        </span>
        <button className="text-[11px] font-semibold bg-primary text-primary-foreground px-3.5 py-1 rounded-full hover:opacity-90 transition-opacity">
          Publish
        </button>
      </div>
    </div>
  );
};
