"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { MemberCreationForm } from "@/components/members/add/member-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { useGetUserDetailsById, useUpdateMember } from "@/graphql/actions";
import { UserDetailsSkeleton } from "@/components/members/details/detail-states";

const EditMemberPage = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const { data, loading: queryLoading } = useGetUserDetailsById({
    variables: { input: { id } },
    skip: !id,
  });

  const [updateMember, { loading: mutationLoading }] = useUpdateMember({
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Member details updated successfully!",
      });
      router.push(`/members/${id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update member",
        variant: "destructive",
      });
    },
  });

  const member = data?.getUserDetailsById;
  const user = member?.user;

  if (queryLoading) return <UserDetailsSkeleton />;
  if (!member) return <div>Member not found</div>;

  const initialValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    headline: user.about?.headline || "",
    about: user.about?.about || "",
    dob: user.profile?.DOB ? new Date(user.profile.DOB) : null,
    industryIds: member.industries?.map((i: any) => i.id) || [],
    jobFunctionIds: member.jobFunctions?.map((jf: any) => jf.id) || [],
    skillIds: member.skills?.map((s: any) => s.id) || [],
    skills: member.skills?.filter((s: any) => s.category) || [],
    interestIds: member.interests?.map((i: any) => i.id) || [],
    membershipTierId: member.membershipTier?.id || null,
    avatar: user.avatar || null,
  };

  const onFinish = (values: any) => {
    const input = {
      id,
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
      membershipTierId: values.membershipTierId,
    };

    updateMember({ variables: { input } });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="h-full overflow-hidden bg-background">
      <MemberCreationForm
        initialValues={initialValues}
        loading={mutationLoading}
        onFinish={onFinish}
        onCancel={onCancel}
        isEdit={true}
      />
    </div>
  );
};

export default EditMemberPage;
