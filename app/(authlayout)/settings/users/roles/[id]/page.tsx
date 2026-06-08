"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetRoleById, useUpdateRole, AdminAccess } from "@/graphql/actions";
import { RoleCreationForm } from "@/components/settings/rebac/role-creation-form";
import { useToast } from "@/hooks/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { ApolloError } from "@apollo/client";
import { Loader2 } from "lucide-react";

const EditRolePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();

  const { data, loading: fetching } = useGetRoleById(id);

  const [updateRole, { loading }] = useUpdateRole({
    onCompleted: () => {
      toast({ title: "Role updated successfully" });
      router.push("/settings/users/roles");
    },
    onError: (err: ApolloError) => {
      toast({
        title: "Failed to update role",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    updateRole({
      variables: {
        input: {
          id: id,
          name: values.name,
          description: values.description,
          adminAccess: values.adminAccess as Partial<AdminAccess>,
          modulePermissions: values.modulePermissions,
        },
      },
    });
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

  const role = data?.getRoleById;

  if (!role) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Role not found.
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <RoleCreationForm
        initialValues={role}
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default withModulePermission(EditRolePage, "ADMIN_USERS", "canEdit");
