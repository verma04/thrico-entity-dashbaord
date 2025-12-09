"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { EntityTheme } from "@/store/ts-types"

interface CreatePostProps {
  theme: EntityTheme
}

const CreatePost: React.FC<CreatePostProps> = ({ theme }) => {
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
        <Input
          placeholder="What's on your mind?"
          style={{
            backgroundColor: theme.backgroundColor,
            borderColor: theme.inputBorderColor,
            borderRadius: `${theme.borderRadius}px`,
            fontSize: `${theme.fontSize}px`,
          }}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge style={{ backgroundColor: theme.primaryColor, color: "#fff" }}>Discussion</Badge>
          <Badge style={{ backgroundColor: theme.secondaryColor, color: "#fff" }}>Question</Badge>
        </div>
        <Button
          style={{
            backgroundColor: theme.primaryColor,
            color: "#fff",
            borderRadius: `${theme.borderRadius}px`,
          }}
        >
          <Plus size={16} className="mr-1" />
          Post
        </Button>
      </div>
    </Card>
  )
}

export default CreatePost
