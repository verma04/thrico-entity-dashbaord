"use client";

import React, { useState, useEffect } from "react";
import {
  Images,
  Wand2,
  Plus,
  Trash2,
  GripVertical,
  Rss,
  MessageSquare,
  BarChart2,
  Users2,
  ShieldAlert,
  Film,
  Sparkles,
  Layers,
  CheckCircle2,
  Briefcase,
  ShieldCheck,
  PenLine,
  MessageCircle,
  Repeat2,
  BookOpen,
  Share2,
  Heart,
  Eye,
  Sliders,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { IconPicker } from "@/components/ui/icon-picker";
import { DynamicIcon } from "@/components/website-layout/preview/DynamicIcon";
import { Badge } from "@/components/ui/badge";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  useEntitySettings,
  useUpdateEntitySettings,
  useUpdateFeedEntityName,
} from "@/graphql/actions";
import { useGetMediaGalleryAlbums } from "@/graphql/actions/mediaGallery";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface MediaGalleryFeedLink {
  id: string;
  albumId: string;
  name: string;
  icon?: string;
}

export interface FeedField {
  key: string;
  label: string;
  description: string;
  icon: any;
  type?: string;
}

export const FEED_FIELDS: FeedField[] = [
  {
    key: "allowEntityDiscoverInFeed",
    label: "Show Discover Feed",
    description:
      "Main community stream showcasing personalized updates, trending posts, and curated activities.",
    icon: Wand2,
    type: "switch",
  },
  {
    key: "allowEntityMomentsInFeed",
    label: "Show Video Moments in Feed",
    description:
      "Surface short-form vertical video clips and milestone moments in feed cards.",
    icon: Film,
    type: "switch",
  },
  {
    key: "allowEntityFeedInFeed",
    label: "Show Admin Feed Announcements",
    description:
      "Surface entity announcements, pinned notifications, and administrative updates.",
    icon: ShieldAlert,
    type: "switch",
  },
  {
    key: "allowEntityCommunityInFeed",
    label: "Show Communities in Feed",
    description:
      "Surface community group activities and member announcements in the main feed stream.",
    icon: Users2,
    type: "switch",
  },
  {
    key: "allowEntityDiscussionForumInFeed",
    label: "Show Forum Posts in Feed",
    description:
      "Allow structured discussion forum topics and questions to appear in the stream.",
    icon: MessageSquare,
    type: "switch",
  },
  {
    key: "allowEntityPollsInFeed",
    label: "Show Polls & Votes in Feed",
    description:
      "Allow interactive community voting polls and opinion cards directly in member feeds.",
    icon: BarChart2,
    type: "switch",
  },
  {
    key: "allowEntityMediaGalleryInFeed",
    label: "Show Media Gallery in Feed",
    description:
      "Surface photo albums and curated visual media collections directly in member feed tabs.",
    icon: Images,
    type: "switch",
  },
  {
    key: "allowEntityOpportunitiesInFeed",
    label: "Show Opportunities in Feed",
    description:
      "Surface job openings, grants, internships, and partnerships directly in member feed streams.",
    icon: Briefcase,
    type: "switch",
  },
];

interface FeedVisibilitySettings {
  allowEntityDiscoverInFeed: boolean;
  discoverFeedName: string;
  feedTabNames: Record<string, string>;
  allowEntityCommunityInFeed: boolean;
  allowEntityDiscussionForumInFeed: boolean;
  allowEntityPollsInFeed: boolean;
  allowEntityMomentsInFeed: boolean;
  allowEntityFeedInFeed: boolean;
  allowEntityOpportunitiesInFeed: boolean;
  allowEntityMediaGalleryInFeed: boolean;
  mediaGalleryFeedAlbumId: string;
  mediaGalleryFeedName: string;
  mediaGalleryFeedLinks: MediaGalleryFeedLink[];
  allowMediaGalleryShareToFeed: boolean;
  feedEntityName: string;
  aiModerationFeed: boolean;
  aiModerationComments: boolean;
  allowFeedPost: boolean;
  allowComment: boolean;
  allowReshare: boolean;
  allowStory: boolean;
  allowSocialReshare: boolean;
  allowFeedReaction: boolean;
  allowReactionVisibility: boolean;
}

interface SortableMediaLinkRowProps {
  link: MediaGalleryFeedLink;
  index: number;
  albums: any[];
  onUpdate: (index: number, field: "name" | "albumId" | "icon", value: string) => void;
  onRemoveRequest: (index: number, name: string) => void;
}

function SortableMediaLinkRow({
  link,
  index,
  albums,
  onUpdate,
  onRemoveRequest,
}: SortableMediaLinkRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-[8px] border transition-all",
        isDragging
          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-1 ring-blue-500"
          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#b4b7bb]",
      )}
    >
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-[#8c9196] hover:text-[#303030] dark:hover:text-zinc-200 transition-colors"
          title="Drag to reorder tab"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-[11px] font-semibold text-[#8c9196] dark:text-zinc-500 min-w-[20px]">
          #{index + 1}
        </span>
      </div>

      <div className="w-full sm:w-[130px] shrink-0">
        <IconPicker
          value={link.icon || "Images"}
          onChange={(newIcon) => onUpdate(index, "icon", newIcon)}
        />
      </div>

      <div className="w-full sm:w-[190px]">
        <input
          type="text"
          placeholder="Tab Display Name"
          value={link.name}
          onChange={(e) => onUpdate(index, "name", e.target.value)}
          className="w-full text-[12px] h-8 px-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700 bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <select
          value={link.albumId}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedAlbum = albums.find((a: any) => a.id === selectedId);
            onUpdate(index, "albumId", selectedId);
            if (
              selectedAlbum &&
              (!link.name ||
                link.name === "Gallery" ||
                link.name === "Media Gallery" ||
                link.name.trim() === "")
            ) {
              onUpdate(index, "name", selectedAlbum.title);
            }
          }}
          className="w-full text-[12px] h-8 px-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700 bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Albums (Default Stream)</option>
          {albums.map((a: any) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={() => onRemoveRequest(index, link.name || "Media Tab")}
        className="p-1.5 text-[#8c9196] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-[6px] transition-colors self-end sm:self-center cursor-pointer"
        title="Remove tab"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function FeedVisibility() {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});
  const [updateFeedName, { loading: loadingName }] = useUpdateFeedEntityName(
    {},
  );
  const { data: albumsData } = useGetMediaGalleryAlbums();
  const albums = albumsData?.getMediaGalleryAlbums || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = prev.mediaGalleryFeedLinks.findIndex(
          (i) => i.id === active.id,
        );
        const newIndex = prev.mediaGalleryFeedLinks.findIndex(
          (i) => i.id === over.id,
        );
        if (oldIndex === -1 || newIndex === -1) return prev;
        const newLinks = arrayMove(
          prev.mediaGalleryFeedLinks,
          oldIndex,
          newIndex,
        );
        return {
          ...prev,
          mediaGalleryFeedLinks: newLinks,
        };
      });
      setHasChanged(true);
    }
  };

  const handleTabNameChange = (key: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      feedTabNames: {
        ...prev.feedTabNames,
        [key]: name,
      },
    }));
    setHasChanged(true);
  };

  const handleAddMediaLink = () => {
    const defaultAlbum = albums[0];
    setFormData((prev) => ({
      ...prev,
      mediaGalleryFeedLinks: [
        ...prev.mediaGalleryFeedLinks,
        {
          id: `link-${Date.now()}`,
          albumId: defaultAlbum?.id || "",
          name: defaultAlbum?.title || "Media Gallery",
          icon: "Images",
        },
      ],
    }));
    setHasChanged(true);
  };

  const handleUpdateMediaLink = (
    index: number,
    field: "name" | "albumId" | "icon",
    value: string,
  ) => {
    setFormData((prev) => {
      const nextLinks = [...prev.mediaGalleryFeedLinks];
      nextLinks[index] = { ...nextLinks[index], [field]: value };
      return { ...prev, mediaGalleryFeedLinks: nextLinks };
    });
    setHasChanged(true);
  };

  const handleRemoveMediaLink = (index: number) => {
    setFormData((prev) => {
      const nextLinks = prev.mediaGalleryFeedLinks.filter(
        (_, i) => i !== index,
      );
      return { ...prev, mediaGalleryFeedLinks: nextLinks };
    });
    setHasChanged(true);
  };

  const initialSettings: FeedVisibilitySettings = {
    allowEntityDiscoverInFeed:
      data?.getEntitySettings?.allowEntityDiscoverInFeed ?? true,
    discoverFeedName: data?.getEntitySettings?.discoverFeedName || "",
    feedTabNames: (data?.getEntitySettings?.feedTabNames as any) || {},
    allowEntityCommunityInFeed:
      data?.getEntitySettings?.allowEntityCommunityInFeed ?? true,
    allowEntityDiscussionForumInFeed:
      data?.getEntitySettings?.allowEntityDiscussionForumInFeed ?? true,
    allowEntityPollsInFeed:
      data?.getEntitySettings?.allowEntityPollsInFeed ?? true,
    allowEntityMomentsInFeed:
      data?.getEntitySettings?.allowEntityMomentsInFeed ?? true,
    allowEntityFeedInFeed:
      data?.getEntitySettings?.allowEntityFeedInFeed ?? true,
    allowEntityOpportunitiesInFeed:
      data?.getEntitySettings?.allowEntityOpportunitiesInFeed ?? true,
    allowEntityMediaGalleryInFeed:
      data?.getEntitySettings?.allowEntityMediaGalleryInFeed ?? true,
    mediaGalleryFeedAlbumId:
      data?.getEntitySettings?.mediaGalleryFeedAlbumId || "",
    mediaGalleryFeedName: data?.getEntitySettings?.mediaGalleryFeedName || "",
    mediaGalleryFeedLinks:
      data?.getEntitySettings?.mediaGalleryFeedLinks &&
      Array.isArray(data.getEntitySettings.mediaGalleryFeedLinks) &&
      data.getEntitySettings.mediaGalleryFeedLinks.length > 0
        ? data.getEntitySettings.mediaGalleryFeedLinks
        : [
            {
              id: "link-default",
              name:
                data?.getEntitySettings?.mediaGalleryFeedName ||
                "Media Gallery",
              albumId: data?.getEntitySettings?.mediaGalleryFeedAlbumId || "",
            },
          ],
    allowMediaGalleryShareToFeed:
      data?.getEntitySettings?.allowMediaGalleryShareToFeed ?? true,
    feedEntityName: data?.getEntitySettings?.feedEntityName || "",
    aiModerationFeed: data?.getEntitySettings?.aiModerationFeed ?? true,
    aiModerationComments: data?.getEntitySettings?.aiModerationComments ?? true,
    allowFeedPost: data?.getEntitySettings?.allowFeedPost ?? true,
    allowComment: data?.getEntitySettings?.allowComment ?? true,
    allowReshare: data?.getEntitySettings?.allowReshare ?? true,
    allowStory: data?.getEntitySettings?.allowStory ?? true,
    allowSocialReshare: data?.getEntitySettings?.allowSocialReshare ?? true,
    allowFeedReaction: data?.getEntitySettings?.allowFeedReaction ?? true,
    allowReactionVisibility:
      data?.getEntitySettings?.allowReactionVisibility ?? true,
  };

  const [formData, setFormData] =
    useState<FeedVisibilitySettings>(initialSettings);
  const [hasChanged, setHasChanged] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    index: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (data?.getEntitySettings) {
      const serverSettings: FeedVisibilitySettings = {
        allowEntityDiscoverInFeed:
          data.getEntitySettings.allowEntityDiscoverInFeed ?? true,
        discoverFeedName: data.getEntitySettings.discoverFeedName || "",
        feedTabNames: (data.getEntitySettings.feedTabNames as any) || {},
        allowEntityCommunityInFeed:
          data.getEntitySettings.allowEntityCommunityInFeed ?? true,
        allowEntityDiscussionForumInFeed:
          data.getEntitySettings.allowEntityDiscussionForumInFeed ?? true,
        allowEntityPollsInFeed:
          data.getEntitySettings.allowEntityPollsInFeed ?? true,
        allowEntityMomentsInFeed:
          data.getEntitySettings.allowEntityMomentsInFeed ?? true,
        allowEntityFeedInFeed:
          data.getEntitySettings.allowEntityFeedInFeed ?? true,
        allowEntityOpportunitiesInFeed:
          data.getEntitySettings.allowEntityOpportunitiesInFeed ?? true,
        allowEntityMediaGalleryInFeed:
          data.getEntitySettings.allowEntityMediaGalleryInFeed ?? true,
        mediaGalleryFeedAlbumId:
          data.getEntitySettings.mediaGalleryFeedAlbumId || "",
        mediaGalleryFeedName: data.getEntitySettings.mediaGalleryFeedName || "",
        mediaGalleryFeedLinks:
          data.getEntitySettings.mediaGalleryFeedLinks &&
          Array.isArray(data.getEntitySettings.mediaGalleryFeedLinks) &&
          data.getEntitySettings.mediaGalleryFeedLinks.length > 0
            ? data.getEntitySettings.mediaGalleryFeedLinks
            : [
                {
                  id: "link-default",
                  name:
                    data.getEntitySettings.mediaGalleryFeedName ||
                    "Media Gallery",
                  albumId: data.getEntitySettings.mediaGalleryFeedAlbumId || "",
                },
              ],
        allowMediaGalleryShareToFeed:
          data.getEntitySettings.allowMediaGalleryShareToFeed ?? true,
        feedEntityName: data.getEntitySettings.feedEntityName || "",
        aiModerationFeed: data.getEntitySettings.aiModerationFeed ?? true,
        aiModerationComments:
          data.getEntitySettings.aiModerationComments ?? true,
        allowFeedPost: data.getEntitySettings.allowFeedPost ?? true,
        allowComment: data.getEntitySettings.allowComment ?? true,
        allowReshare: data.getEntitySettings.allowReshare ?? true,
        allowStory: data.getEntitySettings.allowStory ?? true,
        allowSocialReshare: data.getEntitySettings.allowSocialReshare ?? true,
        allowFeedReaction: data.getEntitySettings.allowFeedReaction ?? true,
        allowReactionVisibility:
          data.getEntitySettings.allowReactionVisibility ?? true,
      };
      setFormData(serverSettings);
      setHasChanged(false);
    }
  }, [data]);

  const handleToggle = (field: keyof FeedVisibilitySettings) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: !prev[field] };
      setHasChanged(true);
      return next;
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => {
      const next = { ...prev, feedEntityName: value };
      setHasChanged(true);
      return next;
    });
  };

  const handleReset = () => {
    if (data?.getEntitySettings) {
      setFormData({
        allowEntityDiscoverInFeed:
          data.getEntitySettings.allowEntityDiscoverInFeed ?? true,
        discoverFeedName: data.getEntitySettings.discoverFeedName || "",
        feedTabNames: (data.getEntitySettings.feedTabNames as any) || {},
        allowEntityCommunityInFeed:
          data.getEntitySettings.allowEntityCommunityInFeed ?? true,
        allowEntityDiscussionForumInFeed:
          data.getEntitySettings.allowEntityDiscussionForumInFeed ?? true,
        allowEntityPollsInFeed:
          data.getEntitySettings.allowEntityPollsInFeed ?? true,
        allowEntityMomentsInFeed:
          data.getEntitySettings.allowEntityMomentsInFeed ?? true,
        allowEntityFeedInFeed:
          data.getEntitySettings.allowEntityFeedInFeed ?? true,
        allowEntityOpportunitiesInFeed:
          data.getEntitySettings.allowEntityOpportunitiesInFeed ?? true,
        allowEntityMediaGalleryInFeed:
          data.getEntitySettings.allowEntityMediaGalleryInFeed ?? true,
        mediaGalleryFeedAlbumId:
          data.getEntitySettings.mediaGalleryFeedAlbumId || "",
        mediaGalleryFeedName: data.getEntitySettings.mediaGalleryFeedName || "",
        mediaGalleryFeedLinks:
          data.getEntitySettings.mediaGalleryFeedLinks &&
          Array.isArray(data.getEntitySettings.mediaGalleryFeedLinks) &&
          data.getEntitySettings.mediaGalleryFeedLinks.length > 0
            ? data.getEntitySettings.mediaGalleryFeedLinks
            : [
                {
                  id: "link-default",
                  name:
                    data.getEntitySettings.mediaGalleryFeedName ||
                    "Media Gallery",
                  albumId: data.getEntitySettings.mediaGalleryFeedAlbumId || "",
                },
              ],
        allowMediaGalleryShareToFeed:
          data.getEntitySettings.allowMediaGalleryShareToFeed ?? true,
        feedEntityName: data.getEntitySettings.feedEntityName || "",
        aiModerationFeed: data.getEntitySettings.aiModerationFeed ?? true,
        aiModerationComments:
          data.getEntitySettings.aiModerationComments ?? true,
        allowFeedPost: data.getEntitySettings.allowFeedPost ?? true,
        allowComment: data.getEntitySettings.allowComment ?? true,
        allowReshare: data.getEntitySettings.allowReshare ?? true,
        allowStory: data.getEntitySettings.allowStory ?? true,
        allowSocialReshare: data.getEntitySettings.allowSocialReshare ?? true,
        allowFeedReaction: data.getEntitySettings.allowFeedReaction ?? true,
        allowReactionVisibility:
          data.getEntitySettings.allowReactionVisibility ?? true,
      });
      setHasChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      const cleanSettings = {
        allowEntityDiscoverInFeed: formData.allowEntityDiscoverInFeed,
        discoverFeedName:
          formData.feedTabNames["allowEntityDiscoverInFeed"] ||
          formData.discoverFeedName ||
          null,
        feedTabNames: formData.feedTabNames || {},
        allowEntityCommunityInFeed: formData.allowEntityCommunityInFeed,
        allowEntityDiscussionForumInFeed:
          formData.allowEntityDiscussionForumInFeed,
        allowEntityPollsInFeed: formData.allowEntityPollsInFeed,
        allowEntityMomentsInFeed: formData.allowEntityMomentsInFeed,
        allowEntityFeedInFeed: formData.allowEntityFeedInFeed,
        allowEntityOpportunitiesInFeed: formData.allowEntityOpportunitiesInFeed,
        allowEntityMediaGalleryInFeed: formData.allowEntityMediaGalleryInFeed,
        mediaGalleryFeedAlbumId:
          formData.mediaGalleryFeedLinks[0]?.albumId || null,
        mediaGalleryFeedName: formData.mediaGalleryFeedLinks[0]?.name || null,
        mediaGalleryFeedLinks: formData.mediaGalleryFeedLinks || [],
        allowMediaGalleryShareToFeed: formData.allowMediaGalleryShareToFeed,
        aiModerationFeed: formData.aiModerationFeed,
        aiModerationComments: formData.aiModerationComments,
        allowFeedPost: formData.allowFeedPost,
        allowComment: formData.allowComment,
        allowReshare: formData.allowReshare,
        allowStory: formData.allowStory,
        allowSocialReshare: formData.allowSocialReshare,
        allowFeedReaction: formData.allowFeedReaction,
        allowReactionVisibility: formData.allowReactionVisibility,
      };

      const promises = [];

      promises.push(
        update({
          variables: { input: cleanSettings },
        }),
      );

      if (formData.feedEntityName !== data?.getEntitySettings?.feedEntityName) {
        promises.push(
          updateFeedName({
            variables: { name: formData.feedEntityName },
          }),
        );
      }

      await Promise.all(promises);
      toast.success("Feed protocols synchronized successfully.");
      setHasChanged(false);
    } catch (error) {
      toast.error("Failed to update feed parameters.");
      console.error(error);
    }
  };

  const activeSourcesCount = [
    formData.allowEntityCommunityInFeed,
    formData.allowEntityDiscussionForumInFeed,
    formData.allowEntityPollsInFeed,
    formData.allowEntityMomentsInFeed,
    formData.allowEntityFeedInFeed,
    formData.allowEntityOpportunitiesInFeed,
    formData.allowEntityMediaGalleryInFeed,
  ].filter(Boolean).length;

  const contentSources = [
    {
      key: "allowEntityDiscoverInFeed" as const,
      label: "Show Discover Feed",
      defaultName: "Discover",
      description:
        "Main community stream showcasing personalized updates, trending posts, and curated activities.",
      icon: Wand2,
      enabled: formData.allowEntityDiscoverInFeed,
    },
    {
      key: "allowEntityFeedInFeed" as const,
      label: `Show ${formData.feedTabNames["allowEntityFeedInFeed"] || formData.feedEntityName || "Admin"} Announcements`,
      defaultName: "By Admin",
      description:
        "Surface official administrative broadcasts, alerts, and pinned entity updates.",
      icon: ShieldAlert,
      enabled: formData.allowEntityFeedInFeed,
    },
    {
      key: "allowEntityCommunityInFeed" as const,
      label: "Show Communities in Feed",
      defaultName: "Communities",
      description:
        "Surface community group activities and member announcements in the main feed stream.",
      icon: Users2,
      enabled: formData.allowEntityCommunityInFeed,
    },
    {
      key: "allowEntityDiscussionForumInFeed" as const,
      label: "Show Forum Posts in Feed",
      defaultName: "Discussions",
      description:
        "Allow structured discussion forum topics and questions to appear in the stream.",
      icon: MessageSquare,
      enabled: formData.allowEntityDiscussionForumInFeed,
    },
    {
      key: "allowEntityPollsInFeed" as const,
      label: "Show Polls & Votes in Feed",
      defaultName: "Polls",
      description:
        "Allow interactive community voting polls and opinion cards directly in member feeds.",
      icon: BarChart2,
      enabled: formData.allowEntityPollsInFeed,
    },
    {
      key: "allowEntityMomentsInFeed" as const,
      label: "Show Video Moments in Feed",
      defaultName: "Moments",
      description:
        "Surface short-form vertical video clips and milestone moments in feed cards.",
      icon: Film,
      enabled: formData.allowEntityMomentsInFeed,
    },
    {
      key: "allowEntityOpportunitiesInFeed" as const,
      label: "Show Opportunities in Feed",
      defaultName: "Opportunities",
      description:
        "Surface job openings, grants, internships, and partnerships directly in member feed streams.",
      icon: Briefcase,
      enabled: formData.allowEntityOpportunitiesInFeed,
    },
    {
      key: "allowEntityMediaGalleryInFeed" as const,
      label: "Show Media Gallery in Feed",
      defaultName: "Media Gallery",
      description:
        "Surface photo albums and curated visual media collections directly in member feed tabs.",
      icon: Images,
      enabled: formData.allowEntityMediaGalleryInFeed,
    },
  ];

  const userActionPermissions = [
    {
      key: "allowFeedPost" as const,
      label: "Allow Feed Posts",
      description:
        "Allow members to create and publish new feed posts in the community.",
      icon: PenLine,
      enabled: formData.allowFeedPost,
    },
    {
      key: "allowComment" as const,
      label: "Allow Comments",
      description:
        "Allow members to comment and participate in discussions under feed posts.",
      icon: MessageCircle,
      enabled: formData.allowComment,
    },
    {
      key: "allowFeedReaction" as const,
      label: "Allow Feed Reactions",
      description:
        "Allow members to react with emojis and like feed posts and updates.",
      icon: Heart,
      enabled: formData.allowFeedReaction,
    },
    {
      key: "allowReactionVisibility" as const,
      label: "Show Reaction Visibility",
      description:
        "Display reaction counts and member reaction lists on feed posts.",
      icon: Eye,
      enabled: formData.allowReactionVisibility,
    },
    {
      key: "allowReshare" as const,
      label: "Allow Feed Reshare",
      description:
        "Allow members to reshare feed posts internally within the platform.",
      icon: Repeat2,
      enabled: formData.allowReshare,
    },
    {
      key: "allowStory" as const,
      label: "Allow Stories",
      description:
        "Allow members to publish short-lived story cards and ephemeral media.",
      icon: BookOpen,
      enabled: formData.allowStory,
    },
    {
      key: "allowSocialReshare" as const,
      label: "Allow Social Reshare",
      description:
        "Allow members to share feed posts externally to third-party social networks.",
      icon: Share2,
      enabled: formData.allowSocialReshare,
    },
    {
      key: "allowMediaGalleryShareToFeed" as const,
      label: "Allow Media Gallery Share to Feed",
      description:
        "Allow members to repost photos and albums from the media gallery directly into the community feed.",
      icon: Images,
      enabled: formData.allowMediaGalleryShareToFeed,
    },
  ];

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Stream Preview Card */}
            <PolarisSidebarCard
              title="Feed Stream Simulation"
              badge="Live Protocols"
              icon={Sparkles}
            >
              <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3.5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#303030] text-white flex items-center justify-center text-[10px] font-bold">
                      <Rss className="h-3 w-3" />
                    </div>
                    <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100">
                      {formData.feedEntityName || "Community"} Feed
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 px-1.5 py-0.2 rounded-[4px]"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Live
                  </Badge>
                </div>

                {/* Enabled Content Types Pill Cloud */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-[#616161] dark:text-zinc-400">
                    Active Stream Sources ({activeSourcesCount}/
                    {contentSources.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {contentSources.map((source) => {
                      if (
                        source.key === "allowEntityMediaGalleryInFeed" &&
                        source.enabled &&
                        formData.mediaGalleryFeedLinks.length > 0
                      ) {
                        return formData.mediaGalleryFeedLinks.map((link, idx) => (
                          <Badge
                            key={link.id || idx}
                            variant="secondary"
                            className="text-[11px] px-2 py-0.5 rounded-[4px] flex items-center gap-1 transition-all bg-white dark:bg-zinc-800 border-[#d2d5d9] text-[#303030] dark:text-zinc-200 shadow-2xs"
                          >
                            {link.icon !== "none" && (
                              <DynamicIcon
                                name={link.icon || "Images"}
                                className="h-3 w-3 text-blue-600 dark:text-blue-400"
                              />
                            )}
                            <span>{link.name || `Gallery ${idx + 1}`}</span>
                          </Badge>
                        ));
                      }

                      return (
                        <Badge
                          key={source.key}
                          variant={source.enabled ? "secondary" : "outline"}
                          className={cn(
                            "text-[11px] px-2 py-0.5 rounded-[4px] flex items-center gap-1 transition-all",
                            source.enabled
                              ? "bg-white dark:bg-zinc-800 border-[#d2d5d9] text-[#303030] dark:text-zinc-200 shadow-2xs"
                              : "opacity-40 line-through border-dashed text-[#8c9196]",
                          )}
                        >
                          <source.icon className="h-3 w-3" />
                          <span>{source.label.replace("Show ", "")}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Configuration Breakdown */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Official Brand Tag"
                  value={formData.feedEntityName || "Default (Admin)"}
                />
                <PolarisSummaryRow
                  label="Enabled Protocols"
                  value={`${activeSourcesCount} of ${contentSources.length} Active`}
                  highlight={activeSourcesCount >= 4}
                />
                <PolarisSummaryRow
                  label="AI Feed Sentinel"
                  value={formData.aiModerationFeed ? "Active" : "Disabled"}
                  highlight={formData.aiModerationFeed}
                />
                <PolarisSummaryRow
                  label="AI Comment Sentinel"
                  value={formData.aiModerationComments ? "Active" : "Disabled"}
                  highlight={formData.aiModerationComments}
                />
                <PolarisSummaryRow
                  label="User Action Controls"
                  value={`${userActionPermissions.filter((a) => a.enabled).length} of ${userActionPermissions.length} Active`}
                  highlight={userActionPermissions.some((a) => a.enabled)}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Engagement Strategy Tip */}
            <PolarisTipCard title="Feed Optimization Tip">
              Enabling interactive sources like community polls and moments
              increases member return rates. Keep AI Moderation active to
              automatically filter toxicity and maintain clean community
              discussions.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Section 1: Official Brand Identity */}
          <PolarisFormCard
            step={1}
            icon={Sparkles}
            title="Official Feed Identity"
            description="Customize the brand name attached to official entity publications and pinned alerts."
            badge="Branding"
          >
            <div className="space-y-3">
              <PolarisInput
                id="feedEntityName"
                name="feedEntityName"
                label="Feed Brand Display Name"
                placeholder="e.g. Acme Official, Community Team"
                value={formData.feedEntityName}
                onChange={handleNameChange}
                helperText="This custom name will appear as the author name on official entity posts."
                prefix={<Sparkles className="h-4 w-4" />}
              />
            </div>
          </PolarisFormCard>

          {/* Section 2: Content Stream Protocols */}
          <PolarisFormCard
            step={2}
            icon={Layers}
            title="Content Stream Sources"
            description="Control which modules automatically aggregate content into the central community feed."
            badge="Aggregation"
          >
            <div className="space-y-3">
              {contentSources.map((source) => (
                <div
                  key={source.key}
                  className={cn(
                    "p-3.5 rounded-[8px] border transition-all",
                    source.enabled
                      ? "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
                      : "border-[#e1e3e5] dark:border-zinc-800/60 bg-[#f6f6f7]/40 dark:bg-zinc-900/30 opacity-75",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 min-w-0 pr-2">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 border",
                          source.enabled
                            ? "bg-[#f6f6f7] dark:bg-zinc-800 border-[#d2d5d9] text-[#303030] dark:text-zinc-100"
                            : "bg-transparent border-transparent text-[#8c9196]",
                        )}
                      >
                        <source.icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <PolarisLabel className="cursor-pointer">
                          {source.label}
                        </PolarisLabel>
                        <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                          {source.description}
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={source.enabled}
                      onCheckedChange={() => handleToggle(source.key)}
                    />
                  </div>

                  {source.key !== "allowEntityMediaGalleryInFeed" &&
                    source.enabled && (
                      <div className="mt-2.5 pt-2.5 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#616161] dark:text-zinc-400">
                          <span>Tab Display Name:</span>
                          <span className="text-[10px] text-[#8c9196]">
                            (Default: &quot;{source.defaultName}&quot;)
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder={source.defaultName}
                          value={formData.feedTabNames[source.key] || ""}
                          onChange={(e) =>
                            handleTabNameChange(source.key, e.target.value)
                          }
                          className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full sm:w-[220px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}

                  {source.key === "allowEntityMediaGalleryInFeed" &&
                    source.enabled && (
                      <div className="mt-3.5 pt-3.5 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 flex items-center gap-1.5">
                              <Images className="h-3.5 w-3.5 text-blue-600" />
                              Media Gallery Feed Tabs
                            </h4>
                            <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                              Configure media album tabs linked into the
                              community feed. Drag items to reorder the tabs.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddMediaLink}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-[6px] bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-colors shadow-xs cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Media Link
                          </button>
                        </div>

                        {formData.mediaGalleryFeedLinks.length === 0 ? (
                          <div className="p-4 text-center rounded-[6px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50">
                            <p className="text-[12px] text-[#616161] dark:text-zinc-400">
                              No media tabs configured. Click &quot;Add Media
                              Link&quot; to add a media tab to the feed.
                            </p>
                          </div>
                        ) : (
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                          >
                            <SortableContext
                              items={formData.mediaGalleryFeedLinks.map(
                                (l) => l.id,
                              )}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-2">
                                {formData.mediaGalleryFeedLinks.map(
                                  (link, idx) => (
                                    <SortableMediaLinkRow
                                      key={link.id}
                                      link={link}
                                      index={idx}
                                      albums={albums}
                                      onUpdate={handleUpdateMediaLink}
                                      onRemoveRequest={(index, name) =>
                                        setDeleteConfirmTarget({ index, name })
                                      }
                                    />
                                  ),
                                )}
                              </div>
                            </SortableContext>
                          </DndContext>
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </PolarisFormCard>

          {/* Section 3: AI Safety Sentinel */}
          <PolarisFormCard
            step={3}
            icon={ShieldCheck}
            title="AI Moderation Sentinel"
            description="Automated AI safety analysis and toxicity filtration for feed posts and comment threads."
            badge="AI Safety"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div className="h-8 w-8 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 border bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <PolarisLabel className="cursor-pointer">
                      AI Feed Post Moderation
                    </PolarisLabel>
                    <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                      Inspect all feed publications, links, and captions using
                      AI safety checks in real time.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.aiModerationFeed}
                  onCheckedChange={() => handleToggle("aiModerationFeed")}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <div className="h-8 w-8 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 border bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <PolarisLabel className="cursor-pointer">
                      AI Feed Comments Moderation
                    </PolarisLabel>
                    <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                      Automatically analyze and block spam, abusive remarks, or
                      toxic replies under feed items.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.aiModerationComments}
                  onCheckedChange={() => handleToggle("aiModerationComments")}
                />
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 4: User Action Permissions */}
          <PolarisFormCard
            step={4}
            icon={Sliders}
            title="User Action Permissions"
            description="Control interactive permissions and engagement capabilities available to members in the feed."
            badge="Permissions"
          >
            <div className="space-y-3">
              {userActionPermissions.map((action) => (
                <div
                  key={action.key}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-[8px] border transition-all",
                    action.enabled
                      ? "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
                      : "border-[#e1e3e5] dark:border-zinc-800/60 bg-[#f6f6f7]/40 dark:bg-zinc-900/30 opacity-75",
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 border",
                        action.enabled
                          ? "bg-[#f6f6f7] dark:bg-zinc-800 border-[#d2d5d9] text-[#303030] dark:text-zinc-100"
                          : "bg-transparent border-transparent text-[#8c9196]",
                      )}
                    >
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <PolarisLabel className="cursor-pointer">
                        {action.label}
                      </PolarisLabel>
                      <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={action.enabled}
                    onCheckedChange={() => handleToggle(action.key)}
                  />
                </div>
              ))}
            </div>
          </PolarisFormCard>
        </div>
      </PolarisFormLayout>

      {/* Floating Save Action Bar */}
      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={false}
        isSaving={loadingBtn || loadingName}
        onSave={handleSave}
        onReset={handleReset}
        title="Unsaved Feed Protocols"
        description="You have modified content aggregation parameters."
        buttonText="Save Protocols"
      />

      {/* Delete Media Tab Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmTarget(null);
        }}
      >
        <AlertDialogContent className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[14px] font-bold text-[#303030] dark:text-zinc-100">
              Remove Media Tab?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[12px] text-[#616161] dark:text-zinc-400">
              Are you sure you want to remove &quot;{deleteConfirmTarget?.name}
              &quot; from the community feed? This action will remove the tab
              from member feed navigation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-[12px] font-medium rounded-[6px]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmTarget !== null) {
                  handleRemoveMediaLink(deleteConfirmTarget.index);
                  setDeleteConfirmTarget(null);
                }
              }}
              className="h-8 text-[12px] font-medium rounded-[6px] bg-red-600 hover:bg-red-700 text-white"
            >
              Remove Tab
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
