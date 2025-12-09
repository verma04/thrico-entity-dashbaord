"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe2, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getThricoDomain } from "@/graphql/actions/domain"
import DomainChange from "./domain-change"

export const ThricoDomain = () => {
  const { data, loading } = getThricoDomain()

  if (loading) {
    return <Skeleton className="h-24 rounded-lg" />
  }

  const domain = data?.getThricoDomain?.domain

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Globe2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Thrico Domain</p>
            <p className="font-mono text-sm font-medium">{`https://${domain}.thrico.community`}</p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1 bg-green-50 text-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      </CardHeader>
      <CardContent>
        <DomainChange />
      </CardContent>
    </Card>
  )
}
