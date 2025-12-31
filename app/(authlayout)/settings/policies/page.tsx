"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PoliciesPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Platform Policies</h1>
        <p className="text-muted-foreground">
          Terms of service and acceptable use guidelines.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
          <CardDescription>Last updated: December 30, 2025</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing and using this platform, you accept and agree to be
              bound by the terms and provision of this agreement. In addition,
              when using this platform's particular services, you shall be
              subject to any posted guidelines or rules applicable to such
              services.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">2. User Conduct</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You agree to use the platform only for lawful purposes. You are
              prohibited from posting or transmitting any unlawful, threatening,
              libelous, defamatory, obscene, scandalous, inflammatory,
              pornographic, or profane material or any material that could
              constitute or encourage conduct that would be considered a
              criminal offense, give rise to civil liability, or otherwise
              violate any law.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">3. Content Ownership</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You retain all rights and ownership of your content. However, by
              uploading content to the platform, you grant us a worldwide,
              non-exclusive, royalty-free license to use, reproduce, and display
              the content in connection with providing the service. We claim no
              intellectual property rights over the material you provide to the
              service.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acceptable Use Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Prohibited Activities</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Spamming or sending unsolicited messages.</li>
              <li>Hosting or distributing malware or malicious code.</li>
              <li>
                Attempting to gain unauthorized access to the system or user
                accounts.
              </li>
              <li>Harassing, bullying, or intimidating other users.</li>
              <li>Impersonating any person or entity.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
