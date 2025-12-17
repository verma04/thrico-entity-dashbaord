import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar, User, Tag, ExternalLink, Link, Copy } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

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

interface BlogSettingsProps {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
}

const BlogSettings: React.FC<BlogSettingsProps> = ({ content, onChange }) => {
  const posts: BlogPost[] = content.posts || [];
  const blogTitle = content.title || "Blog";
  const blogDescription = content.description || "Latest articles and insights";
  const categories = content.categories || ["Technology", "Business", "Design"];

  const updatePost = (index: number, field: keyof BlogPost, value: any) => {
    const newPosts = [...posts];
    newPosts[index] = { ...newPosts[index], [field]: value };
    onChange({ ...content, posts: newPosts });
  };

  const addPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: "New Article",
      slug: "new-article",
      excerpt: "Brief description of the article...",
      content: "Article content goes here...",
      author: "Author Name",
      date: new Date().toISOString().split("T")[0],
      category: categories[0] || "General",
      tags: [],
      readTime: "5 min read",
      featured: false,
    };
    onChange({ ...content, posts: [...posts, newPost] });
  };

  const removePost = (index: number) => {
    const newPosts = posts.filter((_, i) => i !== index);
    onChange({ ...content, posts: newPosts });
  };

  const addTag = (postIndex: number, tag: string) => {
    if (tag.trim() && !posts[postIndex].tags.includes(tag.trim())) {
      updatePost(postIndex, "tags", [...posts[postIndex].tags, tag.trim()]);
    }
  };

  const removeTag = (postIndex: number, tagIndex: number) => {
    const newTags = posts[postIndex].tags.filter((_, i) => i !== tagIndex);
    updatePost(postIndex, "tags", newTags);
  };

  return (
    <div className="space-y-6">
      {/* View Blog Link */}
    

      {/* Categories */}
      <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
        <Label className="text-xs uppercase font-bold text-muted-foreground">
          Categories
        </Label>

        <div>
          <Label htmlFor="categories" className="text-sm font-medium">
            Categories (comma-separated)
          </Label>
          <Input
            id="categories"
            value={categories.join(", ")}
            onChange={(e) =>
              onChange({
                ...content,
                categories: e.target.value
                  .split(",")
                  .map((cat) => cat.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Technology, Business, Design"
          />
        </div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Blog Posts ({posts.length})
          </Label>
          <Button onClick={addPost} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Post
          </Button>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No blog posts yet. Click "Add Post" to create your first article.
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="border rounded-lg p-3 space-y-3 bg-background"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Post #{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={post.featured}
                        onChange={(e) =>
                          updatePost(index, "featured", e.target.checked)
                        }
                        className="rounded"
                      />
                      Featured
                    </label>
                    <Button
                      onClick={() => removePost(index)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <Input
                      value={post.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        // Auto-generate slug from title
                        const slug = newTitle
                          .toLowerCase()
                          .trim()
                          .replace(/[^\w\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-");
                        
                        // Update both title and slug together
                        const newPosts = [...posts];
                        newPosts[index] = {
                          ...newPosts[index],
                          title: newTitle,
                          slug: slug,
                        };
                        onChange({ ...content, posts: newPosts });
                      }}
                      placeholder="Article title"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Slug (URL)</Label>
                    <Input
                      value={post.slug || ""}
                      onChange={(e) =>
                        updatePost(index, "slug", e.target.value)
                      }
                      placeholder="article-slug"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      URL-friendly version of the title (auto-generated)
                    </p>
                  </div>

                  <div>
                    <ImageUploadWithCrop
                      label="Featured Image"
                      currentImage={post.image}
                      onImageUpdate={(url) =>
                        updatePost(index, "image", url)
                      }
                      recommendedWidth={1200}
                      recommendedHeight={630}
                      aspectRatio={1200 / 630}
                      maxFileSize={5}
                      showDimensions={true}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Excerpt</Label>
                    <Textarea
                      value={post.excerpt}
                      onChange={(e) =>
                        updatePost(index, "excerpt", e.target.value)
                      }
                      placeholder="Brief description..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Author
                      </Label>
                      <Input
                        value={post.author}
                        onChange={(e) =>
                          updatePost(index, "author", e.target.value)
                        }
                        placeholder="Author name"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Date
                      </Label>
                      <Input
                        type="date"
                        value={post.date}
                        onChange={(e) =>
                          updatePost(index, "date", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <select
                        value={post.category}
                        onChange={(e) =>
                          updatePost(index, "category", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Read Time</Label>
                      <Input
                        value={post.readTime}
                        onChange={(e) =>
                          updatePost(index, "readTime", e.target.value)
                        }
                        placeholder="5 min read"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Tags
                    </Label>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(index, tagIndex)}
                            className="hover:text-destructive"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <Input
                      placeholder="Add tags (press Enter)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(index, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>

                  <div>
                    <RichTextEditor
                      label="Content"
                      value={post.content}
                      onChange={(value) =>
                        updatePost(index, "content", value)
                      }
                      placeholder="Write your article content here..."
                      minHeight="300px"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSettings;
