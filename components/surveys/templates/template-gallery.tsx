"use client";

import React, { useState } from "react";
import {
  useGetSurveyTemplates,
  SurveyTemplate,
} from "@/graphql/surveys/survey-queries";
import { useCreateSurveyFromTemplate } from "@/graphql/surveys/survey-mutations";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Eye,
  Copy,
  Layout,
  Search,
  ArrowLeft,
  CheckCircle2,
  ListFilter,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const TemplateGallery = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<SurveyTemplate | null>(null);

  const { data, loading, error } = useGetSurveyTemplates();
  const [createFromTemplate, { loading: isCloning }] =
    useCreateSurveyFromTemplate({
      onCompleted: (data) => {
        toast.success("Survey created from template!");
        router.push(`/surveys/${data.createSurveyFromTemplate.formId}`);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create survey from template");
      },
    });

  const templates = data?.getSurveyTemplates || [];
  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleUseTemplate = (templateId: string) => {
    createFromTemplate({ variables: { templateId } });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-destructive/5 rounded-3xl border-2 border-dashed border-destructive/20 max-w-2xl mx-auto">
        <Layout className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load templates</h2>
        <p className="text-muted-foreground mb-6">
          There was an error fetching the template gallery. Please try again
          later.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="pl-0 gap-2 mb-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/surveys/all")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Surveys
          </Button>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Template Gallery
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Jumpstart your research with pre-built survey templates designed for
            high engagement and quality insights.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-10 h-12 rounded-2xl border-none shadow-sm bg-card/50 backdrop-blur-sm focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
          ))
        ) : filteredTemplates.length > 0 ? (
          filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card className="group h-full flex flex-col border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden border-t-4 border-t-primary/10 hover:border-t-primary/40">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Layout className="h-5 w-5" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="font-mono text-[9px] uppercase tracking-widest bg-primary/5 text-primary border-none"
                    >
                      {template.questions.length} questions
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {template.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">
                    {template.description ||
                      "Start with a clean structure designed for modern data collection."}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-2 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-border/60 hover:bg-accent/50 group/btn"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Eye className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all font-semibold"
                    onClick={() => handleUseTemplate(template.id)}
                    disabled={isCloning}
                  >
                    {isCloning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1.5" />
                        Use
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="h-20 w-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold">No templates found</h3>
            <p className="text-muted-foreground text-center">
              We couldn't find any templates matching "{searchQuery}". Try a
              different term.
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={(open) => !open && setSelectedTemplate(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 border-none shadow-2xl overflow-hidden rounded-3xl">
          <div className="bg-linear-to-br from-primary/10 via-background to-background pt-10 pb-6 px-10 border-b border-border/50 sticky top-0 z-10 backdrop-blur-xl">
            <DialogHeader className="space-y-2">
              <div className="w-fit p-3 bg-primary/15 rounded-2xl text-primary mb-2 shadow-inner">
                <Layout className="h-6 w-6" />
              </div>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-3xl font-black tabular-nums tracking-tight">
                  {selectedTemplate?.title}
                </DialogTitle>
              </div>
              <DialogDescription className="text-base leading-relaxed text-foreground/80 font-medium">
                {selectedTemplate?.description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-10 space-y-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[.3em] text-muted-foreground/50 flex items-center gap-4">
                Structured Questions ({selectedTemplate?.questions.length})
                <Separator className="flex-1 opacity-20" />
              </h4>

              <div className="space-y-4">
                {selectedTemplate?.questions.map((q, i) => (
                  <div
                    key={i}
                    className="group relative pl-8 border-l-2 border-primary/10 hover:border-primary/40 transition-colors py-1"
                  >
                    <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-foreground/90">
                          {i + 1}. {q.question}
                        </span>
                        {q.required && (
                          <Badge className="bg-destructive/5 text-destructive border-none text-[8px] h-4 leading-none lowercase py-0">
                            required
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0 h-5 rounded-md border-primary/20 bg-primary/5 text-primary/80 capitalize font-medium tracking-tight"
                        >
                          {q.type.toLowerCase().replace(/_/g, " ")}
                        </Badge>
                        {q.type === "RATING" && (
                          <span className="text-[10px] text-muted-foreground italic font-medium">
                            Scale: 1-{q.scale || 5}
                          </span>
                        )}
                        {q.options && q.options.length > 0 && (
                          <span className="text-[10px] text-muted-foreground font-medium">
                            • {q.options.length} preset options
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-muted/10 border-t border-border/40 gap-4 mt-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedTemplate(null)}
              className="rounded-xl px-6 font-semibold"
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl px-8 shadow-xl shadow-primary/20 font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isCloning}
              onClick={() =>
                selectedTemplate && handleUseTemplate(selectedTemplate.id)
              }
            >
              {isCloning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Clone & Customize
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
