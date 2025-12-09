"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { addCustomDomain } from "@/graphql/actions/domain";

const domainSchema = z.object({
  website: z
    .string()
    .min(1, "Domain is required")
    .regex(
      /^(?!https?:\/\/)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})+$/,
      "Enter a valid domain (e.g., example.com)"
    ),
});

type DomainFormValues = z.infer<typeof domainSchema>;

export const AddDomain = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      website: "",
    },
  });

  const [add, { loading }] = addCustomDomain({
    onCompleted: (data: { addCustomDomain?: { id: string } }) => {
      router.push(`/settings/domains/${data?.addCustomDomain?.id}`);
      setIsOpen(false);
      form.reset();
    },
  });

  const onSubmit = (values: DomainFormValues) => {
    add({
      variables: {
        input: {
          domain: values.website,
        },
      },
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="default">
        Connect Domain
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect your domain</DialogTitle>
            <DialogDescription>
              Add a domain you own to your Thrico workspace
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="domain">Domain</Label>
                    <FormControl>
                      <Input
                        {...field}
                        id="domain"
                        placeholder="example.com"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Domain"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
