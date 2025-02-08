"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  subject: string;
  content: string;
  token: string;
  admin_response: string | null;
  is_read: boolean;
  created_at: string;
  responded_at: string | null;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  const fetchMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    setMessages(data || []);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking message as read:", error);
      return;
    }

    // Refresh data
    router.refresh();
    fetchMessages(); // Add this function to refetch data
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Messages</h1>

      <div className="grid gap-6">
        {messages.map((message) => (
          <Card key={message.id} className={message.is_read ? "" : "border-primary"}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{message.subject}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Token: {message.token}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(message.created_at).toLocaleDateString()}
                </p>
              </div>
              {!message.is_read && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => markAsRead(message.id)}
                >
                  Mark as Read
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-secondary/5 p-4 rounded-lg">
                  <p className="text-foreground">{message.content}</p>
                </div>

                {message.admin_response && (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Response:</p>
                    <p>{message.admin_response}</p>
                    {message.responded_at && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Responded on {new Date(message.responded_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground">No messages found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}