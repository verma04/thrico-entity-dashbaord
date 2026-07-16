"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TermsAndConditions = () => {
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);
  const [termsEnabled, setTermsEnabled] = useState(true);
  const [termsContent, setTermsContent] = useState(`# Marketplace Terms and Conditions

## 1. Introduction

Welcome to our Marketplace. These Terms and Conditions govern your use of our platform and services.

## 2. Listing Guidelines

### 2.1 Prohibited Items
The following items are prohibited from being listed on our marketplace:
- Illegal items or services
- Counterfeit goods
- Dangerous or hazardous materials
- Items that infringe on intellectual property rights
- Adult content or services

### 2.2 Listing Requirements
All listings must:
- Include accurate descriptions
- Use appropriate categories
- Show clear images of the actual item
- Include all relevant details about condition, dimensions, etc.
- Specify shipping options and costs

## 3. User Conduct

Users must:
- Provide accurate information
- Communicate respectfully with other users
- Honor commitments to buy or sell
- Not engage in price manipulation or fraudulent activities

## 4. Fees and Payments

- Listing fees may apply depending on the category
- Commission fees are charged on successful sales
- Payment processing fees may apply
- All fees are non-refundable unless otherwise stated

## 5. Dispute Resolution

- Users should attempt to resolve disputes directly
- Our platform provides mediation services for unresolved disputes
- We reserve the right to make final decisions on disputes

## 6. Termination

We reserve the right to terminate or suspend accounts that violate these terms.

## 7. Changes to Terms

We may update these terms from time to time. Users will be notified of significant changes.

## 8. Contact Information

For questions about these terms, please contact support@marketplace.com`);

  const handleSave = () => {
    // In a real app, call API to save terms
    console.log("Saving terms:", { termsEnabled, termsContent });
    toast({
      title: "Success",
      description: "Terms & Conditions updated successfully",
    });
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Terms & Conditions Management</h1>

      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit Terms</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="terms-enabled"
                  checked={termsEnabled}
                  onCheckedChange={setTermsEnabled}
                />
                <Label htmlFor="terms-enabled">Enable Terms & Conditions</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms-content">Terms & Conditions Content</Label>
                <Textarea
                  id="terms-content"
                  value={termsContent}
                  onChange={(e) => setTermsContent(e.target.value)}
                  rows={20}
                  className="font-mono"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Terms
                </Button>
                <Button variant="outline" onClick={togglePreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? "Edit Mode" : "Preview Mode"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: termsContent
                    .replace(/\n/g, "<br>")
                    .replace(/#{1,6}\s?(.*)/g, "<h3>$1</h3>"),
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Revision History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Terms & Conditions revision history will be displayed here.
              </p>
              <Separator className="mb-4" />
              <ul className="space-y-2">
                <li className="text-sm">
                  Version 3.0 - Updated on May 15, 2023 by admin1
                </li>
                <li className="text-sm">
                  Version 2.5 - Updated on February 10, 2023 by admin2
                </li>
                <li className="text-sm">
                  Version 2.0 - Updated on November 5, 2022 by admin1
                </li>
                <li className="text-sm">
                  Version 1.5 - Updated on August 20, 2022 by admin3
                </li>
                <li className="text-sm">
                  Version 1.0 - Created on June 1, 2022 by admin1
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TermsAndConditions;
