import { Topbar } from "@/components/home/Topbar";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Services } from "@/components/home/Services";
import { Work } from "@/components/home/Work";
import { Process } from "@/components/home/Process";
import { Testimonials } from "@/components/home/Testimonials";
import { Contact } from "@/components/home/Contact";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      <Topbar />
      <Hero />
      <About />
      <Services />
      <Work />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
