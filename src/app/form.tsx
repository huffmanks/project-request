"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Audience } from "@prisma/client";
import { add, format, startOfToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { MultiSelect } from "@/components/custom/multi-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z
  .object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    audiences: z.array(z.string()),
    purpose: z.string().min(2, {
      message: "Purpose must be at least 2 characters.",
    }),
    proofDate: z.date(),
    completionDate: z.date(),
    isMailed: z.boolean(),
    mailDate: z.date().optional(),
    budget: z.string().min(1, {
      message: "Budget is required.",
    }),
    printerQuote: z.boolean(),
    meeting: z.boolean(),
    additionalInfo: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isMailed && !data.mailDate) {
      ctx.addIssue({
        path: ["mailDate"],
        message: "The maild date is required if it needs to be mailed.",
        code: z.ZodIssueCode.custom,
      });
    } else {
      data.mailDate = undefined;
    }

    if (data.budget && isNaN(Number(data.budget))) {
      ctx.addIssue({
        path: ["budget"],
        message: "Budget must be a valid number.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

interface ProjectRequestFormProps {
  audiences: Audience[];
}

export function ProjectRequestForm({ audiences }: ProjectRequestFormProps) {
  const today = startOfToday();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      audiences: [""],
      purpose: "",
      proofDate: add(today, { days: 7 }),
      completionDate: add(today, { days: 14 }),
      isMailed: false,
      budget: "",
      printerQuote: false,
      meeting: false,
      additionalInfo: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    );
  }

  const audiencesList = audiences.map((audience) => {
    return {
      label: audience.title,
      value: slugify(audience.title),
    };
  });

  const showMailDate = form.watch("isMailed");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Homecoming Banners"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audiences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Audiences</FormLabel>
              <FormControl>
                <MultiSelect
                  options={audiencesList}
                  onValueChange={field.onChange}
                  placeholder="Select audiences"
                  animation={2}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us the purpose of the project."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proofDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Proof date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < today}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>When the proof needs to be ready by.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="completionDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Completion date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < today}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>When the project needs to be completed.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isMailed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Mailed</FormLabel>
                <FormDescription>Does this need to be mailed?</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {showMailDate && (
          <FormField
            control={form.control}
            name="mailDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Mail date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < today}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>When it needs to be mailed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
