"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Globe,
  DollarSign,
  Users,
  Eye,
  Calendar,
  CheckCircle,
  ThumbsDown,
  Undo,
  Shield,
  XCircle,
  Star,
} from "lucide-react";
import React, { useState } from "react";
import moment from "moment";
import { Job } from "../../graphql/actions/jobs";

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { variant: any; icon: any }> = {
    PUBLISHED: {
      variant: "default",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    PENDING: {
      variant: "secondary",
      icon: <Clock className="w-3 h-3" />,
    },
    REJECTED: {
      variant: "destructive",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {status}
    </Badge>
  );
};

const getVerificationBadge = (isVerified: boolean) => {
  return isVerified ? (
    <Badge variant="default" className="gap-1">
      <Shield className="w-3 h-3" />
      Verified
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1">
      <XCircle className="w-3 h-3" />
      Unverified
    </Badge>
  );
};

const Details = ({
  job,
  isDrawerOpen,
  setIsDrawerOpen,
  handleAction,
}: {
  job: Job | null;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  handleAction: (
    action:
      | "APPROVE"
      | "DISABLE"
      | "ENABLE"
      | "UNBLOCK"
      | "REJECT"
      | "FLAG"
      | "VERIFY"
      | "UNVERIFY"
      | "REAPPROVE",
    listing: Job | null
  ) => void;
}) => {
  const [activeTab, setActiveTab] = useState("description");

  if (!job) return null;

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Job Details</SheetTitle>
          <SheetDescription>
            View and manage job posting details
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Header Section */}
          <div className="flex gap-4">
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarImage
                src={`https://cdn.thrico.network/${job.company?.logo}`}
                alt={job.company?.name}
              />
              <AvatarFallback className="rounded-lg">
                {job.company?.name?.charAt(0) || "J"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-bold">{job.title}</h2>
              <p className="text-muted-foreground">{job.company?.name}</p>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="capitalize">{job.jobType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span className="capitalize">{job.workplaceType}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                {getStatusBadge(job.status)}
                {getVerificationBadge(job.verification?.isVerified || false)}
                {job.experienceLevel && <Badge variant="outline">{job.experienceLevel}</Badge>}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{job.numberOfApplicant || 0}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Eye className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">--</p>
                <p className="text-sm text-muted-foreground">Views</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">
                  {moment(job.createdAt).fromNow(true)}
                </p>
                <p className="text-sm text-muted-foreground">Posted</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4 mt-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="mt-4">
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="responsibilities" className="mt-4">
              <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
              <ul className="space-y-2">
                {job.responsibilities?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="benefits" className="mt-4">
              <h3 className="text-lg font-semibold mb-3">Benefits & Perks</h3>
              <ul className="space-y-2">
                {job.benefits?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Star className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            {job?.status === "PENDING" && (
              <>
                <Button onClick={() => handleAction("APPROVE", job)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleAction("REJECT", job)}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}

            {job?.status === "REJECTED" && (
              <Button onClick={() => handleAction("REAPPROVE", job)}>
                <Undo className="mr-2 h-4 w-4" />
                Re-approve
              </Button>
            )}

            {job?.status === "APPROVED" && (
              <>
                {job?.verification?.isVerified ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleAction("UNVERIFY", job)}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Remove Verification
                  </Button>
                ) : (
                  <Button onClick={() => handleAction("VERIFY", job)}>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Job
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleAction("DISABLE", job)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Disable
                </Button>
              </>
            )}

            {job?.status === "DISABLED" && (
              <Button onClick={() => handleAction("ENABLE", job)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Enable
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Details;
