import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Option, poll } from "../ts-types";

// Simple color palette for chart cells
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28FD0",
  "#FF6699",
  "#33CC99",
  "#FF4444",
];

function getRandomColor(index: number) {
  return COLORS[index % COLORS.length];
}

const Summary = ({
  selectedPoll,
  options,
}: {
  selectedPoll: poll;
  options: Option[];
}) => {
  const optionsData = options?.map((set) => ({
    name: set.text,
    value: set.votes,
  }));

  const totalVotes =
    optionsData?.reduce((acc, curr) => acc + curr.value, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{selectedPoll?.question}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {selectedPoll?.totalVotes} total votes
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={optionsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {optionsData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRandomColor(index)} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Vote Breakdown</h3>
            <div className="space-y-3">
              {optionsData?.map((option, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getRandomColor(index) }}
                    />
                    <span className="text-sm">{option.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{option.value}</span>
                    <span className="text-sm text-muted-foreground">
                      ({Math.round((option.value / totalVotes) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;
