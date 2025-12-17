interface PreviewTopBarProps {
  currentTheme: string;
  children: React.ReactNode;
}

export const PreviewTopBar = ({
  currentTheme,
  children,
}: PreviewTopBarProps) => {
  return (
    <div className="h-12 border-b bg-white dark:bg-black flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm shrink-0">
      {children}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground mr-2">
          Live Preview • {currentTheme} theme
        </span>
        <button className="text-xs font-semibold bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity">
          Publish
        </button>
      </div>
    </div>
  );
};
