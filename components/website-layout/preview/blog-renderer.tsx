import React from "react";
import { cn } from "@/lib/utils";
import { LayoutType, ThemeType } from "@/store/useWebsiteBuilderStore";
import {
  Calendar,
  User,
  Clock,
  Tag,
  BookOpen,
  FileText,
  HelpCircle,
  MessageCircle,
  Map,
  Star,
  Zap,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  image?: string;
}

interface BlogRendererProps {
  content: Record<string, any>;
  layout: LayoutType;
  theme: ThemeType;
  previewDevice: "desktop" | "tablet" | "mobile";
}

const BlogRenderer: React.FC<BlogRendererProps> = ({
  content,
  layout,
  theme,
  previewDevice,
}) => {
  const posts: BlogPost[] = content.posts || [];
  const title = content.title || "Blog";
  const description = content.description || "Latest articles and insights";

  const getLayoutIcon = (layout: LayoutType) => {
    switch (layout) {
      case "encyclopedia-article":
        return <BookOpen className="h-4 w-4" />;
      case "documentation-page":
        return <FileText className="h-4 w-4" />;
      case "knowledge-hub":
        return <Map className="h-4 w-4" />;
      case "interview-qa":
        return <MessageCircle className="h-4 w-4" />;
      case "guide-tutorial":
        return <HelpCircle className="h-4 w-4" />;
      case "featured-story":
        return <Star className="h-4 w-4" />;
      case "standard-article":
        return <Zap className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getLayoutStyles = (layout: LayoutType) => {
    const baseStyles = "p-6 rounded-lg border";

    switch (layout) {
      case "encyclopedia-article":
        return `${baseStyles} bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800`;
      case "documentation-page":
        return `${baseStyles} bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800`;
      case "knowledge-hub":
        return `${baseStyles} bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800`;
      case "interview-qa":
        return `${baseStyles} bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800`;
      case "guide-tutorial":
        return `${baseStyles} bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800`;
      case "featured-story":
        return `${baseStyles} bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-200 dark:from-yellow-950 dark:to-amber-950 dark:border-amber-800`;
      default:
        return `${baseStyles} bg-card border-border`;
    }
  };

  const renderPostCard = (post: BlogPost, index: number) => (
    <article
      key={post.id}
      className={cn(
        getLayoutStyles(layout),
        "group hover:shadow-lg transition-all duration-200 overflow-hidden",
        post.featured && "ring-2 ring-primary/20"
      )}
    >
      {/* Featured Image */}
      {post.image && (
        <div className="relative w-full h-48 mb-4 -mx-6 -mt-6 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.featured && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full shadow-lg">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </div>
          )}
        </div>
      )}

      {!post.image && post.featured && (
        <div className="flex items-center gap-1 text-sm font-medium text-primary mb-2">
          <Star className="h-4 w-4 fill-current" />
          Featured
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getLayoutIcon(layout)}
          <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
            {post.category}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{post.date}</span>
      </div>

      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {post.title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
        </div>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded"
            >
              <Tag className="h-2 w-2" />
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </article>
  );

  const getGridColumns = () => {
    if (previewDevice === "mobile") return "grid-cols-1";
    if (previewDevice === "tablet") return "grid-cols-2";

    switch (layout) {
      case "encyclopedia-article":
      case "documentation-page":
        return "grid-cols-1";
      case "knowledge-hub":
      case "featured-story":
        return "grid-cols-2";
      default:
        return "grid-cols-3";
    }
  };

  if (posts.length === 0) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">{getLayoutIcon(layout)}</div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
          <div className="p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg">
            <p className="text-muted-foreground">
              No blog posts yet. Add some posts in the settings to get started.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {getLayoutIcon(layout)}
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Layout-specific rendering */}
        {(layout === "encyclopedia-article" ||
          layout === "documentation-page") && (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className={cn(
                  "prose prose-sm max-w-none overflow-hidden",
                  getLayoutStyles(layout)
                )}
              >
                {/* Featured Image */}
                {post.image && (
                  <div className="relative w-full h-64 mb-4 -mx-6 -mt-6 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getLayoutIcon(layout)}
                    <span className="text-sm font-medium">{post.category}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {post.date}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>

                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      By {post.author} • {post.readTime}
                    </span>
                    <div className="flex gap-1">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs px-2 py-1 bg-muted rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid Layout */}
        {!["encyclopedia-article", "documentation-page"].includes(layout) && (
          <div className={cn("grid gap-6", getGridColumns())}>
            {posts.map(renderPostCard)}
          </div>
        )}

        {/* Featured Story Layout */}
        {layout === "featured-story" && posts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Featured Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.filter((post) => post.featured).map(renderPostCard)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogRenderer;
