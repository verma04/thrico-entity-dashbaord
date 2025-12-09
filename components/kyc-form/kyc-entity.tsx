"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import KycFooter from "./kyc-footer";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  Briefcase,
  MapPin,
  Factory,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrganizationFormData {
  name: string;
  entityType: string;
  industryType: string;
  website: string;
  address: string;
}

interface KycEntityProps {
  setCurrent: (step: number) => void;
  organization: OrganizationFormData;
  setOrganization: (org: OrganizationFormData) => void;
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

const KycEntity: React.FC<KycEntityProps> = ({
  setCurrent,
  organization,
  setOrganization,
}) => {
  const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: organization?.name || "",
      entityType: organization?.entityType || "",
      industryType: organization?.industryType || "",
      website: organization?.website || "",
      address: organization?.address || "",
    }),
    [organization]
  );

  const form = useForm<OrganizationFormData>({
    defaultValues,
    mode: "onChange",
  });

  const onWebsiteChange = (value: string) => {
    if (!value || value.includes(".")) {
      setAutoCompleteResult([]);
      setShowAutocomplete(false);
    } else {
      const suggestions = [
        ".com",
        ".org",
        ".net",
        ".tech",
        ".in",
        ".io",
        ".co",
      ].map((domain) => `${value.toLowerCase()}${domain}`);
      setAutoCompleteResult(suggestions);
      setShowAutocomplete(true);
    }
  };

  const entityTypes = [
    {
      value: "Enterprise",
      label: "Enterprise",
      description: "Large business organization",
    },
    {
      value: "Creator",
      label: "Creator",
      description: "Content creator or influencer",
    },
    {
      value: "Association",
      label: "Association",
      description: "Non-profit or community group",
    },
    {
      value: "Public Enterprise",
      label: "Public Enterprise",
      description: "Government entity",
    },
    {
      value: "Professional",
      label: "Professional",
      description: "Professional services",
    },
    { value: "Startup", label: "Startup", description: "Early-stage company" },
    { value: "other", label: "Other", description: "Other type of entity" },
  ];

  const industryTypes = [
    { value: "Technology", label: "Technology", icon: "💻" },
    { value: "Retail", label: "Retail", icon: "🛍️" },
    { value: "Education", label: "Education", icon: "🎓" },
    { value: "FMCG", label: "FMCG", icon: "🛒" },
    { value: "Electronics", label: "Electronics", icon: "⚡" },
    { value: "Telecommunications", label: "Telecommunications", icon: "📡" },
    { value: "Healthcare", label: "Healthcare", icon: "🏥" },
    { value: "Finance", label: "Finance", icon: "💰" },
    { value: "Manufacturing", label: "Manufacturing", icon: "🏭" },
    { value: "other", label: "Other", icon: "📊" },
  ];

  const onFinish = (values: OrganizationFormData) => {
    setOrganization(values);
    setCurrent(3);
  };

  const handleAutocompleteSelect = (option: string) => {
    form.setValue("website", option, { shouldValidate: true });
    setAutoCompleteResult([]);
    setShowAutocomplete(false);
  };

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
          className="w-full max-w-2xl mx-auto space-y-6"
        >
          {/* Basic Information Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Entity Information</h3>
            </div>

            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Entity name is required",
                minLength: {
                  value: 2,
                  message: "Entity name must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Entity name must be less than 100 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Name *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g., Acme Corporation, Tech Innovators"
                        {...field}
                        className="pl-10"
                      />
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Official name of your organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entityType"
              rules={{ required: "Please select entity category" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(!field.value && "text-muted-foreground")}
                      >
                        <SelectValue placeholder="Select entity category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entityTypes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{item.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Type of organization you represent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industryType"
              rules={{ required: "Please select industry type" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Industry *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(!field.value && "text-muted-foreground")}
                      >
                        <SelectValue placeholder="Select industry type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {industryTypes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <div className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Primary industry your organization operates in
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Online Presence Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Online Presence</h3>
            </div>

            <FormField
              control={form.control}
              name="website"
              rules={{
                required: "Website is required",
                pattern: {
                  value: /^[a-zA-Z0-9][a-zA-Z0-9-_.]*\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid website (e.g., example.com)",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="relative">
                        <Input
                          placeholder="yoursite.com"
                          {...field}
                          className="pl-10"
                          onChange={(e) => {
                            field.onChange(e);
                            onWebsiteChange(e.target.value);
                          }}
                          onBlur={() => {
                            setTimeout(() => setShowAutocomplete(false), 200);
                          }}
                          onFocus={() => {
                            if (autoCompleteResult.length > 0) {
                              setShowAutocomplete(true);
                            }
                          }}
                        />
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      {showAutocomplete && autoCompleteResult.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border rounded-md shadow-lg overflow-hidden"
                        >
                          <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50 border-b">
                            Suggestions
                          </div>
                          {autoCompleteResult.map((option) => (
                            <div
                              key={option}
                              className="px-3 py-2.5 hover:bg-accent cursor-pointer text-sm border-b last:border-b-0 flex items-center gap-2 transition-colors"
                              onClick={() => handleAutocompleteSelect(option)}
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{option}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your organization's website or domain name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Location Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Location</h3>
            </div>

            <FormField
              control={form.control}
              name="address"
              rules={{
                required: "Address is required",
                minLength: {
                  value: 10,
                  message:
                    "Please provide a complete address (at least 10 characters)",
                },
                maxLength: {
                  value: 500,
                  message: "Address must be less than 500 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your complete business address&#10;e.g., 123 Main Street, Suite 100&#10;City, State/Province, Postal Code&#10;Country"
                      {...field}
                      className="min-h-[120px] resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Full registered address of your organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </form>

        <KycFooter onSubmit={form.handleSubmit(onFinish)} />
      </motion.div>
    </FormProvider>
  );
};

export default React.memo(KycEntity);
