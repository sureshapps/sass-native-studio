import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function AdminProfile() {
  const { data: profile, isLoading } = useProfile();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    quote: "",
    avatar_url: "",
    address: "",
    city: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        quote: profile.quote || "",
        avatar_url: profile.avatar_url || "",
        address: profile.address || "",
        city: profile.city || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile?.id) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("profile")
      .update(formData)
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile saved!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
    setSaving(false);
  };

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-secondary border-0"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-secondary border-0"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Avatar URL</label>
          <Input
            value={formData.avatar_url}
            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
            className="bg-secondary border-0"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="bg-secondary border-0 min-h-[100px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Quote</label>
          <Input
            value={formData.quote}
            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
            className="bg-secondary border-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-secondary border-0"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">City</label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="bg-secondary border-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-secondary border-0"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-secondary border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
