export default function Loading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 w-36 bg-surface rounded-lg mb-2" />
      <div className="h-4 w-72 bg-surface/60 rounded mb-6" />
      <div className="h-10 w-full max-w-md bg-surface rounded-lg border border-border mb-4" />
      <div className="flex gap-1.5 flex-wrap mb-6">
        {Array.from({ length: 26 }).map((_, i) => (
          <div key={i} className="h-8 w-8 bg-surface rounded" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-24 bg-surface rounded-lg border border-border" />
        ))}
      </div>
    </div>
  );
}
