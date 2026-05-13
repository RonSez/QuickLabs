export type Service = {
  title: string;
  body: string;
  icon: string; // lucide icon name
};

export const services: Service[] = [
  {
    title: "AI product engineering",
    body:
      "End-to-end builds of AI products — from model selection and eval harnesses to inference plumbing, retrieval, and the UX wrapper that makes any of it usable.",
    icon: "Sparkles",
  },
  {
    title: "Full-stack web & mobile",
    body:
      "TypeScript, React/Next.js, React Native, Node, and the supporting cloud. We ship production systems with the testing and observability they need to stay up.",
    icon: "Layers",
  },
  {
    title: "Vertical AI integrations",
    body:
      "Embedding AI into the systems professionals already live in — clinical EMRs, MS Word, Google Workspace, CRMs — so adoption isn't a fight.",
    icon: "Plug",
  },
  {
    title: "Product design & strategy",
    body:
      "Specialist-grade interfaces. Information architecture, interaction design, and design systems for products where polish and clarity convert directly to user trust.",
    icon: "Compass",
  },
];
