import React from "react";
import SponsorForm from "@/components/sponsors/sponsor-form";

export default function CreateSponsorPage() {
  return (
    <div className="h-full overflow-hidden">
      <SponsorForm isEdit={false} />
    </div>
  );
}
