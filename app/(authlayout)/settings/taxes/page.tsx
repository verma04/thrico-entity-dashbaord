"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TaxesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Taxes & Duties</h1>
        <p className="text-muted-foreground">
          Information regarding tax regulations and compliance.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Compliance</CardTitle>
          <CardDescription>Understanding your tax obligations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">1. Digital Services Tax</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are required to collect and remit digital services tax in
              certain jurisdictions. The applicable tax rate matches the
              standard VAT/GST rate in your country of residence. This tax is
              automatically calculated and added to your monthly subscription
              invoice where applicable.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">2. Sales Tax / VAT</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you are a business customer registered for VAT/GST, you may be
              eligible to receive invoices without tax charged, subject to the
              reverse charge mechanism. Please ensure your business details and
              tax identification number are correctly entered in your billing
              settings to facilitate this.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">3. Withholding Tax</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In some cases, you may be required by local law to withhold tax
              from payments made to us. If this applies, you must provide us
              with an official withholding tax certificate. Please contact our
              billing support team for assistance with processing withholding
              tax documentation and adjustments.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Duties & Import Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            For any physical goods or merchandise purchased or distributed
            through the platform, the recipient is generally responsible for all
            import duties, customs fees, and local sales taxes levied by the
            destination country. We are not responsible for delays caused by
            customs clearance processes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
