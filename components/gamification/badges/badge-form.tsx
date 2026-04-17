"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Award,
  ChevronRight,
  Info,
  Sparkles,
  Gamepad2,
  Trophy,
  Target,
  Search,
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useToast } from "@/hooks/use-toast";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";

const ICON_CATEGORIES = [
  {
    name: "Success & Achievement",
    icons: ["⭐", "🏆", "🎯", "🎖️", "🏅", "🥇", "🥈", "🥉", "👑", "✨", "🌟", "🎊"],
  },
  {
    name: "Rare & Premium",
    icons: ["💎", "💠", "🔮", "💫", "💍", "⚡", "🔥", "🌈", "🦄", "🍭", "🔱", "⚔️"],
  },
  {
    name: "Growth & Speed",
    icons: ["🚀", "📈", "🆙", "🌱", "🏋️", "💡", "📡", "🛸", "🔋"],
  },
  {
    name: "Social & Community",
    icons: ["🤝", "🌍", "❤️", "🎈", "💬", "📣", "🦋", "🌸", "🍕", "🥂", "🎉"],
  },
];

const badgeSchema = Yup.object().shape({
  name: Yup.string().required("Badge name is required"),
  description: Yup.string().required("Please provide a description"),
  icon: Yup.string().required("Select an icon for the badge"),
  type: Yup.string().oneOf(["ACTION", "POINTS"]).required(),
  module: Yup.string().when("type", {
    is: "ACTION",
    then: (schema) => schema.required("Module is required for action challenges"),
    otherwise: (schema) => schema.optional(),
  }),
  targetValue: Yup.number().required("Target value is required").min(1, "Must be at least 1"),
  action: Yup.string().when("type", {
    is: "ACTION",
    then: (schema) => schema.required("Specify the triggering action"),
    otherwise: (schema) => schema.optional(),
  }),
});

interface BadgeFormProps {
  initialValues?: any;
  onSubmit: (values: any) => Promise<void>;
  loading: boolean;
  isEdit?: boolean;
  modules: any[];
  triggers: any[];
}

export function BadgeForm({ initialValues, onSubmit, loading, isEdit, modules, triggers }: BadgeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      description: "",
      icon: "⭐",
      type: "ACTION",
      module: "",
      action: "",
      targetValue: 1,
      isActive: true,
    },
    validationSchema: badgeSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
        setSaved(true);
        setTimeout(() => {
          router.push("/gamification/badges");
        }, 1500);
      } catch (error: any) {
        toast({
          title: "Save Failed",
          description: error.message || "Failed to preserve configuration.",
          variant: "destructive",
        });
      }
    },
  });

  const filteredTriggers = triggers.filter((t) => t.moduleId === formik.values.module);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <form onSubmit={formik.handleSubmit} className="space-y-8">
          
          <EcosystemCard
            title="Identity & Designation"
            description="Give your achievement a name, description, and visual icon."
            icon={Sparkles}
          >
            <div className="space-y-6 mt-4">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Achievement Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Master Contributor, Early Adopter"
                      {...formik.getFieldProps("name")}
                      className="h-11 shadow-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      placeholder="What does a user need to do to earn this?"
                      {...formik.getFieldProps("description")}
                      className="min-h-[100px] shadow-none resize-none"
                    />
                  </div>
                </div>

                <div className="w-full md:w-[300px] space-y-4">
                   <Label>Visual Representation</Label>
                   <div className="flex flex-col gap-4 p-4 rounded-xl border bg-muted/20">
                      <div className="h-20 w-20 mx-auto bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl border animate-in zoom-in-90 duration-300">
                        {formik.values.icon}
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input 
                           placeholder="Filter icons..." 
                           className="pl-9 h-8 text-xs bg-white"
                           value={iconSearch}
                           onChange={(e) => setIconSearch(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-6 gap-2 max-h-[150px] overflow-y-auto pr-1">
                         {ICON_CATEGORIES.flatMap(c => c.icons).map(icon => (
                           <button
                             key={icon}
                             type="button"
                             onClick={() => formik.setFieldValue("icon", icon)}
                             className={cn(
                               "h-8 w-8 rounded-lg flex items-center justify-center text-lg transition-all",
                               formik.values.icon === icon 
                                 ? "bg-indigo-600 text-white shadow-lg scale-110" 
                                 : "bg-white hover:bg-muted"
                             )}
                           >
                             {icon}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </EcosystemCard>

          <EcosystemCard
            title="Achievement Logic"
            description="Determine how this badge is algorithmically awarded."
            icon={Target}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
               <div className="space-y-2">
                  <Label>Award Mechanism</Label>
                  <Select 
                    value={formik.values.type} 
                    onValueChange={(val) => formik.setFieldValue("type", val)}
                    disabled={isEdit}
                  >
                    <SelectTrigger className="h-11 shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTION">Action Cumulative</SelectItem>
                      <SelectItem value="POINTS">Milestone Threshold</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <Label>{formik.values.type === "ACTION" ? "Required Count" : "Required Points"}</Label>
                  <Input
                    type="number"
                    {...formik.getFieldProps("targetValue")}
                    className="h-11"
                    min={1}
                  />
               </div>

               {formik.values.type === "ACTION" && (
                 <>
                    <div className="space-y-2">
                      <Label>Target Module</Label>
                      <Select 
                        value={formik.values.module} 
                        onValueChange={(val) => {
                           formik.setFieldValue("module", val);
                           formik.setFieldValue("action", "");
                        }}
                        disabled={isEdit}
                      >
                        <SelectTrigger className="h-11 shadow-none">
                          <SelectValue placeholder="Identify module" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules.map(m => (
                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Triggering Action</Label>
                      <Select 
                        value={formik.values.action} 
                        onValueChange={(val) => formik.setFieldValue("action", val)}
                        disabled={!formik.values.module || isEdit}
                      >
                        <SelectTrigger className="h-11 shadow-none">
                          <SelectValue placeholder={formik.values.module ? "Select action" : "Select module first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredTriggers.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.description}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                 </>
               )}
            </div>
          </EcosystemCard>
        </form>
      </div>

      <div className="lg:col-span-4">
         <div className="sticky top-24 space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
              <CardHeader className="bg-muted/30 border-b pb-4 text-center">
                <UIBadge variant="outline" className="w-fit mb-2 bg-indigo-500/5 text-indigo-600 border-indigo-500/20 mx-auto">
                  Discovery Preview
                </UIBadge>
                <CardTitle className="text-lg">Member View</CardTitle>
              </CardHeader>
              <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
                 <div className="relative group">
                   <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors" />
                   <div className="relative h-24 w-24 bg-white rounded-3xl shadow-2xl border flex items-center justify-center text-5xl transition-transform group-hover:scale-105">
                      {formik.values.icon}
                   </div>
                   <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <Trophy className="h-4 w-4 text-white" />
                   </div>
                 </div>
                 <div className="space-y-1 pt-2">
                    <h3 className="text-xl font-black text-foreground">{formik.values.name || "Achievement Name"}</h3>
                    <p className="text-xs text-muted-foreground px-4 leading-relaxed font-medium">
                      {formik.values.description || "Design your badge to see how it will appear to members in their profile gallery."}
                    </p>
                 </div>
                 <div className="w-full pt-4 border-t border-dashed space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                       <span>Rarity Grade</span>
                       <span className="text-indigo-600">Legendary</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full w-1/3 bg-indigo-500 rounded-full" />
                    </div>
                 </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-zinc-900 text-white">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                   <Gamepad2 className="h-4 w-4 text-indigo-400" />
                   Meta Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Members who meet the criteria after deployment will be automatically awarded.
                </p>
              </CardContent>
            </Card>
         </div>
      </div>

      <FloatingSavePanel
        hasChanged={formik.dirty && !!formik.values.name}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title={isEdit ? "Unsaved Changes" : "Unsaved Achievement"}
        description={isEdit ? "Update this badge in the global directory?" : "Deploy this badge to the production community?"}
        buttonText={isEdit ? "Update Badge" : "Deploy Badge"}
      />
    </div>
  );
}
