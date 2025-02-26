"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { updateAttendeeId } from "@/actions/verification";

type Attendee = {
  id: string;
  full_name: string;
  college_name: string;
  department: string;
  email: string;
  phone_no: string;
  attendee_id: string | null;
  attendee_events: { events: { id: string; name: string } }[];
};

export default function AttendeeCard({ attendee }: { attendee: Attendee }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateAttendeeId, {
    error: null,
    success: false,
  });

  const [localAttendeeId] = useState(attendee.attendee_id);

  useEffect(() => {
    if (state.success) {
      toast.success("Attendee ID updated successfully!");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  useEffect(() => {
    if (attendee.attendee_id) {
      toast.success("Attendee verified. Redirecting to verification page...");
      const timer = setTimeout(() => {
        router.push("/verification");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [attendee.attendee_id, router]);

  if (!attendee) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>{attendee.full_name}</CardTitle>
          <CardDescription>{attendee.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>College:</strong> {attendee.college_name}
            </p>
            <p>
              <strong>Department:</strong> {attendee.department}
            </p>
            <p>
              <strong>Phone:</strong> {attendee.phone_no}
            </p>
            <p>
              <strong>Events:</strong> {attendee.attendee_events.map((e) => e.events.name).join(", ")}
            </p>

            {localAttendeeId ? (
              <p>
                <strong>Attendee ID:</strong> {localAttendeeId}
              </p>
            ) : (
              <motion.form
                action={formAction}
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Input name="attendee_id" placeholder="Enter 3-digit Attendee ID" pattern="[0-9]{3}" required maxLength={3} />
                <input type="hidden" name="id" value={attendee.id} />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Adding Attendee ID..." : "Set Attendee ID"}
                </Button>
              </motion.form>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
