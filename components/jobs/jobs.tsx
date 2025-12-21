"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Calendar, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import moment from "moment";
import { Job } from "../../graphql/actions/jobs";
import Actions from "./action";

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { variant: any; icon: any }> = {
    PUBLISHED: {
      variant: "default",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    DRAFT: {
      variant: "secondary",
      icon: <Clock className="w-3 h-3" />,
    },
    CLOSED: {
      variant: "destructive",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

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
      <CheckCircle className="w-3 h-3" />
      Verified
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1">
      <XCircle className="w-3 h-3" />
      Unverified
    </Badge>
  );
};

export default function Jobs({ data }: { data: Job[] | undefined }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">
            No jobs found matching your criteria
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((job) => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              {/* Left: Job Info */}
              <div className="flex gap-4 flex-1">
                <Avatar className="h-16 w-16 rounded-lg">
                  <AvatarImage
                    src={`https://cdn.thrico.network/${job.company?.logo}`}
                    alt={job.company?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {job.company?.name?.charAt(0) || "J"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {job.workplaceType} • {job.jobType}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company?.name}</span>
                    </div>
                    {job.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{job.numberOfApplicant || 0} applicants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{moment(job.createdAt).format("MMM D, YYYY")}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {getStatusBadge(job.status)}
                    {getVerificationBadge(job.verification?.isVerified || false)}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs text-muted-foreground">
                  Updated {moment(job.updatedAt).fromNow()}
                </p>
                <Actions {...job} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
