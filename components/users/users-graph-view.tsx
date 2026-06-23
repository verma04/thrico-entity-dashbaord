"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS_GRAPH } from "@/graphql/quries/user";
import { useGetIndustries } from "@/graphql/quries/industries/industry-queries";
import { useGetSkills } from "@/graphql/quries/skills/skill-queries";
import { useGetInterests } from "@/graphql/quries/interests/interest-queries";
import { useGetUserEducationGraph } from "@/graphql/quries/education/education-queries";
import { useGetUserExperienceGraph } from "@/graphql/quries/experience/experience-queries";
import { useGetUserLocationGraph } from "@/graphql/quries/location/location-queries";

import type {
  GraphNode,
  GraphEdge,
  GetUsersGraphQueryResponse,
  GetUsersGraphQueryVariables,
  UsersGraphFilter,
} from "@/types/user-graph-types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  ChevronRight,
  X,
  Factory,
  Star,
  Building2,
  GraduationCap,
  Heart,
  MapPin,
  Link2,
  UserPlus,
  Check,
  ChevronsUpDown,
  Layers,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { EcosystemGraphView } from "@/components/shared/ecosystem-graph-view";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { cn } from "@/lib/utils";

// ─── Industry color palette ──────────────────────────────────────
const INDUSTRY_COLORS = [
  "#d7d7e9ff", // indigo
  "#cee4e7ff", // cyan
  "#ecd3c4ff", // orange
  "#edccccff", // red
  "#d3c6e1ff", // purple
  "#cfe6ffff", // blue
  "#d6f1dfff", // green
  "#f6efceb2", // yellow
  "#f1d1e0ff", // pink
];

function getIndustryColor(index: number) {
  return INDUSTRY_COLORS[index % INDUSTRY_COLORS.length];
}

// ─── Cytoscape Stylesheet (light theme) ──────────────────────────
const GRAPH_STYLESHEET: any[] = [
  {
    selector: "node",
    style: {
      "background-color": "data(color)",
      label: "data(label)",
      color: "#334155",
      "text-valign": "bottom",
      "text-halign": "center",
      "font-size": "9px",
      "font-weight": "500",
      width: "data(size)",
      height: "data(size)",
      shape: "ellipse",
      "border-width": 1.5,
      "border-color": "#e2e8f0",
      "text-margin-y": 6,
      "text-outline-width": 0,
      "overlay-padding": 6,
      "background-image": "data(avatar)",
      "background-fit": "cover",
      "background-clip": "node",
    } as any,
  },
  {
    selector: "node[!avatar]",
    style: {
      "background-image": "none",
    } as any,
  },
  {
    selector: "edge[relationType='CONNECTED']",
    style: {
      width: 0.8,
      "line-color": "#cbd5e1",
      "target-arrow-shape": "none",
      "curve-style": "bezier",
      opacity: 0.5,
    } as any,
  },
  {
    selector: "edge[relationType='FOLLOWS']",
    style: {
      width: 0.6,
      "line-color": "#94a3b8",
      "target-arrow-color": "#94a3b8",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      opacity: 0.35,
      "arrow-scale": 0.4,
    } as any,
  },
  {
    selector: "node:active",
    style: {
      "overlay-color": "#0f172a",
      "overlay-padding": 10,
      "overlay-opacity": 0.05,
    } as any,
  },
  {
    selector: "node.highlighted",
    style: {
      "border-color": "#0f172a",
      "border-width": 2,
      "z-index": 999,
    } as any,
  },
  {
    selector: "edge.highlighted",
    style: {
      width: 1.5,
      opacity: 0.8,
      "z-index": 999,
    } as any,
  },
  {
    selector: "node.faded",
    style: {
      opacity: 0.15,
    } as any,
  },
  {
    selector: "edge.faded",
    style: {
      opacity: 0.05,
    } as any,
  },
];

// ─── Filter Tag Component ────────────────────────────────────────
function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-indigo-900 transition-colors"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}

// ─── Filter Section Component ────────────────────────────────────
interface FilterSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({
  icon,
  title,
  children,
  defaultOpen = false,
}: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
      >
        <span className="text-slate-400">{icon}</span>
        <span className="text-xs font-semibold text-slate-700 flex-1">
          {title}
        </span>
        <ChevronRight
          className={`h-3 w-3 text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

// ─── Filter Input for typing free text ───────────────────────────
function FilterInput({
  placeholder,
  values,
  onAdd,
  onRemove,
}: {
  placeholder: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [input, setInput] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder={placeholder}
        className="h-7 text-xs bg-white border-slate-200 text-slate-700 placeholder:text-slate-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {values.map((v) => (
            <FilterTag key={v} label={v} onRemove={() => onRemove(v)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Filter Combobox for selecting from options ──────────────────
function FilterCombobox({
  placeholder,
  options,
  values,
  onAdd,
  onRemove,
  searchValue,
  onSearchChange,
}: {
  placeholder: string;
  options: string[];
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const search = searchValue !== undefined ? searchValue : localSearch;
  const handleSearchChange = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    setLocalSearch(val);
  };

  const filteredOptions = useMemo(() => {
    if (searchValue !== undefined) return options; // Options already filtered by server
    if (!localSearch) return options.slice(0, 50);
    return options
      .filter((o) => o.toLowerCase().includes(localSearch.toLowerCase()))
      .slice(0, 50);
  }, [options, localSearch, searchValue]);

  return (
    <div className="space-y-2">
      <Popover open={open} modal={true} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-8 text-xs bg-white border-slate-200 text-slate-500 font-normal hover:bg-slate-50"
          >
            {placeholder}
            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[220px] p-0 border-slate-200"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandInput
              placeholder="Search..."
              className="h-8 text-xs"
              value={search}
              onValueChange={handleSearchChange}
            />
            <CommandList className="max-h-48 overflow-y-auto custom-scrollbar">
              <CommandEmpty className="py-2 px-4 text-xs text-slate-500 text-center">
                No option found.
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      if (!values.includes(option)) {
                        onAdd(option);
                      } else {
                        onRemove(option);
                      }
                      handleSearchChange("");
                    }}
                    className="text-xs py-1.5 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        values.includes(option) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {values.map((v) => (
            <FilterTag key={v} label={v} onRemove={() => onRemove(v)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Filter Combobox Single for Location ─────────────────────────
function FilterComboboxSingle({
  placeholder,
  options,
  value,
  onChange,
  onSearchChange,
}: {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onSearchChange?: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (onSearchChange) onSearchChange(val);
  };

  const filteredOptions = useMemo(() => {
    if (!search) return options.slice(0, 50);
    return options
      .filter((o) => o.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 50);
  }, [options, search]);

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-8 text-xs bg-white border-slate-200 text-slate-700 font-normal hover:bg-slate-50"
          >
            {value ? (
              <span className="truncate">{value}</span>
            ) : (
              <span className="text-slate-500">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[220px] p-0 border-slate-200"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search location..."
              className="h-8 text-xs"
              value={search}
              onValueChange={handleSearchChange}
            />
            <CommandList className="max-h-48 overflow-y-auto custom-scrollbar">
              <CommandEmpty className="py-2 px-4 text-xs text-slate-500 text-center">
                No location found.
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      onChange(option === value ? "" : option);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="text-xs py-1.5 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3 w-3",
                        value === option ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <div className="flex flex-wrap gap-1">
          <FilterTag label={value} onRemove={() => onChange("")} />
        </div>
      )}
    </div>
  );
}

// ─── Selected User Detail Panel ──────────────────────────────────
function UserDetailPanel({
  user,
  connections,
  onClose,
}: {
  user: GraphNode;
  connections: Array<{ user: GraphNode; relationType: string }>;
  onClose: () => void;
}) {
  const avatarUrl = user.avatar
    ? `https://cdn.thrico.network/${user.avatar}`
    : "";
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";

  const connected = connections.filter((c) => c.relationType === "CONNECTED");
  const follows = connections.filter((c) => c.relationType === "FOLLOWS");

  return (
    <div className="absolute top-4 left-4 z-20 w-72 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
      <div className="h-16 bg-slate-50 border-b border-slate-100 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 h-6 w-6 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200/50"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="-mt-8 px-4">
        <UserProfileHoverCard
          user={{
            id: user.id,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            avatar: user.avatar || "",
            headline: user.email || "",
          }}
        >
          <Avatar className="h-16 w-16 border-[3px] border-white shadow-sm bg-white cursor-pointer">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-slate-100 text-slate-600 text-lg font-medium">
              {user.firstName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </UserProfileHoverCard>
      </div>
      <div className="px-4 pt-2 pb-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 truncate">
            {name}
          </h3>
          {user.email && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {user.email}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex flex-col bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 flex-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400" /> Points
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {user.gamificationScore ?? 0}
              </span>
            </div>
            <div className="flex flex-col bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 flex-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                <Heart className="h-3 w-3 text-rose-400" /> Impact
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {user.impactScore ?? 0}
              </span>
            </div>
          </div>
        </div>

        {connected.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Link2 className="h-3 w-3" />
              Connections ({connected.length})
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {connected.slice(0, 8).map(({ user: u }, idx) => {
                const uAvatar = u.avatar
                  ? `https://cdn.thrico.network/${u.avatar}`
                  : "";
                const uName =
                  [u.firstName, u.lastName].filter(Boolean).join(" ") || "User";
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Avatar className="h-6 w-6 border border-slate-200 bg-white">
                      <AvatarImage src={uAvatar} alt={uName} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-[9px] font-medium">
                        {u.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] text-slate-700 truncate">
                      {uName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {follows.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <UserPlus className="h-3 w-3" />
              Follows ({follows.length})
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {follows.slice(0, 8).map(({ user: u }, idx) => {
                const uAvatar = u.avatar
                  ? `https://cdn.thrico.network/${u.avatar}`
                  : "";
                const uName =
                  [u.firstName, u.lastName].filter(Boolean).join(" ") || "User";
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Avatar className="h-6 w-6 border border-slate-200 bg-white">
                      <AvatarImage src={uAvatar} alt={uName} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-[9px] font-medium">
                        {u.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] text-slate-700 truncate">
                      {uName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export function UsersGraphView({
  isFullScreenMode,
}: {
  isFullScreenMode?: boolean;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 500);

  // Filter state
  const [locationInput, setLocationInput] = useState("");
  const [debouncedLocation] = useDebounce(locationInput, 500);
  const [industries, setIndustries] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [education, setEducation] = useState<string[]>([]);
  const [company, setCompany] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [gamificationScore, setGamificationScore] = useState<[number, number]>([
    0, 10000,
  ]);
  const [debouncedGamificationScore] = useDebounce(gamificationScore, 500);
  const [impactScore, setImpactScore] = useState<[number, number]>([0, 1000]);
  const [debouncedImpactScore] = useDebounce(impactScore, 500);
  const [limit, setLimit] = useState<number>(200);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Build filter object
  const filter = useMemo<UsersGraphFilter | undefined>(() => {
    const f: UsersGraphFilter = {};
    if (debouncedSearch.length > 0) f.search = debouncedSearch;
    if (debouncedLocation.length > 0) f.location = debouncedLocation;
    if (industries.length > 0) f.industries = industries;
    if (skills.length > 0) f.skills = skills;
    if (education.length > 0) f.education = education;
    if (company.length > 0) f.company = company;
    if (interests.length > 0) f.interests = interests;
    if (
      debouncedGamificationScore[0] > 0 ||
      debouncedGamificationScore[1] < 10000
    ) {
      f.gamificationScore = {
        min: debouncedGamificationScore[0],
        max: debouncedGamificationScore[1],
      };
    }
    if (debouncedImpactScore[0] > 0 || debouncedImpactScore[1] < 1000) {
      f.impactScore = {
        min: debouncedImpactScore[0],
        max: debouncedImpactScore[1],
      };
    }
    return Object.keys(f).length > 0 ? f : undefined;
  }, [
    debouncedSearch,
    debouncedLocation,
    industries,
    skills,
    education,
    company,
    interests,
    debouncedGamificationScore,
    debouncedImpactScore,
  ]);

  const activeFilterCount =
    (debouncedSearch.length > 0 ? 1 : 0) +
    (debouncedLocation.length > 0 ? 1 : 0) +
    industries.length +
    skills.length +
    education.length +
    company.length +
    interests.length +
    (debouncedGamificationScore[0] > 0 || debouncedGamificationScore[1] < 10000
      ? 1
      : 0) +
    (debouncedImpactScore[0] > 0 || debouncedImpactScore[1] < 1000 ? 1 : 0);

  const clearAllFilters = () => {
    setSearchInput("");
    setLocationInput("");
    setIndustries([]);
    setSkills([]);
    setEducation([]);
    setCompany([]);
    setInterests([]);
    setGamificationScore([0, 10000]);
    setImpactScore([0, 1000]);
    setLimit(200);
  };

  const { data, loading } = useQuery<
    GetUsersGraphQueryResponse,
    GetUsersGraphQueryVariables
  >(GET_USERS_GRAPH, {
    variables: { limit, filter },
  });

  const [industrySearch, setIndustrySearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [interestSearch, setInterestSearch] = useState("");
  const [educationSearch, setEducationSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  const [debouncedIndustrySearch] = useDebounce(industrySearch, 300);
  const [debouncedSkillSearch] = useDebounce(skillSearch, 300);
  const [debouncedInterestSearch] = useDebounce(interestSearch, 300);
  const [debouncedEducationSearch] = useDebounce(educationSearch, 300);
  const [debouncedCompanySearch] = useDebounce(companySearch, 300);
  const [debouncedLocationSearch] = useDebounce(locationSearch, 300);

  // Fetch lists for filter dropdowns (only those that are bounded lists)
  const { data: industriesData } = useGetIndustries({
    variables: { search: debouncedIndustrySearch, limit: 50 },
  });
  const { data: skillsData } = useGetSkills({
    variables: { search: debouncedSkillSearch, limit: 50 },
  });
  const { data: interestsData } = useGetInterests({
    variables: { search: debouncedInterestSearch, limit: 50 },
  });
  const { data: educationData } = useGetUserEducationGraph({
    variables: { search: debouncedEducationSearch, limit: 50 },
  });
  const { data: experienceData } = useGetUserExperienceGraph({
    variables: { search: debouncedCompanySearch, limit: 50 },
  });
  const { data: locationData } = useGetUserLocationGraph({
    variables: { search: debouncedLocationSearch, limit: 50 },
  });

  const industryOptions = useMemo(
    () => industriesData?.getIndustries.map((i) => i.title) || [],
    [industriesData],
  );
  const skillOptions = useMemo(
    () => skillsData?.getSkills.map((s) => s.title) || [],
    [skillsData],
  );
  const interestOptions = useMemo(
    () => interestsData?.getInterests.map((i) => i.title) || [],
    [interestsData],
  );
  const educationOptions = useMemo(
    () =>
      Array.from(
        new Set(
          educationData?.getUserEducationGraph
            .map((e) => e.school.title)
            .filter(Boolean),
        ),
      ) || [],
    [educationData],
  );
  const companyOptions = useMemo(
    () =>
      Array.from(
        new Set(
          experienceData?.getUserExperienceGraph
            .map((e) => e.company.title)
            .filter(Boolean),
        ),
      ) || [],
    [experienceData],
  );
  const locationOptions = useMemo(
    () =>
      Array.from(
        new Set(
          locationData?.getUserLocationGraph
            .map((l) => l.location.title)
            .filter(Boolean),
        ),
      ) || [],
    [locationData],
  );

  // ── Build connection map ───────────────────────────────────────
  const connectionMap = useMemo(() => {
    const graphResponse = data?.getUsersGraph;
    if (!graphResponse)
      return { adj: new Map(), counts: new Map(), nodeMap: new Map() };

    const { nodes = [], edges = [] } = graphResponse;
    const nodeMap = new Map<string, GraphNode>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const counts = new Map<string, number>();
    edges.forEach((edge) => {
      counts.set(edge.source, (counts.get(edge.source) || 0) + 1);
      counts.set(edge.target, (counts.get(edge.target) || 0) + 1);
    });

    const adj = new Map<
      string,
      Array<{ user: GraphNode; relationType: string }>
    >();
    edges.forEach((edge) => {
      const s = nodeMap.get(edge.source);
      const t = nodeMap.get(edge.target);
      if (!s || !t) return;
      if (!adj.has(edge.source)) adj.set(edge.source, []);
      adj.get(edge.source)!.push({ user: t, relationType: edge.relationType });
      if (!adj.has(edge.target)) adj.set(edge.target, []);
      adj.get(edge.target)!.push({ user: s, relationType: edge.relationType });
    });

    return { adj, counts, nodeMap };
  }, [data]);

  // ── Cytoscape elements ─────────────────────────────────────────
  const elements = useMemo(() => {
    const graphResponse = data?.getUsersGraph;
    if (!graphResponse) return [];

    const { nodes = [], edges = [] } = graphResponse;
    if (nodes.length === 0) return [];

    const counts = new Map<string, number>();
    edges.forEach((edge) => {
      counts.set(edge.source, (counts.get(edge.source) || 0) + 1);
      counts.set(edge.target, (counts.get(edge.target) || 0) + 1);
    });

    const cyNodes: any[] = nodes.map((user) => {
      const name =
        [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";
      const avatarUrl = user.avatar
        ? `https://cdn.thrico.network/${user.avatar}`
        : "";
      const connCount = counts.get(user.id) || 0;
      const size = Math.max(20, Math.min(60, 18 + connCount * 5));
      const colorIdx =
        (user.firstName || "U").charCodeAt(0) % INDUSTRY_COLORS.length;

      return {
        data: {
          id: `user-${user.id}`,
          label: name.length > 14 ? name.substring(0, 12) + "…" : name,
          type: "user",
          avatar: avatarUrl || undefined,
          raw: user,
          color: getIndustryColor(colorIdx),
          size,
        },
      };
    });

    const cyEdges: any[] = edges.map((edge, idx) => ({
      data: {
        id: `edge-${idx}-${edge.source}-${edge.target}`,
        source: `user-${edge.source}`,
        target: `user-${edge.target}`,
        relationType: edge.relationType,
      },
    }));

    return [...cyNodes, ...cyEdges];
  }, [data]);

  // ── Selected user info ─────────────────────────────────────────
  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    const user = connectionMap.nodeMap.get(selectedUserId);
    if (!user) return null;
    const connections = connectionMap.adj.get(selectedUserId) || [];
    return { user, connections };
  }, [selectedUserId, connectionMap]);

  const handleNodeSelect = (nodeData: any) => {
    setSelectedUserId(nodeData.raw?.id || null);
  };

  // ── Stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const graphResponse = data?.getUsersGraph;
    if (!graphResponse)
      return {
        totalNodes: 0,
        totalEdges: 0,
        connectionEdges: 0,
        followEdges: 0,
      };
    const { nodes = [], edges = [] } = graphResponse;
    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      connectionEdges: edges.filter((e) => e.relationType === "CONNECTED")
        .length,
      followEdges: edges.filter((e) => e.relationType === "FOLLOWS").length,
    };
  }, [data]);

  const legend = (
    <>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-indigo-400 border border-indigo-300" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Users
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-5 rounded bg-slate-300" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Connected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-0 w-5 border-t border-dashed border-slate-400" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Follows
        </span>
      </div>
    </>
  );

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-xl border border-slate-200 bg-white",
        isFullScreenMode ? "h-full" : "h-[calc(100vh-200px)] min-h-[600px]",
      )}
    >
      {/* ─── LEFT: Filters Panel ──────────────────────────────── */}
      <div className="w-64 min-w-[256px] border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-[10px] font-medium text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-md border border-rose-200 transition-all duration-150 active:scale-95"
              >
                <X className="h-3 w-3" />
                Clear all ({activeFilterCount})
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            <span className="text-indigo-600 font-semibold">
              {stats.totalNodes}
            </span>{" "}
            people · {stats.totalEdges} relationships
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Search filter */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search people..."
                className="pl-7 h-8 text-xs bg-white border-slate-200 text-slate-700 placeholder:text-slate-400"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          <FilterSection
            icon={<Layers className="h-3.5 w-3.5" />}
            title="Node Limit"
            defaultOpen
          >
            <div className="space-y-3 px-1 pb-1 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Max Nodes
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {limit}
                </span>
              </div>
              <Slider
                value={[limit]}
                min={50}
                max={10000}
                step={50}
                onValueChange={(val) => setLimit(val[0])}
                className="w-full"
              />
            </div>
          </FilterSection>

          <FilterSection
            icon={<MapPin className="h-3.5 w-3.5" />}
            title="Location"
            defaultOpen
          >
            <FilterComboboxSingle
              placeholder="Select location..."
              options={locationOptions}
              value={locationInput}
              onChange={setLocationInput}
              onSearchChange={setLocationSearch}
            />
          </FilterSection>

          <FilterSection
            icon={<Factory className="h-3.5 w-3.5" />}
            title="Industry"
          >
            <FilterCombobox
              placeholder="Select industries..."
              options={industryOptions}
              values={industries}
              onAdd={(v) =>
                !industries.includes(v) && setIndustries([...industries, v])
              }
              onRemove={(v) => setIndustries(industries.filter((i) => i !== v))}
              searchValue={industrySearch}
              onSearchChange={setIndustrySearch}
            />
          </FilterSection>

          <FilterSection icon={<Star className="h-3.5 w-3.5" />} title="Skills">
            <FilterCombobox
              placeholder="Select skills..."
              options={skillOptions}
              values={skills}
              onAdd={(v) => !skills.includes(v) && setSkills([...skills, v])}
              onRemove={(v) => setSkills(skills.filter((s) => s !== v))}
              searchValue={skillSearch}
              onSearchChange={setSkillSearch}
            />
          </FilterSection>

          <FilterSection
            icon={<Building2 className="h-3.5 w-3.5" />}
            title="Company"
          >
            <FilterCombobox
              placeholder="Select companies..."
              options={companyOptions}
              values={company}
              onAdd={(v) => !company.includes(v) && setCompany([...company, v])}
              onRemove={(v) => setCompany(company.filter((c) => c !== v))}
              onSearchChange={setCompanySearch}
            />
          </FilterSection>

          <FilterSection
            icon={<GraduationCap className="h-3.5 w-3.5" />}
            title="University"
          >
            <FilterCombobox
              placeholder="Select universities..."
              options={educationOptions}
              values={education}
              onAdd={(v) =>
                !education.includes(v) && setEducation([...education, v])
              }
              onRemove={(v) => setEducation(education.filter((e) => e !== v))}
              onSearchChange={setEducationSearch}
            />
          </FilterSection>

          <FilterSection
            icon={<Heart className="h-3.5 w-3.5" />}
            title="Interests"
          >
            <FilterCombobox
              placeholder="Select interests..."
              options={interestOptions}
              values={interests}
              onAdd={(v) =>
                !interests.includes(v) && setInterests([...interests, v])
              }
              onRemove={(v) => setInterests(interests.filter((i) => i !== v))}
              searchValue={interestSearch}
              onSearchChange={setInterestSearch}
            />
          </FilterSection>
          <FilterSection
            icon={<Star className="h-3.5 w-3.5 text-amber-500" />}
            title="Gamification Points"
          >
            <div className="px-3 pt-4 pb-2">
              <Slider
                min={0}
                max={10000}
                step={100}
                value={[gamificationScore[0], gamificationScore[1]]}
                onValueChange={(val) => setGamificationScore([val[0], val[1]])}
                className="mt-2"
              />
              <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500 font-medium">
                <span>{gamificationScore[0]}</span>
                <span>
                  {gamificationScore[1] === 10000
                    ? "10000+"
                    : gamificationScore[1]}
                </span>
              </div>
            </div>
          </FilterSection>

          <FilterSection
            icon={<Heart className="h-3.5 w-3.5 text-rose-500" />}
            title="Impact Score"
          >
            <div className="px-3 pt-4 pb-2">
              <Slider
                min={0}
                max={1000}
                step={100}
                value={[impactScore[0], impactScore[1]]}
                onValueChange={(val) => setImpactScore([val[0], val[1]])}
                className="mt-2"
              />
              <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500 font-medium">
                <span>{impactScore[0]}</span>
                <span>
                  {impactScore[1] === 1000 ? "1000+" : impactScore[1]}
                </span>
              </div>
            </div>
          </FilterSection>
        </div>
      </div>

      {/* ─── CENTER: Graph (using EcosystemGraphView) ─────────── */}
      <div className="flex-1 flex flex-col">
        <EcosystemGraphView
          elements={elements}
          stylesheet={GRAPH_STYLESHEET}
          loading={loading}
          loadingText="Loading network graph..."
          emptyTitle="No graph data available"
          emptyDescription="There are no user connections or follows to visualize yet."
          legend={legend}
          selectedNodeId={selectedUserId ? selectedUserId : null}
          onNodeSelect={handleNodeSelect}
          onNodeDeselect={() => setSelectedUserId(null)}
          detailPanel={
            selectedUser ? (
              <UserDetailPanel
                user={selectedUser.user}
                connections={selectedUser.connections}
                onClose={() => setSelectedUserId(null)}
              />
            ) : null
          }
        />
      </div>
    </div>
  );
}
