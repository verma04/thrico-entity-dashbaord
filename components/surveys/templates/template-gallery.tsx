"use client";

import React, { useState, useMemo } from "react";
import {
  useGetSurveyTemplates,
  SurveyTemplate,
} from "@/graphql/surveys/survey-queries";
import { useCreateSurveyFromTemplate } from "@/graphql/surveys/survey-mutations";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Eye,
  Copy,
  Layout,
  Search,
  Sparkles,
  Loader2,
  FileQuestion,
  Layers,
  ArrowRight,
} from "lucide-react";
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const TemplateGallery = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<SurveyTemplate | null>(null);

  const { data, loading, error, refetch } = useGetSurveyTemplates();
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
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const q = searchQuery.toLowerCase().trim();
    return templates.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.questions?.some((qu) => qu.question?.toLowerCase().includes(q)),
    );
  }, [templates, searchQuery]);

  const handleUseTemplate = (templateId: string) => {
    createFromTemplate({ variables: { templateId } });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-destructive/5 rounded-2xl border border-destructive/20 max-w-xl mx-auto">
        <Layout className="h-10 w-10 text-destructive mb-3" />
        <h2 className="text-sm font-bold mb-1.5 text-foreground">Failed to load templates</h2>
        <p className="text-muted-foreground mb-4 text-xs">
          There was an error fetching the survey template blueprints.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* ── Action / Filter Bar ─────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search templates by title, topic, or question…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={filteredTemplates.length > 0}>
            Showing {filteredTemplates.length} of {templates.length} Templates
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Compact Templates Grid (4-5 columns) ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-card p-3 space-y-2.5 shadow-2xs animate-pulse"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <Skeleton className="h-4 w-4/5 rounded" />
              <Skeleton className="h-8 w-full rounded" />
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-6 w-full rounded-md" />
              </div>
            </div>
          ))
        ) : filteredTemplates.length > 0 ? (
          filteredTemplates.map((template, index) => {
            const questionCount = template.questions?.length || 0;
            const uniqueTypes = Array.from(
              new Set(template.questions?.map((q) => q.type) || []),
            ).slice(0, 2);

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="h-full"
              >
                <div
                  onClick={() => setSelectedTemplate(template)}
                  className="group relative h-full flex flex-col justify-between rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 overflow-hidden cursor-pointer"
                >
                  {/* Top 1px Classification / Status Accent Bar */}
                  <div className="absolute top-0 left-0 h-1 w-full bg-primary/70 group-hover:bg-primary transition-colors z-10" />

                  {/* ── Inlined Badges Header ─────────────────────────── */}
                  <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">
                      <Sparkles className="h-2.5 w-2.5" />
                      Blueprint
                    </span>

                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
                      <FileQuestion className="h-2.5 w-2.5" />
                      {questionCount} {questionCount === 1 ? "Question" : "Questions"}
                    </span>
                  </div>

                  {/* ── Body ───────────────────────────────────────────── */}
                  <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3
                        className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
                        title={template.title}
                      >
                        {template.title}
                      </h3>

                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {template.description ||
                          "Battle-tested survey structure designed for community insights."}
                      </p>
                    </div>

                    {/* Question Type preview tags */}
                    {uniqueTypes.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1">
                        {uniqueTypes.map((type, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50 truncate max-w-[120px] capitalize"
                          >
                            {type.toLowerCase().replace(/_/g, " ")}
                          </span>
                        ))}
                        {template.questions?.length > 2 && (
                          <span className="text-[10px] font-medium text-muted-foreground self-center">
                            +{template.questions.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── Footer ─────────────────────────────────────────── */}
                  <div className="p-2.5 pt-2 border-t border-border/40 bg-muted/10 grid grid-cols-2 gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px] font-medium border-border/80 bg-card px-2 hover:bg-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <CtaButton
                      size="sm"
                      className="h-7 text-[11px] font-medium px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template.id);
                      }}
                      disabled={isCloning}
                    >
                      {isCloning ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Plus className="h-3 w-3 mr-1" />
                          Use
                        </>
                      )}
                    </CtaButton>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center space-y-2 rounded-2xl border border-dashed border-border bg-muted/20">
            <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center mx-auto text-muted-foreground/40 mb-2">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No blueprints found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any survey templates matching "{searchQuery}". Try a different search term.
            </p>
          </div>
        )}
      </div>

      {/* ── Preview Modal ──────────────────────────────────────────────── */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={(open) => !open && setSelectedTemplate(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 border border-border shadow-2xl rounded-2xl">
          <div className="bg-muted/40 pt-6 pb-4 px-6 border-b border-border sticky top-0 z-10 backdrop-blur-md">
            <DialogHeader className="space-y-1.5 text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <Badge
                  variant="outline"
                  className="font-mono text-[9px] uppercase tracking-wider bg-card text-foreground border-border"
                >
                  {selectedTemplate?.questions?.length || 0} Questions
                </Badge>
              </div>
              <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                {selectedTemplate?.title}
              </DialogTitle>
              <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
                {selectedTemplate?.description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                Structured Questions ({selectedTemplate?.questions?.length || 0})
                <Separator className="flex-1" />
              </h4>

              <div className="space-y-2.5">
                {selectedTemplate?.questions?.map((q, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-border bg-card/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {i + 1}. {q.question}
                      </span>
                      {q.required && (
                        <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20 uppercase">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0 h-5 rounded-md border-border bg-muted text-muted-foreground capitalize font-medium"
                      >
                        {q.type?.toLowerCase().replace(/_/g, " ")}
                      </Badge>
                      {q.type === "RATING" && (
                        <span className="text-[10px] text-muted-foreground font-medium">
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
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 bg-muted/20 border-t border-border gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTemplate(null)}
              className="h-8 text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs font-semibold bg-primary text-primary-foreground gap-1.5"
              disabled={isCloning}
              onClick={() =>
                selectedTemplate && handleUseTemplate(selectedTemplate.id)
              }
            >
              {isCloning ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
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

export default TemplateGallery;
