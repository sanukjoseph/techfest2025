"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { attendeeSchema, AttendeeFormData } from "@/lib/validations/attendee";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { registerAttendees } from "@/actions/register";

interface AttendeeFormProps {
  eventId: string;
  price: number;
  maxGroupSize: number;
  eventType: string;
  name: string;
  description: string;
  minGroupSize: number;
}

const AttendeeForm = ({ eventId, price, maxGroupSize, eventType, description, name, minGroupSize }: AttendeeFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const form = useForm<AttendeeFormData>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: {
      full_name: "",
      college_name: "",
      department: "",
      email: "",
      phone_no: "",
      payment_id: null,
      event_id: eventId,
      group_members: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "group_members",
  });

  useEffect(() => {
    if (eventType === "group" && fields.length === 0) {
      for (let i = 0; i < minGroupSize - 1; i++) {
        append({
          full_name: "",
          college_name: "",
          department: "",
          email: "",
          phone_no: "",
        });
      }
    }
  }, [eventType, maxGroupSize, append, fields.length, minGroupSize]);

  const handleFormSubmit = async (data: AttendeeFormData) => {
    setRegistrationError(null);
    setPaymentError(null);

    startTransition(async () => {
      const attendeesData =
        eventType === "group"
          ? [
              { ...data, payment_id: null, event_id: eventId },
              ...(data.group_members
                ? data.group_members.map((member) => ({
                    ...member,
                    payment_id: null,
                    event_id: eventId,
                  }))
                : []),
            ]
          : [{ ...data, payment_id: null, event_id: eventId }];

      const result = await registerAttendees(attendeesData, price, name, description, eventId);

      if (result.error) {
        setRegistrationError(result.error);
        return;
      }

      if (result.orderId) {
        router.push(
          `/payment?orderId=${result.orderId}&eventName=${encodeURIComponent(result.eventName)}&price=${result.price}&name=${encodeURIComponent(
            result.user.name,
          )}&email=${encodeURIComponent(result.user.email)}&phone=${encodeURIComponent(result.user.phone)}`,
        );
      } else {
        router.push(`/events/${eventId}/success`);
      }
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Event Registration</CardTitle>
        <CardDescription>Fill out the form below to register for the event.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Your Details</h3>
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="college_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl>
                    <Input placeholder="College Name" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Department" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" type="tel" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {eventType === "group" && maxGroupSize > 1 && (
              <>
                <Separator className="my-4" />
                <h3 className="text-lg font-semibold mb-4">Group Members Details</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 mb-4 p-4 border rounded">
                    <h4 className="text-md font-semibold">Member {index + 1}</h4>
                    <FormField
                      control={form.control}
                      name={`group_members.${index}.full_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full Name" {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`group_members.${index}.college_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College Name</FormLabel>
                          <FormControl>
                            <Input placeholder="College Name" {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`group_members.${index}.department`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="Department" {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`group_members.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email" type="email" {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`group_members.${index}.phone_no`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone Number" type="tel" {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {fields.length > 1 && (
                      <Button variant="destructive" size="sm" onClick={() => remove(index)} disabled={isPending}>
                        Remove Member
                      </Button>
                    )}
                  </div>
                ))}
                {fields.length < maxGroupSize - 1 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => append({ full_name: "", college_name: "", department: "", email: "", phone_no: "" })}
                    disabled={isPending}
                  >
                    Add Member
                  </Button>
                )}
              </>
            )}

            <Button type="submit" disabled={isPending} className="w-full">
              {price > 0 ? "Register and Pay" : "Register"}
            </Button>
            {paymentError && (
              <Alert variant="destructive">
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}
            {registrationError && (
              <Alert variant="destructive">
                <AlertDescription>{registrationError}</AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AttendeeForm;
