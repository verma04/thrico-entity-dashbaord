"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCreationForm } from "./listing-creation-form";
import { ListingPreview } from "./listing-preview";
import { useAddListing } from "@/graphql/actions/listing";

export function CreateListingDialog() {
  const [open, setOpen] = useState(false);

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
  const [add, { loading }] = useAddListing({
    onCompleted: (data) => {
      setOpen(false);
    },
  });

  const [activeTab, setActiveTab] = useState("form");
  const [formData, setFormData] = useState<any>(null);

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    setActiveTab("preview");
  };

  const handlePreviewSubmit = () => {
    add({ variables: { input: formData } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button onClick={() => onOpenChange(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create Listing
      </Button>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new marketplace listing
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Details</TabsTrigger>
            <TabsTrigger value="preview" disabled={!formData}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4">
            <ListingCreationForm onSubmit={handleFormSubmit} />
          </TabsContent>

          <TabsContent value="preview">
            {formData && (
              <div className="space-y-4">
                <ListingPreview data={formData} />
                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("form")}
                  >
                    Back to Edit
                  </Button>
                  <Button onClick={handlePreviewSubmit}>Create Listing</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
