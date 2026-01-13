import { cn } from "@/lib/utils";

interface ExperienceCardProps {
  logo: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  className?: string;
}

export function ExperienceCard({ logo, company, role, startDate, endDate, className }: ExperienceCardProps) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 bg-card rounded-xl min-w-[280px]",
      className
    )}>
      <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src={logo} alt={company} className="w-10 h-10 object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-sm">{company}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {startDate} - {endDate}
        </p>
      </div>
    </div>
  );
}
