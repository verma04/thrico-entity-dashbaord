"use client";

import React, { useState } from "react";
import { FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X, Star } from "lucide-react";
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
import { Check, ChevronsUpDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PolarisInput, PolarisTextarea } from "@/components/ui/platform/polaris-primitives";

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
      <div className="flex items-center justify-between mb-1">
        <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200">
          Detailed Competencies
        </label>
        <span className="text-[12px] text-[#616161] dark:text-zinc-400">
          Add specific skills with proficiency
        </span>
      </div>

      <FieldArray
        name="skills"
        render={(arrayHelpers) => (
          <div className="space-y-4">
            {values.skills && values.skills.length > 0 ? (
              values.skills.map((skill: any, index: number) => {
                const skillErrors = (errors.skills as any)?.[index] || {};
                const skillTouched = (touched.skills as any)?.[index] || {};

                return (
                  <div
                    key={index}
                    className="p-4 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/40 relative space-y-4"
                  >
                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        className="h-7 w-7 rounded-[6px] flex items-center justify-center text-[#616161] hover:text-[#d72c0d] hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        onClick={() => arrayHelpers.remove(index)}
                        title="Remove skill"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                      <PolarisInput
                        name={`skills.${index}.name`}
                        label="Skill Name"
                        required
                        placeholder="e.g. React.js"
                        value={skill.name}
                        onChange={(e) =>
                          setFieldValue(`skills.${index}.name`, e.target.value)
                        }
                        error={skillTouched.name && skillErrors.name ? String(skillErrors.name) : null}
                      />

                      <div className="w-full space-y-1.5">
                        <div className="flex items-center justify-between gap-2 mb-[6px]">
                          <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
                            Category <span className="text-[#d72c0d] ml-0.5">*</span>
                          </label>
                        </div>
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
                            <button
                              type="button"
                              className={cn(
                                "w-full h-[40px] px-3 text-[14px] bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] flex items-center justify-between transition-all duration-150 outline-none hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500 cursor-pointer",
                                !skill.category && "text-[#8c9196] dark:text-zinc-500"
                              )}
                            >
                              <span className="truncate">
                                {skill.category
                                  ? (entitySkills.length > 0
                                      ? entitySkills.find(
                                          (c: any) => c.title === skill.category,
                                        )?.title
                                      : skillCategories.find(
                                          (c) => c.value === skill.category,
                                        )?.label) || skill.category
                                  : "Select category"}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 text-[#616161] dark:text-zinc-400 shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-0"
                            align="start"
                          >
                            <Command className="border-none">
                              <CommandInput placeholder="Search category..." className="h-10 text-[13px]" />
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
                                          className="flex items-center justify-between text-[13px] font-medium cursor-pointer"
                                        >
                                          <span>{c.title}</span>
                                          {skill.category === c.title && (
                                            <Check className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
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
                                          className="flex items-center justify-between text-[13px] font-medium cursor-pointer"
                                        >
                                          <span>{c.label}</span>
                                          {skill.category === c.value && (
                                            <Check className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
                                          )}
                                        </CommandItem>
                                      ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {skillErrors.category && skillTouched.category && (
                          <p className="text-[12.5px] text-[#d72c0d] dark:text-rose-400 mt-1 flex items-center gap-1 font-normal leading-[18px]">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{skillErrors.category}</span>
                          </p>
                        )}
                      </div>

                      {/* Level */}
                      <div className="w-full space-y-1.5">
                        <div className="flex items-center justify-between gap-2 mb-[6px]">
                          <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
                            Level <span className="text-[#d72c0d] ml-0.5">*</span>
                          </label>
                        </div>
                        <div className="relative">
                          <select
                            value={skill.level || ""}
                            onChange={(e) =>
                              setFieldValue(`skills.${index}.level`, e.target.value)
                            }
                            className="w-full h-[40px] pl-3 pr-9 text-[14px] text-[#303030] dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] appearance-none cursor-pointer transition-all duration-150 outline-none hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500"
                          >
                            <option value="" disabled>Select level</option>
                            {skillLevels.map((l) => (
                              <option key={l.value} value={l.value}>
                                {l.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#616161] dark:text-zinc-400">
                            <ChevronsUpDown className="h-4 w-4" />
                          </div>
                        </div>
                        {skillErrors.level && skillTouched.level && (
                          <p className="text-[12.5px] text-[#d72c0d] dark:text-rose-400 mt-1 flex items-center gap-1 font-normal leading-[18px]">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{skillErrors.level}</span>
                          </p>
                        )}
                      </div>

                      <PolarisInput
                        type="number"
                        name={`skills.${index}.yearsOfExperience`}
                        label="Years of Experience"
                        placeholder="e.g. 3"
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

                    <div className="space-y-1.5 pt-1">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
                        Tags & Keywords <span className="text-[#d72c0d] ml-0.5">*</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {skill.tags?.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-[#e4e5e7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 text-[11px] font-medium px-2 py-0.5 flex items-center gap-1 rounded-[6px]"
                          >
                            {tag}
                            <X
                              className="h-2.5 w-2.5 cursor-pointer hover:text-[#d72c0d]"
                              onClick={() => removeTag(index, tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <PolarisInput
                        placeholder="Type a tag and press Enter or comma..."
                        value={tagInput[index] || ""}
                        onChange={(e) =>
                          setTagInput({ ...tagInput, [index]: e.target.value })
                        }
                        onKeyDown={(e) => handleAddTag(index, e)}
                        error={skillTouched.tags && skillErrors.tags ? String(skillErrors.tags) : null}
                      />
                    </div>

                    <PolarisTextarea
                      label="Description"
                      placeholder="Describe how this skill is applied..."
                      value={skill.description || ""}
                      onChange={(e) =>
                        setFieldValue(
                          `skills.${index}.description`,
                          e.target.value,
                        )
                      }
                      className="min-h-[72px]"
                    />
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[8px] bg-[#f6f6f7]/40 dark:bg-zinc-900/20">
                <Star className="h-6 w-6 text-[#8c9196] mx-auto mb-2 opacity-60" />
                <p className="text-[13px] text-[#616161] dark:text-zinc-400 font-medium">
                  No detailed skills added yet.
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-300 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 hover:border-[#8c9196] dark:hover:border-zinc-600 transition-all rounded-[8px] h-[40px] text-[13.5px] font-medium"
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
