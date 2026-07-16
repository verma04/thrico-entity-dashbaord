"use client";

import React, { useState } from "react";
import { NewsArticle } from "@/types/news-types";
import { useNewsStore } from "@/store/useNewsStore";
import { formatNewsDate } from "@/lib/news-utils";
import {
  Calendar,
  User,
  Clock,
  Tag,
  Edit,
  Trash2,
  FileText,
  Eye,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface NewsListProps {
  onEdit: (article: NewsArticle) => void;
  onView?: (article: NewsArticle) => void;
}

export const NewsList: React.FC<NewsListProps> = ({ onEdit, onView }) => {
  const { getFilteredArticles, deleteArticle } = useNewsStore();
  const articles = getFilteredArticles();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);

  const handleDeleteClick = (article: NewsArticle) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (articleToDelete) {
      deleteArticle(articleToDelete.id);
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg bg-muted/10">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No articles found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Start creating news articles to share with your community. Click the "Create Article"
          button to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg",
              article.featured && "ring-2 ring-primary/20"
            )}
          >
            {/* Featured Image */}
            {article.featuredImage ? (
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {article.featured && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant={article.status === "published" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {article.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="relative h-48 w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                <div className="absolute top-3 left-3">
                  <Badge
                    variant={article.status === "published" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {article.status}
                  </Badge>
                </div>
                {article.featured && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              {/* Category & Date */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="font-medium uppercase tracking-wide">{article.category}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatNewsDate(article.date)}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors cursor-pointer"
                onClick={() => onView?.(article)}
              >
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                {article.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime}
                </span>
              </div>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                    >
                      <Tag className="h-2 w-2" />
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{article.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t">
                {onView && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(article)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(article)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(article)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{articleToDelete?.title}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
