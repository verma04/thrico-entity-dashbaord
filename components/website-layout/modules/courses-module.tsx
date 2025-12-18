"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  GraduationCap,
  User,
  ArrowRight,
  Play,
  Star,
  Users,
} from "lucide-react";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import * as LucideIcons from "lucide-react";

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

  // Helper to render Lucide icon
  const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  // Get level badge info
  const getLevelInfo = (level: string) => {
    const levelMap: Record<string, { emoji: string; color: string }> = {
      beginner: { emoji: "🌱", color: "bg-green-100 text-green-700" },
      intermediate: { emoji: "📈", color: "bg-blue-100 text-blue-700" },
      advanced: { emoji: "🚀", color: "bg-purple-100 text-purple-700" },
      expert: { emoji: "💎", color: "bg-amber-100 text-amber-700" },
    };
    return levelMap[level] || levelMap.beginner;
  };

  const EmptyState = () => (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <GraduationCap className="h-16 w-16 text-muted-foreground mb-4" />
        <CardTitle className="mb-2">No courses available</CardTitle>
        <CardDescription className="max-w-md">
          Add your first course to start building your educational platform.
        </CardDescription>
      </CardContent>
    </Card>
  );

  const CourseCard = ({ course, index }: { course: any; index: number }) => {
    const levelInfo = getLevelInfo(course.level);

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-400 to-purple-500">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              {course.icon ? (
                <div className="text-white">
                  {renderIcon(course.icon, "h-16 w-16")}
                </div>
              ) : (
                <Play className="h-12 w-12 text-white/80" />
              )}
            </div>
          )}
          {course.level && (
            <div className="absolute top-3 left-3">
              <Badge className={levelInfo.color}>
                {levelInfo.emoji} {course.level}
              </Badge>
            </div>
          )}
          {course.price && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 font-bold">
                {course.price}
              </Badge>
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-start gap-2">
            {course.icon && course.thumbnail && (
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                {renderIcon(course.icon, "w-4 h-4")}
              </div>
            )}
            <CardTitle className="text-lg line-clamp-2 flex-1">
              {course.title || `Course ${index + 1}`}
            </CardTitle>
          </div>
          <CardDescription className="line-clamp-2">
            {course.description ||
              "Learn essential skills in this comprehensive course."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.duration}
              </div>
            )}
            {course.studentsEnrolled && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {course.studentsEnrolled}
              </div>
            )}
            {course.rating && (
              <div className="flex items-center gap-1 ml-auto">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            className="w-full group"
            onClick={() =>
              course.enrollmentLink &&
              window.open(course.enrollmentLink, "_blank")
            }
          >
            Enroll Now
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 mx-auto block w-fit">
          {content.badge || "Featured Courses"}
        </Badge>
        <ModuleHeader
          title={content.title}
          description={content.description}
          layoutSettings={content.layoutSettings}
          titleClassName="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          descriptionClassName="text-lg max-w-2xl mx-auto"
        />
      </div>

      {courses.length === 0 && <EmptyState />}

      {/* Grid Cards Layout */}
      {layout === "course-cards" && courses.length > 0 && (
        <div
          className={cn(
            "grid gap-6",
            previewDevice === "mobile"
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {courses.map((course: any, idx: number) => (
            <CourseCard key={idx} course={course} index={idx} />
          ))}
        </div>
      )}

      {/* Detailed List Layout */}
      {layout === "course-list" && courses.length > 0 && (
        <div className="space-y-6">
          {courses.map((course: any, idx: number) => {
            const levelInfo = getLevelInfo(course.level);

            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-80 h-48 md:h-auto relative overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none bg-gradient-to-br from-blue-400 to-purple-500">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        {course.icon ? (
                          <div className="text-white">
                            {renderIcon(course.icon, "h-16 w-16")}
                          </div>
                        ) : (
                          <Play className="h-12 w-12 text-white/80" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <CardTitle className="text-xl">
                            {course.title || `Advanced Course ${idx + 1}`}
                          </CardTitle>
                          <div className="flex items-center gap-2 ml-4">
                            {course.level && (
                              <Badge className={levelInfo.color}>
                                {levelInfo.emoji} {course.level}
                              </Badge>
                            )}
                            {course.price && (
                              <Badge variant="secondary" className="font-bold">
                                {course.price}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-base mb-4">
                          {course.description ||
                            "Comprehensive curriculum covering advanced topics and practical applications."}
                        </CardDescription>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          {course.duration && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              {course.duration}
                            </div>
                          )}
                          {course.instructor && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <User className="h-4 w-4 mr-2" />
                              {course.instructor}
                            </div>
                          )}
                          {course.studentsEnrolled && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-2" />
                              {course.studentsEnrolled} students
                            </div>
                          )}
                          {course.rating && (
                            <div className="flex items-center text-sm text-muted-foreground ml-auto">
                              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {course.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        className="w-full md:w-auto self-start"
                        onClick={() =>
                          course.enrollmentLink &&
                          window.open(course.enrollmentLink, "_blank")
                        }
                      >
                        Start Learning
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Learning Path Layout */}
      {layout === "learning-path" && courses.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-16 bottom-8 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
            {courses.map((course: any, idx: number) => {
              const levelInfo = getLevelInfo(course.level);

              return (
                <div
                  key={idx}
                  className="relative flex items-start gap-6 mb-12 last:mb-0"
                >
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {course.icon ? (
                      <div className="text-white">
                        {renderIcon(course.icon, "w-8 h-8")}
                      </div>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <Card className="flex-1 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">
                          {course.title || `Learning Phase ${idx + 1}`}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {course.level && (
                            <Badge className={levelInfo.color}>
                              {levelInfo.emoji} {course.level}
                            </Badge>
                          )}
                          <Badge variant={idx === 0 ? "default" : "secondary"}>
                            {idx === 0 ? "Start Here" : `Step ${idx + 1}`}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {course.description ||
                          "Build foundational knowledge and advance your skills through structured learning modules."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center gap-4">
                        {course.duration && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.duration}
                          </div>
                        )}
                        {course.studentsEnrolled && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-1" />
                            {course.studentsEnrolled}
                          </div>
                        )}
                        {course.rating && (
                          <div className="flex items-center text-sm text-muted-foreground ml-auto">
                            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{course.rating}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <a
                        href={course.enrollmentLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant={idx === 0 ? "default" : "outline"}
                          className="w-full"
                        >
                          {idx === 0 ? "Begin Journey" : "Continue Learning"}
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Tabs Layout */}
      {layout === "course-grid" && courses.length > 0 && (
        <div>
          <div className="flex gap-2 mb-8 border-b overflow-x-auto">
            {["Beginner", "Intermediate", "Advanced", "Expert"].map(
              (category, idx) => (
                <Button
                  key={category}
                  variant={idx === 0 ? "default" : "ghost"}
                  className={cn(
                    "rounded-none border-b-2 border-transparent whitespace-nowrap",
                    idx === 0 && "border-b-primary"
                  )}
                >
                  {category}
                </Button>
              )
            )}
          </div>
          <div
            className={cn(
              "grid gap-6",
              previewDevice === "mobile"
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2"
            )}
          >
            {courses.map((course: any, idx: number) => {
              const levelInfo = getLevelInfo(course.level);

              return (
                <Card
                  key={idx}
                  className="group hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {course.icon && (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            {renderIcon(course.icon, "w-5 h-5")}
                          </div>
                        )}
                        <CardTitle className="text-lg">
                          {course.title || `Course ${idx + 1}`}
                        </CardTitle>
                      </div>
                      {course.level && (
                        <Badge className={`ml-2 ${levelInfo.color}`}>
                          {levelInfo.emoji} {course.level}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      {course.description ||
                        "Perfect for beginners looking to get started."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                      {course.duration && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                      )}
                      {course.studentsEnrolled && (
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {course.studentsEnrolled}
                        </div>
                      )}
                      {course.rating && (
                        <div className="flex items-center text-muted-foreground ml-auto">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full group">
                      <a
                        href={course.enrollmentLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Start Course
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};
