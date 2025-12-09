"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle2, AlertCircle, Copy, Trash2, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { checkUpdatedDnsRecord, deleteDomain, getCustomDomainDetails } from "@/graphql/actions/domain"
import { CheckSsl } from "./check-ssl"

interface DomainDetailProps {
  id: string
}

export const DomainDetail = ({ id }: DomainDetailProps) => {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { data, loading, error } = getCustomDomainDetails({
    variables: {
      input: { id },
    },
  })

  const [del, { loading: deleting }] = deleteDomain({
    onCompleted: () => {
      router.push("/settings/domains")
    },
  })

  const [check, { loading: checking }] = checkUpdatedDnsRecord({})

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Domain not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Loading...</div>
  }

  const domainDetails = data?.getCustomDomainDetails

  if (!domainDetails) return null

  const dnsRecords = !domainDetails.isSubDomain
    ? [
        { key: "1", type: "CNAME", ...domainDetails.cname },
        { key: "2", type: "TXT", ...domainDetails.txt },
        { key: "3", type: "A", ...domainDetails.aRecord },
      ]
    : [
        { key: "1", type: "CNAME", ...domainDetails.cname },
        { key: "2", type: "TXT", ...domainDetails.txt },
      ]

  const handleDelete = () => {
    del({
      variables: {
        input: { id },
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
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
              <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-700">
                <AlertCircle className="h-3 w-3" />
                Setup Needed
              </Badge>
            )}
          </div>
        </div>
        {domainDetails.isVerified && <CheckSsl id={id} ssl={domainDetails.ssl} />}
      </div>

      {/* DNS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            DNS Configuration
          </CardTitle>
          <CardDescription>Add these DNS records to your domain provider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ol className="list-inside space-y-2">
                <li>
                  1. Log in to your domain provider and open DNS management for <strong>{domainDetails.domain}</strong>
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
                    <TableCell className="font-mono font-semibold">{record.type}</TableCell>
                    <TableCell className="font-mono text-sm">{record.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-1 text-xs font-mono">{record.value}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(record.value)
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {record.verified ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-600" />
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
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Domain
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete domain?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {domainDetails.domain} from your workspace. This action cannot be undone.
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
  )
}
