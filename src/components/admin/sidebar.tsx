"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignOut } from "@/lib/utils/auth-utils";

export const Sidebar = () => {
  const signOut = useSignOut();

  return (
    <Card className="w-64 h-screen flex-none border-r">
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <Button variant="ghost" className="justify-start" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
          <Link href="/create">Create Events</Link>
        </Button>
        <Button variant="ghost" className="justify-start" asChild>
          <Link href="/profile">Profile</Link>
        </Button>
        <Button variant="ghost" className="justify-start" onClick={signOut}>
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};
