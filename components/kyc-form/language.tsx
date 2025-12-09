"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { languageData } from "./types/kyc-types";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageProps {
  initialValue?: string;
}

const Language: React.FC<LanguageProps> = ({ initialValue }) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="language"
      rules={{ required: "Language is required" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preferred Language *</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={initialValue || field.value}
          >
            <FormControl>
              <SelectTrigger
                className={cn(!field.value && "text-muted-foreground")}
              >
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select your preferred language" />
                </div>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {languageData.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground text-sm">
                      ({item.nativeName})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Choose your preferred language for the dashboard
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default React.memo(Language);
