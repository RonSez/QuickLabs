import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Products } from "@/components/sections/Products";
import { WebOffer } from "@/components/sections/WebOffer";
import { Principles } from "@/components/sections/Principles";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Products />
      <Services />
      <WebOffer />
      <Principles />
      <Contact />
    </>
  );
}
