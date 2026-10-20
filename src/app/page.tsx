import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Products } from "@/components/sections/Products";
import { WebOffer } from "@/components/sections/WebOffer";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Products />
      <Services />
      <WebOffer />
      <Approach />
      <Contact />
    </>
  );
}
