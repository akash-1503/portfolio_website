import { HeroSection } from "@/components/sections/hero";
import { DashboardSection } from "@/components/sections/dashboard";
import { AboutSection } from "@/components/sections/about";
import { ProjectsSection } from "@/components/sections/projects";
import { ArchitectureLab } from "@/components/sections/architecture-lab";
import { DatabaseExplorer } from "@/components/sections/database-explorer";
import { ApiExplorer } from "@/components/sections/api-explorer";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <DashboardSection />
      <ProjectsSection />
      <ArchitectureLab />
      <DatabaseExplorer />
      <ApiExplorer />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
