export function BuilderSkeleton() {
  return (
    <div className="mt-10 grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div className="order-1 aspect-900/620 w-full animate-pulse rounded-3xl bg-muted lg:order-2" />
      <div className="order-2 flex flex-col gap-2.5 lg:order-1">
        <div className="h-9 animate-pulse rounded-full bg-muted" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
