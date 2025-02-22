"use client";

import { useAuthSession } from "@/lib/utils/auth-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const { session } = useAuthSession();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {session?.user.user_metadata.full_name || session?.user.email}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Email: {session?.user.email}</p>
            <p className="text-sm text-muted-foreground">
              Last Sign In: {new Date(session?.user.last_sign_in_at || "").toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" asChild>
              <Link href="/create">Create Event</Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/profile">Update Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
