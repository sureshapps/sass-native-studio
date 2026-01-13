import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSubmissions, useNewsletterSubscribers } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export function AdminMessages() {
  const { data: messages, isLoading: loadingMessages } = useContactSubmissions();
  const { data: subscribers, isLoading: loadingSubs } = useNewsletterSubscribers();
  const queryClient = useQueryClient();

  const handleMarkRead = async (id: string, isRead: boolean) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: !isRead })
      .eq("id", id);
    
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["contact_submissions"] });
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted!");
      queryClient.invalidateQueries({ queryKey: ["contact_submissions"] });
    }
  };

  if (loadingMessages || loadingSubs) {
    return <div className="animate-pulse text-muted-foreground">Loading...</div>;
  }

  const unreadCount = messages?.filter(m => !m.is_read).length || 0;

  return (
    <div className="space-y-8">
      {/* Contact Messages */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-foreground">Contact Messages</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="space-y-3">
          {messages?.length === 0 ? (
            <p className="text-muted-foreground text-sm">No messages yet</p>
          ) : (
            messages?.map((msg) => (
              <div 
                key={msg.id} 
                className={`bg-card rounded-xl p-4 border ${msg.is_read ? 'border-border' : 'border-primary/50'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground">{msg.name}</h3>
                    <p className="text-sm text-muted-foreground">{msg.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(msg.created_at), "MMM d, yyyy")}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkRead(msg.id, msg.is_read)}
                    >
                      {msg.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteMessage(msg.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground/80">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Newsletter Subscribers */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Newsletter Subscribers ({subscribers?.length || 0})
        </h2>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {subscribers?.length === 0 ? (
            <p className="text-muted-foreground text-sm p-4">No subscribers yet</p>
          ) : (
            <div className="divide-y divide-border">
              {subscribers?.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3">
                  <span className="text-sm text-foreground">{sub.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(sub.subscribed_at), "MMM d, yyyy")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
