"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { IconPicker } from "./icon-picker";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CoursesSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const CoursesSettings = ({
  content,
  onChange,
  layout,
}: CoursesSettingsProps) => {
  const courses = content.courses || [];

  const addCourse = () => {
    const newCourses = [
      ...courses,
      {
        title: "",
        description: "",
        instructor: "",
        duration: "",
        level: "beginner",
        price: "",
        thumbnail: "",
        enrollmentLink: "",
        icon: "",
        rating: "",
        studentsEnrolled: "",
      },
    ];
    onChange({ courses: newCourses });
  };

  const updateCourse = (index: number, field: string, value: any) => {
    const newCourses = [...courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    onChange({ courses: newCourses });
  };

  const deleteCourse = (index: number) => {
    const newCourses = courses.filter((_: any, i: number) => i !== index);
    onChange({ courses: newCourses });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(courses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ courses: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Courses
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCourse}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Course
          </Button>
        </div>

        <Droppable droppableId="courses-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {courses.map((course: any, index: number) => (
                <Draggable
                  key={`course-${index}`}
                  draggableId={`course-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "space-y-2 p-3 bg-muted/10 rounded border transition-shadow",
                        snapshot.isDragging && "shadow-lg ring-2 ring-primary/20"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                          </div>
                          <span className="text-xs font-bold">Course {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteCourse(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Course Title</Label>
                        <Input
                          value={course.title || ""}
                          onChange={(e) => updateCourse(index, "title", e.target.value)}
                          placeholder="Introduction to Web Development"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={course.description || ""}
                          onChange={(e) => updateCourse(index, "description", e.target.value)}
                          placeholder="Course description..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Thumbnail Image</Label>
                        <ImageUploadWithCrop
                          currentImage={course.thumbnail || ""}
                          onImageUpdate={(url: string) => updateCourse(index, "thumbnail", url)}
                          aspectRatio={16 / 9}
                          label="Upload Thumbnail"
                          maxFileSize={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Icon</Label>
                          <IconPicker
                            value={course.icon || ""}
                            onChange={(icon) => updateCourse(index, "icon", icon)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Level</Label>
                          <Select
                            value={course.level || "beginner"}
                            onValueChange={(value) => updateCourse(index, "level", value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">🌱 Beginner</SelectItem>
                              <SelectItem value="intermediate">📈 Intermediate</SelectItem>
                              <SelectItem value="advanced">🚀 Advanced</SelectItem>
                              <SelectItem value="expert">💎 Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Instructor</Label>
                          <Input
                            value={course.instructor || ""}
                            onChange={(e) => updateCourse(index, "instructor", e.target.value)}
                            placeholder="John Doe"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Duration</Label>
                          <Input
                            value={course.duration || ""}
                            onChange={(e) => updateCourse(index, "duration", e.target.value)}
                            placeholder="8 weeks"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Price</Label>
                          <Input
                            value={course.price || ""}
                            onChange={(e) => updateCourse(index, "price", e.target.value)}
                            placeholder="$99"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Rating</Label>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={course.rating || ""}
                            onChange={(e) => updateCourse(index, "rating", e.target.value)}
                            placeholder="4.8"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Students</Label>
                          <Input
                            type="number"
                            value={course.studentsEnrolled || ""}
                            onChange={(e) => updateCourse(index, "studentsEnrolled", e.target.value)}
                            placeholder="1250"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Enrollment Link</Label>
                        <Input
                          value={course.enrollmentLink || ""}
                          onChange={(e) => updateCourse(index, "enrollmentLink", e.target.value)}
                          placeholder="https://..."
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {courses.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No courses yet. Click "Add Course" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
