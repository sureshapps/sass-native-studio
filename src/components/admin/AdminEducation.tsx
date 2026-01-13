import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEducation } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function AdminEducation() {
  const { data: education, isLoading } = useEducation();
  const queryClient = useQueryClient();
  const [newEdu, setNewEdu] = useState({ institution: "", degree: "", logo_url: "", start_date: "", end_date: "" });

  const handleAdd = async () => {
    if (!newEdu.institution || !newEdu.degree || !newEdu.start_date) {
      toast.error("Institution, degree and start date are required");
      return;
    }

    const { error } = await supabase.from("education").insert({
      ...newEdu,
      display_order: (education?.length || 0) + 1,
    });

    if (error) {
      toast.error("Failed to add education");
    } else {
      toast.success("Education added!");
      setNewEdu({ institution: "", degree: "", logo_url: "", start_date: "", end_date: "" });
      queryClient.invalidateQueries({ queryKey: ["education"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("education").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted!");
      queryClient.invalidateQueries({ queryKey: ["education"] });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Education</h2>

      {/* Add New */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-medium text-foreground mb-4">Add Education</h3>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Institution"
              value={newEdu.institution}
              onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
              className="bg-secondary border-0"
            />
            <Input
              placeholder="Degree"
              value={newEdu.degree}
              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              className="bg-secondary border-0"
            />
          </div>
          <Input
            placeholder="Logo URL"
            value={newEdu.logo_url}
            onChange={(e) => setNewEdu({ ...newEdu, logo_url: e.target.value })}
            className="bg-secondary border-0"
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Start date"
              value={newEdu.start_date}
              onChange={(e) => setNewEdu({ ...newEdu, start_date: e.target.value })}
              className="bg-secondary border-0"
            />
            <Input
              placeholder="End date"
              value={newEdu.end_date}
              onChange={(e) => setNewEdu({ ...newEdu, end_date: e.target.value })}
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
        {education?.map((edu) => (
          <div key={edu.id} className="bg-card rounded-xl p-4 border border-border flex items-center gap-4">
            {edu.logo_url && (
              <img src={edu.logo_url} alt={edu.institution} className="w-12 h-12 rounded-lg object-contain bg-secondary p-2" />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{edu.institution}</h3>
              <p className="text-sm text-muted-foreground">{edu.degree}</p>
              <p className="text-xs text-muted-foreground/70">{edu.start_date} - {edu.end_date}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(edu.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
