"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";
import BillingAddress from "./billing-address";
import { useGetEntity } from "@/graphql/actions";
import { EntityProfileCard } from "./entity-profile-card";
import { EntityLogoUpload } from "./entity-logo-upload";
import { FaviconUpload } from "./favicon-upload";

export default function GeneralSettings() {
  const { data: entityData, loading: entityLoading } = useGetEntity();

  const [communityName, setCommunityName] = useState(
    entityData?.getEntity?.name || "My Page"
  );
  const [communityImage, setCommunityImage] = useState<string>("");
  const [faviconImage, setFaviconImage] = useState<string>("");

  useEffect(() => {
    if (entityData?.getEntity) {
      setCommunityName(entityData.getEntity.name || "My Page");
      setCommunityImage(
        entityData.getEntity.logo
          ? `https://cdn.thrico.network/${entityData.getEntity.logo}`
          : ""
      );
    }
  }, [entityData]);

  const handleNameUpdate = (newName: string) => {
    setCommunityName(newName);
  };

  const handleLogoUpdate = (newUrl: string) => {
    setCommunityImage(newUrl);
  };

  const handleFaviconUpdate = (newUrl: string) => {
    setFaviconImage(newUrl);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Entity Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <EntityProfileCard
            name={communityName}
            image={communityImage}
            onNameUpdate={handleNameUpdate}
          />

          {/* Entity Logo Upload */}
          <EntityLogoUpload
            currentImage={communityImage}
            onImageUpdate={handleLogoUpdate}
          />

          {/* Favicon Upload */}
          <FaviconUpload
            currentImage={faviconImage}
            onImageUpdate={handleFaviconUpdate}
          />

          {/* Billing Address */}
          <BillingAddress />
        </CardContent>
      </Card>
    </div>
  );
}
