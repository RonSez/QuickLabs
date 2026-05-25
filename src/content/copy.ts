export const copy = {
  hero: {
    eyebrow: "[ Software studio · AI products ]",
    headline: "We build software for clients, and ship our own AI products.",
    sub: "QuickLabs is a development studio with two live products in healthcare and legal. We bring the same regulated-industry rigor to every engagement.",
    primaryCta: { label: "See our products", href: "#products" },
    secondaryCta: { label: "Work with us", href: "#contact" },
  },
  about: {
    eyebrow: "About",
    title: "A studio that builds — and ships its own.",
    body:
      "Most agencies stop at delivery. We don't. QuickLabs operates two of its own products in regulated industries, which means every line of client code we write has shipped past our own bar for compliance, performance, and clinician- or operator-grade UX.",
    stats: [
      { value: "2", label: "products live in regulated verticals" },
      { value: "AI-native", label: "from research to deployment" },
      { value: "HIPAA · SOC 2 · ISO 27001", label: "compliance-aware by default" },
    ],
  },
  services: {
    eyebrow: "What we do",
    title: "Engineering, design, and AI — for the work that has to be right.",
    body:
      "We take on engagements that demand domain depth. Healthcare, legal, fintech, and other verticals where the stakes — and the regulations — are real.",
  },
  products: {
    eyebrow: "Our products",
    title: "Two AI products. Built, shipped, supported.",
    body:
      "We don't only consult. We're operators. Each of these products started as a thesis about a workflow that AI could actually own end-to-end — and is now in daily use by professionals who can't tolerate guesswork.",
  },
  approach: {
    eyebrow: "How we work",
    title: "Three principles that show up in everything we ship.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell us what you're building.",
    body:
      "Send us a note. We reply within one working day with a real human, not a form receipt.",
    cta: { label: "Email us", hrefBase: "mailto:" },
  },
} as const;
