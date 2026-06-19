"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateImpactTemplate, useGetImpactTemplates } from "@/graphql/actions/impact";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  minScore: z.coerce.number().min(0, "Min score must be >= 0"),
  maxScore: z.coerce.number().min(1, "Max score must be > 0"),
  defaultScore: z.coerce.number().min(0, "Default score must be >= 0"),
  activityWindowDays: z.coerce.number().min(1, "Window must be > 0"),
  refreshFrequency: z.string().min(1, "Refresh frequency is required"),
  decayEnabled: z.boolean(),
  decayPenalty: z.coerce.number().min(1, "Decay penalty must be > 0"),
});

export function TemplateForm() {
  const router = useRouter();
  const [createTemplate, { loading }] = useCreateImpactTemplate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Default Community Template",
      minScore: 0,
      maxScore: 1000,
      defaultScore: 0,
      activityWindowDays: 30,
      refreshFrequency: "WEEKLY",
      decayEnabled: true,
      decayPenalty: 5,
    },
  });

  const { data: templatesData } = useGetImpactTemplates();

  React.useEffect(() => {
    if (templatesData?.impactTemplates && templatesData.impactTemplates.length > 0) {
      const existing = templatesData.impactTemplates[0];
      form.reset({
        name: existing.name,
        minScore: existing.minScore,
        maxScore: existing.maxScore,
        defaultScore: existing.defaultScore,
        activityWindowDays: existing.activityWindowDays,
        refreshFrequency: existing.refreshFrequency,
        decayEnabled: existing.decayEnabled,
        decayPenalty: existing.decayPenalty,
      });
    }
  }, [templatesData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createTemplate({
        variables: {
          input: {
            ...values,
          },
        },
      });
      const isEditing = templatesData?.impactTemplates && templatesData.impactTemplates.length > 0;
      toast.success(isEditing ? "Template updated successfully!" : "Template created successfully!");
      router.push("/impact-score");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create template.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Standard Ruleset" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for this impact scoring template.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Score</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Score</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="defaultScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Starting Score</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="activityWindowDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Window (Days)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="refreshFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refresh Frequency</FormLabel>
              <FormControl>
                <Input placeholder="e.g. DAILY, WEEKLY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="decayEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable Score Decay</FormLabel>
                  <FormDescription>
                    Reduce scores for inactive users.
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
            name="decayPenalty"
            render={({ field }) => (
              <FormItem className="rounded-lg border p-4">
                <FormLabel>Decay Penalty (Points)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={!form.watch("decayEnabled")} />
                </FormControl>
                <FormDescription>
                  Points deducted per cycle if inactive.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : (templatesData?.impactTemplates?.length > 0 ? "Update Template" : "Save Template")}
        </Button>
      </form>
    </Form>
  );
}
