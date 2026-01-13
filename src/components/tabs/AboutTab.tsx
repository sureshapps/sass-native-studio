import { useState } from "react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { SkillBar } from "@/components/ui/SkillBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import profileAvatar from "@/assets/profile-avatar.jpg";

const experiences = [
  { 
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    company: "Google Inc.",
    role: "Head of Marketing",
    startDate: "September 12, 2021",
    endDate: "January 24, 2019"
  },
  { 
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    company: "Apple Inc.",
    role: "Senior Designer",
    startDate: "March 2018",
    endDate: "August 2021"
  },
];

const education = [
  { 
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Seal_of_the_California_Institute_of_Technology.svg",
    company: "California Institute of Technology",
    role: "Bachelor's in Design",
    startDate: "September 2015",
    endDate: "June 2019"
  },
  { 
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg",
    company: "MIT",
    role: "Master's in Visual Arts",
    startDate: "September 2019",
    endDate: "June 2021"
  },
];

const skills = [
  { icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg", name: "Adobe Photoshop", percentage: 92, color: "bg-[#31A8FF]" },
  { icon: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg", name: "Adobe Illustrator", percentage: 88, color: "bg-[#FF9A00]" },
  { icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg", name: "After Effects", percentage: 78, color: "bg-[#9999FF]" },
];

export function AboutTab() {
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
      <section className="text-center">
        <div className="flex justify-center mb-4">
          <ProfileAvatar src={profileAvatar} alt="John Doe" size="lg" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">John Doe</h1>
        <p className="text-muted-foreground mt-1">Graphist and Video<br />Producer Freelance</p>
      </section>

      {/* Quote */}
      <section className="text-center px-4">
        <p className="text-muted-foreground italic">
          "If you cannot do great things, do small things in a great way."
        </p>
      </section>

      {/* About Me */}
      <section>
        <SectionTitle className="mb-3">More about me</SectionTitle>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </p>
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

      {/* Experiences */}
      <section>
        <SectionTitle className="mb-4">Experiences</SectionTitle>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
          {experiences.map((exp, idx) => (
            <ExperienceCard key={idx} {...exp} />
          ))}
        </div>
      </section>

      {/* Formation */}
      <section>
        <SectionTitle className="mb-4">Formation</SectionTitle>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
          {education.map((edu, idx) => (
            <ExperienceCard key={idx} {...edu} />
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
