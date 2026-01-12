"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleContainer } from "./module-container";
import { ModuleHeader } from "./module-header";
import { Calendar, MapPin, Users, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventCountdownModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const EventCountdownModule = ({
  module,
  previewDevice,
}: EventCountdownModuleProps) => {
  const { content, layout } = module;

  // Sample countdown values
  const timeUnits = [
    { value: "07", label: "Days" },
    { value: "14", label: "Hours" },
    { value: "23", label: "Minutes" },
    { value: "45", label: "Seconds" },
  ];

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      {/* Timer Large Layout */}
      {layout === "timer-large" && (
        <div className="p-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <ModuleHeader
            title={content.title || "Next Event"}
            description={content.description || "Don't miss our upcoming event"}
            alignment="center"
            titleClassName="text-4xl font-bold"
            descriptionClassName="opacity-90 text-lg"
            titleColor={content.titleColor}
            descriptionColor={content.descriptionColor}
            hideTitle={content.hideTitle}
            hideDescription={content.hideDescription}
          />
          <div className="flex justify-center gap-6 mb-8">
            {timeUnits.map((unit) => (
              <div key={unit.label} className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 min-w-[100px]">
                  <div className="text-5xl font-bold">{unit.value}</div>
                </div>
                <div className="text-sm mt-3 opacity-75 uppercase tracking-wide">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            {content.ctaText || "Register Now"}
          </button>
        </div>
      )}

      {/* Event Card Layout */}
      {layout === "event-card" && (
        <div className="py-12 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden shadow-xl">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 flex flex-col justify-center">
                  <div className="mb-6">
                    <span className="inline-block bg-white/20 text-xs px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                      Upcoming Event
                    </span>
                    <ModuleHeader
                      title={content.title || "Annual Tech Conference 2024"}
                      description={
                        content.description ||
                        "Join us for an amazing experience"
                      }
                      titleClassName="text-3xl font-bold"
                      descriptionClassName="text-indigo-100"
                      titleColor={content.titleColor}
                      descriptionColor={content.descriptionColor}
                      hideTitle={content.hideTitle}
                      hideDescription={content.hideDescription}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {content.eventDate || "March 15, 2024 at 10:00 AM"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5" />
                      <span>{content.venue || "Grand Convention Center"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5" />
                      <span>
                        {content.attendees || "500+ Attendees Expected"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 flex flex-col justify-center">
                  <div className="text-center mb-6">
                    <h4 className="text-gray-600 font-semibold mb-4 uppercase tracking-wide text-sm">
                      Event Starts In
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {timeUnits.map((unit) => (
                        <div key={unit.label} className="text-center">
                          <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
                            <div className="text-3xl font-bold text-indigo-600">
                              {unit.value}
                            </div>
                          </div>
                          <div className="text-xs mt-2 text-gray-500 uppercase">
                            {unit.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">
                    {content.ctaText || "Reserve Your Spot"}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Circular Progress Layout */}
      {layout === "circular-progress" && (
        <div className="py-16 bg-gradient-to-b from-gray-900 to-black text-white">
          <div className="max-w-6xl mx-auto text-center">
            <ModuleHeader
              title={content.title || "Countdown to Launch"}
              description={
                content.description || "Get ready for something extraordinary"
              }
              alignment="center"
              titleClassName="text-4xl font-bold mb-3"
              descriptionClassName="text-gray-400 mb-12 text-lg"
              titleColor={content.titleColor}
              descriptionColor={content.descriptionColor}
              hideTitle={content.hideTitle}
              hideDescription={content.hideDescription}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {timeUnits.map((unit, idx) => (
                <div key={unit.label} className="relative">
                  <div className="relative w-32 h-32 mx-auto">
                    {/* Circular background */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-800"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="352"
                        strokeDashoffset={
                          352 - (352 * (parseInt(unit.value) % 60)) / 60
                        }
                        className={cn(
                          idx === 0 && "text-blue-500",
                          idx === 1 && "text-purple-500",
                          idx === 2 && "text-pink-500",
                          idx === 3 && "text-orange-500"
                        )}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{unit.value}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm mt-4 text-gray-400 uppercase tracking-wider">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {content.ctaText || "Get Notified"}
            </button>
          </div>
        </div>
      )}

      {/* Compact Banner Layout */}
      {layout === "compact-banner" && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="py-4 px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <ModuleHeader
                    title={content.title || "Webinar: Future of AI"}
                    description={
                      content.eventDate || "December 20, 2024 • 3:00 PM EST"
                    }
                    titleClassName="font-bold text-lg"
                    descriptionClassName="text-emerald-100 text-sm"
                    titleColor={content.titleColor}
                    descriptionColor={content.descriptionColor}
                    hideTitle={content.hideTitle}
                    hideDescription={content.hideDescription}
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-3">
                  {timeUnits.map((unit, idx) => (
                    <div key={unit.label} className="flex items-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{unit.value}</div>
                        <div className="text-xs opacity-75">{unit.label}</div>
                      </div>
                      {idx < timeUnits.length - 1 && (
                        <span className="text-xl mx-2 opacity-50">:</span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors whitespace-nowrap">
                  {content.ctaText || "Join Live"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Counter Layout */}
      {layout === "milestone-counter" && (
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <ModuleHeader
                title={content.title || "Event Timeline"}
                description={
                  content.description || "Track our journey to the main event"
                }
                alignment="center"
                titleClassName="text-4xl font-bold mb-3 text-gray-900"
                descriptionClassName="text-gray-600"
                titleColor={content.titleColor}
                descriptionColor={content.descriptionColor}
                hideTitle={content.hideTitle}
                hideDescription={content.hideDescription}
              />
            </div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {[
                {
                  phase: "Registration Opens",
                  status: "completed",
                  date: "Nov 1",
                },
                {
                  phase: "Early Bird Deadline",
                  status: "completed",
                  date: "Dec 1",
                },
                {
                  phase: "Speaker Lineup Released",
                  status: "completed",
                  date: "Dec 10",
                },
                {
                  phase: "Main Event",
                  status: "upcoming",
                  date: "Jan 15",
                  highlight: true,
                },
              ].map((milestone, idx) => (
                <div key={idx} className="relative pl-20 mb-8 last:mb-0">
                  <div
                    className={cn(
                      "absolute left-6 w-5 h-5 rounded-full border-4 border-white",
                      milestone.status === "completed"
                        ? "bg-green-500"
                        : milestone.highlight
                        ? "bg-blue-500 ring-4 ring-blue-100"
                        : "bg-gray-300"
                    )}
                  />
                  <Card
                    className={cn(
                      "transition-all",
                      milestone.highlight && "border-blue-500 shadow-lg"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {milestone.phase}
                            {milestone.status === "completed" && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {milestone.date}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    {milestone.highlight && (
                      <CardContent>
                        <div className="grid grid-cols-4 gap-3">
                          {timeUnits.map((unit) => (
                            <div
                              key={unit.label}
                              className="text-center bg-blue-50 rounded-lg p-3"
                            >
                              <div className="text-2xl font-bold text-blue-600">
                                {unit.value}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {unit.label}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                          {content.ctaText || "Register Now"}
                        </button>
                      </CardContent>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};
