import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTestimonials } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function AdminTestimonials() {
  const { data: testimonials, isLoading } = useTestimonials();
  const queryClient = useQueryClient();
  const [newTest, setNewTest] = useState({ 
    quote: "", 
    author_name: "", 
    author_role: "", 
    author_avatar: "" 
  });

  const handleAdd = async () => {
    if (!newTest.quote || !newTest.author_name) {
      toast.error("Quote and author name are required");
      return;
    }

    const { error } = await supabase.from("testimonials").insert({
      ...newTest,
      display_order: (testimonials?.length || 0) + 1,
    });

    if (error) {
      toast.error("Failed to add testimonial");
    } else {
      toast.success("Testimonial added!");
      setNewTest({ quote: "", author_name: "", author_role: "", author_avatar: "" });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted!");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Testimonials</h2>

      {/* Add New */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h3 className="font-medium text-foreground mb-4">Add Testimonial</h3>
        <div className="grid gap-4">
          <Textarea
            placeholder="Quote"
            value={newTest.quote}
            onChange={(e) => setNewTest({ ...newTest, quote: e.target.value })}
            className="bg-secondary border-0"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Author name"
              value={newTest.author_name}
              onChange={(e) => setNewTest({ ...newTest, author_name: e.target.value })}
              className="bg-secondary border-0"
            />
            <Input
              placeholder="Author role"
              value={newTest.author_role}
              onChange={(e) => setNewTest({ ...newTest, author_role: e.target.value })}
              className="bg-secondary border-0"
            />
          </div>
          <div className="flex gap-4">
            <Input
              placeholder="Author avatar URL"
              value={newTest.author_avatar}
              onChange={(e) => setNewTest({ ...newTest, author_avatar: e.target.value })}
              className="bg-secondary border-0 flex-1"
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
        {testimonials?.map((test) => (
          <div key={test.id} className="bg-card rounded-xl p-4 border border-border">
            <p className="text-muted-foreground italic text-sm mb-3">"{test.quote}"</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {test.author_avatar && (
                  <img src={test.author_avatar} alt={test.author_name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-medium text-foreground text-sm">{test.author_name}</p>
                  <p className="text-xs text-muted-foreground">{test.author_role}</p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(test.id)}
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
