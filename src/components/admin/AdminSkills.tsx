import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useSkills } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function AdminSkills() {
  const { data: skills, isLoading } = useSkills();
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState({ name: "", icon_url: "", percentage: 50, color: "#00CED1" });

  const handleAdd = async () => {
    if (!newSkill.name) {
      toast.error("Skill name is required");
      return;
    }

    const { error } = await supabase.from("skills").insert({
      ...newSkill,
      display_order: (skills?.length || 0) + 1,
    });

    if (error) {
      toast.error("Failed to add skill");
    } else {
      toast.success("Skill added!");
      setNewSkill({ name: "", icon_url: "", percentage: 50, color: "#00CED1" });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted!");
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    }
  };

  const handleUpdate = async (id: string, updates: { name?: string; percentage?: number; icon_url?: string; color?: string }) => {
    const { error } = await supabase.from("skills").update(updates).eq("id", id);
    
    if (error) {
      toast.error("Failed to update");
    } else {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Skills</h2>

      {/* Add New */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-medium text-foreground mb-4">Add New Skill</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Input
              placeholder="Skill name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="bg-secondary border-0"
            />
            <Input
              placeholder="Icon URL"
              value={newSkill.icon_url}
              onChange={(e) => setNewSkill({ ...newSkill, icon_url: e.target.value })}
              className="bg-secondary border-0"
            />
            <Input
              type="color"
              value={newSkill.color}
              onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
              className="bg-secondary border-0 h-10"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-20">{newSkill.percentage}%</span>
            <Slider
              value={[newSkill.percentage]}
              onValueChange={([value]) => setNewSkill({ ...newSkill, percentage: value })}
              max={100}
              step={1}
              className="flex-1"
            />
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {skills?.map((skill) => (
          <div key={skill.id} className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-4">
              {skill.icon_url && (
                <img src={skill.icon_url} alt={skill.name} className="w-10 h-10 object-contain" />
              )}
              <Input
                value={skill.name}
                onChange={(e) => handleUpdate(skill.id, { name: e.target.value })}
                className="bg-secondary border-0 flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">{skill.percentage}%</span>
              <Slider
                value={[skill.percentage]}
                onValueChange={([value]) => handleUpdate(skill.id, { percentage: value })}
                max={100}
                step={1}
                className="w-32"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(skill.id)}
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
