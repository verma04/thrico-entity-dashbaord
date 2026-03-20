"use client";

import React, { useState, useEffect } from "react";
import { useGetUser, useUpdateUserProfile } from "@/graphql/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  FileText, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data, loading: userLoading } = useGetUser();
  const user = data?.getUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [updateProfile, { loading: updating }] = useUpdateUserProfile({
    onCompleted: () => {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    }
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Name fields cannot be empty");
      return;
    }
    
    await updateProfile({
      variables: {
        input: {
          firstName,
          lastName
        }
      }
    });
  };

  const getInitials = (f?: string, l?: string) => {
    return `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase() || "U";
  };

  if (userLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-2">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            {user?.avatar && <AvatarImage src={user.avatar} />}
            <AvatarFallback className="bg-linear-to-br from-primary to-purple-600 text-white text-3xl font-black">
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <UserIcon className="text-white h-6 w-6" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            {user?.firstName} {user?.lastName}
            {user?.status && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] uppercase font-black px-2">
                Active
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" /> {user?.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Role Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> System Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Current Role</Label>
                <div className="flex items-center gap-2">
                   <Badge className="bg-primary/10 text-primary border-primary/20 font-black px-3">
                    {user?.role?.name || "Member"}
                  </Badge>
                  {user?.role?.isSystem && (
                    <Badge variant="outline" className="text-[10px] font-bold border-blue-500/30 text-blue-500">System</Badge>
                  )}
                </div>
              </div>

              {user?.role?.description && (
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Role Capacity</Label>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                    {user?.role?.description}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-border/40 space-y-3">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-bold">Account ID</span>
                    <span className="font-mono text-muted-foreground/60">{user?.id?.substring(0, 12)}...</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-bold">Permissions</span>
                    <span className="text-primary font-black">Active</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Profile */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <FileText className="h-5 w-5 text-primary" /> Profile Settings
                </CardTitle>
                <CardDescription>
                  Update your personal information visible across the dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-bold">First Name</Label>
                    <Input 
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      className="bg-muted/30 focus-visible:ring-primary/30 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-bold">Last Name</Label>
                    <Input 
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="bg-muted/30 focus-visible:ring-primary/30 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 opacity-60">
                  <Label className="font-bold">Email Address</Label>
                  <Input 
                    value={user?.email || ""}
                    disabled
                    className="bg-muted cursor-not-allowed font-medium"
                  />
                  <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Email cannot be changed here. Contact support for changes.
                  </p>
                </div>
              </CardContent>
              <div className="p-6 pt-0 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updating || (firstName === user?.firstName && lastName === user?.lastName)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 shadow-lg shadow-primary/20"
                >
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>

          {/* Security Banner or Note */}
          <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
            <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-black text-blue-700 uppercase tracking-wider">Account Security</h4>
              <p className="text-xs text-blue-600/80 font-medium leading-relaxed">
                Your profile information is protected. Changes to your name will be reflected across audit logs and collaborator views.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
