"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  LayoutGrid,
  List,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetRewards,
  useUploadVouchers,
} from "@/graphql/actions/rewards";
import { useToast } from "@/hooks/use-toast";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { RewardsGalleryTab } from "@/components/rewards/coupons/rewards-gallery-tab";
import { BatchUploadDialog } from "@/components/rewards/coupons/batch-upload-dialog";
import { cn } from "@/lib/utils";

export default function RewardsGalleryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Batch Upload States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadRewardId, setUploadRewardId] = useState("");
  const [uploadStep, setUploadStep] = useState<"idle" | "validating" | "summary">("idle");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  const [uploadData, setUploadData] = useState<any[]>([]);

  const { toast } = useToast();

  const {
    data: rewardsData,
    loading: rewardsLoading,
    refetch,
  } = useGetRewards({
    pagination: { page: 1, limit: 100 },
  });

  const [uploadVouchers, { loading: uploading }] = useUploadVouchers();

  const rewards = rewardsData?.getRewards || [];

  const filteredRewards = rewards.filter((reward: any) =>
    reward.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setUploadStep("validating");
    
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter(l => l.trim());
        const data = lines.slice(1).map(l => ({ code: l.trim() }));
        
        setUploadData(data);
        setValidCount(data.length);
        setInvalidCount(0);
        setUploadStep("summary");
      };
      reader.readAsText(file);
    }, 1500);
  };

  const downloadTemplate = () => {
    const csvContent = "code\nVOUCHER-123\nVOUCHER-456";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vouchers_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmUpload = async () => {
    if (!uploadRewardId) {
      toast({ title: "Select a reward", variant: "destructive" });
      return;
    }

    try {
      await uploadVouchers({
        variables: {
          rewardId: uploadRewardId,
          vouchers: uploadData,
        },
      });
      toast({ title: "Dynamic Ingestion Successful", description: `${validCount} vouchers have been localized.` });
      resetUpload();
      setIsUploadOpen(false);
      refetch();
    } catch {
      toast({ title: "Ingestion Failure", variant: "destructive" });
    }
  };

  const resetUpload = () => {
    setUploadStep("idle");
    setUploadedFile(null);
    setValidCount(0);
    setUploadData([]);
  };

  const openUploadForReward = (rewardId: string) => {
    setUploadRewardId(rewardId);
    setIsUploadOpen(true);
  };

  return (
    <>
      <EcosystemActionBar
        shadow="none"
        className="bg-background/80 backdrop-blur-xl border-b border-border/40 py-2 sticky top-[112px] z-20"
      >
        <EcosystemActionBar.Group className="flex-1">
          <EcosystemActionBar.Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search within reward collection..."
            className="max-w-md"
          />
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <div className="flex bg-secondary/50 p-1 rounded-xl border border-border/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "h-8 w-8 rounded-lg transition-all",
                  viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-muted-foreground",
                )}
              >
                <LayoutGrid size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-8 w-8 rounded-lg transition-all",
                  viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-muted-foreground",
                )}
              >
                <List size={14} />
              </Button>
            </div>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 rounded-xl border-border bg-card text-muted-foreground hover:text-foreground"
            >
              <RotateCw size={14} className={cn(rewardsLoading ? "animate-spin" : "")} />
            </Button>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Link href="/rewards/coupons/create">
              <Button className="h-9 px-5 rounded-xl gap-2 font-bold shadow-sm">
                <Plus className="h-4 w-4" />
                New Reward
              </Button>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              onClick={() => setIsUploadOpen(true)}
              className="h-9 px-5 rounded-xl border-indigo-200 bg-indigo-50/30 text-indigo-700 font-bold hover:bg-indigo-50"
            >
              Batch Upload
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 pb-20 overflow-visible mt-6">
        <RewardsGalleryTab
          loading={rewardsLoading}
          viewMode={viewMode}
          filteredRewards={filteredRewards}
          searchQuery={searchQuery}
          onManageVouchers={(rewardId) => {
            router.push(`/rewards/coupons/vouchers?rewardId=${rewardId}`);
          }}
          onOpenUploadForReward={openUploadForReward}
        />
      </EcosystemContainer>

      <BatchUploadDialog
        isOpen={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        uploadRewardId={uploadRewardId}
        setUploadRewardId={setUploadRewardId}
        inventoryItems={rewards}
        uploadStep={uploadStep}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
        downloadTemplate={downloadTemplate}
        uploadedFile={uploadedFile}
        validCount={validCount}
        invalidCount={invalidCount}
        resetUpload={resetUpload}
        confirmUpload={confirmUpload}
        uploading={uploading}
      />
    </>
  );
}
