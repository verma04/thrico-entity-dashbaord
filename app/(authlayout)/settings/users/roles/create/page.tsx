"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateRole, AdminAccess } from "@/graphql/actions";
import { RoleCreationForm } from "@/components/settings/rebac/role-creation-form";
import { useToast } from "@/hooks/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { ApolloError } from "@apollo/client";

const CreateRolePage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [createRole, { loading }] = useCreateRole({
    onCompleted: () => {
      toast({ title: "Role created successfully" });
      router.push("/settings/users/roles");
    },
    onError: (err: ApolloError) => {
      toast({
        title: "Failed to create role",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    createRole({
      variables: {
        input: {
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

  return (
    <div className="h-full overflow-hidden">
      <RoleCreationForm
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default withModulePermission(CreateRolePage, "ADMIN_USERS", "canCreate");
