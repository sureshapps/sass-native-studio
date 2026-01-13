import { useState } from "react";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function AdminProjects() {
  const { data: projects, isLoading } = useProjects();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    client: "",
    image_url: "",
    description: "",
    tags: "",
  });

  const handleAdd = async () => {
    if (!formData.title || !formData.category) {
      toast.error("Title and category are required");
      return;
    }

    const { error } = await supabase.from("projects").insert({
      title: formData.title,
      category: formData.category,
      client: formData.client,
      image_url: formData.image_url,
      description: formData.description,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      display_order: (projects?.length || 0) + 1,
    });

    if (error) {
      toast.error("Failed to add project");
    } else {
      toast.success("Project added!");
      setFormData({ title: "", category: "", client: "", image_url: "", description: "", tags: "" });
      setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from("projects")
      .update({
        title: formData.title,
        category: formData.category,
        client: formData.client,
        image_url: formData.image_url,
        description: formData.description,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      })
      .eq("id", id);
    
    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success("Updated!");
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  };

  const startEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || "",
      category: project.category || "",
      client: project.client || "",
      image_url: project.image_url || "",
      description: project.description || "",
      tags: (project.tags || []).join(", "),
    });
  };

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Projects</h2>
        <Button onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-card rounded-xl p-4 border border-primary/50">
          <h3 className="font-medium text-foreground mb-4">New Project</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-secondary border-0"
              />
              <Input
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-secondary border-0"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="bg-secondary border-0"
              />
              <Input
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-secondary border-0"
              />
            </div>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-secondary border-0"
            />
            <Input
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="bg-secondary border-0"
            />
            <div className="flex gap-2">
              <Button onClick={handleAdd}>Save</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {projects?.map((project) => (
          <div key={project.id} className="bg-card rounded-xl p-4 border border-border">
            {editingId === project.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-secondary border-0"
                  />
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-secondary border-0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="bg-secondary border-0"
                  />
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="bg-secondary border-0"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdate(project.id)}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {project.image_url && (
                  <img src={project.image_url} alt={project.title} className="w-16 h-16 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.category} • {project.client}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(project)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
