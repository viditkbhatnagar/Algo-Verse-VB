export default function Loading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-surface rounded-lg" />
        <div>
          <div className="h-7 w-56 bg-surface rounded-lg mb-1" />
          <div className="h-4 w-80 bg-surface/60 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-40 bg-surface rounded-lg border border-border" />
        ))}
      </div>
    </div>
  );
}
