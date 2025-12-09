"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

import { getCustomDomain } from "@/graphql/actions/domain";
import { ThricoDomain } from "./thrico-domain";
import { CustomDomain } from "./custom-domain";
import { AddDomain } from "./add-domain";
import { useGetEntity } from "@/graphql/actions";
import Link from "next/link";

export const DomainsPage = () => {
  const { data, loading } = useGetEntity();
  const { data: domainData } = getCustomDomain();

  const hasCustomDomain = !!domainData?.getCustomDomain?.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Domains</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your Thrico workspace domains and custom domain configurations
        </p>
      </div>

      {!hasCustomDomain && (
        <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Buy or connect a domain
            </CardTitle>
            <CardDescription>
              Secure the perfect web address for your portal that customers can
              trust and find easily.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get a new domain or connect one you already own from providers
              like Namecheap or GoDaddy.
            </p>
            <div className="flex flex-wrap gap-3">
              <AddDomain />
              <Link
                href="https://www.godaddy.com/domains/searchresults.aspx?checkAvail=1&tmskey=&domainToCheck=yourdomain&isc=GPPT01A0010001"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline">Buy Domain</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Active Domains</h2>
        <div className="space-y-3">
          <ThricoDomain />
          <CustomDomain />
        </div>
      </div>
    </div>
  );
};
