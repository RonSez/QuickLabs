export type ProductSlug = "rounds" | "redlines";

export type ProductScreen =
  | { kind: "note"; title: string; fields: { label: string; text: string }[] }
  | { kind: "redline"; title: string; before: string; deleted: string; inserted: string; after: string };

export type Product = {
  slug: ProductSlug;
  name: string;
  domain: string;
  url: string;
  vertical: string;
  tagline: string;
  facts: string;
  screen: ProductScreen;
};

export const products: Product[] = [
  {
    slug: "rounds",
    name: "rounds.health",
    domain: "rounds.health",
    url: "https://rounds.health",
    vertical: "Healthcare",
    tagline: "An AI assistant for specialists that handles the work around each visit: intake, notes and follow-up.",
    facts: "HIPAA · SOC 2 · ISO 27001",
    screen: {
      kind: "note",
      title: "Pre-visit summary · J. Alvarez, 54",
      fields: [
        { label: "Chief complaint", text: "Right knee pain for three weeks, worse on stairs." },
        { label: "History", text: "Meniscus repair in 2019. No new injury." },
        { label: "Medications", text: "Ibuprofen as needed." },
        { label: "For this visit", text: "Examine the knee and review the MRI from the referral." },
      ],
    },
  },
  {
    slug: "redlines",
    name: "redlines.legal",
    domain: "redlines.legal",
    url: "https://redlines.legal",
    vertical: "Legal",
    tagline: "Contract redlining inside Microsoft Word, applied against your firm's playbook.",
    facts: "Word add-in · Contract text is never stored",
    screen: {
      kind: "redline",
      title: "Supply Agreement · Clause 9.2",
      before: "The Supplier shall indemnify the Customer",
      deleted: "against any and all losses, however arising,",
      inserted: "against direct losses, capped at the fees paid in the previous 12 months,",
      after: "arising from a breach of this Agreement.",
    },
  },
];
