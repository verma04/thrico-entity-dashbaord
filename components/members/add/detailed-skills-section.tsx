"use client";

import React, { useState } from "react";
import { FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, X, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const skillValidationSchema = Yup.object().shape({
  skillId: Yup.string().nullable(),
  name: Yup.string().required("Please enter skill name"),
  category: Yup.string().required("Please select a category"),
  level: Yup.string().required("Please select skill level"),
  tags: Yup.array().of(Yup.string()).min(1, "Please add at least one tag"),
  yearsOfExperience: Yup.number()
    .min(0, "Years cannot be negative")
    .max(50, "Years cannot exceed 50")
    .nullable(),
  description: Yup.string().nullable(),
});

export const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
  { value: "master", label: "Master" },
];

export const skillCategories = [
  { value: "programming-languages", label: "Programming Languages" },
  { value: "frameworks", label: "Frameworks & Libraries" },
  { value: "databases", label: "Databases" },
  { value: "tools", label: "Tools & DevOps" },
  { value: "soft-skills", label: "Soft Skills" },
  { value: "other", label: "Other" },
];

export function DetailedSkillsSection({
  entitySkills = [],
}: {
  entitySkills?: any[];
}) {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const [tagInput, setTagInput] = useState<{ [key: number]: string }>({});
  const [openComboboxes, setOpenComboboxes] = useState<{
    [key: number]: boolean;
  }>({});

  const handleAddTag = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput[index]?.trim();
      if (newTag) {
        const currentTags = values.skills[index].tags || [];
        if (!currentTags.includes(newTag)) {
          setFieldValue(`skills.${index}.tags`, [...currentTags, newTag]);
        }
        setTagInput({ ...tagInput, [index]: "" });
      }
    }
  };

  const removeTag = (skillIndex: number, tagToRemove: string) => {
    const currentTags = values.skills[skillIndex].tags || [];
    setFieldValue(
      `skills.${skillIndex}.tags`,
      currentTags.filter((tag: string) => tag !== tagToRemove),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          Detailed Competencies
        </Label>
        <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
          Add specific skills with proficiency
        </p>
      </div>

      <FieldArray
        name="skills"
        render={(arrayHelpers) => (
          <div className="space-y-5">
            {values.skills && values.skills.length > 0 ? (
              values.skills.map((skill: any, index: number) => {
                const skillErrors = (errors.skills as any)?.[index] || {};
                const skillTouched = (touched.skills as any)?.[index] || {};

                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 relative space-y-4"
                  >
                    <div className="absolute top-3.5 right-3.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 h-7 w-7 rounded-lg transition-colors"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Skill Name <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          name={`skills.${index}.name`}
                          placeholder="e.g. React.js"
                          className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                          value={skill.name}
                          onChange={(e) =>
                            setFieldValue(
                              `skills.${index}.name`,
                              e.target.value,
                            )
                          }
                        />
                        {skillErrors.name && skillTouched.name && (
                          <p className="text-[11px] text-rose-500 font-medium">
                            {skillErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Category <span className="text-rose-500">*</span>
                        </Label>
                        <Popover
                          open={openComboboxes[index]}
                          onOpenChange={(open) =>
                            setOpenComboboxes({
                              ...openComboboxes,
                              [index]: open,
                            })
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openComboboxes[index]}
                              className={cn(
                                "w-full justify-between h-10 text-xs font-semibold bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
                                !skill.category && "text-zinc-400 font-normal",
                              )}
                            >
                              {skill.category
                                ? (entitySkills.length > 0
                                    ? entitySkills.find(
                                        (c: any) => c.title === skill.category,
                                      )?.title
                                    : skillCategories.find(
                                        (c) => c.value === skill.category,
                                      )?.label) || skill.category
                                : "Select category"}
                              <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-0"
                            align="start"
                          >
                            <Command className="border-none">
                              <CommandInput placeholder="Search category..." className="h-10 text-xs" />
                              <CommandList className="max-h-[200px]">
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                  {entitySkills.length > 0
                                    ? entitySkills.map((c: any) => (
                                        <CommandItem
                                          key={c.id}
                                          value={c.title}
                                          onSelect={(currentValue) => {
                                            const newValue =
                                              currentValue === skill.category
                                                ? ""
                                                : currentValue;
                                            setFieldValue(
                                              `skills.${index}.category`,
                                              newValue,
                                            );
                                            setFieldValue(
                                              `skills.${index}.skillId`,
                                              newValue ? c.id : null,
                                            );
                                            setOpenComboboxes({
                                              ...openComboboxes,
                                              [index]: false,
                                            });
                                          }}
                                          className="flex items-center justify-between text-xs font-semibold cursor-pointer"
                                        >
                                          <span>{c.title}</span>
                                          {skill.category === c.title && (
                                            <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
                                          )}
                                        </CommandItem>
                                      ))
                                    : skillCategories.map((c) => (
                                        <CommandItem
                                          key={c.value}
                                          value={c.label}
                                          onSelect={() => {
                                            setFieldValue(
                                              `skills.${index}.category`,
                                              c.value,
                                            );
                                            setFieldValue(
                                              `skills.${index}.skillId`,
                                              null,
                                            );
                                            setOpenComboboxes({
                                              ...openComboboxes,
                                              [index]: false,
                                            });
                                          }}
                                          className="flex items-center justify-between text-xs font-semibold cursor-pointer"
                                        >
                                          <span>{c.label}</span>
                                          {skill.category === c.value && (
                                            <Check className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
                                          )}
                                        </CommandItem>
                                      ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {skillErrors.category && skillTouched.category && (
                          <p className="text-[11px] text-rose-500 font-medium">
                            {skillErrors.category}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Level <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                          value={skill.level}
                          onValueChange={(val) =>
                            setFieldValue(`skills.${index}.level`, val)
                          }
                        >
                          <SelectTrigger className="h-10 text-xs font-semibold bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {skillLevels.map((l) => (
                              <SelectItem key={l.value} value={l.value} className="text-xs font-medium">
                                {l.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {skillErrors.level && skillTouched.level && (
                          <p className="text-[11px] text-rose-500 font-medium">
                            {skillErrors.level}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          Years of Experience
                        </Label>
                        <Input
                          type="number"
                          name={`skills.${index}.yearsOfExperience`}
                          placeholder="e.g. 3"
                          className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                          value={skill.yearsOfExperience}
                          onChange={(e) =>
                            setFieldValue(
                              `skills.${index}.yearsOfExperience`,
                              Number(e.target.value),
                            )
                          }
                          min={0}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Tags & Keywords <span className="text-rose-500">*</span>
                      </Label>
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {skill.tags?.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1"
                          >
                            {tag}
                            <X
                              className="h-2.5 w-2.5 cursor-pointer hover:text-rose-500"
                              onClick={() => removeTag(index, tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Type a tag and press Enter or comma..."
                        className="h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-medium"
                        value={tagInput[index] || ""}
                        onChange={(e) =>
                          setTagInput({ ...tagInput, [index]: e.target.value })
                        }
                        onKeyDown={(e) => handleAddTag(index, e)}
                      />
                      {skillErrors.tags && skillTouched.tags && (
                        <p className="text-[11px] text-rose-500 font-medium">
                          {skillErrors.tags}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Description
                      </Label>
                      <Textarea
                        placeholder="Describe how this skill is applied..."
                        className="min-h-[72px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
                        value={skill.description}
                        onChange={(e) =>
                          setFieldValue(
                            `skills.${index}.description`,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-900/20">
                <Star className="h-7 w-7 text-zinc-400 mx-auto mb-2 opacity-60" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  No detailed skills added yet.
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all rounded-xl h-11 text-xs font-semibold"
              onClick={() =>
                arrayHelpers.push({
                  skillId: null,
                  name: "",
                  category: "",
                  level: "",
                  tags: [],
                  yearsOfExperience: 0,
                  description: "",
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add Detailed Skill
            </Button>
          </div>
        )}
      />
    </div>
  );
}
