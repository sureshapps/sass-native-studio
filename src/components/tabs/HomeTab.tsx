import { useState } from "react";
import { Instagram, Linkedin, Globe } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { SocialButton } from "@/components/ui/SocialButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SkillBar } from "@/components/ui/SkillBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import profileAvatar from "@/assets/profile-avatar.jpg";
import projectWatch from "@/assets/project-watch.jpg";
import projectFanta from "@/assets/project-fanta.jpg";
import projectCar from "@/assets/project-car.jpg";
import projectShoes from "@/assets/project-shoes.jpg";

interface HomeTabProps {
  onViewProject: (projectId: string) => void;
}

const projects = [
  { id: "1", image: projectWatch, title: "Cartier - Graphic Design", category: "Product Design", date: "Jan 12, 2024" },
  { id: "2", image: projectFanta, title: "Fanta - Video Production", category: "Advertising", date: "Dec 27, 2023" },
  { id: "3", image: projectCar, title: "BMW - Brand Campaign", category: "Automotive", date: "Nov 15, 2023" },
  { id: "4", image: projectShoes, title: "Nike - Product Shot", category: "Fashion", date: "Oct 8, 2023" },
];

const skills = [
  { icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg", name: "Adobe Photoshop", percentage: 92, color: "bg-[#31A8FF]" },
  { icon: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg", name: "Adobe Illustrator", percentage: 88, color: "bg-[#FF9A00]" },
  { icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg", name: "Adobe Premiere", percentage: 85, color: "bg-[#9999FF]" },
  { icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg", name: "After Effects", percentage: 78, color: "bg-[#9999FF]" },
];

export function HomeTab({ onViewProject }: HomeTabProps) {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Profile Hero */}
      <section className="flex items-center gap-5">
        <ProfileAvatar src={profileAvatar} alt="John Doe" size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hello, I'm John Doe</h1>
          <p className="text-muted-foreground mt-1">Graphist and Video<br />Producer Freelance</p>
        </div>
      </section>

      {/* Social Links */}
      <section>
        <SectionTitle className="mb-4">Learn more about me</SectionTitle>
        <div className="flex justify-around">
          <SocialButton icon={Instagram} label="Instagram" href="#" />
          <SocialButton icon={Linkedin} label="LinkedIn" href="#" />
          <SocialButton icon={Globe} label="Behance" href="#" />
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-card rounded-2xl p-5">
        <SectionTitle className="mb-4">Subscribe to my newsletter!</SectionTitle>
        <div className="flex gap-3">
          <Input 
            type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-secondary border-0"
          />
          <Button onClick={handleSubscribe} className="px-6">
            Subscribe
          </Button>
        </div>
      </section>

      {/* Projects */}
      <section>
        <SectionTitle className="mb-4">Discover my last projects</SectionTitle>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id}
              {...project}
              onClick={() => onViewProject(project.id)}
            />
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <SectionTitle className="mb-4">My skills</SectionTitle>
        <div className="space-y-3">
          {skills.map((skill) => (
            <SkillBar key={skill.name} {...skill} />
          ))}
        </div>
      </section>
    </div>
  );
}
