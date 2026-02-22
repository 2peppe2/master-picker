const MastersRequirementsSkeleton = () => (
  <div className="flex items-center gap-4 w-full animate-pulse">
    <div className="h-8 w-24 bg-muted rounded shrink-0" />
    <div className="flex gap-3 overflow-hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-8 w-20 bg-muted rounded-full shrink-0" />
      ))}
    </div>
  </div>
);

export default MastersRequirementsSkeleton;
