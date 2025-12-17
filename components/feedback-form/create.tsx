"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Settings from "./settings";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { SortableQuestionItem } from "./editor/sortable-question-Item";
import { Sidebar } from "./editor/sidebar";
import { options } from "./options";
import Preview from "./preview/preview";

import { Question } from "../../../store/ts-types";
import { useFormStore } from "@/store/useFormStore";

interface NewFormPageProps {
  add: () => void;
}

export default function NewFormPage({}: NewFormPageProps) {
  const {
    formTitle,
    formDescription,
    questions,
    formSettings,
    setFormTitle,
    setFormDescription,
    addQuestion,
    updateQuestion,
    duplicateQuestion,
    updateOption,
    addOption,
    removeQuestion,
    updateFormSetting,
    reorderQuestions,
  } = useFormStore();

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const oldIndex = result.source.index;
    const newIndex = result.destination.index;
    
    if (oldIndex !== newIndex) {
      reorderQuestions(oldIndex, newIndex);
    }
  }

  const [tab, setActiveTab] = useState("edit");

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto p-6">
        <Tabs defaultValue="edit" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-6">
            <div className="flex gap-6">
              {/* Sidebar */}
              <Card className="w-1/5">
                <CardHeader className="pb-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {options.map((option) => (
                        <DropdownMenuItem
                          key={option.key}
                          onClick={() => addQuestion(option.key as Question["type"])}
                        >
                          {option.icon && <span className="mr-2">{option.icon}</span>}
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sidebar-questions">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {questions.map((question, index) => (
                            <Draggable
                              key={question.id}
                              draggableId={question.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Sidebar
                                    question={question}
                                    index={index}
                                    duplicateQuestion={duplicateQuestion}
                                    updateQuestion={updateQuestion}
                                    updateOption={updateOption}
                                    addOption={addOption}
                                    removeQuestion={removeQuestion}
                                    options={options}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CardContent>
              </Card>

              {/* Main Content */}
              <div className="flex-1 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="form-title">Form Title</Label>
                        <Input
                          id="form-title"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          className="text-xl font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form-description">Description (Optional)</Label>
                        <Textarea
                          id="form-description"
                          placeholder="Enter a description for your form"
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="main-questions">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {questions.map((question, index) => (
                          <Draggable
                            key={question.id}
                            draggableId={question.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <SortableQuestionItem
                                  question={question}
                                  index={index}
                                  updateQuestion={updateQuestion}
                                  updateOption={updateOption}
                                  addOption={addOption}
                                  removeQuestion={removeQuestion}
                                  options={options}
                                  dragHandleProps={provided.dragHandleProps}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Preview
              formTitle={formTitle}
              formDescription={formDescription}
              questions={questions}
              formSettings={formSettings}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Settings
              formSettings={formSettings}
              updateFormSetting={updateFormSetting}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
