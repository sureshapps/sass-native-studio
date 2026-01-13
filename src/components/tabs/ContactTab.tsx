import { useState } from "react";
import { Phone, Mail, Info, AtSign } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProfile } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";

import profileAvatar from "@/assets/profile-avatar.jpg";

type TabType = "information" | "form";

export function ContactTab() {
  const [activeTab, setActiveTab] = useState<TabType>("information");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  
  const { data: profile } = useProfile();

  const contactMethods = [
    { icon: Phone, label: "Call", action: `tel:${profile?.phone || "+1234567890"}` },
    { icon: Mail, label: "Email", action: `mailto:${profile?.email || "john@example.com"}` },
    { icon: Info, label: "Info", action: "#" },
    { icon: AtSign, label: "Social", action: "#" },
  ];

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    
    setSubmitting(true);
    const { error } = await supabase
      .from("contact_submissions")
      .insert(formData);
    
    if (error) {
      toast.error("Failed to send message");
    } else {
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    }
    setSubmitting(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-secondary rounded-full p-1 flex">
          <button
            onClick={() => setActiveTab("information")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeTab === "information" 
                ? "bg-foreground text-background" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeTab === "form" 
                ? "bg-foreground text-background" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Form
          </button>
        </div>
      </div>

      {activeTab === "information" ? (
        <div className="space-y-8 animate-fade-in">
          {/* Profile */}
          <section className="text-center">
            <div className="flex justify-center mb-4">
              <ProfileAvatar 
                src={profile?.avatar_url || profileAvatar} 
                alt={profile?.name || "Profile"} 
                size="xl" 
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{profile?.name || "John Doe"}</h1>
            <p className="text-muted-foreground mt-2">
              {profile?.address || "115 Arbor Ln Marlton"}<br />
              {profile?.city || "New Jersey(NJ), 08053"}
            </p>
          </section>

          {/* Contact Methods */}
          <section className="flex justify-center gap-4">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.action}
                className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
              >
                <method.icon className="w-5 h-5 text-muted-foreground" />
              </a>
            ))}
          </section>

          <p className="text-center text-muted-foreground text-sm italic">
            "Select an icon to see more information"
          </p>

          {/* Quick Actions */}
          <section className="flex gap-4 justify-center">
            <Button variant="outline" className="rounded-full px-8">
              Projects
            </Button>
            <Button variant="outline" className="rounded-full px-8">
              About
            </Button>
          </section>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div>
            <SectionTitle className="mb-3">Name</SectionTitle>
            <Input 
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <SectionTitle className="mb-3">E-mail</SectionTitle>
            <Input 
              type="email"
              placeholder="Your e-mail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <SectionTitle className="mb-3">Message</SectionTitle>
            <Textarea 
              placeholder="Your message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-secondary border-border min-h-[120px]"
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="w-full rounded-full py-6 text-base"
          >
            <Mail className="w-5 h-5 mr-2" />
            {submitting ? "Sending..." : "Send message!"}
          </Button>
        </div>
      )}
    </div>
  );
}
