"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_SUPPORT_TICKET } from "@/graphql/quries/trust-center";
import { useToast } from "@/components/ui/use-toast";
import { CreateTicketForm } from "@/components/trust-center/create-ticket-form";
import { ShieldCheck } from "lucide-react";

export default function CreateBroadcastPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [createTicketMutation, { loading: ticketLoading }] = useMutation(CREATE_SUPPORT_TICKET);

  const handleCreateTicket = async (
    subject: string,
    category: any,
    subCategory: string | undefined,
    description: string,
    targetUserId?: string,
    targetUserIds?: string[],
    allowReplies: boolean = true
  ) => {
    try {
      const isMultiple = targetUserIds && targetUserIds.length > 0;

      await createTicketMutation({
        variables: {
          input: {
            subject,
            description,
            category: category.toUpperCase().replace(" ", "_"),
            subCategory: subCategory ? subCategory.toUpperCase().replace(" ", "_") : null,
            recipientType: isMultiple ? "MULTIPLE" : "ONE",
            allowReplies,
            targetUserId: isMultiple ? undefined : targetUserId,
            targetUserIds: isMultiple ? targetUserIds : undefined,
          }
        }
      });
      toast({
        title: "Success",
        description: isMultiple
          ? `Message sent to ${targetUserIds.length} users successfully!`
          : "Message created successfully!",
      });
      router.push("/trust-center/member");
    } catch (e: any) {
      console.error("Failed to create:", e);
      toast({
        title: "Error",
        description: e.message || "Failed to create message",
        variant: "destructive",
      });
    }
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="h-full overflow-hidden">
      <CreateTicketForm
        onCancel={onCancel}
        onCreateTicket={handleCreateTicket}
        loading={ticketLoading}
      />
    </div>
  );
}
