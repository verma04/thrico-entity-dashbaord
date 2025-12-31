"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useChangeEntityCurrency, useEntityCurrency } from "@/graphql/actions";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle, Coins, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CurrencyPage() {
  const { data, loading: loadingCurrency } = useEntityCurrency();
  const [currency, setCurrency] = useState("");

  useEffect(() => {
    if (data?.getEntityCurrency) {
      setCurrency(data.getEntityCurrency);
    }
  }, [data]);

  const [changeCurrency, { loading: updating }] = useChangeEntityCurrency({
    onCompleted: (data: any) => {
      if (data?.changeEntityCurrency?.success) {
        toast.success("Currency updated successfully");
      } else {
        toast.error("Failed to update currency");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update currency");
    },
  });

  const handleSave = () => {
    if (!currency) return;
    changeCurrency({
      variables: {
        currency: currency,
      },
    });
  };

  const currencies = [
    { code: "USD", name: "US Dollar ($)" },
    { code: "EUR", name: "Euro (€)" },
    { code: "GBP", name: "British Pound (£)" },
    { code: "INR", name: "Indian Rupee (₹)" },
    { code: "CAD", name: "Canadian Dollar (C$)" },
    { code: "AUD", name: "Australian Dollar (A$)" },
    { code: "JPY", name: "Japanese Yen (¥)" },
    { code: "CNY", name: "Chinese Yuan (¥)" },
  ];

  if (loadingCurrency) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Currency Settings</h1>
        <p className="text-muted-foreground">
          Set the default currency for your entity's transactions and billing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Default Currency
          </CardTitle>
          <CardDescription>
            This currency will be used for all revenue reports and billing
            calculations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="grid gap-2 w-full sm:max-w-xs">
              <label htmlFor="currency" className="text-sm font-medium">
                Select Currency
              </label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSave}
              disabled={updating || currency === data?.getEntityCurrency}
              className="w-full sm:w-auto"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
