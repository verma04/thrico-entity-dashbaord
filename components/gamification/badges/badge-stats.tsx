import { Card, CardContent } from "@/components/ui/card";
import { Award, Star, Trophy } from "lucide-react";
import { Badge } from "@/graphql/actions";

interface BadgeStatsProps {
  badges: Badge[];
}

export function BadgeStats({ badges }: BadgeStatsProps) {
  const actionBadges = badges.filter((b) => b.type === "ACTION");
  const pointsBadges = badges.filter((b) => b.type === "POINTS");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Badges</p>
              <p className="text-2xl font-bold">{badges.length}</p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Action-Based</p>
              <p className="text-2xl font-bold">{actionBadges.length}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Points-Based</p>
              <p className="text-2xl font-bold">{pointsBadges.length}</p>
            </div>
            <Trophy className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
