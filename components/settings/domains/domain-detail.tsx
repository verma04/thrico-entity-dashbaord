"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Trash2,
  Globe,
  ExternalLink,
  Info,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  checkUpdatedDnsRecord,
  deleteDomain,
  getCustomDomainDetails,
} from "@/graphql/actions/domain";
import { CheckSsl } from "./check-ssl";
import { DNSProviderGuide } from "./dns-provider-guide";

interface DomainDetailProps {
  id: string;
}

export const DomainDetail = ({ id }: DomainDetailProps) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, loading, error } = getCustomDomainDetails({
    variables: {
      input: { id },
    },
  });

  const [del, { loading: deleting }] = deleteDomain({
    onCompleted: () => {
      router.push("/settings/domains");
    },
  });

  const [check, { loading: checking }] = checkUpdatedDnsRecord({});

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Domain not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">Loading...</div>
    );
  }

  const domainDetails = data?.getCustomDomainDetails;

  if (!domainDetails) return null;

  const dnsRecords = !domainDetails.isSubDomain
    ? [
        { key: "1", type: "CNAME", ...domainDetails.cname },
        { key: "2", type: "TXT", ...domainDetails.txt },
        { key: "3", type: "A", ...domainDetails.aRecord },
      ]
    : [
        { key: "1", type: "CNAME", ...domainDetails.cname },
        { key: "2", type: "TXT", ...domainDetails.txt },
      ];

  const handleDelete = () => {
    del({
      variables: {
        input: { id },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{domainDetails.domain}</h1>
            {domainDetails.isVerified ? (
              <Badge className="gap-1 bg-green-100 text-green-800">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1 bg-amber-50 text-amber-700"
              >
                <AlertCircle className="h-3 w-3" />
                Setup Needed
              </Badge>
            )}
          </div>
        </div>
        {console.log(domainDetails)}
        <div className="flex gap-2">
          {domainDetails?.isVerified && (
            <>
              {domainDetails?.ssl ? (
                <Badge className="gap-1 bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3" />
                  SSL Enabled
                </Badge>
              ) : (
                <CheckSsl ssl={domainDetails.ssl} />
              )}
            </>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="gap-2  text-white"
          >
            <Trash2 className="h-4 w-4 " />
            Delete
          </Button>
        </div>
      </div>

      {/* Conditionally Render Content based on Verification */}
      {domainDetails.isVerified ? (
        <Card className="bg-green-50/50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              Domain configuration complete
            </CardTitle>
            <CardDescription className="text-green-700">
              Your domain is correctly pointed to our servers and is ready to
              use.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-4 bg-white rounded-lg border border-green-100 shadow-sm">
              <Globe className="h-5 w-5 text-green-600" />
              <a
                href={`https://www.${domainDetails.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-800 hover:underline font-medium flex-1 truncate"
              >
                https://www.{domainDetails.domain}
              </a>
              <ExternalLink className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  DNS Configuration
                </CardTitle>
                <CardDescription>
                  Add these DNS records to your domain provider
                </CardDescription>
              </div>
              <DNSProviderGuide domainName={domainDetails.domain} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 text-blue-900 border-blue-200 mb-4">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                DNS changes can take up to 48 hours to propagate globally. If
                your domain isn't verifying immediately, please wait and try
                again later.
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ol className="list-inside space-y-2">
                  <li>
                    1. Log in to your domain provider and open DNS management
                    for <strong>{domainDetails.domain}</strong>
                  </li>
                  <li>2. Add the records below</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="w-12 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dnsRecords.map((record) => (
                    <TableRow key={record.key} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-semibold">
                        {record.type}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {record.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                            {record.value}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(record.value);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {record.verified ? (
                          <div className="flex justify-end">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </Badge>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <Badge
                              variant="outline"
                              className="text-amber-600 border-amber-200 bg-amber-50 gap-1"
                            >
                              <Clock className="h-3 w-3" />
                              Pending
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() =>
                  check({
                    variables: {
                      input: { id },
                    },
                  })
                }
                loading={checking}
                disabled={checking}
              >
                {checking ? "Checking..." : "Check DNS Records"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              Propagation may take some time.
            </p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete domain?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {domainDetails.domain} from your
              workspace. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
