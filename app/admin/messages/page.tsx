"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  subject: string;
  content: string;
  token: string;
  admin_response: string | null;
  created_at: string;
  responded_at: string | null;
  user: {
    email: string;
    username: string;
  };
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          user:users(email, username)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();
  }, []);

  const handleResponse = async (messageId: string) => {
    const response = responses[messageId];
    if (!response) return;

    const { error } = await supabase
      .from("messages")
      .update({ 
        admin_response: response,
        responded_at: new Date().toISOString()
      })
      .eq("id", messageId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Response sent successfully.",
    });

    setMessages(messages.map(msg => 
      msg.id === messageId ? { 
        ...msg, 
        admin_response: response,
        responded_at: new Date().toISOString()
      } : msg
    ));
    setResponses({ ...responses, [messageId]: "" });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">User Messages</h1>

      <div className="grid gap-6">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{message.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    From: {message.user.username} ({message.user.email})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Token: {message.token}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(message.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-secondary/5 p-4 rounded-lg">
                  <p className="text-foreground">{message.content}</p>
                </div>

                {message.admin_response ? (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Your Response:</p>
                    <p>{message.admin_response}</p>
                    {message.responded_at && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Responded on {new Date(message.responded_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your response..."
                      value={responses[message.id] || ""}
                      onChange={(e) => setResponses({
                        ...responses,
                        [message.id]: e.target.value
                      })}
                    />
                    <Button 
                      onClick={() => handleResponse(message.id)}
                      disabled={!responses[message.id]}
                    >
                      Send Response
                    </Button>
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