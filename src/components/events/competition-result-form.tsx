"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateAttendeeWinningPosition } from "@/actions/events";
import { useAuthStore } from "@/store/use-auth-store";

const competitionResultSchema = z.object({
  winner_ids: z.array(z.string().length(3, "ID must be 3 digits")).min(0),
});

interface CompetitionResultFormProps {
  eventId: string;
  numWinners: number;
}

export const CompetitionResultForm = ({ eventId, numWinners }: CompetitionResultFormProps) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [winnerIds, setWinnerIds] = useState<string[]>(Array(numWinners).fill(""));

  const form = useForm({
    resolver: zodResolver(competitionResultSchema),
    defaultValues: {
      winner_ids: Array(numWinners).fill(""),
    },
  });

  useEffect(() => {
    setWinnerIds(Array(numWinners).fill(""));
    form.reset({ winner_ids: Array(numWinners).fill("") });
  }, [numWinners, form]);

  const onSubmit = async (data: z.infer<typeof competitionResultSchema>) => {
    startTransition(async () => {
      try {
        const result = await updateAttendeeWinningPosition({
          eventId: eventId,
          winnerPositions: data.winner_ids.map((id: string, index: number) => ({
            attendeeId: id,
            position: index + 1,
          })),
        });
        if (result?.serverError) {
          throw new Error(result.serverError);
        }
        toast.success("Competition results updated successfully!");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update competition results");
      }
    });
  };

  const handleWinnerIdChange = (index: number, value: string) => {
    const newWinnerIds = [...winnerIds];
    newWinnerIds[index] = value;
    setWinnerIds(newWinnerIds);
  };

  if (!user?.id) {
    return;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {Array.from({ length: numWinners }).map((_, index) => (
          <FormItem key={index}>
            <FormLabel>Winner #{index + 1} ID</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter 3-digit ID"
                value={winnerIds[index] || ""}
                disabled={isPending}
                {...form.register(`winner_ids.${index}`, {
                  onChange: (e) => {
                    handleWinnerIdChange(index, e.target.value);
                    form.setValue(`winner_ids.${index}`, e.target.value);
                  },
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        ))}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Results"}
        </Button>
      </form>
    </Form>
  );
};
