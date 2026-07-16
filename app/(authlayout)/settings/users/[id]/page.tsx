"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetAdminById, useUpdateAdminUser, useUpdateAdminUserRole } from "@/graphql/actions";
import { UserCreationForm } from "@/components/settings/rebac/user-creation-form";
import { useToast } from "@/hooks/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { ApolloError } from "@apollo/client";
import { Loader2 } from "lucide-react";

const EditUserPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();

  const { data, loading: fetching } = useGetAdminById(id);

  const [updateAdmin, { loading: updatingAdmin }] = useUpdateAdminUser({
    onCompleted: () => {
      toast({
        title: "Member updated",
        description: "The member details have been updated.",
      });
      router.push("/settings/users");
    },
    onError: (err: ApolloError) => {
      toast({
        title: "Failed to update member",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    updateAdmin({
      variables: {
        adminId: id,
        input: {
          firstName: values.firstName,
          lastName: values.lastName,
          // Note: email is not updatable here based on backend implementation
        },
      },
    });
    // Note: Role updates might need to be handled separately if the form allows it, 
    // but the UserCreationForm for edit mode shows a message to update role from the table.
  };

  const onCancel = () => {
    router.back();
  };

  if (fetching) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const user = data?.getAdminById;

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Member not found.
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <UserCreationForm
        initialValues={user}
        loading={updatingAdmin}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default withModulePermission(EditUserPage, "ADMIN_USERS", "canEdit");
