"use client";

import React, { useState } from "react";
import { NewsArticle } from "@/types/news-types";
import { formatNewsDate } from "@/lib/news-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, Tag, Edit, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsDetailViewProps {
  article: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (article: NewsArticle) => void;
}

export const NewsDetailView: React.FC<NewsDetailViewProps> = ({
  article,
  open,
  onOpenChange,
  onEdit,
}) => {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant={article.status === "published" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {article.status}
                </Badge>
                {article.featured && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight mb-4">
                {article.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatNewsDate(article.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </span>
                <Badge variant="outline">{article.category}</Badge>
              </div>
            </div>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEdit(article);
                  onOpenChange(false);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Featured Image */}
          {article.featuredImage && (
            <div className="relative w-full rounded-lg overflow-hidden">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          <div className="bg-muted/50 border-l-4 border-primary p-4 rounded">
            <p className="text-lg font-medium italic">{article.excerpt}</p>
          </div>

          {/* Content */}
          <div
            className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="pt-6 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Footer Meta */}
          <div className="pt-6 border-t text-xs text-muted-foreground">
            <p>
              Created: {new Date(article.createdAt).toLocaleString()}
            </p>
            <p>
              Last updated: {new Date(article.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
