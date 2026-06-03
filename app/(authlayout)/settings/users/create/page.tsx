"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateAdmin } from "@/graphql/actions";
import { UserCreationForm } from "@/components/settings/rebac/user-creation-form";
import { useToast } from "@/hooks/use-toast";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { ApolloError } from "@apollo/client";

const CreateUserPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [createAdmin, { loading }] = useCreateAdmin({
    onCompleted: () => {
      toast({
        title: "Member added",
        description: "The new admin has been invited.",
      });
      router.push("/settings/users");
    },
    onError: (err: ApolloError) => {
      toast({
        title: "Failed to add member",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    createAdmin({
      variables: {
        input: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          roleId: values.role,
          avatar: values.avatar,
        },
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="h-full overflow-hidden">
      <UserCreationForm
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default withModulePermission(CreateUserPage, "ADMIN_USERS", "canCreate");
