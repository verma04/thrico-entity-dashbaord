"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Eye, Share2 } from "lucide-react"
import type { EntityTheme } from "@/store/ts-types"

interface PostData {
  author: string
  avatar: string
  time: string
  title: string
  content: string
  tags: string[]
  likes: number
  comments: number
  views: number
}

interface PostCardProps {
  theme: EntityTheme
  post: PostData
}

const PostCard: React.FC<PostCardProps> = ({ theme, post }) => {
  return (
    <Card
      className="p-4"
      style={{
        backgroundColor: theme.inputBackground,
        borderColor: theme.borderColor,
        borderRadius: `${theme.borderRadius}px`,
        boxShadow: theme.boxShadow,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-10 h-10" />
        <div>
          <p
            className="font-semibold"
            style={{
              color: theme.textColor,
              fontSize: `${theme.fontSize}px`,
            }}
          >
            {post.author}
          </p>
          <p
            className="text-sm opacity-60"
            style={{
              color: theme.textColor,
              fontSize: `${theme.fontSize - 2}px`,
            }}
          >
            {post.time}
          </p>
        </div>
      </div>

      <h3
        className="font-bold mb-2"
        style={{
          color: theme.textColor,
          fontSize: `${theme.fontSize + 2}px`,
          fontWeight: theme.fontWeight as any,
        }}
      >
        {post.title}
      </h3>

      <p
        className="mb-4 leading-relaxed"
        style={{
          color: theme.textColor,
          fontSize: `${theme.fontSize}px`,
        }}
      >
        {post.content}
      </p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {post.tags.map((tag, idx) => (
          <Badge
            key={idx}
            style={{
              backgroundColor: `${theme.primaryColor}20`,
              color: theme.primaryColor,
              borderRadius: `${theme.borderRadius / 2}px`,
              fontSize: `${theme.fontSize - 3}px`,
            }}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: theme.borderColor }}>
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" style={{ color: theme.primaryColor }}>
            <Heart size={16} className="mr-1" />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" style={{ color: theme.primaryColor }}>
            <MessageCircle size={16} className="mr-1" />
            {post.comments}
          </Button>
          <Button variant="ghost" size="sm" style={{ color: theme.textColor, opacity: 0.6 }}>
            <Eye size={16} className="mr-1" />
            {post.views}
          </Button>
        </div>
        <Button variant="ghost" size="sm" style={{ color: theme.primaryColor }}>
          <Share2 size={16} />
        </Button>
      </div>
    </Card>
  )
}

export default PostCard
