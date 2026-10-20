import type { Metadata } from "next";
import { webDesignPage } from "@/content/webdesign";
import { copy } from "@/content/copy";
import { site } from "@/content/site";
import { WebHero } from "@/components/sections/webdesign/WebHero";
import { BuildList } from "@/components/sections/webdesign/BuildList";
import { CarePlan } from "@/components/sections/webdesign/CarePlan";
import { Closer } from "@/components/sections/Closer";

export const metadata: Metadata = {
  title: webDesignPage.meta.title,
  description: webDesignPage.meta.description,
  openGraph: {
    title: `${webDesignPage.meta.title} · ${site.name}`,
    description: webDesignPage.meta.description,
    url: `${site.url}/web-design`,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${webDesignPage.meta.title} · ${site.name}`,
    description: webDesignPage.meta.description,
  },
};

export default function WebDesignPage() {
  return (
    <>
      <WebHero />
      <BuildList />
      <CarePlan />
      <Closer intro={copy.closer.webDesignIntro} />
    </>
  );
}
