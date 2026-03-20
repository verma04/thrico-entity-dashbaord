"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";

export default function BillingAddress() {
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState("India");
  const form = useForm({ defaultValues: { country } });

  const handleSave = (data: { country: string }) => {
    setCountry(data.country);
    setIsOpen(false);
  };

  return (
    <>
    <div className="group/billing p-6 rounded-2xl bg-muted/20 border border-border/40 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-orange-500/5 text-orange-600 border border-orange-500/10 group-hover/billing:scale-110 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-black text-lg tracking-tight">Legal Address</p>
            <p className="text-sm text-muted-foreground font-bold max-w-md leading-relaxed uppercase tracking-wide">
              {country || "No address provided"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            form.reset({ country });
            setIsOpen(true);
          }}
          className="font-black px-6 rounded-full border-primary/20 hover:bg-primary hover:text-primary-foreground group-hover/billing:shadow-lg group-hover/billing:shadow-primary/10 transition-all"
        >
          Update Address
        </Button>
      </div>
    </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Billing Address</DialogTitle>
            <DialogDescription>
              Update your billing address information
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="country"
                rules={{ required: "Please enter billing address" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your billing address"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
