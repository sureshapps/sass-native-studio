import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProjectCard } from "@/components/ui/ProjectCard";

import projectWatch from "@/assets/project-watch.jpg";
import projectFanta from "@/assets/project-fanta.jpg";
import projectCar from "@/assets/project-car.jpg";
import projectShoes from "@/assets/project-shoes.jpg";

interface WorksTabProps {
  onViewProject: (projectId: string) => void;
}

const projects = [
  { id: "1", image: projectWatch, title: "Cartier - Graphic Design", category: "Product Design", date: "Jan 12, 2024", client: "Cartier", tags: ["Website", "Socials"] },
  { id: "2", image: projectFanta, title: "Fanta - Video Production", category: "Advertising", date: "Dec 27, 2023", client: "The Coca-Cola Company", tags: ["Video", "Socials"] },
  { id: "3", image: projectCar, title: "BMW - Brand Campaign", category: "Automotive", date: "Nov 15, 2023", client: "BMW Group", tags: ["Branding", "Print"] },
  { id: "4", image: projectShoes, title: "Nike - Product Shot", category: "Fashion", date: "Oct 8, 2023", client: "Nike Inc.", tags: ["Product", "E-commerce"] },
];

const testimonials = [
  { 
    quote: "Work with Build'up was a wonderful experience, they helped us on graphics and saved us so much time!", 
    name: "Cartohn Doe", 
    role: "Head of Marketing",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  },
  { 
    quote: "Exceptional creativity and professionalism. The final deliverables exceeded our expectations.", 
    name: "Sarah Miller", 
    role: "Brand Director",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
  },
];

export function WorksTab({ onViewProject }: WorksTabProps) {
  return (
    <div className="animate-fade-in space-y-8">
      <SectionTitle>My works</SectionTitle>
      
      {/* Projects Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id}
            image={project.image}
            title={project.title}
            category={project.category}
            date={project.date}
            onClick={() => onViewProject(project.id)}
          />
        ))}
      </div>

      {/* Client Info */}
      <section className="bg-card rounded-2xl p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
            <span className="text-2xl font-serif text-foreground">C</span>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Client: <span className="text-foreground">Cartier</span></p>
            <p className="text-muted-foreground text-sm">Project: <span className="text-foreground">Graphic Design</span></p>
            <div className="flex gap-2 mt-2">
              <span className="px-3 py-1 bg-secondary rounded-full text-xs text-foreground">Website</span>
              <span className="px-3 py-1 bg-secondary rounded-full text-xs text-foreground">Socials</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <SectionTitle className="mb-4">What they think about us</SectionTitle>
        <div className="space-y-4">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-card rounded-2xl p-5">
              <p className="text-muted-foreground italic text-sm mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-foreground font-medium text-sm">Name: {testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">Job: {testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Details */}
      <section>
        <SectionTitle className="mb-4">Cartier - Graphic design</SectionTitle>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
          <img src={projectWatch} alt="Project 1" className="w-32 h-32 rounded-xl object-cover" />
          <img src={projectFanta} alt="Project 2" className="w-32 h-32 rounded-xl object-cover" />
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mt-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.
        </p>
        
        <h3 className="text-foreground font-semibold mt-6 mb-2">More about this project</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </p>
        
        <h3 className="text-foreground font-semibold mt-6 mb-2">It was important for us</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </p>
      </section>
    </div>
  );
}
