export default function Loading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-10 w-72 bg-surface rounded-lg mb-3" />
      <div className="h-5 w-96 bg-surface/60 rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-36 bg-surface rounded-lg border border-border" />
        ))}
      </div>
    </div>
  );
}
