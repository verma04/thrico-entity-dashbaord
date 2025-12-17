"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPicker } from "./icon-picker";

interface StatsSettingsProps {
  content: {
    stats?: Array<{
      label: string;
      value: string;
      change?: string;
      changeType?: "positive" | "negative";
      icon?: string;
    }>;
    title?: string;
    description?: string;
    backgroundColor?: string;
  };
  onChange: (updates: any) => void;
}

const StatsSettings: React.FC<StatsSettingsProps> = ({ content, onChange }) => {
  const {
    stats = [
      { label: "Active Users", value: "50K+", icon: "Users" },
      { label: "Growth Rate", value: "125%", icon: "TrendingUp" },
      { label: "Awards Won", value: "15", icon: "Award" },
      { label: "Projects Completed", value: "500+", icon: "Target" },
    ],
    title = "Our Key Statistics",
    description = "Showcasing our achievements and growth metrics",
    backgroundColor = "#ffffff",
  } = content;

  const addStat = () => {
    const newStats = [
      ...stats,
      {
        label: "New Metric",
        value: "100",
        change: "+5%",
        changeType: "positive" as const,
        icon: "BarChart",
      },
    ];
    onChange({ stats: newStats });
  };

  const updateStat = (index: number, updates: Partial<(typeof stats)[0]>) => {
    const newStats = stats.map((stat, i) =>
      i === index ? { ...stat, ...updates } : stat
    );
    onChange({ stats: newStats });
  };

  const removeStat = (index: number) => {
    const newStats = stats.filter((_, i) => i !== index);
    onChange({ stats: newStats });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Section Title</label>
          <Input
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Our Key Statistics"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Section Description</label>
          <Input
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Showcasing our achievements and growth metrics"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Background Color</label>
          <Input
            type="color"
            value={backgroundColor}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium">Statistics</label>
          <Button onClick={addStat} size="sm">
            Add Stat
          </Button>
        </div>

        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Stat #{index + 1}</span>
                <Button
                  onClick={() => removeStat(index)}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Label</label>
                  <Input
                    value={stat.label}
                    onChange={(e) =>
                      updateStat(index, { label: e.target.value })
                    }
                    placeholder="Total Users"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Value</label>
                  <Input
                    value={stat.value}
                    onChange={(e) =>
                      updateStat(index, { value: e.target.value })
                    }
                    placeholder="10,000"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Change</label>
                  <Input
                    value={stat.change || ""}
                    onChange={(e) =>
                      updateStat(index, { change: e.target.value })
                    }
                    placeholder="+15%"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Change Type</label>
                  <Select
                    value={stat.changeType || "positive"}
                    onValueChange={(value) =>
                      updateStat(index, {
                        changeType: value as "positive" | "negative",
                      })
                    }
                  >
                    <SelectTrigger type="button">
                      <SelectValue placeholder="Select change type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-600">Icon</label>
                  <IconPicker
                    value={stat.icon || ""}
                    onChange={(iconName) =>
                      updateStat(index, { icon: iconName })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSettings;
