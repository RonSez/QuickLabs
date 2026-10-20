import type { ProductScreen } from "@/content/products";
import { Words } from "./Words";

type NoteScreen = Extract<ProductScreen, { kind: "note" }>;

export function TypewriterNote({ screen }: { screen: NoteScreen }) {
  return (
    <div className="rounded-[2px] border border-line bg-ink-2 p-5 text-[0.9375rem] leading-relaxed sm:p-7">
      <div className="mb-5 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-bone/15" />
        ))}
      </div>
      <p className="mb-4 font-semibold">{screen.title}</p>
      <dl className="grid gap-3">
        {screen.fields.map((f, i) => (
          <div key={f.label} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="text-[var(--product)]">{f.label}</dt>
            <dd className="text-bone/75">
              <Words text={f.text} />
              {i === screen.fields.length - 1 ? <i className="caret ml-1 text-[var(--product)]" /> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
