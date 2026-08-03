"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DangerZoneDeleteProps {
  title: string;
  itemTitle: string;
  description: string;
  onDelete: () => void;
  deleting: boolean;
  deleteButtonText?: string;
}

export function DangerZoneDelete({
  title,
  itemTitle,
  description,
  onDelete,
  deleting,
  deleteButtonText = "Delete",
}: DangerZoneDeleteProps) {
  const [deleteInput, setDeleteInput] = useState("");

  const isDeleteMatch = deleteInput.trim() === itemTitle;

  return (
    <div className="border border-red-200 rounded-xl overflow-hidden bg-white">
      <div className="bg-red-50 px-6 py-4 border-b border-red-200 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <label
              htmlFor="delete-confirm"
              className="block text-sm font-medium text-gray-700"
            >
              To verify, type{" "}
              <span className="font-bold text-gray-900 select-all">
                {itemTitle}
              </span>{" "}
              below:
            </label>
            <Input
              id="delete-confirm"
              placeholder={`Type "${itemTitle}" to confirm`}
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="max-w-md border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
            <Button
              variant="destructive"
              disabled={!isDeleteMatch || deleting}
              loading={deleting}
              onClick={onDelete}
              className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              {!deleting && <Trash2 className="w-4 h-4" />}
              {deleting ? "Deleting..." : deleteButtonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
