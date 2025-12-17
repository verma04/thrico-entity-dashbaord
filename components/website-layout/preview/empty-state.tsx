export const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground opacity-50">
      <p>All modules are hidden.</p>
      <p className="text-sm">
        Enable modules from the left panel to see them here.
      </p>
    </div>
  );
};
