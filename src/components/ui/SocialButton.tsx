import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SocialButtonProps {
  icon: LucideIcon;
  label: string;
  href: string;
  className?: string;
}

export function SocialButton({ icon: Icon, label, href, className }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex flex-col items-center gap-2 group",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center transition-all duration-200 group-hover:border-primary group-hover:shadow-lg group-hover:scale-105">
        <Icon className="w-6 h-6 text-foreground" />
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </a>
  );
}
