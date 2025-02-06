"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  email: string;
  username: string;
  created_at: string;
  applications_count: number;
  messages_count: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select(`
          *,
          applications:applications(count),
          messages:messages(count)
        `);

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      const processedUsers = data.map(user => ({
        ...user,
        applications_count: user.applications?.length || 0,
        messages_count: user.messages?.length || 0
      }));

      setUsers(processedUsers);
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Users</h1>

      <div className="grid gap-6">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.username}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Email: {user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
                <div className="flex space-x-4">
                  <p className="text-sm">
                    Applications: <span className="font-bold">{user.applications_count}</span>
                  </p>
                  <p className="text-sm">
                    Messages: <span className="font-bold">{user.messages_count}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}