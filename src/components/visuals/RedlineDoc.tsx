import type { ProductScreen } from "@/content/products";
import { Words } from "./Words";

type RedlineScreen = Extract<ProductScreen, { kind: "redline" }>;

export function RedlineDoc({ screen }: { screen: RedlineScreen }) {
  return (
    <div className="rounded-[2px] bg-bone p-5 text-ink sm:p-7">
      <p className="type-label mb-4 text-ink/60">{screen.title}</p>
      <p className="font-[ui-serif,Georgia,'Times_New_Roman',serif] text-[1.0625rem] leading-relaxed sm:text-[1.1875rem]">
        {screen.before}{" "}
        <del data-del className="text-redlines decoration-redlines decoration-[1.5px]">
          {screen.deleted}
        </del>{" "}
        <ins data-ins className="text-redlines underline decoration-redlines/60 underline-offset-[3px]">
          <Words text={screen.inserted} />
        </ins>{" "}
        {screen.after}
      </p>
    </div>
  );
}
