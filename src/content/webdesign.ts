export type WebDesignService = {
  title: string;
  body: string;
  icon: string; // lucide icon name
};

export type CarePlanItem = {
  title: string;
  body: string;
  icon: string;
};

export const webDesignCopy = {
  eyebrow: "Web design & care",
  title: "Modern websites for businesses that want to stand out online.",
  body:
    "Custom-designed, fast, and mobile-ready sites — backed by a monthly care plan that keeps everything running smoothly so you can focus on the business.",
  carePlan: {
    eyebrow: "Monthly care plan",
    title: "Your site, fully looked after.",
    body:
      "One predictable monthly plan covers hosting, maintenance, content changes, technical support, and performance monitoring — no surprise quotes.",
  },
  cta: {
    label: "See the full offer",
    href: "/web-design",
  },
} as const;

export const webDesignPageCopy = {
  eyebrow: "Web design & care plan",
  title: "Premium websites — designed, built, and looked after.",
  body:
    "We design and build modern websites for businesses that want a premium online presence. Every site is custom, mobile-first, and performance-tuned — then kept healthy by an optional monthly care plan.",
  servicesTitle: "What we build",
  servicesBody:
    "From a focused landing page to a full company website — designed to look professional, load fast, and convert.",
  carePlanTitle: "The monthly care plan",
  carePlanBody:
    "A single monthly plan that keeps your site fast, secure, and current. We handle the operations so you don't have to think about it.",
  ctaTitle: "Ready to start?",
  ctaBody:
    "Tell us about the business and the kind of site you have in mind. We reply within one working day.",
} as const;

export const webDesignServices: WebDesignService[] = [
  {
    title: "Custom design & build",
    body:
      "Tailored design and development for businesses that need a site as polished as the product behind it.",
    icon: "Palette",
  },
  {
    title: "Mobile-first responsive",
    body:
      "Designed for the phone first. Every layout, interaction, and image works at any screen size.",
    icon: "Smartphone",
  },
  {
    title: "Fast, modern UX",
    body:
      "Performance-tuned from the first paint. Pages that load instantly and feel right under the cursor.",
    icon: "Zap",
  },
  {
    title: "Landing & company sites",
    body:
      "Conversion-focused landing pages and full company websites — built around what visitors need to do next.",
    icon: "Globe",
  },
  {
    title: "Updates & ongoing support",
    body:
      "Content changes, design refreshes, and product launches handled without you spinning up a dev team.",
    icon: "Wrench",
  },
  {
    title: "Hosting setup & maintenance",
    body:
      "Hosting, deployments, monitoring, and the unglamorous infrastructure work done right.",
    icon: "Server",
  },
];

export const carePlanItems: CarePlanItem[] = [
  {
    title: "Website hosting",
    body:
      "Fast, reliable hosting on modern infrastructure — configured, secured, and monitored.",
    icon: "Server",
  },
  {
    title: "Ongoing maintenance",
    body:
      "Dependencies, security updates, and the upkeep that keeps a site healthy over time.",
    icon: "Wrench",
  },
  {
    title: "Content & design changes",
    body:
      "Swap copy, refresh sections, add pages — covered each month, no separate project quote.",
    icon: "FileText",
  },
  {
    title: "Technical support",
    body:
      "A direct line to the team when something needs fixing or you have a question.",
    icon: "LifeBuoy",
  },
  {
    title: "Performance monitoring",
    body:
      "Uptime, speed, and Core Web Vitals tracked so issues are caught before users notice.",
    icon: "Gauge",
  },
];
