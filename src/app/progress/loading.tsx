export default function Loading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 w-48 bg-surface rounded-lg mb-2" />
      <div className="h-4 w-64 bg-surface/60 rounded mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-surface rounded-lg border border-border" />
        ))}
      </div>
      <div className="h-48 bg-surface rounded-lg border border-border mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 bg-surface rounded-lg border border-border" />
        <div className="h-64 bg-surface rounded-lg border border-border" />
      </div>
    </div>
  );
}
