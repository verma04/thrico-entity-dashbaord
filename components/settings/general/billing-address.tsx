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
      <div className="flex items-start justify-between py-4 px-0">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-medium text-sm">Billing address</p>
            <p className="text-sm text-muted-foreground">{country}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            form.reset({ country });
            setIsOpen(true);
          }}
          className="h-8 w-8 p-0"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
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
