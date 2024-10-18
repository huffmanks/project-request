"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Audience, TaskType } from "@prisma/client";
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
    audiences: z.array(z.string().min(1)).min(1).nonempty("Please select at least one audience."),
    otherAudience: z.string().min(2, {
      message: "Audience must be at least 2 characters.",
    }),
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
    taskTypes: z
      .array(z.string().min(1))
      .min(1)
      .nonempty("Please select at least one project type."),
    otherTaskType: z.string().min(2, {
      message: "Project type must be at least 2 characters.",
    }),
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
  taskTypes: TaskType[];
}

export default function ProjectRequestForm({ audiences, taskTypes }: ProjectRequestFormProps) {
  const today = startOfToday();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      audiences: [],
      otherAudience: "",
      purpose: "",
      proofDate: add(today, { days: 7 }),
      completionDate: add(today, { days: 14 }),
      isMailed: false,
      mailDate: undefined,
      budget: "",
      printerQuote: false,
      meeting: false,
      taskTypes: [],
      otherTaskType: "",
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

  const taskTypesList = taskTypes.map((taskType) => {
    return {
      label: taskType.title,
      value: slugify(taskType.title),
    };
  });

  const showOtherAudience = form.watch("audiences").includes("Other");
  const showMailDate = form.watch("isMailed");
  const showOtherTaskType = form.watch("taskTypes").includes("Other");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6">
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
                  defaultValue={field.value}
                  placeholder="Select audiences"
                  variant="inverted"
                  animation={2}
                  maxCount={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showOtherAudience && (
          <FormField
            control={form.control}
            name="otherAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other audience</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Special list"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us the purpose of the project."
                  className="min-h-24 resize-none"
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
                <FormLabel className="text-sm">Mailing</FormLabel>
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

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <Input
                  placeholder="75"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="printerQuote"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Printer quote</FormLabel>
                <FormDescription>
                  Do you need a quote from the printer before we begin?
                </FormDescription>
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

        <FormField
          control={form.control}
          name="meeting"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Meeting</FormLabel>
                <FormDescription>Would you like to meet with OMC before we begin? </FormDescription>
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

        <FormField
          control={form.control}
          name="taskTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project types</FormLabel>
              <FormControl>
                <MultiSelect
                  options={taskTypesList}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select types of projects"
                  variant="inverted"
                  animation={2}
                  maxCount={3}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {showOtherTaskType && (
          <FormField
            control={form.control}
            name="otherTaskType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other project type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Build a robot"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any thing else you would like to add."
                  className="min-h-24 resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
