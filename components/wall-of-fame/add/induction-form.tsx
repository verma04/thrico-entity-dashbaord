"use client";

import { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { notify } from "@/lib/notify";
import {
  User,
  ChevronRight,
  Search,
  Check,
  X,
  Loader2,
  Trophy,
  Award,
  Calendar,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchUserByName } from "@/graphql/actions/mentorship/mentorship-actions";
import { useGetWallOfFameCategories } from "@/graphql/wall-of-fame";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function InductionForm({ loading, onFinish, onCancel, submitError, onDismissError }: any) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchUser, { data: searchData, loading: searching }] = useSearchUserByName();
  const { data: categoriesData } = useGetWallOfFameCategories();

  const inductionSchema = Yup.object({
    title: Yup.string()
      .required("Recognition title is required")
      .max(100, "Max 100 characters"),
    achievement: Yup.string()
      .required("Core achievement is required")
      .max(500, "Max 500 characters"),
    categoryId: Yup.string().required("Category is required"),
    year: Yup.string().required("Year is required"),
    recognitionDate: Yup.string().required("Recognition date is required"),
    order: Yup.number().min(0, "Order must be 0 or greater"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      achievement: "",
      categoryId: "",
      year: new Date().getFullYear().toString(),
      recognitionDate: new Date().toISOString().split('T')[0],
      order: 0,
    },
    validationSchema: inductionSchema,
    onSubmit: (values) => {
      if (!selectedUser) {
        notify.error("Please select a user to induct first");
        return;
      }
      onFinish({
        ...values,
        userId: selectedUser?.id,
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const categories = categoriesData?.getWallOfFameCategories || [];

  return (
    <FormikProvider value={formik}>
      <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
        {/* Header section - Sticky */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 rounded-xl bg-slate-900 ring-1 ring-slate-900/10">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Induct into Wall of Fame
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 ml-1">
                <span>Wall of Fame</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-900">New Induction</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <Button 
                 variant="ghost" 
                 onClick={onCancel}
                 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900"
               >
                 Abort Protocol
               </Button>
               <Button 
                 onClick={handleSubmit}
                 disabled={loading || !formik.isValid}
                 className="h-10 px-6 rounded-xl bg-slate-900 font-black text-[10px] uppercase tracking-widest text-white shadow-xl hover:bg-black transition-all gap-2"
               >
                 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                 Register Node
               </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-10">
            {/* Error Banner */}
            {submitError && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-rose-50 border border-rose-200 ring-1 ring-rose-100">
                  <div className="shrink-0 mt-0.5">
                    <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-rose-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-rose-900 uppercase tracking-wide mb-1">
                      Synchronization Failed
                    </h4>
                    <p className="text-sm font-medium text-rose-700 leading-relaxed">
                      {submitError}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onDismissError}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-rose-100 text-rose-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                {/* Step 1: User Selection */}
                {!selectedUser ? (
                  <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white transition-all duration-300">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Search className="h-4 w-4 text-slate-900" />
                        <CardTitle className="text-lg font-bold text-slate-800">
                          Step 1: Locate Inductee
                        </CardTitle>
                      </div>
                      <CardDescription className="text-slate-500 font-medium">
                        Search and select a member to recognize in the Wall of Fame
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="Search members by name..."
                          className="h-12 pl-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-slate-500/5 transition-all text-lg font-medium"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                        {searching && (
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-5 w-5 text-slate-900 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {searchData?.searchUserByName?.map((user: any) => (
                          <div
                            key={user?.id}
                            className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/30 hover:shadow-lg hover:shadow-slate-500/5 transition-all cursor-pointer"
                            onClick={() => handleSelectUser(user)}
                          >
                            <div className="flex items-center gap-4">
                               <Avatar className="h-14 w-14 rounded-xl border border-slate-200 shadow-sm">
                                  <AvatarImage src={user.user?.avatar} />
                                  <AvatarFallback className="bg-slate-100 text-slate-400">
                                     <User className="h-6 w-6" />
                                  </AvatarFallback>
                               </Avatar>
                              <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                                  {user?.user?.firstName} {user?.user?.lastName}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                  {user?.user?.email}
                                </p>
                              </div>
                            </div>
                            <div className="h-10 w-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-900 text-white transition-all transform group-hover:scale-110 shadow-lg">
                              <Check className="h-5 w-5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* User Profile Hooked */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-linear-to-r from-slate-800 to-slate-900 rounded-2xl blur-xl opacity-5 group-hover:opacity-10 transition-opacity" />
                      <div className="relative flex items-center justify-between p-6 bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-5">
                           <Avatar className="h-20 w-20 rounded-2xl border-2 border-white shadow-xl rotate-[-2deg] group-hover:rotate-0 transition-transform">
                              <AvatarImage src={selectedUser?.user?.avatar} />
                              <AvatarFallback className="bg-slate-100 text-slate-300">
                                 <User className="h-10 w-10" />
                              </AvatarFallback>
                           </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                                {selectedUser?.user?.firstName}{" "}
                                {selectedUser?.user?.lastName}
                              </h2>
                              <div className="h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white stroke-[3px]" />
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                               <span>{selectedUser?.user?.email}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                          onClick={() => {
                            setSelectedUser(null);
                            // Keep form values but reset user selection
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Change User
                        </Button>
                      </div>
                    </div>

                    {/* Achievement Details */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="h-4 w-4 text-slate-900" />
                          <CardTitle className="text-lg font-bold text-slate-800">
                            Achievement Metadata
                          </CardTitle>
                        </div>
                        <CardDescription className="text-slate-500 font-medium">
                          Define the induction details and core achievements
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-8 space-y-8">
                        <div className="space-y-6">
                           {/* Recognition Title */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="title"
                              className="text-sm font-bold text-slate-700 flex items-center gap-2"
                            >
                              Recognition Title <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                              id="title"
                              name="title"
                              placeholder="e.g. LIFETIME ACHIEVEMENT AWARD"
                              className="h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-slate-500/5 transition-all font-bold uppercase tracking-widest text-xs"
                              value={formik.values.title}
                              onChange={(e) => formik.setFieldValue("title", e.target.value.toUpperCase())}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.title && formik.errors.title && (
                              <p className="text-xs font-semibold text-rose-500 ml-1">
                                {formik.errors.title as string}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div className="space-y-2.5">
                              <Label
                                htmlFor="categoryId"
                                className="text-sm font-bold text-slate-700"
                              >
                                Taxonomy Node <span className="text-rose-500">*</span>
                              </Label>
                              <Select
                                value={formik.values.categoryId}
                                onValueChange={(value) =>
                                  formik.setFieldValue("categoryId", value)
                                }
                              >
                                <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-slate-500/5 transition-all font-bold uppercase tracking-widest text-xs">
                                  <SelectValue placeholder="Select taxonomy" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 shadow-xl overflow-hidden">
                                  {categories.map((cat: any) => (
                                    <SelectItem
                                      key={cat.id}
                                      value={cat.id}
                                      className="py-3 font-bold text-[10px] uppercase tracking-widest"
                                    >
                                      {cat.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {formik.touched.categoryId && formik.errors.categoryId && (
                                <p className="text-xs font-semibold text-rose-500 ml-1">
                                  {formik.errors.categoryId as string}
                                </p>
                              )}
                            </div>

                            {/* Year */}
                            <div className="space-y-2.5">
                              <Label
                                htmlFor="year"
                                className="text-sm font-bold text-slate-700"
                              >
                                Legacy Year <span className="text-rose-500">*</span>
                              </Label>
                              <Input
                                id="year"
                                name="year"
                                placeholder="e.g. 2024"
                                className="h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-slate-500/5 transition-all font-bold uppercase tracking-widest text-xs"
                                value={formik.values.year}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </div>
                          </div>

                          {/* Core Achievement */}
                          <div className="space-y-2.5">
                            <Label
                              htmlFor="achievement"
                              className="text-sm font-bold text-slate-700"
                            >
                              Core Achievement <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                              id="achievement"
                              name="achievement"
                              placeholder="Describe the contribution or achievement..."
                              className="min-h-[120px] rounded-2xl border-slate-200 focus:ring-4 focus:ring-slate-500/5 transition-all resize-none p-4 font-bold uppercase tracking-widest text-xs leading-relaxed"
                              value={formik.values.achievement}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.achievement && formik.errors.achievement && (
                              <p className="text-xs font-semibold text-rose-500 ml-1">
                                {formik.errors.achievement as string}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Recognition Date */}
                            <div className="space-y-2.5">
                              <Label
                                htmlFor="recognitionDate"
                                className="text-sm font-bold text-slate-700 flex items-center gap-2"
                              >
                                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                Protocol Date <span className="text-rose-500">*</span>
                              </Label>
                              <Input
                                id="recognitionDate"
                                name="recognitionDate"
                                type="date"
                                className="h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-slate-500/5 transition-all font-bold uppercase tracking-widest text-xs"
                                value={formik.values.recognitionDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </div>

                            {/* Order */}
                            <div className="space-y-2.5">
                              <Label
                                htmlFor="order"
                                className="text-sm font-bold text-slate-700"
                              >
                                Registry Priority
                              </Label>
                              <Input
                                id="order"
                                name="order"
                                type="number"
                                className="h-12 rounded-xl border-slate-200 focus:ring-4 focus:ring-slate-500/5 transition-all font-bold uppercase tracking-widest text-xs"
                                value={formik.values.order}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-2xl bg-white p-6">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Recognition Guidelines
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 text-xs font-medium text-slate-500 leading-relaxed">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                      Ensure the achievement is verified and documented before induction.
                    </li>
                    <li className="flex gap-3 text-xs font-medium text-slate-500 leading-relaxed">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                      Use clear, concise titles that reflect the level of distinction.
                    </li>
                    <li className="flex gap-3 text-xs font-medium text-slate-500 leading-relaxed">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                      Taxonomy nodes help organize the legacy registry for public display.
                    </li>
                  </ul>
                </Card>

                <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
                   <Trophy className="h-8 w-8 mb-4 text-amber-400" />
                   <h3 className="text-lg font-black uppercase tracking-tight mb-2">Excellence Registry</h3>
                   <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                     Inducting a member into the Wall of Fame creates a permanent node in your ecosystem's legacy graph.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormikProvider>
  );
}
