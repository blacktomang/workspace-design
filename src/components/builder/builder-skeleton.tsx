export function BuilderSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-10 sm:pt-14">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <div className="h-6 w-48 animate-pulse rounded-full bg-muted" />
        <div className="h-11 w-80 max-w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="order-1 aspect-[900/620] w-full animate-pulse rounded-3xl bg-muted lg:order-2" />
        <div className="order-2 flex flex-col gap-2.5 lg:order-1">
          <div className="h-9 animate-pulse rounded-full bg-muted" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    </section>
  );
}
