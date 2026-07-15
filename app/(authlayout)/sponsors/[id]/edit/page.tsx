"use client";

import React from "react";
import SponsorForm from "@/components/sponsors/sponsor-form";
import { useGetSponsor } from "@/graphql/actions/sponsors";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export default function EditSponsorPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, loading, error } = useGetSponsor(id);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <PageHeader icon={Pencil} title="Edit Sponsor" description="Loading..." />
        <Skeleton className="h-[400px] w-full max-w-2xl mt-6 rounded-xl" />
      </div>
    );
  }

  if (error || !data?.getSponsor) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <PageHeader icon={Pencil} title="Edit Sponsor" description="Failed to load sponsor." />
        <div className="mt-6 text-red-500">Failed to load sponsor.</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <SponsorForm isEdit={true} initialData={data.getSponsor} />
    </div>
  );
}
