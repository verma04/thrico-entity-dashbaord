"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, Network } from "lucide-react";
import UsersTab from "./users-tab";
import PersonsTab from "./persons-tab";
import RelationshipsTab from "./relationships-tab";
import RolesTab from "./roles-tab";
import { ShieldAlert } from "lucide-react";

export default function RebacSettings() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users & Persons</h1>
        <p className="text-muted-foreground mt-2">
          Manage users, persons, and relationship-based access control (ReBAC)
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and their relationships with persons and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Define and manage global roles and their module-level
                permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RolesTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="persons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Person Management</CardTitle>
              <CardDescription>
                Manage persons (organizations, teams, groups) and their
                relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonsTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relationship Management</CardTitle>
              <CardDescription>
                Visualize and manage relationships between users, persons, and
                resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RelationshipsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
