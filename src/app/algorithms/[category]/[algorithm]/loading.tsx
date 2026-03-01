export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto animate-pulse">
      <div className="h-4 w-40 bg-surface/60 rounded mb-4" />
      <div className="h-8 w-72 bg-surface rounded-lg mb-2" />
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-16 bg-surface rounded-full" />
        <div className="h-6 w-20 bg-surface rounded-full" />
        <div className="h-6 w-24 bg-surface rounded-full" />
      </div>
      <div className="h-[200px] sm:h-[350px] bg-surface rounded-lg border border-border mb-8" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-surface/60 rounded" />
        <div className="h-4 w-5/6 bg-surface/60 rounded" />
        <div className="h-4 w-4/6 bg-surface/60 rounded" />
      </div>
      <div className="mt-8 space-y-3">
        <div className="h-6 w-32 bg-surface rounded-lg" />
        <div className="h-32 bg-surface rounded-lg border border-border" />
      </div>
    </div>
  );
}
