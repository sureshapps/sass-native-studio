import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Briefcase, GraduationCap, Star, MessageSquare, 
  Mail, Settings, LogOut, Home, Link, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminSkills } from "@/components/admin/AdminSkills";
import { AdminExperience } from "@/components/admin/AdminExperience";
import { AdminEducation } from "@/components/admin/AdminEducation";
import { AdminTestimonials } from "@/components/admin/AdminTestimonials";
import { AdminSocials } from "@/components/admin/AdminSocials";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { cn } from "@/lib/utils";

type AdminSection = "profile" | "socials" | "projects" | "skills" | "experience" | "education" | "testimonials" | "messages";

const menuItems = [
  { id: "profile" as const, label: "Profile", icon: User },
  { id: "socials" as const, label: "Social Links", icon: Link },
  { id: "projects" as const, label: "Projects", icon: Layers },
  { id: "skills" as const, label: "Skills", icon: Star },
  { id: "experience" as const, label: "Experience", icon: Briefcase },
  { id: "education" as const, label: "Education", icon: GraduationCap },
  { id: "testimonials" as const, label: "Testimonials", icon: MessageSquare },
  { id: "messages" as const, label: "Messages", icon: Mail },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>("profile");
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
          {isAdmin && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
              Admin
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                activeSection === item.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border pt-4 space-y-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full justify-start"
          >
            <Home className="w-4 h-4 mr-2" />
            View Portfolio
          </Button>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl">
          {activeSection === "profile" && <AdminProfile />}
          {activeSection === "socials" && <AdminSocials />}
          {activeSection === "projects" && <AdminProjects />}
          {activeSection === "skills" && <AdminSkills />}
          {activeSection === "experience" && <AdminExperience />}
          {activeSection === "education" && <AdminEducation />}
          {activeSection === "testimonials" && <AdminTestimonials />}
          {activeSection === "messages" && <AdminMessages />}
        </div>
      </main>
    </div>
  );
}
