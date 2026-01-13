import { useState } from "react";
import { Instagram, Linkedin, Globe, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { SocialButton } from "@/components/ui/SocialButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SkillBar } from "@/components/ui/SkillBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProfile, useSocialLinks, useProjects, useSkills } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";

import profileAvatar from "@/assets/profile-avatar.jpg";

interface HomeTabProps {
  onViewProject: (projectId: string) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case "instagram": return Instagram;
    case "linkedin": return Linkedin;
    default: return Globe;
  }
};

export function HomeTab({ onViewProject }: HomeTabProps) {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const navigate = useNavigate();
  
  const { data: profile } = useProfile();
  const { data: socials } = useSocialLinks();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();

  const handleSubscribe = async () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    
    setSubscribing(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });
    
    if (error) {
      if (error.code === "23505") {
        toast.error("You're already subscribed!");
      } else {
        toast.error("Failed to subscribe");
      }
    } else {
      toast.success("Subscribed successfully!");
      setEmail("");
    }
    setSubscribing(false);
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Admin Link */}
      <div className="flex justify-end">
        <button 
          onClick={() => navigate("/auth")}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      {/* Profile Hero */}
      <section className="flex items-center gap-5">
        <ProfileAvatar 
          src={profile?.avatar_url || profileAvatar} 
          alt={profile?.name || "Profile"} 
          size="lg" 
        />
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hello, I'm {profile?.name || "John Doe"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {profile?.title || "Graphist and Video Producer Freelance"}
          </p>
        </div>
      </section>

      {/* Social Links */}
      <section>
        <SectionTitle className="mb-4">Learn more about me</SectionTitle>
        <div className="flex justify-around">
          {socials?.map((social) => (
            <SocialButton 
              key={social.id}
              icon={getIcon(social.icon)} 
              label={social.platform} 
              href={social.url} 
            />
          ))}
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
          <Button onClick={handleSubscribe} disabled={subscribing} className="px-6">
            {subscribing ? "..." : "Subscribe"}
          </Button>
        </div>
      </section>

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section>
          <SectionTitle className="mb-4">Discover my last projects</SectionTitle>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id}
                image={project.image_url || "https://via.placeholder.com/200"}
                title={project.title}
                category={project.category}
                date={project.project_date ? new Date(project.project_date).toLocaleDateString() : ""}
                onClick={() => onViewProject(project.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <SectionTitle className="mb-4">My skills</SectionTitle>
          <div className="space-y-3">
            {skills.map((skill) => (
              <SkillBar 
                key={skill.id} 
                icon={skill.icon_url || ""}
                name={skill.name}
                percentage={skill.percentage}
                color={`bg-[${skill.color}]`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
