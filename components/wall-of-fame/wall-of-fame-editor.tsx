"use client";

import React, { useState } from "react";
import {
  useAddToWallOfFame,
  useUpdateWallOfFame,
  useGetWallOfFameCategories,
} from "@/graphql/wall-of-fame";
import { useSearchUserByName } from "@/graphql/actions/mentorship/mentorship-actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notify } from "@/lib/notify";
import { Save, Trophy, Search, User, Check, X, Loader2, Calendar, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";

interface WallOfFameEditorProps {
  entry?: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefetch?: () => void;
}

const wallOfFameSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  achievement: Yup.string()
    .required("Achievement is required")
    .min(10, "Achievement description must be at least 10 characters"),
  year: Yup.string().required("Year is required"),
  categoryId: Yup.string().required("Category is required"),
});

export const WallOfFameEditor: React.FC<WallOfFameEditorProps> = ({
  entry,
  open,
  onOpenChange,
}) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUser, { data: searchData, loading: searching }] = useSearchUserByName();
  const { data: categoriesData } = useGetWallOfFameCategories();
  const [addEntry, { loading: adding }] = useAddToWallOfFame();
  const [updateEntry, { loading: updating }] = useUpdateWallOfFame();

  const categories = categoriesData?.getWallOfFameCategories || [];

  const formik = useFormik({
    initialValues: {
      title: entry?.title || "",
      achievement: entry?.achievement || "",
      year: entry?.year || new Date().getFullYear().toString(),
      categoryId: entry?.category?.id || "",
      recognitionDate: entry?.recognitionDate ? new Date(entry.recognitionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      order: entry?.order || 0,
    },
    validationSchema: wallOfFameSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (entry) {
          await updateEntry({
            variables: {
              updateWallOfFameId: entry.id,
              input: {
                ...values,
                userId: entry.user.id, // Keep original user
              }
            }
          });
          notify.success("Legacy record updated successfully");
        } else {
          if (!selectedUser) {
            notify.error("Please select a user to induct");
            return;
          }
          await addEntry({
            variables: {
              input: {
                ...values,
                userId: selectedUser.id,
              }
            }
          });
          notify.success("New achievement node registered");
        }
        onOpenChange(false);
      } catch (error: any) {
        notify.error(error.message || "Protocol synchronization failed");
      }
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 2) {
      searchUser({ variables: { name: value } });
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setSearchQuery("");
  };

  const handleClose = () => {
    formik.resetForm();
    setSelectedUser(null);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 border-l border-slate-200">
        <div className="h-full flex flex-col bg-slate-50/30">
          <SheetHeader className="p-8 bg-white border-b border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                <Trophy size={20} />
              </div>
              <div>
                <SheetTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {entry ? "Update Protocol" : "New Induction"}
                </SheetTitle>
                <SheetDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Registry Node Modulation & Achievement Logging
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <form onSubmit={formik.handleSubmit} className="flex-1 p-8 space-y-8">
            {/* User Selection (Only for New Induction) */}
            {!entry && (
              <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Search size={14} className="text-indigo-500" />
                  Step 1: Locate Achievement Node
                </Label>
                
                {selectedUser ? (
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100 ring-4 ring-emerald-500/5 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        {selectedUser.user?.avatar ? (
                          <img src={selectedUser.user.avatar} className="h-full w-full object-cover" alt="" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-300">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {selectedUser.user?.firstName} {selectedUser.user?.lastName}
                        </h4>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Selected Member</p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedUser(null)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="SEARCH MEMBERS BY NAME..."
                        className="h-12 pl-11 rounded-xl border-slate-200 bg-white font-bold text-xs uppercase tracking-widest"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                      {searching && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {searchData?.searchUserByName?.map((user: any) => (
                        <button
                          key={user.id}
                          type="button"
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group"
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="flex items-center gap-3">
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={user.user?.avatar} />
                                <AvatarFallback className="text-[10px] font-bold uppercase">{user.user?.firstName[0]}</AvatarFallback>
                             </Avatar>
                             <div>
                               <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                 {user.user?.firstName} {user.user?.lastName}
                               </p>
                               <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{user.user?.email}</p>
                             </div>
                          </div>
                          <Check size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Induction Details */}
            <div className="space-y-6">
              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Award size={14} className="text-indigo-500" />
                Step 2: Achievement Metadata
              </Label>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[10px] font-black text-slate-900 uppercase">Recognition Title</Label>
                  <Input
                    id="title"
                    {...formik.getFieldProps("title")}
                    placeholder="E.G. LIFETIME ACHIEVEMENT AWARD"
                    className="h-12 rounded-xl border-slate-200 bg-white font-bold text-xs uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{formik.errors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId" className="text-[10px] font-black text-slate-900 uppercase">Taxonomy Node</Label>
                    <Select
                      value={formik.values.categoryId}
                      onValueChange={(value) => formik.setFieldValue("categoryId", value)}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold text-xs uppercase tracking-widest">
                        <SelectValue placeholder="SELECT CATEGORY" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-2xl">
                        {categories.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id} className="font-bold text-[10px] uppercase tracking-widest py-3">
                            {cat.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-[10px] font-black text-slate-900 uppercase">Legacy Year</Label>
                    <Input
                      id="year"
                      {...formik.getFieldProps("year")}
                      placeholder="E.G. 2024"
                      className="h-12 rounded-xl border-slate-200 bg-white font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievement" className="text-[10px] font-black text-slate-900 uppercase">Core Achievement</Label>
                  <Textarea
                    id="achievement"
                    {...formik.getFieldProps("achievement")}
                    rows={4}
                    placeholder="DESCRIBE THE INDUCTEE'S IMPACT AND CONTRIBUTIONS..."
                    className="rounded-2xl border-slate-200 bg-white font-bold text-xs uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none p-4"
                  />
                  {formik.touched.achievement && formik.errors.achievement && (
                    <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{formik.errors.achievement}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recognitionDate" className="text-[10px] font-black text-slate-900 uppercase">Protocol Date</Label>
                    <Input
                      id="recognitionDate"
                      type="date"
                      {...formik.getFieldProps("recognitionDate")}
                      className="h-12 rounded-xl border-slate-200 bg-white font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-[10px] font-black text-slate-900 uppercase">Registry Priority</Label>
                    <Input
                      id="order"
                      type="number"
                      {...formik.getFieldProps("order")}
                      className="h-12 rounded-xl border-slate-200 bg-white font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

          <SheetFooter className="p-8 bg-white border-t border-slate-100 flex-row gap-4 items-center justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleClose}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
            >
              Abort Protocol
            </Button>
            <Button 
              type="submit" 
              disabled={!formik.isValid || adding || updating} 
              onClick={() => formik.handleSubmit()}
              className="h-12 px-8 rounded-xl bg-slate-900 font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl hover:bg-black transition-all"
            >
              {adding || updating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {entry ? "Sync Manifest" : "Register Node"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
