export type Principle = {
  title: string;
  body: string;
  icon: string; // lucide icon name
};

export const principles: Principle[] = [
  {
    title: "Regulated-first",
    body:
      "We start with the compliance, security, and legal posture the product needs to ship — not after launch when retrofitting is expensive.",
    icon: "ShieldCheck",
  },
  {
    title: "Workflow-native",
    body:
      "We embed AI into the tools professionals already use. The best product is the one users adopt without a fight, because it lives where they live.",
    icon: "Workflow",
  },
  {
    title: "Specialist-grade",
    body:
      "Surgeons, partners, and senior operators are unforgiving users. We design and build for them, and the rest of the audience comes along.",
    icon: "Award",
  },
];
