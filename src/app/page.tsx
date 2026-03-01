export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center animate-fade-in">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          <span className="text-primary">Algo</span>
          <span className="text-accent">Verse</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Interactive visual learning platform for algorithms, data structures,
          machine learning, deep learning, and NLP.
        </p>
        <div className="flex gap-4 justify-center">
          <div className="px-4 py-2 rounded-md bg-surface border border-border text-sm text-muted-foreground">
            300+ Algorithms
          </div>
          <div className="px-4 py-2 rounded-md bg-surface border border-border text-sm text-muted-foreground">
            Step-by-Step Visualizations
          </div>
          <div className="px-4 py-2 rounded-md bg-surface border border-border text-sm text-muted-foreground">
            AI-Powered Explanations
          </div>
        </div>
        <p className="mt-12 text-sm text-muted-foreground/60">
          Phase 0 complete — Shell &amp; Navigation coming in Phase 1
        </p>
      </div>
    </main>
  );
}
