export const webOffer = {
  label: "Web design",
  title: "Websites, looked after.",
  body: "We design and build custom sites for businesses, then host and maintain them for one monthly fee.",
  ledger: [
    { item: "Design & build", term: "Once" },
    { item: "Hosting", term: "Monthly" },
    { item: "Maintenance", term: "Monthly" },
    { item: "Content changes", term: "Monthly" },
    { item: "Support & monitoring", term: "Monthly" },
  ],
  link: { label: "See the web design offer", href: "/web-design" },
} as const;

export const webDesignPage = {
  meta: {
    title: "Web design & care plan",
    description:
      "Custom websites for businesses, designed and built by QuickLabs, then hosted and maintained under one monthly care plan.",
  },
  hero: {
    back: "QuickLabs",
    titleA: "Websites,",
    titleB: "looked after.",
    body: "We design and build custom websites for businesses, then host and maintain them every month.",
    cta: { label: "Start a project", href: "#contact" },
  },
  build: {
    label: "What we build",
    items: [
      { title: "Custom design & build", body: "Designed from scratch for your business. No templates." },
      { title: "Mobile-first", body: "Designed for phones first, then scaled up to larger screens." },
      { title: "Fast by default", body: "Pages that load quickly on any connection." },
      { title: "Landing & company sites", body: "A single focused landing page or a full company website." },
      { title: "Updates & support", body: "We handle changes, so you don't need to hire a developer." },
      { title: "Hosting & maintenance", body: "Hosting, security updates and monitoring, set up and handled by us." },
    ],
  },
  care: {
    label: "Care plan",
    title: "One plan. Everything covered.",
    body: "One monthly plan covers hosting, updates, changes and support, so there are no separate quotes.",
    receipt: {
      title: "Care plan",
      period: "Monthly",
      items: [
        "Hosting",
        "Maintenance & updates",
        "Content & design changes",
        "Technical support",
        "Performance monitoring",
      ],
      included: "Included",
      totalLabel: "Total",
      totalValue: "Ask us",
    },
  },
} as const;
