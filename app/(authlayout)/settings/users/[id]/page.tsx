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
        description: "The member details have been updated successfully.",
      });
      router.push("/settings/users/all");
    },
    onError: (err: ApolloError) => {
      toast({
        title: "Failed to update member",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const [updateRole] = useUpdateAdminUserRole();

  const onFinish = async (values: any) => {
    try {
      if (values.role && values.role !== data?.getAdminById?.role?.id) {
        await updateRole({
          variables: {
            adminId: id,
            roleId: values.role,
          },
        });
      }

      await updateAdmin({
        variables: {
          adminId: id,
          input: {
            firstName: values.firstName,
            lastName: values.lastName,
          },
        },
      });
    } catch (err: any) {
      // Error handled by Apollo error callbacks
    }
  };

  const onCancel = () => {
    router.push("/settings/users/all");
  };

  if (fetching) {
    return (
      <div className="flex h-[calc(100vh-140px)] w-full items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const user = data?.getAdminById;

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-140px)] w-full items-center justify-center flex-col gap-2 text-muted-foreground">
        <p className="text-sm font-medium">Member not found.</p>
        <button
          onClick={() => router.push("/settings/users/all")}
          className="text-xs text-primary underline hover:opacity-80"
        >
          Return to Members
        </button>
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
