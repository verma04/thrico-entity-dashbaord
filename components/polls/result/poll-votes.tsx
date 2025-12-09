import React, { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter } from "lucide-react";
import { result } from "../ts-types";

import moment from "moment";
import { useGetEntity } from "@/graphql/actions";

// Simple function to generate a color from an index
function getRandomColor(index: number): string {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
    "#fa8072",
    "#b0e0e6",
    "#f08080",
  ];
  return colors[index % colors.length];
}

export const Votes = (data: result) => {
  const [activeTab, setActiveTab] = useState("summary");
  const optionsData = data?.options?.map((set) => ({
    name: set.text,
    value: set.votes,
  }));
  const { data: entity } = useGetEntity();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="votes">Individual Votes</TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Votes by option</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={optionsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    scale="band"
                    width={100}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {optionsData?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getRandomColor(index)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="votes" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Individual Votes</h3>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Votes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Individual vote details
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voter</TableHead>
                  <TableHead>Vote</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.individualVotes?.map((vote) => (
                  <TableRow key={vote?.createdAt}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {vote.votedBy === "USER" && (
                          <>
                            <Avatar>
                              <AvatarImage src={vote?.user?.avatar} />
                              <AvatarFallback>
                                {vote?.user?.firstName?.charAt(0)}
                                {vote?.user?.lastName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {vote?.user?.firstName} {vote?.user?.lastName}
                            </span>
                          </>
                        )}
                        {vote.votedBy === "ENTITY" && (
                          <>
                            <Avatar>
                              <AvatarImage src={entity?.getEntity?.logo} />
                              <AvatarFallback>
                                {entity?.getEntity?.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {entity?.getEntity?.name}
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{vote?.pollOptions?.text}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {moment(vote?.createdAt).fromNow()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
