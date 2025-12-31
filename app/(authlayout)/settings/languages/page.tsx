"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function LanguagesPage() {
  const supportedLanguages = [
    { name: "English (US)", code: "en-US", active: true },
    { name: "Spanish", code: "es", active: false },
    { name: "French", code: "fr", active: false },
    { name: "German", code: "de", active: false },
    { name: "Portuguese", code: "pt", active: false },
    { name: "Japanese", code: "ja", active: false },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Languages</h1>
        <p className="text-muted-foreground">
          Manage language settings for your dashboard and user interface.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Language</CardTitle>
          <CardDescription>
            Select the default language for the admin dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Currently, the platform defaults to English (US). We are actively
            working on localization for other regions. Support for listed
            languages is coming soon.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {supportedLanguages.map((lang) => (
              <div
                key={lang.code}
                className={`flex items-start justify-between space-x-4 rounded-md border p-4 ${
                  lang.active ? "bg-muted/50 border-primary/50" : "bg-card"
                }`}
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {lang.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{lang.code}</p>
                </div>
                {lang.active && <Check className="h-4 w-4 text-primary" />}
                {!lang.active && (
                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
