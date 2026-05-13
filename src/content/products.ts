export type ProductSlug = "rounds" | "redlines";

export type Product = {
  slug: ProductSlug;
  name: string;
  domain: string;
  url: string;
  tagline: string;
  blurb: string;
  features: { title: string; body: string }[];
  badges: string[];
  accentVar: string; // CSS var name e.g. '--health'
  accentClass: string; // Tailwind class for accent (mapped to var)
};

export const products: Product[] = [
  {
    slug: "rounds",
    name: "rounds.health",
    domain: "rounds.health",
    url: "https://rounds.health",
    tagline: "AI physician assistant for specialty care.",
    blurb:
      "Rounds is an AI medical assistant designed for specialists. It runs the workflow around the appointment — pre-visit history-taking, in-visit scribing, and post-visit follow-up — so clinicians spend less time on documentation and more time with patients.",
    features: [
      {
        title: "Pre-visit AI history",
        body:
          "Patients answer an adaptive intake before the appointment. Rounds composes a structured pre-visit summary the clinician opens already up to speed.",
      },
      {
        title: "AI medical scribe",
        body:
          "Ambient capture during the encounter. Rounds writes the structured note in the clinician's voice and inserts it into the EMR — no copy-paste.",
      },
      {
        title: "Post-visit agent",
        body:
          "Follow-ups, patient instructions, and routing handled automatically after the visit ends — with the clinician in the loop on anything clinical.",
      },
      {
        title: "Document management",
        body:
          "Inbound faxes, referrals, and labs are parsed, tagged, and surfaced where they belong in the chart.",
      },
    ],
    badges: ["HIPAA", "SOC 2", "ISO 27001"],
    accentVar: "--health",
    accentClass: "text-health",
  },
  {
    slug: "redlines",
    name: "redlines.legal",
    domain: "redlines.legal",
    url: "https://redlines.legal",
    tagline: "AI contract redlining inside Microsoft Word.",
    blurb:
      "Redlines lives where lawyers actually work — inside MS Word. It produces firm-quality redlines against your playbook, with transient processing so contract text never lingers in third-party storage.",
    features: [
      {
        title: "Native Word add-in",
        body:
          "No new tab, no upload-and-wait. Redlines runs as a Word task pane and edits the document you're already in.",
      },
      {
        title: "Playbook-aware redlines",
        body:
          "Encode your firm's positions once. Redlines applies them consistently, with rationale you can review before accepting.",
      },
      {
        title: "Transient processing",
        body:
          "Contract text is processed in-memory and dropped — never used to train models, never retained beyond the request.",
      },
      {
        title: "LLM-powered drafting",
        body:
          "Generate alternative language, fall-back positions, and clause comparisons without leaving the document.",
      },
    ],
    badges: ["Confidentiality-first", "Word add-in", "Frontier LLMs"],
    accentVar: "--legal",
    accentClass: "text-legal",
  },
];
