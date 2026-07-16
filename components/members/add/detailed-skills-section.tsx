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
        <Label className="text-sm font-bold text-foreground">
          Detailed Skills
        </Label>
        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
          Add specific skills with proficiency
        </p>
      </div>

      <FieldArray
        name="skills"
        render={(arrayHelpers) => (
          <div className="space-y-6">
            {values.skills && values.skills.length > 0 ? (
              values.skills.map((skill: any, index: number) => {
                const skillErrors = (errors.skills as any)?.[index] || {};
                const skillTouched = (touched.skills as any)?.[index] || {};

                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-border bg-muted/50 relative"
                  >
                    <div className="absolute top-4 right-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 rounded-lg"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground">
                          Skill Name <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          name={`skills.${index}.name`}
                          placeholder="e.g. React.js"
                          className="h-10 rounded-lg bg-card"
                          value={skill.name}
                          onChange={(e) =>
                            setFieldValue(
                              `skills.${index}.name`,
                              e.target.value,
                            )
                          }
                        />
                        {skillErrors.name && skillTouched.name && (
                          <p className="text-[10px] text-rose-500">
                            {skillErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground">
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
                                "w-full justify-between h-10 rounded-lg bg-card",
                                !skill.category && "text-muted-foreground",
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
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-0"
                            align="start"
                          >
                            <Command>
                              <CommandInput placeholder="Search category..." />
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
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              skill.category === c.title
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                          {c.title}
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
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              skill.category === c.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                          {c.label}
                                        </CommandItem>
                                      ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {skillErrors.category && skillTouched.category && (
                          <p className="text-[10px] text-rose-500">
                            {skillErrors.category}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground">
                          Level <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                          value={skill.level}
                          onValueChange={(val) =>
                            setFieldValue(`skills.${index}.level`, val)
                          }
                        >
                          <SelectTrigger className="h-10 rounded-lg bg-card">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {skillLevels.map((l) => (
                              <SelectItem key={l.value} value={l.value}>
                                {l.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {skillErrors.level && skillTouched.level && (
                          <p className="text-[10px] text-rose-500">
                            {skillErrors.level}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground">
                          Years of Experience
                        </Label>
                        <Input
                          type="number"
                          name={`skills.${index}.yearsOfExperience`}
                          placeholder="e.g. 3"
                          className="h-10 rounded-lg bg-card"
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

                    <div className="mt-4 space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        Tags <span className="text-rose-500">*</span>
                      </Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {skill.tags?.map((tag: string) => (
                          <Badge
                            key={tag}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100"
                          >
                            {tag}
                            <X
                              className="h-3 w-3 ml-1 cursor-pointer"
                              onClick={() => removeTag(index, tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Type a tag and press enter..."
                        className="h-10 rounded-lg bg-card"
                        value={tagInput[index] || ""}
                        onChange={(e) =>
                          setTagInput({ ...tagInput, [index]: e.target.value })
                        }
                        onKeyDown={(e) => handleAddTag(index, e)}
                      />
                      {skillErrors.tags && skillTouched.tags && (
                        <p className="text-[10px] text-rose-500">
                          {skillErrors.tags}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        Description
                      </Label>
                      <Textarea
                        placeholder="Describe how you used this skill..."
                        className="min-h-[80px] rounded-lg bg-card resize-none"
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
              <div className="text-center p-8 border border-dashed border-border rounded-xl bg-muted/30">
                <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-medium">
                  No detailed skills added yet.
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all rounded-xl h-12"
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
