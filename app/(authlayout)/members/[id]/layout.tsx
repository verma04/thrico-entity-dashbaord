"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetUserDetailsById } from "@/graphql/actions";

import { MemberDetailHeader } from "@/components/members/details/member-detail-header";
import { MemberDetailNav } from "@/components/members/details/member-detail-nav";
import { UserInfoCard } from "@/components/members/details/user-info-card";
import { MemberProvider } from "@/components/members/details/member-context";
import {
  UserDetailsSkeleton,
  ErrorState,
} from "@/components/members/details/detail-states";

export default function UserDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, loading, error } = useGetUserDetailsById({
    variables: { input: { id } },
    skip: !id,
  });

  const member = data?.getUserDetailsById;
  const user = member?.user;

  if (loading) return <UserDetailsSkeleton />;
  if (error || !member) return <ErrorState onBack={() => router.back()} />;

  return (
    <MemberProvider member={member} user={user}>
      <div className="flex flex-col h-full bg-background overflow-hidden">
        <MemberDetailHeader
          firstName={user.firstName}
          lastName={user.lastName}
          memberId={id}
          status={member.status}
          isOnline={member.isOnline}
          isVerified={member.verification?.isVerified}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar (Left Side) */}
              <div className="lg:col-span-3 self-start sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pb-4">
                <UserInfoCard member={member} />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9">
                <MemberDetailNav />
                <div className="mt-4">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberProvider>
  );
}
