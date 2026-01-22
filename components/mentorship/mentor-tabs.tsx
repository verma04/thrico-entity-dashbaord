import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  CheckCircle,
  FolderTree,
  Settings,
  UserCheck,
} from "lucide-react";
import { Mentor } from "@/types/mentor-types";
import { MentorList } from "./mentor-list";
import { MentorSettings } from "./mentor-settings";
import { CategoryManager } from "@/components/wall-of-fame/category-manager";

interface MentorTabsProps {
  adminCount: number;
  userCount: number;
  onEdit: (mentor: Mentor) => void;
  onCreate: () => void;
  filtersComponent: React.ReactNode;
}

export function MentorTabs({
  adminCount,
  userCount,
  onEdit,
  onCreate,
  filtersComponent,
}: MentorTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6 flex-wrap h-auto">
        <TabsTrigger value="all" className="gap-2">
          <Users className="h-4 w-4" />
          All Mentors
        </TabsTrigger>
        <TabsTrigger value="admin" className="gap-2">
          <CheckCircle className="h-4 w-4" />
          Admin Mentors
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-muted">
            {adminCount}
          </span>
        </TabsTrigger>
        <TabsTrigger value="user" className="gap-2">
          <UserCheck className="h-4 w-4" />
          User Requests
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-muted">
            {userCount}
          </span>
        </TabsTrigger>
        <TabsTrigger value="categories" className="gap-2">
          <FolderTree className="h-4 w-4" />
          Categories
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </TabsTrigger>
      </TabsList>

      {/* All Mentors Tab */}
      <TabsContent value="all" className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Mentor
          </Button>
        </div>

        {filtersComponent}

        <MentorList onEdit={onEdit} />
      </TabsContent>

      {/* Admin Mentors Tab */}
      <TabsContent value="admin" className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Mentor
          </Button>
        </div>
        <MentorList onEdit={onEdit} />
      </TabsContent>

      {/* User Requests Tab */}
      <TabsContent value="user" className="space-y-6">
        <MentorList onEdit={onEdit} />
      </TabsContent>

      {/* Categories Tab */}
      <TabsContent value="categories">
        <CategoryManager />
      </TabsContent>

      {/* Settings Tab */}
      <TabsContent value="settings">
        <MentorSettings />
      </TabsContent>
    </Tabs>
  );
}
