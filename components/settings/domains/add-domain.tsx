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
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    let domain = values.website;
    if (domain.startsWith("www.")) {
      domain = domain.replace("www.", "");
    }

    add({
      variables: {
        input: {
          domain,
        },
      },
    });
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="h-8 px-4 text-[11px] font-bold uppercase tracking-wider bg-primary text-primary-foreground  hover:bg-black dark:hover:bg-card text-white  gap-2 rounded-md shadow-none"
      >
        <Plus className="h-3.5 w-3.5" />
        Connect Domain
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border/50 rounded-lg shadow-none">
          <div className="px-6 py-5 border-b border-border/50 bg-muted/30">
            <DialogHeader>
              <DialogTitle className="text-[15px] font-semibold text-foreground tracking-tight">
                Connect domain
              </DialogTitle>
              <DialogDescription className="text-[12px] text-muted-foreground mt-1 font-medium">
                Add an external domain namespace to this workspace infrastructure.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="domain" className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Domain namespace
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-[12px] font-mono select-none">
                            https://
                          </span>
                          <Input
                            {...field}
                            id="domain"
                            placeholder="acme-corp.com"
                            disabled={loading}
                            autoFocus
                            className="pl-[68px] h-10 border-border/50 focus:border-foreground focus:ring-0 rounded-md text-[13px] font-mono shadow-none transition-all placeholder:text-muted-foreground/30"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-rose-500 uppercase tracking-wider" />
                    </FormItem>
                  )}
                />

                <DialogFooter className="gap-2 sm:gap-2 pt-4 border-t border-border/50">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                    className="h-9 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-9 px-6 text-[11px] font-bold uppercase tracking-wider bg-primary text-primary-foreground  hover:bg-black dark:hover:bg-card text-white  gap-2 rounded-md transition-all active:scale-[0.98]"
                  >
                    {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                    {loading ? "Provisioning..." : "Connect Domain"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
