import type { ProductSlug } from "./products";

export type Review = {
  quote: string;
  author: string;
  productSlug: ProductSlug | "quicklabs";
  source?: string;
};

export const reviews: Review[] = [
  {
    quote:
      "Rounds saves me five to ten minutes per patient. By the time I open the chart, the history is structured and the questions I want to ask are right there.",
    author: "Orthopedic specialist",
    productSlug: "rounds",
  },
  {
    quote:
      "Patients arrive ready. I'm not spending the visit excavating their story — I'm spending it on the plan.",
    author: "Neurologist",
    productSlug: "rounds",
  },
  {
    quote:
      "The scribe writes the note the way I'd write it. The first week I corrected things — by week two I was barely touching it.",
    author: "Internal medicine attending",
    productSlug: "rounds",
  },
  {
    quote:
      "Redlines runs inside Word, which means my associates actually use it. Anything that asks them to leave the document loses.",
    author: "Partner, mid-market firm",
    productSlug: "redlines",
  },
  {
    quote:
      "It applies our playbook the same way every time. New associates start producing partner-grade first passes in week one.",
    author: "General counsel, SaaS company",
    productSlug: "redlines",
  },
  {
    quote:
      "The transient-processing posture is what got us to yes. We weren't going to put client contracts into a vendor's training set.",
    author: "Director of legal operations",
    productSlug: "redlines",
  },
];
