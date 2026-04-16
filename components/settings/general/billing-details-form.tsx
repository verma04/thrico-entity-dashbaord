"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const pincodeRegex = /^\d{6}$/;
const indianStatesAndUts = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const billingDetailsSchema = z
  .object({
    accountType: z.enum(["enterprise", "individual"]),
    gstNumber: z.string().trim(),
    panNumber: z
      .string()
      .trim()
      .regex(panRegex, "PAN must be in format ABCDE1234F"),
    addressLine1: z
      .string()
      .trim()
      .min(5, "Address line 1 must be at least 5 characters"),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2, "City is required"),
    state: z.string().trim().min(2, "State is required"),
    pincode: z
      .string()
      .trim()
      .regex(pincodeRegex, "Pincode must be exactly 6 digits"),
    country: z.string().trim().min(2, "Country is required"),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === "enterprise") {
      if (!data.gstNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gstNumber"],
          message: "GST number is required for enterprise accounts",
        });
      } else if (!gstRegex.test(data.gstNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gstNumber"],
          message: "GST must be in format 22AAAAA0000A1Z5",
        });
      }
    } else if (data.gstNumber && !gstRegex.test(data.gstNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gstNumber"],
        message: "GST must be in format 22AAAAA0000A1Z5",
      });
    }
  });

type BillingDetailsFormValues = z.infer<typeof billingDetailsSchema>;

export default function BillingDetailsForm() {
  const [isSaved, setIsSaved] = useState(false);

  const form = useForm<BillingDetailsFormValues>({
    resolver: zodResolver(billingDetailsSchema),
    defaultValues: {
      accountType: "enterprise",
      gstNumber: "",
      panNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  const accountType = form.watch("accountType");

  const onSubmit = () => {
    setIsSaved(true);
    form.reset(form.getValues());
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Account Type
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-9 text-[13px]">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="panNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  PAN Number
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value.toUpperCase()}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase().replace(/\s+/g, ""))
                    }
                    placeholder="ABCDE1234F"
                    className="h-9 text-[13px] font-mono"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gstNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                GST Number {accountType === "enterprise" ? "*" : "(Optional)"}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value.toUpperCase()}
                  onChange={(e) =>
                    field.onChange(e.target.value.toUpperCase().replace(/\s+/g, ""))
                  }
                  placeholder="22AAAAA0000A1Z5"
                  className="h-9 text-[13px] font-mono"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3 pt-2">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Billing Address
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Address line 1"
                      className="h-9 text-[13px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Address line 2 (optional)"
                      className="h-9 text-[13px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="City" className="h-9 text-[13px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-[13px]">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {indianStatesAndUts.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      inputMode="numeric"
                      maxLength={6}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="Pincode"
                      className="h-9 text-[13px] font-mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Country" className="h-9 text-[13px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-zinc-500">
            All fields are secured and encrypted in transit.
          </p>
        </div>
      </form>

      <FloatingSavePanel
        hasChanged={form.formState.isDirty}
        saved={isSaved}
        isSaving={form.formState.isSubmitting}
        onSave={form.handleSubmit(onSubmit)}
        onReset={() => form.reset()}
      />
    </Form>
  );
}
