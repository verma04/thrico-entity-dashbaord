"use client"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe2, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { getCustomDomain } from "@/graphql/actions/domain"

export const CustomDomain = () => {
  const router = useRouter()
  const { data } = getCustomDomain()

  if (!data?.getCustomDomain?.id) {
    return null
  }

  const domain = data.getCustomDomain
  const isVerified = domain.isVerified

  return (
    <Card
      onClick={() => router.push(`/settings/domains/${domain.id}`)}
      className="cursor-pointer overflow-hidden border-l-4 border-l-primary transition-all hover:shadow-md"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Globe2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Custom Domain</p>
            <p className="font-mono text-sm font-medium">{domain.domain}</p>
          </div>
        </div>
        {isVerified ? (
          <Badge variant="outline" className="gap-1 bg-green-50 text-green-700">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-700">
            <AlertCircle className="h-3 w-3" />
            Setup Needed
          </Badge>
        )}
      </CardHeader>
    </Card>
  )
}
