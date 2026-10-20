import { webDesignPage } from "@/content/webdesign";
import { RevealGroup } from "@/components/motion/RevealGroup";

export function BuildList() {
  const b = webDesignPage.build;
  return (
    <section id="build" className="border-t border-line px-gutter py-24 lg:py-36">
      <h2 className="type-label mb-10 text-ash">{b.label}</h2>
      <RevealGroup className="grid border-b border-line md:grid-cols-2 md:gap-x-12">
        {b.items.map((item) => (
          <li key={item.title} className="border-t border-line py-6">
            <h3 className="type-title">{item.title}</h3>
            <p className="type-body mt-2 text-ash">{item.body}</p>
          </li>
        ))}
      </RevealGroup>
    </section>
  );
}
