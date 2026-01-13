import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExperiences } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function AdminExperience() {
  const { data: experiences, isLoading } = useExperiences();
  const queryClient = useQueryClient();
  const [newExp, setNewExp] = useState({ company: "", role: "", logo_url: "", start_date: "", end_date: "" });

  const handleAdd = async () => {
    if (!newExp.company || !newExp.role || !newExp.start_date) {
      toast.error("Company, role and start date are required");
      return;
    }

    const { error } = await supabase.from("experiences").insert({
      ...newExp,
      display_order: (experiences?.length || 0) + 1,
    });

    if (error) {
      toast.error("Failed to add experience");
    } else {
      toast.success("Experience added!");
      setNewExp({ company: "", role: "", logo_url: "", start_date: "", end_date: "" });
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted!");
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Experience</h2>

      {/* Add New */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-medium text-foreground mb-4">Add Experience</h3>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Company"
              value={newExp.company}
              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              className="bg-secondary border-0"
            />
            <Input
              placeholder="Role"
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              className="bg-secondary border-0"
            />
          </div>
          <Input
            placeholder="Logo URL"
            value={newExp.logo_url}
            onChange={(e) => setNewExp({ ...newExp, logo_url: e.target.value })}
            className="bg-secondary border-0"
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Start date"
              value={newExp.start_date}
              onChange={(e) => setNewExp({ ...newExp, start_date: e.target.value })}
              className="bg-secondary border-0"
            />
            <Input
              placeholder="End date (or Present)"
              value={newExp.end_date}
              onChange={(e) => setNewExp({ ...newExp, end_date: e.target.value })}
              className="bg-secondary border-0"
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
        {experiences?.map((exp) => (
          <div key={exp.id} className="bg-card rounded-xl p-4 border border-border flex items-center gap-4">
            {exp.logo_url && (
              <img src={exp.logo_url} alt={exp.company} className="w-12 h-12 rounded-lg object-contain bg-secondary p-2" />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{exp.company}</h3>
              <p className="text-sm text-muted-foreground">{exp.role}</p>
              <p className="text-xs text-muted-foreground/70">{exp.start_date} - {exp.end_date || "Present"}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(exp.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
