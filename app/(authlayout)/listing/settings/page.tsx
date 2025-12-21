"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [autoApproval, setAutoApproval] = useState(false);
  const [allowNewListings, setAllowNewListings] = useState(true);
  const [termsEnabled, setTermsEnabled] = useState(true);
  const [listingApprovalMode, setListingApprovalMode] = useState("manual");
  const [trustedSellerThreshold, setTrustedSellerThreshold] = useState(5);
  const [maxImagesPerListing, setMaxImagesPerListing] = useState(10);
  const [defaultListingDuration, setDefaultListingDuration] = useState(30);
  const [featuredListingCriteria, setFeaturedListingCriteria] =
    useState("manual");
  const [trendingViewThreshold, setTrendingViewThreshold] = useState(1000);
  const [trendingLikesThreshold, setTrendingLikesThreshold] = useState(50);
  const [termsContent, setTermsContent] = useState("");

  const handleGeneralSettingsSave = () => {
    // In a real app, call API to save settings
    console.log("Saving general settings");
    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
  };

  const handleTermsSave = () => {
    // In a real app, call API to save terms
    console.log("Saving terms");
    toast({
      title: "Success",
      description: "Terms & Conditions updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Marketplace Settings</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Listing Approval</h3>
                <Separator className="mb-4" />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-approval"
                      checked={autoApproval}
                      onCheckedChange={setAutoApproval}
                    />
                    <Label htmlFor="auto-approval">
                      Auto-Approve New Listings
                    </Label>
                  </div>

                  {autoApproval && (
                    <>
                      <div className="space-y-2">
                        <Label>Auto-Approval Mode</Label>
                        <RadioGroup
                          value={listingApprovalMode}
                          onValueChange={setListingApprovalMode}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <Label htmlFor="all">All Listings</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="trusted" id="trusted" />
                            <Label htmlFor="trusted">
                              Trusted Sellers Only
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="conditional"
                              id="conditional"
                            />
                            <Label htmlFor="conditional">
                              Based on Conditions
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {listingApprovalMode === "trusted" && (
                        <div className="space-y-2">
                          <Label htmlFor="trusted-threshold">
                            Trusted Seller Threshold (minimum listings)
                          </Label>
                          <Input
                            id="trusted-threshold"
                            type="number"
                            min={1}
                            max={100}
                            value={trustedSellerThreshold}
                            onChange={(e) =>
                              setTrustedSellerThreshold(
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allow-new-listings"
                      checked={allowNewListings}
                      onCheckedChange={setAllowNewListings}
                    />
                    <Label htmlFor="allow-new-listings">
                      Allow New Listings
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      (Turn off temporarily if you need to pause new listings)
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-images">
                      Maximum Images Per Listing
                    </Label>
                    <Input
                      id="max-images"
                      type="number"
                      min={1}
                      max={20}
                      value={maxImagesPerListing}
                      onChange={(e) =>
                        setMaxImagesPerListing(parseInt(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-duration">
                      Default Listing Duration (days)
                    </Label>
                    <Input
                      id="default-duration"
                      type="number"
                      min={1}
                      max={365}
                      value={defaultListingDuration}
                      onChange={(e) =>
                        setDefaultListingDuration(parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Featured & Trending Listings
                </h3>
                <Separator className="mb-4" />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="featured-criteria">
                      Featured Listing Selection
                    </Label>
                    <Select
                      value={featuredListingCriteria}
                      onValueChange={setFeaturedListingCriteria}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">
                          Manual Selection Only
                        </SelectItem>
                        <SelectItem value="automatic">
                          Automatic Based on Performance
                        </SelectItem>
                        <SelectItem value="hybrid">
                          Hybrid (Manual + Automatic)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trending-views">
                      Trending View Threshold
                    </Label>
                    <Input
                      id="trending-views"
                      type="number"
                      min={100}
                      step={100}
                      value={trendingViewThreshold}
                      onChange={(e) =>
                        setTrendingViewThreshold(parseInt(e.target.value))
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Minimum views required to be considered trending
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trending-likes">
                      Trending Likes Threshold
                    </Label>
                    <Input
                      id="trending-likes"
                      type="number"
                      min={10}
                      step={10}
                      value={trendingLikesThreshold}
                      onChange={(e) =>
                        setTrendingLikesThreshold(parseInt(e.target.value))
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Minimum likes required to be considered trending
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleGeneralSettingsSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="terms-enabled"
                  checked={termsEnabled}
                  onCheckedChange={setTermsEnabled}
                />
                <Label htmlFor="terms-enabled">
                  Enable Terms & Conditions
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms-content">
                  Terms & Conditions Content
                </Label>
                <Textarea
                  id="terms-content"
                  value={termsContent}
                  onChange={(e) => setTermsContent(e.target.value)}
                  rows={15}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTermsSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Terms
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
