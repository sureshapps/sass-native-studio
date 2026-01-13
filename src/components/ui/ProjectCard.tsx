import { cn } from "@/lib/utils";

interface ProjectCardProps {
  image: string;
  title: string;
  category: string;
  date: string;
  onClick?: () => void;
  className?: string;
}

export function ProjectCard({ image, title, category, date, onClick, className }: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] text-left",
        "min-w-[200px] w-[200px]",
        className
      )}
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{category}</p>
        <p className="text-xs text-muted-foreground/70 mt-0.5">{date}</p>
      </div>
    </button>
  );
}
