export const site = {
  name: "QuickLabs",
  tagline: "Software studio shipping AI products in regulated verticals",
  description:
    "QuickLabs is a software development studio that ships client work and incubates its own AI products — including rounds.health and redlines.legal.",
  url: "https://quicklabs.ai",
  email: "hello@quicklabs.ai",
  logo: {
    image: "/quicklabslogo.jpg",
    alt: "QuickLabs — Software Development",
  },
} as const;

export const nav = [
  { label: "Products", href: "/#products" },
  { label: "Services", href: "/#services" },
  { label: "Web Design", href: "/web-design" },
  { label: "Approach", href: "/#approach" },
  { label: "Contact", href: "/#contact" },
] as const;

export const social = [
  { label: "GitHub", href: "https://github.com/quicklabs" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/quicklabs" },
] as const;
