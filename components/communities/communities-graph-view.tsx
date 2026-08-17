"use client";

import React, { useMemo, useState } from "react";
import {
  useGetCommunityUsersGraph,
  CommunitiesGraphUser,
  CommunitiesGraphCommunity,
} from "@/graphql/quries/communities/communities-graph-queries";
import { getCommunities } from "@/graphql/actions/group";

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
  Users,
  Lock,
  Globe,
  Laptop,
  MapPin,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  User,
  Crown,
  Layers,
  Check,
  ChevronsUpDown,
  Building2,
  Sparkles,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { EcosystemGraphView } from "@/components/shared/ecosystem-graph-view";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { cn } from "@/lib/utils";

// ─── Filter Tag Component ────────────────────────────────────────
function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}

// ─── Filter Section Accordion Component ──────────────────────────
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
          className={`h-3 w-3 text-slate-400 transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

// ─── Filter Combobox for selecting multiple options ──────────────
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
  options: Array<{ value: string; label: string }>;
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
    if (!search) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

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
            <span className="truncate">{placeholder}</span>
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
                No options found.
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = values.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        if (!isSelected) {
                          onAdd(option.value);
                        } else {
                          onRemove(option.value);
                        }
                        handleSearchChange("");
                      }}
                      className="text-xs py-1.5 cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {values.map((v) => {
            const opt = options.find((o) => o.value === v);
            return (
              <FilterTag
                key={v}
                label={opt ? opt.label : v}
                onRemove={() => onRemove(v)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Cytoscape Stylesheet ────────────────────────────────────────
const GRAPH_STYLESHEET: any[] = [
  {
    selector: "node[type='user']",
    style: {
      "background-color": "#f1f5f9",
      label: "data(label)",
      color: "#334155",
      "text-valign": "bottom",
      "text-halign": "center",
      "font-size": "10px",
      "font-weight": "500",
      width: 36,
      height: 36,
      shape: "ellipse",
      "border-width": 1.5,
      "border-color": "#cbd5e1",
      "text-margin-y": 6,
      "text-outline-width": 0,
      "overlay-padding": 6,
      "background-image": "data(avatar)",
      "background-fit": "cover",
      "background-clip": "node",
    } as any,
  },
  {
    selector: "node[type='user'][!avatar]",
    style: {
      "background-color": "#f1f5f9",
      "background-image": "none",
    } as any,
  },
  {
    selector: "node[type='community']",
    style: {
      "background-color": "#e0e7ff",
      label: "data(label)",
      color: "#3730a3",
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "11px",
      "font-weight": "600",
      width: "data(size)",
      height: "data(size)",
      shape: "round-rectangle",
      "border-width": 1.5,
      "border-color": "#a5b4fc",
      "text-outline-width": 0,
      "overlay-padding": 8,
      "text-max-width": "85px",
      "text-wrap": "wrap",
    } as any,
  },
  {
    selector: "edge",
    style: {
      width: 1,
      "line-color": "#e2e8f0",
      "target-arrow-color": "#e2e8f0",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      opacity: 0.8,
      "arrow-scale": 0.6,
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
      "line-color": "#94a3b8",
      "target-arrow-color": "#94a3b8",
      opacity: 1,
      "z-index": 999,
    } as any,
  },
  {
    selector: "node.faded",
    style: {
      opacity: 0.2,
    } as any,
  },
  {
    selector: "edge.faded",
    style: {
      opacity: 0.1,
    } as any,
  },
];

type EnrichedCommunity = CommunitiesGraphCommunity & {
  privacy?: string;
  communityType?: string;
  joiningTerms?: string;
  numberOfUser?: number;
  description?: string;
  cover?: string;
  addedBy?: string;
  creator?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
};

type SelectedNodeInfo =
  | { type: "user"; data: CommunitiesGraphUser; connectedCommunities: string[] }
  | {
      type: "community";
      data: EnrichedCommunity;
      connectedUsers: CommunitiesGraphUser[];
    };

// ─── Selected Node Detail Panel ──────────────────────────────────
function NodeDetailPanel({
  info,
  onClose,
}: {
  info: SelectedNodeInfo;
  onClose: () => void;
}) {
  if (info.type === "user") {
    const user = info.data;
    const avatarUrl = user.avatar
      ? `https://cdn.thrico.network/${user.avatar}`
      : "";
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";

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
              id: user.globalUserId,
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.avatar,
              headline: user.headline,
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
            {user.headline && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                {user.headline}
              </p>
            )}
          </div>
          {info.connectedCommunities.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Communities ({info.connectedCommunities.length})
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {info.connectedCommunities.map((community) => (
                  <span
                    key={community}
                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-50 text-slate-600 border border-slate-200"
                  >
                    {community}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const community = info.data;
  const creatorName = community.creator
    ? [community.creator.firstName, community.creator.lastName]
        .filter(Boolean)
        .join(" ") || "Admin"
    : community.addedBy || "Entity";

  return (
    <div className="absolute top-4 left-4 z-20 w-80 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden animate-in slide-in-from-left-2 fade-in duration-200">
      <div className="h-12 bg-slate-50 border-b border-slate-100 relative flex items-center px-4">
        <Users className="h-4 w-4 text-indigo-600 mr-2" />
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Community Details
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 h-6 w-6 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-200/50"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {community.title}
          </h3>
          {community.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {community.description}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {community.privacy && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border",
                community.privacy === "PUBLIC"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              )}
            >
              {community.privacy === "PUBLIC" ? (
                <Globe className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
              {community.privacy}
            </span>
          )}

          {community.communityType && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Laptop className="h-3 w-3" />
              {community.communityType}
            </span>
          )}

          {community.joiningTerms && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              <ShieldCheck className="h-3 w-3" />
              {community.joiningTerms === "ANYONE_CAN_JOIN"
                ? "Direct Join"
                : community.joiningTerms === "ADMIN_ONLY_ADD"
                ? "Admin Invite"
                : community.joiningTerms}
            </span>
          )}
        </div>

        {/* Creator Info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Created By:</span>
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-slate-400" />
            {creatorName}
          </span>
        </div>

        {/* Members List */}
        {info.connectedUsers.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Connected Members ({info.connectedUsers.length})
            </p>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
              {info.connectedUsers.map((user) => {
                const avatarUrl = user.avatar
                  ? `https://cdn.thrico.network/${user.avatar}`
                  : "";
                const uname =
                  [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                  "User";
                return (
                  <UserProfileHoverCard
                    key={user.id}
                    user={{
                      id: user.globalUserId,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      avatar: user.avatar,
                      headline: user.headline,
                    }}
                  >
                    <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                      <Avatar className="h-7 w-7 border border-slate-200 bg-white">
                        <AvatarImage src={avatarUrl} alt={uname} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {user.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">
                          {uname}
                        </p>
                        {user.headline && (
                          <p className="text-[10px] text-slate-500 truncate">
                            {user.headline}
                          </p>
                        )}
                      </div>
                    </div>
                  </UserProfileHoverCard>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main CommunitiesGraphView Component ─────────────────────────
export function CommunitiesGraphView({
  isFullScreenMode,
}: {
  isFullScreenMode?: boolean;
}) {
  // Search & Node Limit
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [limit, setLimit] = useState<number>(300);

  // Filter States
  const [privacyTypes, setPrivacyTypes] = useState<string[]>([]);
  const [communityTypes, setCommunityTypes] = useState<string[]>([]);
  const [joiningTerms, setJoiningTerms] = useState<string[]>([]);
  const [membersRange, setMembersRange] = useState<[number, number]>([0, 1000]);
  const [debouncedMembersRange] = useDebounce(membersRange, 300);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  // Selected Node
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(
    null
  );

  // Fetch Community Graph Edges
  const { data: graphDataResponse, loading: graphLoading } =
    useGetCommunityUsersGraph({
      variables: {
        limit,
        search: debouncedSearch.length > 0 ? debouncedSearch : undefined,
      },
    });

  // Fetch Full Community Entities for Metadata Enrichment
  const { data: allCommunitiesData, loading: communitiesLoading } =
    getCommunities({
      variables: {
        input: {
          status: "ALL",
          limit: 500,
        },
      },
    });

  // Map of community ID -> Community Details
  const communityDetailsMap = useMemo(() => {
    const map = new Map<string, any>();
    const communities = allCommunitiesData?.getCommunities?.data || [];
    communities.forEach((c: any) => {
      if (c?.id) {
        map.set(c.id, c);
      }
    });
    return map;
  }, [allCommunitiesData]);

  // Options for Privacy Types
  const privacyOptions = useMemo(
    () => [
      { value: "PUBLIC", label: "Public" },
      { value: "PRIVATE", label: "Private" },
    ],
    []
  );

  // Options for Community Types
  const communityTypeOptions = useMemo(() => {
    const defaultOptions = [
      { value: "VIRTUAL", label: "Virtual" },
      { value: "INPERSON", label: "In Person" },
      { value: "HYBRID", label: "Hybrid" },
    ];
    const discovered = new Set<string>(["VIRTUAL", "INPERSON", "HYBRID"]);
    const communities = allCommunitiesData?.getCommunities?.data || [];
    communities.forEach((c: any) => {
      if (c?.communityType && !discovered.has(c.communityType.toUpperCase())) {
        discovered.add(c.communityType.toUpperCase());
        defaultOptions.push({
          value: c.communityType,
          label: c.communityType,
        });
      }
    });
    return defaultOptions;
  }, [allCommunitiesData]);

  // Options for Joining Terms
  const joiningTermsOptions = useMemo(() => {
    const defaultOptions = [
      { value: "ANYONE_CAN_JOIN", label: "Direct Join (Anyone Can Join)" },
      { value: "ADMIN_ONLY_ADD", label: "Admin Invite Only" },
      { value: "APPROVAL_REQUIRED", label: "Approval Required" },
    ];
    const discovered = new Set<string>([
      "ANYONE_CAN_JOIN",
      "ADMIN_ONLY_ADD",
      "APPROVAL_REQUIRED",
    ]);
    const communities = allCommunitiesData?.getCommunities?.data || [];
    communities.forEach((c: any) => {
      if (c?.joiningTerms && !discovered.has(c.joiningTerms.toUpperCase())) {
        discovered.add(c.joiningTerms.toUpperCase());
        defaultOptions.push({
          value: c.joiningTerms,
          label: c.joiningTerms,
        });
      }
    });
    return defaultOptions;
  }, [allCommunitiesData]);

  // Options for Creators
  const creatorOptions = useMemo(() => {
    const creatorsMap = new Map<string, string>();
    const communities = allCommunitiesData?.getCommunities?.data || [];
    communities.forEach((c: any) => {
      if (c?.creator) {
        const name =
          [c.creator.firstName, c.creator.lastName].filter(Boolean).join(" ") ||
          "User";
        creatorsMap.set(c.creator.id || name, name);
      } else if (c?.addedBy) {
        creatorsMap.set(c.addedBy, c.addedBy);
      }
    });
    if (creatorsMap.size === 0) {
      creatorsMap.set("ENTITY", "Entity Admin");
    }
    return Array.from(creatorsMap.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [allCommunitiesData]);

  // Calculate active filter count
  const activeFilterCount =
    (debouncedSearch.length > 0 ? 1 : 0) +
    privacyTypes.length +
    communityTypes.length +
    joiningTerms.length +
    (debouncedMembersRange[0] > 0 || debouncedMembersRange[1] < 1000 ? 1 : 0) +
    selectedCreators.length;

  const clearAllFilters = () => {
    setSearchInput("");
    setPrivacyTypes([]);
    setCommunityTypes([]);
    setJoiningTerms([]);
    setMembersRange([0, 1000]);
    setSelectedCreators([]);
    setLimit(300);
  };

  // Build Filtered Cytoscape Elements
  const { elements, graphLookup, stats } = useMemo(() => {
    const rawEdges = graphDataResponse?.getCommunityUsersGraph || [];
    if (rawEdges.length === 0) {
      return {
        elements: [],
        graphLookup: {
          userCommunities: new Map(),
          communityUsers: new Map(),
        },
        stats: { totalCommunities: 0, totalUsers: 0, totalEdges: 0 },
      };
    }

    const userNodesMap = new Map<string, any>();
    const communityNodesMap = new Map<
      string,
      { count: number; raw: EnrichedCommunity }
    >();
    const graphEdges: any[] = [];
    const userCommunities = new Map<string, string[]>();
    const communityUsers = new Map<string, CommunitiesGraphUser[]>();

    // First pass: aggregate all edges and counts
    rawEdges.forEach((edge) => {
      const cid = edge.community.id;
      const uid = edge.user.id;
      const details = communityDetailsMap.get(cid);

      const enrichedCommunity: EnrichedCommunity = {
        ...edge.community,
        privacy: details?.privacy || (edge.community as any).privacy || "PUBLIC",
        communityType:
          details?.communityType ||
          (edge.community as any).communityType ||
          "VIRTUAL",
        joiningTerms:
          details?.joiningTerms ||
          (edge.community as any).joiningTerms ||
          "ANYONE_CAN_JOIN",
        numberOfUser: details?.numberOfUser ?? 1,
        description: details?.description,
        cover: details?.cover,
        addedBy: details?.addedBy,
        creator: details?.creator,
      };

      if (!communityNodesMap.has(cid)) {
        communityNodesMap.set(cid, {
          count: 1,
          raw: enrichedCommunity,
        });
      } else {
        communityNodesMap.get(cid)!.count++;
      }

      if (!userCommunities.has(uid)) userCommunities.set(uid, []);
      if (!userCommunities.get(uid)!.includes(edge.community.title)) {
        userCommunities.get(uid)!.push(edge.community.title);
      }

      if (!communityUsers.has(cid)) communityUsers.set(cid, []);
      if (!communityUsers.get(cid)!.find((u) => u.id === uid)) {
        communityUsers.get(cid)!.push(edge.user);
      }
    });

    // Second pass: Filter communities based on active filter criteria
    const validCommunityIds = new Set<string>();

    communityNodesMap.forEach(({ count, raw }, cid) => {
      // 1. Privacy Filter
      if (
        privacyTypes.length > 0 &&
        (!raw.privacy || !privacyTypes.includes(raw.privacy.toUpperCase()))
      ) {
        return;
      }

      // 2. Community Type Filter
      if (
        communityTypes.length > 0 &&
        (!raw.communityType ||
          !communityTypes.includes(raw.communityType.toUpperCase()))
      ) {
        return;
      }

      // 3. Joining Terms Filter
      if (
        joiningTerms.length > 0 &&
        (!raw.joiningTerms ||
          !joiningTerms.includes(raw.joiningTerms.toUpperCase()))
      ) {
        return;
      }

      // 4. Members Range Filter (0-1000)
      const effectiveMemberCount = raw.numberOfUser ?? count;
      if (
        effectiveMemberCount < debouncedMembersRange[0] ||
        (debouncedMembersRange[1] < 1000 &&
          effectiveMemberCount > debouncedMembersRange[1])
      ) {
        return;
      }

      // 5. Created By Filter
      if (selectedCreators.length > 0) {
        const creatorId = raw.creator?.id;
        const creatorName = raw.creator
          ? [raw.creator.firstName, raw.creator.lastName]
              .filter(Boolean)
              .join(" ")
          : null;
        const addedBy = raw.addedBy;

        const matchesCreator = selectedCreators.some(
          (c) =>
            (creatorId && c === creatorId) ||
            (creatorName && c === creatorName) ||
            (addedBy && c === addedBy)
        );

        if (!matchesCreator) return;
      }

      validCommunityIds.add(cid);
    });

    // Build Cytoscape Nodes & Edges from valid filtered communities
    rawEdges.forEach((edge) => {
      const cid = edge.community.id;
      if (!validCommunityIds.has(cid)) return;

      const userId = `user-${edge.user.id}`;
      const communityId = `community-${cid}`;

      if (!userNodesMap.has(userId)) {
        const name =
          [edge.user.firstName, edge.user.lastName].filter(Boolean).join(" ") ||
          "User";
        const avatarUrl = edge.user.avatar
          ? `https://cdn.thrico.network/${edge.user.avatar}`
          : "";
        userNodesMap.set(userId, {
          data: {
            id: userId,
            label: name,
            type: "user",
            avatar: avatarUrl || undefined,
            raw: edge.user,
          },
        });
      }

      graphEdges.push({
        data: {
          id: `edge-${edge.user.id}-${cid}`,
          source: userId,
          target: communityId,
        },
      });
    });

    const communityElements = Array.from(validCommunityIds).map((cid) => {
      const item = communityNodesMap.get(cid)!;
      const size = Math.max(40, Math.min(85, 32 + item.count * 8));
      return {
        data: {
          id: `community-${cid}`,
          label: item.raw.title,
          type: "community",
          size,
          count: item.count,
          raw: item.raw,
        },
      };
    });

    const finalElements = [
      ...Array.from(userNodesMap.values()),
      ...communityElements,
      ...graphEdges,
    ];

    return {
      elements: finalElements,
      graphLookup: { userCommunities, communityUsers },
      stats: {
        totalCommunities: validCommunityIds.size,
        totalUsers: userNodesMap.size,
        totalEdges: graphEdges.length,
      },
    };
  }, [
    graphDataResponse,
    communityDetailsMap,
    privacyTypes,
    communityTypes,
    joiningTerms,
    debouncedMembersRange,
    selectedCreators,
  ]);

  // Node Selection Handler
  const handleNodeSelect = (nodeData: any) => {
    if (nodeData.type === "user") {
      const rawUser = nodeData.raw as CommunitiesGraphUser;
      const connectedCommunities =
        graphLookup.userCommunities.get(rawUser.id) || [];
      setSelectedNode({ type: "user", data: rawUser, connectedCommunities });
    } else if (nodeData.type === "community") {
      const rawCommunity = nodeData.raw as EnrichedCommunity;
      const connectedUsers =
        graphLookup.communityUsers.get(rawCommunity.id) || [];
      setSelectedNode({
        type: "community",
        data: rawCommunity,
        connectedUsers,
      });
    }
  };

  // Legend
  const legend = (
    <>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-slate-100 border border-slate-300" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Members
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded bg-indigo-100 border border-indigo-300" />
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          Communities
        </span>
      </div>
    </>
  );

  const loading = graphLoading || communitiesLoading;

  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-xl border border-slate-200 bg-white",
        isFullScreenMode ? "h-full" : "h-[calc(100vh-220px)] min-h-[600px]"
      )}
    >
      {/* ─── LEFT: Filter Sidebar ──────────────────────────────── */}
      <div className="w-64 min-w-[256px] border-r border-slate-200 flex flex-col bg-slate-50/50">
        {/* Sidebar Header */}
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 transition-all duration-150 active:scale-95"
              >
                <X className="h-3 w-3" />
                Clear all ({activeFilterCount})
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            <span className="text-zinc-700 font-semibold">
              {stats.totalCommunities}
            </span>{" "}
            communities ·{" "}
            <span className="text-zinc-700 font-semibold">
              {stats.totalUsers}
            </span>{" "}
            members · {stats.totalEdges} relations
          </p>
        </div>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Search Filter */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search communities..."
                className="pl-7 h-8 text-xs bg-white border-slate-200 text-slate-700 placeholder:text-slate-400"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          {/* Node Limit Filter */}
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
                <span className="text-xs font-bold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                  {limit}
                </span>
              </div>
              <Slider
                value={[limit]}
                min={25}
                max={1000}
                step={25}
                onValueChange={(val) => setLimit(val[0])}
                className="w-full"
              />
            </div>
          </FilterSection>

          {/* By Privacy Type */}
          <FilterSection
            icon={<Lock className="h-3.5 w-3.5" />}
            title="Privacy Type"
            defaultOpen
          >
            <FilterCombobox
              placeholder="Select privacy type..."
              options={privacyOptions}
              values={privacyTypes}
              onAdd={(v) =>
                !privacyTypes.includes(v) &&
                setPrivacyTypes([...privacyTypes, v])
              }
              onRemove={(v) =>
                setPrivacyTypes(privacyTypes.filter((p) => p !== v))
              }
            />
          </FilterSection>

          {/* By Community Type */}
          <FilterSection
            icon={<Laptop className="h-3.5 w-3.5" />}
            title="Community Type"
            defaultOpen
          >
            <FilterCombobox
              placeholder="Select community type..."
              options={communityTypeOptions}
              values={communityTypes}
              onAdd={(v) =>
                !communityTypes.includes(v) &&
                setCommunityTypes([...communityTypes, v])
              }
              onRemove={(v) =>
                setCommunityTypes(communityTypes.filter((t) => t !== v))
              }
            />
          </FilterSection>

          {/* By Joining Terms */}
          <FilterSection
            icon={<ShieldCheck className="h-3.5 w-3.5" />}
            title="Joining Terms"
            defaultOpen
          >
            <FilterCombobox
              placeholder="Select joining terms..."
              options={joiningTermsOptions}
              values={joiningTerms}
              onAdd={(v) =>
                !joiningTerms.includes(v) &&
                setJoiningTerms([...joiningTerms, v])
              }
              onRemove={(v) =>
                setJoiningTerms(joiningTerms.filter((j) => j !== v))
              }
            />
          </FilterSection>

          {/* Members Range (0-1000) */}
          <FilterSection
            icon={<Users className="h-3.5 w-3.5" />}
            title="Members Range (0-1000)"
            defaultOpen
          >
            <div className="px-1 pt-3 pb-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-medium">
                  Count Range
                </span>
                <span className="text-xs font-bold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                  {membersRange[0]} -{" "}
                  {membersRange[1] === 1000 ? "1000+" : membersRange[1]}
                </span>
              </div>
              <Slider
                min={0}
                max={1000}
                step={20}
                value={[membersRange[0], membersRange[1]]}
                onValueChange={(val) => setMembersRange([val[0], val[1]])}
                className="w-full"
              />
              <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-medium">
                <span>0</span>
                <span>500</span>
                <span>1000+</span>
              </div>
            </div>
          </FilterSection>

          {/* By Created By */}
          <FilterSection
            icon={<Crown className="h-3.5 w-3.5" />}
            title="Created By"
          >
            <FilterCombobox
              placeholder="Select creators..."
              options={creatorOptions}
              values={selectedCreators}
              onAdd={(v) =>
                !selectedCreators.includes(v) &&
                setSelectedCreators([...selectedCreators, v])
              }
              onRemove={(v) =>
                setSelectedCreators(selectedCreators.filter((c) => c !== v))
              }
            />
          </FilterSection>
        </div>
      </div>

      {/* ─── RIGHT: Cytoscape Canvas View ──────────────────────── */}
      <div className="flex-1 flex flex-col relative">
        <EcosystemGraphView
          elements={elements}
          stylesheet={GRAPH_STYLESHEET}
          loading={loading}
          loadingText="Loading communities graph..."
          emptyTitle="No graph data available"
          emptyDescription="There are no user-community relationships matching your filters."
          legend={legend}
          selectedNodeId={
            selectedNode
              ? selectedNode.type === "community"
                ? `community-${selectedNode.data.id}`
                : `user-${selectedNode.data.id}`
              : null
          }
          onNodeSelect={handleNodeSelect}
          onNodeDeselect={() => setSelectedNode(null)}
          detailPanel={
            selectedNode ? (
              <NodeDetailPanel
                info={selectedNode}
                onClose={() => setSelectedNode(null)}
              />
            ) : null
          }
        />
      </div>
    </div>
  );
}
