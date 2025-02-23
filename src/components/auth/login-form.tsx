"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, { error: "" });

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-red-600">Login</CardTitle>
          <CardDescription className="text-center text-foreground/80">
            Enter your credentials to proceed. Failure is not an option.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                autoComplete="off"
                className="focus:ring-red-600 focus:border-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                autoComplete="off"
                className="focus:ring-red-600 focus:border-red-600"
              />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isPending}>
              {isPending ? "Entering the Game..." : "Enter the Game"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
