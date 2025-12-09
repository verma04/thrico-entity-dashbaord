"use client";

import React, { useState, useMemo } from "react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { Phone, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhoneNumberProps {
  initialValue?: string;
  initialCountryCode?: string;
}

// Popular country codes
const countryCodes = [
  { code: "+1", country: "US", name: "United States", flag: "🇺🇸" },
  { code: "+1", country: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "+44", country: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", country: "IN", name: "India", flag: "🇮🇳" },
  { code: "+86", country: "CN", name: "China", flag: "🇨🇳" },
  { code: "+81", country: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "FR", name: "France", flag: "🇫🇷" },
  { code: "+39", country: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "+61", country: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "+55", country: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "+7", country: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "+82", country: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "+971", country: "AE", name: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+27", country: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "+20", country: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "+62", country: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "+60", country: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "+65", country: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "+63", country: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "+66", country: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "+92", country: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", country: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", country: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "+31", country: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "+358", country: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "+41", country: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "+32", country: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "+351", country: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "+30", country: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "+48", country: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "+90", country: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "+98", country: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "+964", country: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "+972", country: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "+962", country: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "+961", country: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "+974", country: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "+965", country: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "+968", country: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "+973", country: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "+254", country: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "+255", country: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "+256", country: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "+233", country: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "+54", country: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "+51", country: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "+58", country: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "+64", country: "NZ", name: "New Zealand", flag: "🇳🇿" },
];

const PhoneNumber: React.FC<PhoneNumberProps> = ({
  initialValue = "",
  initialCountryCode = "+1",
}) => {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const [countryCode, setCountryCode] = useState(initialCountryCode);

  const selectedCountry = useMemo(
    () => countryCodes.find((c) => c.code === countryCode) || countryCodes[0],
    [countryCode]
  );

  const handlePhoneChange = (value: string) => {
    // Remove non-numeric characters except + and spaces
    const cleaned = value.replace(/[^\d\s]/g, "");
    return cleaned;
  };

  return (
    <FormField
      control={form.control}
      name="phone"
      rules={{
        pattern: {
          value: /^[\d\s]{7,15}$/,
          message: "Please enter a valid phone number",
        },
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number *</FormLabel>
          <FormControl>
            <div className="flex gap-2">
              {/* Country Code Selector */}
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[140px] justify-between"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{selectedCountry.flag}</span>
                      <span className="font-mono">{selectedCountry.code}</span>
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {countryCodes.map((country) => (
                        <CommandItem
                          key={`${country.country}-${country.code}`}
                          value={`${country.name} ${country.code}`}
                          onSelect={() => {
                            setCountryCode(country.code);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              countryCode === country.code
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span className="mr-2">{country.flag}</span>
                          <span className="flex-1">{country.name}</span>
                          <span className="text-muted-foreground font-mono text-sm">
                            {country.code}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Phone Number Input */}
              <div className="relative flex-1">
                <Input
                  placeholder="123 456 7890"
                  {...field}
                  onChange={(e) => {
                    const cleaned = handlePhoneChange(e.target.value);
                    field.onChange(cleaned);
                  }}
                  defaultValue={initialValue}
                  className="pl-10"
                  maxLength={15}
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </FormControl>
          <FormDescription>
            Full number: {countryCode} {field.value || "___"}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default React.memo(PhoneNumber);
