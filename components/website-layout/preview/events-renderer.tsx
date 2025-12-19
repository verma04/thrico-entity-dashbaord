import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Clock } from "lucide-react";
import { ModuleContainer } from "../modules/module-container";

export const EventsRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const title = content.title || "Upcoming Events";
  const description =
    content.description || "Join us for these exciting events";
  const events = content.events || [
    {
      title: "Product Launch Conference",
      date: "2024-03-15",
      time: "10:00 AM",
      location: "San Francisco, CA",
      description:
        "Join us for the unveiling of our latest product innovations",
      image: "/api/placeholder/400/250",
      status: "upcoming",
    },
    {
      title: "Developer Workshop",
      date: "2024-03-22",
      time: "2:00 PM",
      location: "Virtual Event",
      description: "Learn advanced techniques from our engineering team",
      image: "/api/placeholder/400/250",
      status: "registration-open",
    },
    {
      title: "Annual User Summit",
      date: "2024-04-10",
      time: "9:00 AM",
      location: "New York, NY",
      description: "Connect with fellow users and discover new possibilities",
      image: "/api/placeholder/400/250",
      status: "early-bird",
    },
  ];

  // Card Events Layout
  if (layout === "card-events") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "grid gap-8",
              isMobile ? "grid-cols-1" : "grid-cols-3"
            )}
          >
            {events.map((event: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Event Image */}
                {event.image ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Event Image
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                  <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // List Events Layout
  if (layout === "list-events") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <div className={cn("container mx-auto max-w-4xl", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="space-y-6">
            {events.map((event: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-lg border p-6 flex gap-6 hover:shadow-md transition-shadow"
              >
                {/* Event Image or Icon */}
                {event.image ? (
                  <div
                    className={cn(
                      "rounded-lg flex-shrink-0 overflow-hidden",
                      isMobile ? "w-20 h-20" : "w-32 h-32"
                    )}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      "bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400",
                      isMobile ? "w-16 h-16" : "w-24 h-24"
                    )}
                  >
                    <Calendar className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        event.status === "upcoming" &&
                          "bg-blue-100 text-blue-800",
                        event.status === "registration-open" &&
                          "bg-green-100 text-green-800",
                        event.status === "early-bird" &&
                          "bg-orange-100 text-orange-800"
                      )}
                    >
                      {event.status.replace("-", " ")}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {event.description}
                  </p>
                  <div
                    className={cn(
                      "flex gap-4 mb-4",
                      isMobile && "flex-col gap-2"
                    )}
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Timeline Events Layout
  if (layout === "timeline-events") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <div className={cn("container mx-auto max-w-4xl", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20" />
            <div className="space-y-12">
              {events.map((event: any, idx: number) => (
                <div key={idx} className="relative flex gap-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold relative z-10">
                    {new Date(event.date).getDate()}
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-lg border">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <div className="text-sm text-primary font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {event.description}
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Calendar Events Layout
  if (layout === "calendar-events") {
    return (
      <ModuleContainer containerSettings={content.containerSettings}>
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "grid gap-8",
              isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
            )}
          >
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold text-lg mb-4">Event Calendar</h3>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-muted-foreground p-2"
                    >
                      {day}
                    </div>
                  )
                )}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = i + 1;
                  const hasEvent = events.some(
                    (event: any) => new Date(event.date).getDate() === date
                  );
                  return (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square flex items-center justify-center text-sm cursor-pointer rounded",
                        hasEvent
                          ? "bg-primary text-white"
                          : "hover:bg-gray-100",
                        date > 31 && "text-gray-300"
                      )}
                    >
                      {date <= 31 ? date : ""}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Upcoming Events</h3>
              {events.map((event: any, idx: number) => (
                <div key={idx} className="bg-white rounded-lg border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="text-xs text-primary">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{event.time}</span>
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModuleContainer>
    );
  }

  // Default Simple Events
  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      <div className={cn("container mx-auto", isMobile && "px-4")}>
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div
          className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-3")}
        >
          {events.map((event: any, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {event.description}
              </p>
              <div className="text-xs text-muted-foreground">
                {new Date(event.date).toLocaleDateString()} • {event.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleContainer>
  );
};
