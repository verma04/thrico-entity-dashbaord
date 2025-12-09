"use client";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { useMemo } from "react";
import Language from "./language";
import PhoneNumber from "./phone-number";
import { useForm, FormProvider } from "react-hook-form";
import type { CountryData } from "./types/kyc-types";
import KycFooter from "./kyc-footer";
import { motion } from "framer-motion";
import { User, Mail, Briefcase, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileFormData {
  fullName: string;
  email: string;
  designation: string;
  phone: string;
  phoneCode: string;
  country: string;
  language: string;
}

interface KycProfileProps {
  fullName: string;
  email: string;
  profile: {
    designation?: string;
    phone?: string | { phone: string; code: string };
    country?: string;
    language?: string;
  };
  setProfile: (values: {
    designation: string;
    phone: { phone: string; code: string };
    country: string;
    language: string;
  }) => void;
  setCurrent: (step: number) => void;
  data?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  countries: CountryData[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const KycProfile: React.FC<KycProfileProps> = ({
  profile,
  setProfile,
  setCurrent,
  data,
  countries,
}) => {
  const defaultValues = useMemo(
    () => ({
      fullName:
        data?.firstName && data?.lastName
          ? `${data.firstName} ${data.lastName}`.trim()
          : "",
      email: data?.email || "",
      designation: profile?.designation || "",
      phone:
        typeof profile?.phone === "string"
          ? profile.phone
          : profile?.phone?.phone || "",
      phoneCode:
        typeof profile?.phone === "object" ? profile.phone?.code || "+1" : "+1",
      country: profile?.country || "",
      language: profile?.language || "",
    }),
    [data, profile]
  );

  const form = useForm<ProfileFormData>({
    defaultValues,
    mode: "onChange",
  });

  const onFinish = (values: ProfileFormData) => {
    setProfile({
      designation: values.designation,
      phone: {
        phone: values.phone,
        code: values.phoneCode,
      },
      country: values.country,
      language: values.language,
    });
    setCurrent(2);
  };

  const sortedCountries = useMemo(
    () => countries?.sort((a, b) => a.name.localeCompare(b.name)) || [],
    [countries]
  );

  return (
    <FormProvider {...form}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <form
          onSubmit={form.handleSubmit(onFinish)}
          className="w-full max-w-2xl mx-auto"
        >
          <div className="space-y-6">
            {/* Personal Information Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>

              <FormField
                control={form.control}
                name="fullName"
                rules={{ required: "Full name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Full Name
                      <span className="text-xs text-muted-foreground">
                        (From your account)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          disabled
                          {...field}
                          className="pl-10 bg-muted/50 cursor-not-allowed"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Email Address
                      <span className="text-xs text-muted-foreground">
                        (Verified)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          disabled
                          {...field}
                          className="pl-10 bg-muted/50 cursor-not-allowed"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Professional Information Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Professional Details</h3>
              </div>

              <PhoneNumber
                initialValue={defaultValues.phone}
                initialCountryCode={defaultValues.phoneCode}
              />

              <FormField
                control={form.control}
                name="designation"
                rules={{
                  required: "Designation is required",
                  minLength: {
                    value: 2,
                    message: "Designation must be at least 2 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Designation must be less than 100 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Designation *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="e.g., Chief Executive Officer, Product Manager"
                          {...field}
                          className="pl-10"
                        />
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your role or position in the organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Location & Language Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">
                  Location & Preferences
                </h3>
              </div>

              <FormField
                control={form.control}
                name="country"
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]">
                        {sortedCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Your primary country of operation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Language initialValue={profile?.language} />
            </motion.div>
          </div>
        </form>

        <KycFooter onSubmit={form.handleSubmit(onFinish)} />
      </motion.div>
    </FormProvider>
  );
};

export default React.memo(KycProfile);
