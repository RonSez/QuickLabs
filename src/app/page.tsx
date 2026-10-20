import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Products } from "@/components/sections/Products";
import { WebOffer } from "@/components/sections/WebOffer";
import { Principles } from "@/components/sections/Principles";
import { Closer } from "@/components/sections/Closer";
import { copy } from "@/content/copy";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Products />
      <Services />
      <WebOffer />
      <Principles />
      <Closer intro={copy.closer.homeIntro} />
    </>
  );
}
