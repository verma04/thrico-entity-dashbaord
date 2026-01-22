"use client";

import React, { useState } from "react";
import { UserList } from "./user-list";
import { useGetAllUser } from "@/graphql/actions/membership/membership-queries";
import TableLoading from "@/components/layout/table-loading";
import { MembersListCards } from "../dashboard/members-listcards";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List as ListIcon, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

const User = ({ status }: any) => {
  const [view, setView] = useState<"grid" | "table">("table");

  const { data, loading } = useGetAllUser({ status });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          icon={Users}
          title={
            status === "ALL"
              ? "All Members"
              : `${status.charAt(0) + status.slice(1).toLowerCase()} Members`
          }
          description={
            loading
              ? "Loading members..."
              : `Managed ${data?.getAllUser?.length || 0} community members.`
          }
        />
        {/* <div>
          <h2 className="text-xl font-bold tracking-tight">
            {status === "ALL"
              ? "All Members"
              : `${status.charAt(0) + status.slice(1).toLowerCase()} Members`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Loading members..."
              : `Managed ${data?.getAllUser?.length || 0} community members.`}
          </p>
        </div> */}

        <Tabs
          value={view}
          onValueChange={(val) => setView(val as "grid" | "table")}
          className="w-[120px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid" className="h-8">
              <LayoutGrid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="table" className="h-8">
              <ListIcon className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <TableLoading />
      ) : (
        <div className="transition-all duration-300">
          {view === "grid" ? (
            <MembersListCards manualData={data?.getAllUser || []} />
          ) : (
            <UserList users={data?.getAllUser || []} />
          )}
        </div>
      )}
    </div>
  );
};

export default User;
