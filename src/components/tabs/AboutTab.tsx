import { useState } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { SkillBar } from "@/components/ui/SkillBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProfile, useExperiences, useEducation, useSkills } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";

import profileAvatar from "@/assets/profile-avatar.jpg";

export function AboutTab() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const { data: profile } = useProfile();
  const { data: experiences } = useExperiences();
  const { data: education } = useEducation();
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
      {/* Profile Hero */}
      <section className="text-center">
        <div className="flex justify-center mb-4">
          <ProfileAvatar 
            src={profile?.avatar_url || profileAvatar} 
            alt={profile?.name || "Profile"} 
            size="lg" 
          />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{profile?.name || "John Doe"}</h1>
        <p className="text-muted-foreground mt-1">
          {profile?.title || "Graphist and Video Producer Freelance"}
        </p>
      </section>

      {/* Quote */}
      {profile?.quote && (
        <section className="text-center px-4">
          <p className="text-muted-foreground italic">{profile.quote}</p>
        </section>
      )}

      {/* About Me */}
      {profile?.bio && (
        <section>
          <SectionTitle className="mb-3">More about me</SectionTitle>
          <p className="text-muted-foreground text-sm leading-relaxed">{profile.bio}</p>
        </section>
      )}

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

      {/* Experiences */}
      {experiences && experiences.length > 0 && (
        <section>
          <SectionTitle className="mb-4">Experiences</SectionTitle>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            {experiences.map((exp) => (
              <ExperienceCard 
                key={exp.id}
                logo={exp.logo_url || ""}
                company={exp.company}
                role={exp.role}
                startDate={exp.start_date}
                endDate={exp.end_date || "Present"}
              />
            ))}
          </div>
        </section>
      )}

      {/* Formation */}
      {education && education.length > 0 && (
        <section>
          <SectionTitle className="mb-4">Formation</SectionTitle>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            {education.map((edu) => (
              <ExperienceCard 
                key={edu.id}
                logo={edu.logo_url || ""}
                company={edu.institution}
                role={edu.degree}
                startDate={edu.start_date}
                endDate={edu.end_date || "Present"}
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
