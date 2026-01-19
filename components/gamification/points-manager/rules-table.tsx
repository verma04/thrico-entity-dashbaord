import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { renderModuleIcon } from "@/components/subscription/utils";
import { PointRule, useTogglePointRule } from "@/graphql/actions";
import { ConfirmDialog } from "@/components/pages/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface RulesTableProps {
  rules: PointRule[];
  selectedModule: string | "ALL";
  modules: { id: string; name: string; icon: string }[];
  onEdit: (rule: PointRule) => void;

  refetchRules: () => void;
  refetchStats: () => void;
  isLoading?: boolean;
}

export function RulesTable({
  rules,
  selectedModule,
  modules,
  onEdit,
  isLoading,
  refetchRules,
  refetchStats,
}: RulesTableProps) {
  const [ruleToDelete, setRuleToDelete] = React.useState<string | null>(null);

  const [togglePointRule, { loading: toggling }] = useTogglePointRule({
    onCompleted: () => {
      refetchRules();
      refetchStats();
    },
  });

  const handleToggleActive = async (id: string) => {
    try {
      await togglePointRule({
        variables: { id },
      });
    } catch (error) {
      console.error("Error toggling point rule active status:", error);
    }
  };

  const getModuleInfo = (moduleId: string) => {
    return modules.find((m) => m.id === moduleId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
            {selectedModule !== "ALL" && (
              <Skeleton className="h-6 w-20 rounded-full" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-10 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Point Rules{" "}
          {selectedModule !== "ALL" && (
            <Badge variant="secondary" className="ml-2">
              {getModuleInfo(selectedModule)?.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Points</TableHead>
              <TableHead>Caps</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>
                  <span className="flex items-center gap-2">
                    {renderModuleIcon(
                      getModuleInfo(rule.module)?.icon || "Settings"
                    )}
                    {getModuleInfo(rule.module)?.name || rule.module}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{rule.action}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      rule.trigger === "FIRST_TIME" ? "default" : "outline"
                    }
                  >
                    {rule.trigger === "FIRST_TIME" ? "First Time" : "Recurring"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-bold text-primary">
                  +{rule.points}
                </TableCell>
                <TableCell>
                  {rule.dailyCap || rule.weeklyCap || rule.monthlyCap ? (
                    <span className="text-xs text-muted-foreground">
                      {rule.dailyCap && `${rule.dailyCap}/day`}
                      {rule.weeklyCap && ` ${rule.weeklyCap}/wk`}
                      {rule.monthlyCap && ` ${rule.monthlyCap}/mo`}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No limit
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => handleToggleActive(rule.id)}
                    disabled={toggling}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(rule)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rules.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No point rules found. Add your first rule!
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
