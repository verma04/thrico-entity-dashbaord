"use client";

import React, { use } from "react";
import { useAdminOpportunityById } from "@/graphql/actions/opportunities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { Skeleton } from "@/components/ui/skeleton";

const OpportunityManagePage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const router = useRouter();
  const { id } = use(params);

  const { data, loading } = useAdminOpportunityById(id, {
    fetchPolicy: "network-only",
  });

  const opportunity = data?.adminGetOpportunityById;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Opportunity not found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Manage Opportunity</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <Target className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <AdminStatusBadge status={opportunity.status} />
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 border-emerald-200">
                    {opportunity.category?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {opportunity.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Posted {moment(opportunity.createdAt).format("MMM DD, YYYY")}
                </span>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold mb-2">Creator</h4>
                {opportunity.creator ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        opportunity.creator.avatar?.startsWith("http")
                          ? opportunity.creator.avatar
                          : `https://cdn.thrico.network/${opportunity.creator.avatar}`
                      }
                      className="h-8 w-8 rounded-full bg-muted object-cover"
                      alt=""
                    />
                    <div className="text-sm">
                      <p className="font-medium">
                        {opportunity.creator.firstName}{" "}
                        {opportunity.creator.lastName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Entity</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OpportunityManagePage;
