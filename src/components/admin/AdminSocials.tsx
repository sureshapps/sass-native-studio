import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocialLinks } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function AdminSocials() {
  const { data: socials, isLoading } = useSocialLinks();
  const queryClient = useQueryClient();
  const [newSocial, setNewSocial] = useState({ platform: "", url: "", icon: "globe" });

  const handleAdd = async () => {
    if (!newSocial.platform || !newSocial.url) {
      toast.error("Please fill in all fields");
      return;
    }

    const { error } = await supabase.from("social_links").insert({
      platform: newSocial.platform,
      url: newSocial.url,
      icon: newSocial.icon,
      display_order: (socials?.length || 0) + 1,
    });

    if (error) {
      toast.error("Failed to add social link");
    } else {
      toast.success("Social link added!");
      setNewSocial({ platform: "", url: "", icon: "globe" });
      queryClient.invalidateQueries({ queryKey: ["social_links"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted!");
      queryClient.invalidateQueries({ queryKey: ["social_links"] });
    }
  };

  const handleUpdate = async (id: string, updates: { platform?: string; url?: string; icon?: string }) => {
    const { error } = await supabase.from("social_links").update(updates).eq("id", id);
    
    if (error) {
      toast.error("Failed to update");
    } else {
      queryClient.invalidateQueries({ queryKey: ["social_links"] });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Social Links</h2>

      {/* Add New */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-medium text-foreground mb-4">Add New Social Link</h3>
        <div className="grid grid-cols-4 gap-3">
          <Input
            placeholder="Platform (e.g. Instagram)"
            value={newSocial.platform}
            onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
            className="bg-secondary border-0"
          />
          <Input
            placeholder="URL"
            value={newSocial.url}
            onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
            className="bg-secondary border-0"
          />
          <Input
            placeholder="Icon (instagram, linkedin, globe)"
            value={newSocial.icon}
            onChange={(e) => setNewSocial({ ...newSocial, icon: e.target.value })}
            className="bg-secondary border-0"
          />
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {socials?.map((social) => (
          <div key={social.id} className="bg-card rounded-xl p-4 border border-border">
            <div className="grid grid-cols-4 gap-3 items-center">
              <Input
                value={social.platform}
                onChange={(e) => handleUpdate(social.id, { platform: e.target.value })}
                className="bg-secondary border-0"
              />
              <Input
                value={social.url}
                onChange={(e) => handleUpdate(social.id, { url: e.target.value })}
                className="bg-secondary border-0"
              />
              <Input
                value={social.icon}
                onChange={(e) => handleUpdate(social.id, { icon: e.target.value })}
                className="bg-secondary border-0"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(social.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
