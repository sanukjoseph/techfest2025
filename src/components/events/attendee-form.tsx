"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { attendeeSchema, type AttendeeFormData } from "@/lib/validations/attendee";
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
    if (eventType === "group" && fields.length === 0) {
      append({
        full_name: "",
        college_name: "",
        department: "",
        email: "",
        phone_no: "",
      });
    }
  }, [eventType, append, fields.length]);

  const handleFormSubmit = async (data: AttendeeFormData) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setRegistrationError(null);
    setPaymentError(null);
    if (!data.full_name || !data.email || !data.phone_no) {
      setRegistrationError("Please fill out all required fields for the main attendee.");
      setIsSubmitting(false);
      return;
    }
    if (eventType === "group") {
      const validGroupMembers = (data.group_members ?? []).filter((member) => member.full_name && member.email && member.phone_no);
      if (validGroupMembers.length + 1 < minGroupSize) {
        setRegistrationError(`Please fill out details for at least ${minGroupSize - 1} group members.`);
        setIsSubmitting(false);
        return;
      }
      if (validGroupMembers.length + 1 > maxGroupSize) {
        setRegistrationError(`You can only register a maximum of ${maxGroupSize} attendees (including yourself).`);
        setIsSubmitting(false);
        return;
      }
    }

    startTransition(async () => {
      try {
        let attendeesData;
        if (eventType === "group") {
          const validGroupMembers = (data.group_members ?? []).filter((member) => member.full_name && member.email && member.phone_no);
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
    <Card className="max-w-4xl mx-auto bg-black text-gray-300 shadow-lg border border-gray-800">
      <CardHeader className="border-b border-gray-800 pb-4">
        <CardTitle className="text-3xl font-bold text-center text-white">Event Registration</CardTitle>
        <CardDescription className="text-gray-400 text-center">Fill out the form below to register for the event.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <Accordion type="single" collapsible defaultValue="personal-details" className="space-y-4">
              <AccordionItem value="personal-details" className="border border-gray-800 rounded-xl overflow-hidden">
                <AccordionTrigger className="bg-gray-900 px-4 py-2 text-lg font-semibold hover:bg-gray-800 transition-colors">
                  Your Details
                </AccordionTrigger>
                <AccordionContent className="space-y-4 p-4 bg-black">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="college_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">College Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your college name"
                            {...field}
                            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Department</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your department"
                            {...field}
                            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your phone number"
                            type="tel"
                            {...field}
                            className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              {eventType === "group" && (
                <AccordionItem value="group-members" className="border border-gray-800 rounded-xl overflow-hidden">
                  <AccordionTrigger className="bg-gray-900 px-4 py-2 text-lg font-semibold hover:bg-gray-800 transition-colors">
                    Group Members Details
                  </AccordionTrigger>
                  <AccordionContent className="space-y-5 p-4 bg-black">
                    {fields.map((field, index) => (
                      <div key={field.id} className="space-y-4 mb-4 border border-gray-800 p-4 rounded-md bg-gray-900">
                        <h4 className="text-md font-semibold text-gray-300">Member {index + 1}</h4>
                        <FormField
                          control={form.control}
                          name={`group_members.${index}.full_name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter group member's full name"
                                  {...field}
                                  className="bg-black border-gray-700 text-white placeholder-gray-500"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`group_members.${index}.college_name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">College Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter group member's college name"
                                  {...field}
                                  className="bg-black border-gray-700 text-white placeholder-gray-500"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`group_members.${index}.department`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Department</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter group member's department"
                                  {...field}
                                  className="bg-black border-gray-700 text-white placeholder-gray-500"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`group_members.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter group member's email"
                                  type="email"
                                  {...field}
                                  className="bg-black border-gray-700 text-white placeholder-gray-500"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`group_members.${index}.phone_no`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter group member's phone number"
                                  type="tel"
                                  {...field}
                                  className="bg-black border-gray-700 text-white placeholder-gray-500"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        {fields.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-gray-800 hover:bg-gray-700 text-white"
                          >
                            Remove Member
                          </Button>
                        )}
                      </div>
                    ))}
                    {fields.length < maxGroupSize - 1 && (
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
                        className="bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        Add Member
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            <Button
              type="submit"
              disabled={isPending || isSubmitting}
              className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white text-lg font-semibold py-3 rounded-md transition-colors"
            >
              {isSubmitting ? "Registering..." : price > 0 ? "Register and Pay" : "Register"}
            </Button>

            {paymentError && (
              <Alert variant="destructive" className="mt-4 bg-gray-900 text-red-400 border border-red-800">
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}
            {registrationError && (
              <Alert variant="destructive" className="mt-4 bg-gray-900 text-red-400 border border-red-800">
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
