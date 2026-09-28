function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800 ${className}`} />;
}

export default function PackageDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading package" className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
      <Block className="aspect-[16/9] w-full sm:aspect-[21/9]" />
      <div className="mt-5 space-y-3">
        <Block className="h-5 w-40 rounded-full" />
        <Block className="h-10 w-3/4" />
        <Block className="h-4 w-1/2" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Block className="h-12 w-full" />
          <Block className="h-56 w-full" />
          <Block className="h-72 w-full" />
        </div>
        <Block className="hidden h-96 lg:col-span-4 lg:block" />
      </div>
      <span className="sr-only">Loading package details…</span>
    </div>
  );
}
