export function SiteAssemble() {
  return (
    <div data-site aria-hidden className="overflow-hidden rounded-[2px] border border-line bg-ink-2">
      <div className="flex h-8 items-center gap-1.5 border-b border-line px-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-bone/15" />
        ))}
        <span className="ml-3 block h-3 w-32 rounded-[2px] bg-bone/10 sm:w-48" />
      </div>
      <div className="grid gap-3 p-5 sm:p-8">
        <span data-block className="block h-3 w-1/4 bg-bone/15" />
        <span data-block className="block h-10 w-5/6 bg-bone/15 sm:h-14" />
        <span data-block className="block h-3 w-3/5 bg-bone/15" />
        <span data-cta className="mt-2 block h-9 w-32 rounded-[2px] bg-bone" />
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <span key={i} data-block className="block aspect-[4/3] bg-bone/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
