"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, AlertCircle } from "lucide-react";
import { GetCurrency } from "../../../screen/Currency";

const Preview = ({ values, fileList }: any) => {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <p className="text-sm text-muted-foreground">
          See how your listing will appear to buyers
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Display */}
        <div className="space-y-3">
          {fileList?.length > 0 ? (
            <img
              src={fileList[0].thumbUrl}
              alt="Preview"
              className="w-full h-52 object-cover rounded-lg"
            />
          ) : (
            <div className="bg-muted h-52 rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Image Placeholder</p>
            </div>
          )}

          {fileList?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {fileList.map((file: any) => (
                <div key={file.uid} className="flex-shrink-0">
                  <img
                    src={file.thumbUrl}
                    alt="Thumbnail"
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listing Details */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{values?.title}</h3>
          <p className="text-3xl font-bold text-green-600">
            ${GetCurrency} {values?.price || "Price not set"}
          </p>
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending Verification
          </Badge>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-2">
          <h4 className="font-semibold">Description</h4>
          <p className="text-muted-foreground">
            {values?.description || "No description provided."}
          </p>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <h4 className="font-semibold">Location</h4>
          <p className="text-destructive flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {values?.location?.name || "Location not specified"}
          </p>
        </div>

        <Separator />

        {/* Seller Info */}
        <div className="space-y-3">
          <h4 className="font-semibold">Seller Information</h4>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>YN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Your Name</p>
              <p className="text-sm text-muted-foreground">Member since 2024</p>
            </div>
          </div>
        </div>

        <Button className="w-full" disabled>
          Contact Seller
        </Button>
      </CardContent>
    </Card>
  );
};

export default Preview;
