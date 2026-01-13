import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useProjects, useTestimonials } from "@/hooks/usePortfolioData";

interface WorksTabProps {
  onViewProject: (projectId: string) => void;
}

export function WorksTab({ onViewProject }: WorksTabProps) {
  const { data: projects } = useProjects();
  const { data: testimonials } = useTestimonials();

  return (
    <div className="animate-fade-in space-y-8">
      <SectionTitle>My works</SectionTitle>
      
      {/* Projects Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
        {projects?.map((project) => (
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

      {/* Client Info - First Project */}
      {projects && projects.length > 0 && (
        <section className="bg-card rounded-2xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
              {projects[0].image_url ? (
                <img src={projects[0].image_url} alt={projects[0].title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-serif text-foreground">
                  {projects[0].client?.[0] || "P"}
                </span>
              )}
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Client: <span className="text-foreground">{projects[0].client || "N/A"}</span>
              </p>
              <p className="text-muted-foreground text-sm">
                Project: <span className="text-foreground">{projects[0].category}</span>
              </p>
              {projects[0].tags && projects[0].tags.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {projects[0].tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-secondary rounded-full text-xs text-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section>
          <SectionTitle className="mb-4">What they think about us</SectionTitle>
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-card rounded-2xl p-5">
                <p className="text-muted-foreground italic text-sm mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  {testimonial.author_avatar && (
                    <img 
                      src={testimonial.author_avatar} 
                      alt={testimonial.author_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-foreground font-medium text-sm">
                      Name: {testimonial.author_name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Job: {testimonial.author_role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Project Details */}
      {projects && projects.length > 0 && projects[0].description && (
        <section>
          <SectionTitle className="mb-4">{projects[0].title}</SectionTitle>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            {projects.slice(0, 2).map((project) => (
              <img 
                key={project.id}
                src={project.image_url || "https://via.placeholder.com/128"} 
                alt={project.title} 
                className="w-32 h-32 rounded-xl object-cover" 
              />
            ))}
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mt-4">
            {projects[0].description}
          </p>
          
          {projects[0].detailed_description && (
            <>
              <h3 className="text-foreground font-semibold mt-6 mb-2">More about this project</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {projects[0].detailed_description}
              </p>
            </>
          )}
          
          {projects[0].importance_note && (
            <>
              <h3 className="text-foreground font-semibold mt-6 mb-2">It was important for us</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {projects[0].importance_note}
              </p>
            </>
          )}
        </section>
      )}
    </div>
  );
}
