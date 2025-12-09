"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { EntityTheme } from "@/store/ts-types"

interface ActiveMembersProps {
  theme: EntityTheme
}

const ActiveMembers: React.FC<ActiveMembersProps> = ({ theme }) => {
  const members = [
    { name: "Alex", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { name: "Jordan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
    { name: "Casey", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey" },
    { name: "Taylor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor" },
  ]

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
      <h3
        className="font-semibold mb-4"
        style={{
          color: theme.textColor,
          fontSize: `${theme.fontSize}px`,
          fontWeight: theme.fontWeight as any,
        }}
      >
        Active Members
      </h3>
      <div className="flex gap-2 flex-wrap">
        {members.map((member, idx) => (
          <Avatar
            key={idx}
            className="w-9 h-9 border-2 cursor-pointer hover:scale-110 transition"
            style={{ borderColor: theme.primaryColor }}
          >
            <AvatarImage src={member.avatar || "/placeholder.svg"} />
            <AvatarFallback>{member.name[0]}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </Card>
  )
}

export default ActiveMembers
