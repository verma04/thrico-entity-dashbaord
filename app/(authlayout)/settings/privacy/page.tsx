"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Customer Privacy</h1>
        <p className="text-muted-foreground">
          Learn how we handle and protect your customer data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Collection & Usage</CardTitle>
          <CardDescription>Last updated: December 30, 2025</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">1. Information We Collect</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We collect information that you provide directly to us when you
              use our services. This includes contact information such as name,
              email address, and phone number; account credentials; and payment
              information. We also automatically collect certain technical data
              when you visit our platform, including IP addresses, browser
              types, and device information.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">2. How We Use Your Data</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use the collected data to provide, maintain, and improve our
              services. Specifically, we use it to process transactions, send
              necessary notifications, provide customer support, and detect
              fraud. We may also use aggregated, anonymized data for analytics
              to understand user behavior and enhance our platform's
              performance.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              3. Data Sharing & Third Parties
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not sell your personal data to third parties. We may share
              information with trusted service providers who assist us in
              operating our website, conducting our business, or serving our
              users, so long as those parties agree to keep this information
              confidential. Legal requirements may also compel us to disclose
              information to authorities.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">4. Your Rights</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal
              data. You can manage your communication preferences and opt-out of
              marketing communications at any time. If you wish to exercise
              these rights, please contact our support team or use the tools
              provided in your account settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
