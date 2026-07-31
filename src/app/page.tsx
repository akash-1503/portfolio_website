import { HeroSection } from "@/components/sections/hero";
import { DashboardSection } from "@/components/sections/dashboard";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { HackathonsSection } from "@/components/sections/hackathons";
import { ExcellenceSection } from "@/components/sections/excellence";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <DashboardSection />
      <ExperienceSection />
      <ProjectsSection />
      <HackathonsSection />
      <ExcellenceSection />
      <ContactSection />
    </main>
  );
}
