export default function Loading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 w-48 bg-surface rounded-lg mb-2" />
      <div className="h-4 w-80 bg-surface/60 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-surface rounded-lg border border-border" />
        ))}
      </div>
    </div>
  );
}
