import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Products } from "@/components/sections/Products";
import { WebDesign } from "@/components/sections/WebDesign";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <Products />
      <WebDesign />
      <Approach />
      <Contact />
    </>
  );
}
