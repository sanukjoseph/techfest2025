"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type EventFormData, eventSchema } from "@/lib/validations/event";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Tables } from "@/lib/supabase/types";
import { uploadFileAction } from "@/actions/file-upload";
import { createEvent, deleteEvent, updateEvent } from "@/actions/events";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Event = Tables<"events">;
interface EventsFormProps {
  initialEvents?: Event[];
}

export default function EventsForm({ initialEvents }: EventsFormProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents ?? []);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      event_limit: 0,
      image_url: "",
      event_type: "single",
      category: "technical",
      format: "competition",
      min_group_size: 1,
      max_group_size: 5,
    },
  });

  const eventType = useWatch({ control: form.control, name: "event_type" });

  useEffect(() => {
    setEvents(initialEvents ?? []);
  }, [initialEvents]);

  useEffect(() => {
    if (selectedEvent) {
      form.reset({
        name: selectedEvent.name || "",
        description: selectedEvent.description || "",
        price: selectedEvent.price || 0,
        event_limit: selectedEvent.event_limit || 0,
        image_url: selectedEvent.image_url || "",
        event_type: (selectedEvent.event_type as "single" | "group") || "single",
        category: (selectedEvent.category as "technical" | "non-technical") || "technical",
        format: (selectedEvent.format as "workshop" | "competition") || "competition",
        min_group_size: selectedEvent.min_group_size || 1,
        max_group_size: selectedEvent.max_group_size || 5,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        price: 0,
        event_limit: 0,
        image_url: "",
        event_type: "single",
        category: "technical",
        format: "competition",
        min_group_size: 1,
        max_group_size: 5,
      });
    }
  }, [selectedEvent, form]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const url = await uploadFileAction(formData);
          if (url?.serverError) {
            throw new Error(url.serverError);
          }
          if (!url?.data?.url) {
            throw new Error("Failed to get upload URL");
          }

          form.setValue("image_url", url.data.url);
          toast.success("Image uploaded successfully");
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to upload image");
        }
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
  });

  const onSubmit = async (data: EventFormData) => {
    startTransition(async () => {
      try {
        if (selectedEvent) {
          const result = await updateEvent({ id: selectedEvent.id, ...data });
          if (result?.serverError) {
            toast.error(result.serverError);
          } else {
            toast.success("Event updated successfully");
          }
        } else {
          const result = await createEvent(data);
          if (result?.serverError) {
            toast.error(result.serverError);
          } else {
            toast.success("Event created successfully");
          }
        }
        form.reset();
        setSelectedEvent(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An error occurred while saving the event");
      }
    });
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      startTransition(async () => {
        try {
          const result = await deleteEvent({ id: selectedEvent.id });
          if (result?.serverError) {
            toast.error(result.serverError);
          } else {
            toast.success("Event deleted successfully");
            const updatedEvents = events.filter((event) => event.id !== selectedEvent.id);
            setEvents(updatedEvents);
            form.reset();
            setSelectedEvent(null);
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "An error occurred while saving the event");
        }
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event List</CardTitle>
            <CardDescription>Select an event to edit or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {events.length === 0 ? (
                <p className="text-muted-foreground">No events created yet.</p>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <Card key={event.id} onClick={() => setSelectedEvent(event)} className="cursor-pointer hover:bg-accent">
                      <CardHeader>
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedEvent ? "Update Event" : "Create Event"}</CardTitle>
            <CardDescription>{selectedEvent ? "Update the event details" : "Create a new event for the tech fest"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Event Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Event Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="event_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limit</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="event_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="group">Group</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="non-technical">Non-Technical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="competition">Competition</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {eventType === "group" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="min_group_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Min Group Size</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="max_group_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Group Size</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                            isDragActive ? "border-primary" : "border-gray-300"
                          }`}
                        >
                          <input {...getInputProps()} />
                          {isDragActive ? <p>Drop the image here ...</p> : <p>Drag and drop an image here, or click to select one</p>}
                          <p className="text-sm text-muted-foreground mt-2">Max file size: 5MB</p>
                        </div>
                      </FormControl>
                      {field.value && (
                        <div className="mt-2">
                          <Image src={field.value || "/placeholder.svg"} alt="Event" width={200} height={200} className="rounded-md" />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <div className="flex justify-end space-x-2">
                  {selectedEvent && (
                    <Button variant="destructive" onClick={handleDelete} type="button" disabled={isPending}>
                      Delete
                    </Button>
                  )}
                  <Button type="submit" disabled={isPending}>
                    {selectedEvent ? "Update Event" : "Create Event"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
