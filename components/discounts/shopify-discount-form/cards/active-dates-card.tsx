"use client";

import React from "react";
import { PolarisCard } from "../primitives/polaris-card";
import { PolarisInput } from "../primitives/polaris-input";
import { PolarisCheckbox } from "../primitives/polaris-checkbox";
import { Calendar, Clock } from "lucide-react";

export interface ActiveDatesCardProps {
  startDate: string;
  onStartDateChange: (val: string) => void;
  startDateError?: string | null;

  startTime: string;
  onStartTimeChange: (val: string) => void;
  startTimeError?: string | null;

  hasEndDate: boolean;
  onHasEndDateChange: (val: boolean) => void;

  endDate: string;
  onEndDateChange: (val: string) => void;
  endDateError?: string | null;

  endTime: string;
  onEndTimeChange: (val: string) => void;
  endTimeError?: string | null;

  timezoneName?: string;
}

export function ActiveDatesCard({
  startDate,
  onStartDateChange,
  startDateError,
  startTime,
  onStartTimeChange,
  startTimeError,
  hasEndDate,
  onHasEndDateChange,
  endDate,
  onEndDateChange,
  endDateError,
  endTime,
  onEndTimeChange,
  endTimeError,
  timezoneName = "EDT",
}: ActiveDatesCardProps) {
  return (
    <PolarisCard title="Active dates">
      {/* ── Start Date & Time ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <PolarisInput
          id="discount-start-date"
          label="Start date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          error={startDateError}
          prefix={<Calendar className="h-3.5 w-3.5" />}
        />

        <PolarisInput
          id="discount-start-time"
          label={`Start time (${timezoneName})`}
          type="text"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          error={startTimeError}
          prefix={<Clock className="h-3.5 w-3.5" />}
          placeholder="10:00 AM"
        />
      </div>

      {/* ── Set End Date Checkbox & Dependent Fields ─────────────────────── */}
      <div className="pt-2 border-t border-[#f1f2f3] dark:border-zinc-800">
        <PolarisCheckbox
          id="set-end-date"
          checked={hasEndDate}
          onChange={onHasEndDateChange}
          label="Set end date"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <PolarisInput
              id="discount-end-date"
              label="End date"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              error={endDateError}
              prefix={<Calendar className="h-3.5 w-3.5" />}
            />

            <PolarisInput
              id="discount-end-time"
              label={`End time (${timezoneName})`}
              type="text"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              error={endTimeError}
              prefix={<Clock className="h-3.5 w-3.5" />}
              placeholder="11:59 PM"
            />
          </div>
        </PolarisCheckbox>
      </div>
    </PolarisCard>
  );
}
