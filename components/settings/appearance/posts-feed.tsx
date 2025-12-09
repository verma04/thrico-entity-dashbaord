"use client"

import type React from "react"
import type { EntityTheme } from "@/store/ts-types"
import CreatePost from "./create-post"
import PostCard from "./post-card"

interface PostsFeedProps {
  theme: EntityTheme
}

const PostsFeed: React.FC<PostsFeedProps> = ({ theme }) => {
  const samplePosts = [
    {
      author: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      time: "2 hours ago",
      title: "Best practices for React component optimization",
      content:
        "I've been working on optimizing our React components and wanted to share some techniques that have worked well for our team...",
      tags: ["React", "Performance", "Frontend"],
      likes: 42,
      comments: 15,
      views: 234,
    },
    {
      author: "Mike Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      time: "4 hours ago",
      title: "Weekly Tech Meetup - Discussion on AI in Development",
      content:
        "Join us this Friday for our weekly tech meetup where we'll be discussing the impact of AI tools on modern development workflows...",
      tags: ["AI", "Meetup", "Discussion"],
      likes: 28,
      comments: 8,
      views: 156,
    },
  ]

  return (
    <div className="space-y-4">
      <CreatePost theme={theme} />
      {samplePosts.map((post, index) => (
        <PostCard key={index} theme={theme} post={post} />
      ))}
    </div>
  )
}

export default PostsFeed
