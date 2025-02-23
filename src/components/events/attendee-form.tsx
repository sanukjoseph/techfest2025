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
import { registerAttendees } from "@/actions/register";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    if (eventType === "group" && fields.length < minGroupSize) {
      for (let i = fields.length; i < minGroupSize; i++) {
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
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    setRegistrationError(null);
    setPaymentError(null);

    startTransition(async () => {
      try {
        let attendeesData;
        if (eventType === "group") {
          // Filter out group members who have filled name field
          const validGroupMembers = data.group_members ? data.group_members.filter((member) => member.full_name !== "") : [];

          attendeesData = [
            { ...data, payment_id: null, event_id: eventId },
            ...validGroupMembers.map((member) => ({
              ...member,
              payment_id: null,
              event_id: eventId,
            })),
          ];
        } else {
          attendeesData = [{ ...data, payment_id: null, event_id: eventId }];
        }

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
      } finally {
        setIsSubmitting(false);
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
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="personal-details">
                <AccordionTrigger>Your Details</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
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
                          <Input placeholder="Enter your college name" {...field} />
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
                          <Input placeholder="Enter your department" {...field} />
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
                          <Input placeholder="Enter your email" type="email" {...field} />
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
                          <Input placeholder="Enter your phone number" type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              {eventType === "group" && (
                <AccordionItem value="group-members">
                  <AccordionTrigger>Group Members Details</AccordionTrigger>
                  <AccordionContent>
                    {fields.map((field, index) => (
                      <div key={field.id} className="space-y-4 mb-4 border p-4 rounded-md">
                        <h4 className="text-md font-semibold">Member {index + 1}</h4>
                        <FormField
                          control={form.control}
                          name={`group_members.${index}.full_name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter group member's full name" {...field} />
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
                                <Input placeholder="Enter group member's college name" {...field} />
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
                                <Input placeholder="Enter group member's department" {...field} />
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
                                <Input placeholder="Enter group member's email" type="email" {...field} />
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
                                <Input placeholder="Enter group member's phone number" type="tel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {fields.length > minGroupSize && (
                          <Button variant="destructive" size="sm" type="button" onClick={() => remove(index)}>
                            Remove Member
                          </Button>
                        )}
                      </div>
                    ))}
                    {fields.length < maxGroupSize && (
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        onClick={() =>
                          append({
                            full_name: "",
                            college_name: "",
                            department: "",
                            email: "",
                            phone_no: "",
                          })
                        }
                      >
                        Add Member
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            <Button type="submit" disabled={isPending || isSubmitting} className="w-full mt-4">
              {isSubmitting ? "Registering..." : price > 0 ? "Register and Pay" : "Register"}
            </Button>

            {paymentError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}
            {registrationError && (
              <Alert variant="destructive" className="mt-4">
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
