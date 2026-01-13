import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-28 h-28",
  xl: "w-36 h-36",
};

export function ProfileAvatar({ src, alt, size = "md", className }: ProfileAvatarProps) {
  return (
    <div 
      className={cn(
        "rounded-full overflow-hidden ring-4 ring-primary/30 shadow-lg",
        sizeClasses[size],
        className
      )}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
    </div>
  );
}
