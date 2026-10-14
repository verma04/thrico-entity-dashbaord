"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewCustomTabDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTab: (tabName: string) => void;
  singularName: string;
}

const tabSchema = Yup.object().shape({
  tabName: Yup.string()
    .trim()
    .required("Tab display name is required")
    .max(40, "Tab display name cannot exceed 40 characters"),
});

export const NewCustomTabDialog: React.FC<NewCustomTabDialogProps> = ({
  isOpen,
  onClose,
  onCreateTab,
  singularName,
}) => {
  const formik = useFormik({
    initialValues: { tabName: "" },
    validationSchema: tabSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      onCreateTab(values.tabName.trim());
      resetForm();
      onClose();
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      formik.resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-5 rounded-xl border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold text-[#303030] dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            Add New Custom Tab
          </DialogTitle>
          <DialogDescription className="text-[11.5px] text-[#616161] dark:text-zinc-400">
            Create a custom navigation tab. You can name it and curate specific {singularName.toLowerCase()} clips for it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label
              htmlFor="new-tab-name"
              className="text-[11.5px] font-medium text-[#303030] dark:text-zinc-200"
            >
              Tab Display Name
            </label>
            <input
              id="new-tab-name"
              name="tabName"
              type="text"
              placeholder="e.g. Staff Highlights, Top Demos, Weekly Best"
              value={formik.values.tabName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoFocus
              className={cn(
                "w-full text-[12px] h-8 px-3 rounded-[6px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                formik.touched.tabName && formik.errors.tabName
                  ? "border-destructive focus:ring-destructive"
                  : "border-[#d2d5d9] dark:border-zinc-700"
              )}
            />
            {formik.touched.tabName && formik.errors.tabName && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {formik.errors.tabName}
              </p>
            )}
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="text-[12px] h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-[12px] h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              Create &amp; Curate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
