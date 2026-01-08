"use client";

import React, { useState } from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import {
  Clock,
  Users,
  Star,
  PlayCircle,
  ArrowRight,
  Filter,
  Search,
  BookOpen,
  GraduationCap,
  Laptop,
  Sparkles,
  CheckCircle2,
  Circle,
  Lock,
  Unlock,
  Layers,
  Play,
} from "lucide-react";

// --- Interfaces ---

interface Course {
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  studentsEnrolled?: number;
  rating?: number;
  instructor?: string;
  enrollmentLink?: string;
  price?: string;
  icon?: string;
  category?: string;
  isLocked?: boolean;
}

interface CommonProps {
  courses: Course[];
  isMobile?: boolean;
}

// --- Course Cards Layout ---

export const CourseCards: React.FC<CommonProps> = ({ courses, isMobile }) => {
  const getLevelColor = (level?: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "expert":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div
      className={cn(
        "grid gap-8",
        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {courses.map((course, idx) => (
        <div
          key={idx}
          className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500"
        >
          {/* Thumbnail */}
          <div className="relative h-56 overflow-hidden bg-slate-900">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-600 to-blue-700 text-white">
                <PlayCircle className="w-16 h-16 opacity-20" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md",
                  getLevelColor(course.level)
                )}
              >
                {course.level || "Beginner"}
              </span>
              {course.price && (
                <span className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {course.price}
                </span>
              )}
            </div>

            {/* Play Overlay */}
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 scale-0 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                <PlayCircle className="w-8 h-8 ml-1" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 flex-1 flex flex-col">
            <h3 className="text-xl font-black mb-3 text-slate-900 tracking-tight line-clamp-2 min-h-14">
              {course.title || "Mastering the Future"}
            </h3>

            <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
              {course.description ||
                "Deep dive into the core principles and advanced strategies of modern development."}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {course.duration || "12h"}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {course.studentsEnrolled || 0}
              </div>
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                {course.rating || "5.0"}
              </div>
            </div>

            {/* Instructor & CTA */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200" />
                <span className="text-xs font-black text-slate-900">
                  {course.instructor || "Expert Lead"}
                </span>
              </div>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-colors"
                onClick={() =>
                  course.enrollmentLink &&
                  window.open(course.enrollmentLink, "_blank")
                }
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Course Grid Layout ---

export const CourseGrid: React.FC<CommonProps> = ({ courses, isMobile }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(courses.map((c) => c.category || "General"))),
  ];

  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((c) => (c.category || "General") === activeCategory);

  return (
    <div className="space-y-12">
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border",
                activeCategory === category
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20"
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-400"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Grid */}
      <div
        className={cn(
          "grid gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {filteredCourses.map((course, idx) => (
          <div
            key={idx}
            className="group bg-slate-50 rounded-4xl p-6 border border-slate-100 hover:bg-white hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer"
            onClick={() =>
              course.enrollmentLink &&
              window.open(course.enrollmentLink, "_blank")
            }
          >
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              <GraduationCap className="w-7 h-7" />
            </div>

            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2 block">
                {course.category || "General"}
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-tight line-clamp-2">
                {course.title}
              </h3>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
                  />
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                +{course.studentsEnrolled} Joined
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-900 rounded-[3rem] p-10 text-white">
        <div className="text-center sm:text-left">
          <Sparkles className="w-8 h-8 text-blue-400 mb-4 mx-auto sm:mx-0" />
          <h4 className="text-3xl font-black mb-1">4.9/5</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Average Rating
          </p>
        </div>
        <div className="text-center sm:text-left border-y sm:border-y-0 sm:border-x border-white/10 py-6 sm:py-0 sm:px-10">
          <BookOpen className="w-8 h-8 text-purple-400 mb-4 mx-auto sm:mx-0" />
          <h4 className="text-3xl font-black mb-1">{courses.length}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Premium Courses
          </p>
        </div>
        <div className="text-center sm:text-left">
          <Laptop className="w-8 h-8 text-green-400 mb-4 mx-auto sm:mx-0" />
          <h4 className="text-3xl font-black mb-1">Lifetime</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Course Access
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Course List Layout ---

export const CourseList: React.FC<CommonProps> = ({ courses, isMobile }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {courses.map((course, idx) => (
        <div
          key={idx}
          className={cn(
            "group relative bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col items-stretch",
            !isMobile && "lg:flex-row"
          )}
        >
          {/* Thumbnail / Media Section */}
          <div
            className={cn(
              "h-64 relative overflow-hidden bg-slate-900 group-hover:bg-slate-800 transition-colors shrink-0",
              !isMobile && "lg:w-80 lg:h-auto"
            )}
          >
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-white backdrop-blur-md">
                  <PlayCircle className="w-10 h-10" />
                </div>
              </div>
            )}

            <div
              className={cn(
                "absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent",
                !isMobile && "lg:hidden"
              )}
            />
          </div>

          {/* Content Section */}
          <div
            className={cn("p-8 flex-1 flex flex-col", !isMobile && "lg:p-10")}
          >
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                {course.level || "Beginner"}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                {course.duration || "12 Hours"}
              </div>
              <div className="ml-auto flex items-center gap-1 text-amber-500 text-sm font-black">
                <Star className="w-4 h-4 fill-current" />
                {course.rating || "5.0"}
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-2xl">
              {course.description ||
                "Master the latest technologies and methodologies with our comprehensive curriculum designed by industry experts for modern developers."}
            </p>

            <div className="mt-auto pt-8 border-t border-slate-50 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden">
                    <div className="w-full h-full bg-linear-to-br from-slate-200 to-slate-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900">
                      {course.instructor || "Lead Instructor"}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Instructor
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-900">
                    {course.studentsEnrolled || 0}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Members
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center gap-3 w-full sm:w-auto",
                  isMobile && "flex-col"
                )}
              >
                {!isMobile && (
                  <div className="text-right hidden sm:block">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Price
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      {course.price || "Free"}
                    </span>
                  </div>
                )}
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-4xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-blue-500/20 active:scale-95"
                  onClick={() =>
                    course.enrollmentLink &&
                    window.open(course.enrollmentLink, "_blank")
                  }
                >
                  Launch Course
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Vertical Badge Divider for Large screens */}
          {!isMobile && (
            <div className="hidden lg:block absolute left-80 top-10 bottom-10 w-px bg-slate-50" />
          )}
        </div>
      ))}
    </div>
  );
};

// --- Learning Path Layout ---

export const LearningPath: React.FC<CommonProps> = ({ courses, isMobile }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="relative">
        {/* Connection Line */}
        {!isMobile && (
          <div className="absolute left-10 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2 hidden sm:block" />
        )}

        <div className="space-y-24">
          {courses.map((course, idx) => {
            const isLeft = idx % 2 === 0;
            const isFinished = idx === 0; // Mocking first as finished
            const isInProgress = idx === 1; // Mocking second as progress

            return (
              <div
                key={idx}
                className={cn(
                  "relative flex flex-col items-center group",
                  !isMobile && "sm:flex-row"
                )}
              >
                {/* Node Milestone */}
                {!isMobile && (
                  <div className="absolute left-10 md:left-1/2 -translate-x-1/2 z-10 hidden sm:block">
                    <div
                      className={cn(
                        "w-20 h-20 rounded-full border-8 border-white shadow-xl flex items-center justify-center transition-all duration-500",
                        isFinished
                          ? "bg-green-500 text-white"
                          : isInProgress
                          ? "bg-blue-600 text-white animate-pulse"
                          : "bg-slate-200 text-slate-400"
                      )}
                    >
                      {isFinished ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        <span className="text-xl font-black italic">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Card */}
                <div
                  className={cn(
                    "w-full transition-all duration-700",
                    isMobile
                      ? "text-center"
                      : isLeft
                      ? "sm:w-[42%] sm:mr-auto sm:text-right"
                      : "sm:w-[42%] sm:ml-auto sm:text-left"
                  )}
                >
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-lg hover:shadow-2xl transition-shadow group-hover:border-blue-500/20">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        isFinished
                          ? "bg-green-50 border-green-100 text-green-600"
                          : isInProgress
                          ? "bg-blue-50 border-blue-100 text-blue-600"
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      )}
                    >
                      {isFinished
                        ? "Completed"
                        : isInProgress
                        ? "Active Wave"
                        : "Phase " + (idx + 1)}
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                      {course.title}
                    </h3>

                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                      {course.description ||
                        "Master the foundational concepts required to progress to the next stage of this specialized curriculum."}
                    </p>

                    <div
                      className={cn(
                        "flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400",
                        isMobile
                          ? "justify-center"
                          : isLeft
                          ? "sm:justify-end"
                          : "justify-center sm:justify-start"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" /> 12 Modules
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connection Dots for mobile */}
                {isMobile && <div className="w-1 h-12 bg-slate-200 my-4" />}
                {!isMobile && (
                  <div className="sm:hidden w-1 h-12 bg-slate-200 my-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* Completion node */}
        <div className="mt-24 text-center relative z-10">
          <div className="w-24 h-24 bg-linear-to-br from-indigo-600 to-purple-700 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 rotate-12 scale-110 border-8 border-white">
            <Unlock className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-black mt-6 text-slate-900 tracking-tight">
            Career Path Unlocked
          </h4>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
            Completion Reward
          </p>
        </div>
      </div>
    </div>
  );
};

interface CoursesModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const CoursesModule = ({
  module,
  previewDevice,
}: CoursesModuleProps) => {
  const { content, layout } = module;
  const courses = content.courses || [];
  const isMobile = previewDevice === "mobile";

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-slate-50 border-y"
    >
      <div className="mb-12">
        <ModuleHeader
          title={content.title}
          description={content.description}
          layoutSettings={content.layoutSettings}
          alignment="center"
        />
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">
            No courses added yet. Add courses in the settings panel.
          </p>
        </div>
      )}

      {layout === "course-cards" && courses.length > 0 && (
        <CourseCards courses={courses} isMobile={isMobile} />
      )}

      {layout === "course-grid" && courses.length > 0 && (
        <CourseGrid courses={courses} isMobile={isMobile} />
      )}

      {layout === "course-list" && courses.length > 0 && (
        <CourseList courses={courses} isMobile={isMobile} />
      )}

      {layout === "learning-path" && courses.length > 0 && (
        <LearningPath courses={courses} isMobile={isMobile} />
      )}
    </ModuleContainer>
  );
};
