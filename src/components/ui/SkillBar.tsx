import { cn } from "@/lib/utils";

interface SkillBarProps {
  icon: string;
  name: string;
  percentage: number;
  color?: string;
  className?: string;
}

export function SkillBar({ icon, name, percentage, color = "bg-primary", className }: SkillBarProps) {
  return (
    <div className={cn("flex items-center gap-4 p-4 bg-card rounded-xl", className)}>
      <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src={icon} alt={name} className="w-10 h-10 object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-foreground text-sm">{name}</h4>
          <span className="text-xs text-muted-foreground">{percentage}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
