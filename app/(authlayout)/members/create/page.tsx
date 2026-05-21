"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MemberCreationForm } from "@/components/members/add/member-creation-form";
import { useToast } from "@/components/ui/use-toast";

import { useAddNewMember } from "@/graphql/actions/membership/membership-mutations";

const AddMemberPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [addMember, { loading }] = useAddNewMember({
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Member added successfully to the community!",
      });
      router.push("/members"); // or the actual members list route
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    }
  });

  const onFinish = (values: any) => {
    // Map Formik values to the expected AddNewMemberInput structure
    const input = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      headline: values.headline,
      about: values.about,
      DOB: values.dob,
      avatar: values.avatar,
      industryIds: values.industryIds,
      jobFunctionIds: values.jobFunctionIds,
      skillIds: values.skillIds,
      skills: values.skills,
      interestIds: values.interestIds,
    };

    addMember({ variables: { input } });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="h-full overflow-hidden bg-white">
      <MemberCreationForm
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default AddMemberPage;
