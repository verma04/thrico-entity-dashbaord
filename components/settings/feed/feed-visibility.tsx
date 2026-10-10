"use client";

import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  FileCode,
  FileUp,
  Eye as EyeIcon,
  Info,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IsolatedHtmlRenderer } from "@/components/website-layout/modules/isolated-html-renderer";

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
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
}

export const FEED_FIELDS: FeedField[] = [
  {
    key: "allowEntityDiscoverInFeed",
    label: "Show Discover Feed",
    description:
      "Main community stream showcasing personalized updates, trending posts, or custom HTML section.",
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
  discoverFeedType: "normal" | "html";
  discoverFeedHtml: string;
  discoverFeedCss: string;
  discoverFeedHtmlFileName: string;
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

const feedVisibilityValidationSchema = Yup.object().shape({
  allowEntityDiscoverInFeed: Yup.boolean().required(),
  discoverFeedName: Yup.string().nullable(),
  discoverFeedType: Yup.string().oneOf(["normal", "html"]).default("normal"),
  discoverFeedHtml: Yup.string().nullable(),
  discoverFeedCss: Yup.string().nullable(),
  discoverFeedHtmlFileName: Yup.string().nullable(),
  feedTabNames: Yup.object().default({}),
  allowEntityCommunityInFeed: Yup.boolean().required(),
  allowEntityDiscussionForumInFeed: Yup.boolean().required(),
  allowEntityPollsInFeed: Yup.boolean().required(),
  allowEntityMomentsInFeed: Yup.boolean().required(),
  allowEntityFeedInFeed: Yup.boolean().required(),
  allowEntityOpportunitiesInFeed: Yup.boolean().required(),
  allowEntityMediaGalleryInFeed: Yup.boolean().required(),
  mediaGalleryFeedAlbumId: Yup.string().nullable(),
  mediaGalleryFeedName: Yup.string().nullable(),
  mediaGalleryFeedLinks: Yup.array().default([]),
  allowMediaGalleryShareToFeed: Yup.boolean().required(),
  feedEntityName: Yup.string().nullable(),
  aiModerationFeed: Yup.boolean().required(),
  aiModerationComments: Yup.boolean().required(),
  allowFeedPost: Yup.boolean().required(),
  allowComment: Yup.boolean().required(),
  allowReshare: Yup.boolean().required(),
  allowStory: Yup.boolean().required(),
  allowSocialReshare: Yup.boolean().required(),
  allowFeedReaction: Yup.boolean().required(),
  allowReactionVisibility: Yup.boolean().required(),
});

const DISCOVER_STARTER_TEMPLATES = [
  {
    id: "welcome-hero",
    name: "Hero Banner",
    category: "Hero",
    html: `<div style="padding: 40px 24px; text-align: center; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.3);">
  <span style="display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Discover & Connect</span>
  <h2 style="font-size: 28px; font-weight: 700; margin: 0 0 12px 0; color: #ffffff;">Welcome to Our Community</h2>
  <p style="font-size: 15px; opacity: 0.9; max-width: 540px; margin: 0 auto 20px auto; line-height: 1.6;">Explore curated updates, join exciting discussions, and connect with fellow members across the network.</p>
  <a href="#explore" style="display: inline-block; padding: 10px 24px; background: #ffffff; color: #4f46e5; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">Get Started &rarr;</a>
</div>`,
    css: ``,
  },
  {
    id: "highlights-grid",
    name: "3-Column Highlights",
    category: "Cards",
    html: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin: 12px 0;">
  <div style="padding: 24px; border-radius: 14px; background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
    <div style="width: 40px; height: 40px; border-radius: 10px; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 14px;">01</div>
    <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a;">Connect & Network</h3>
    <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">Meet peers, industry mentors, and thought leaders directly in your space.</p>
  </div>
  <div style="padding: 24px; border-radius: 14px; background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
    <div style="width: 40px; height: 40px; border-radius: 10px; background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 14px;">02</div>
    <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a;">Exclusive Events</h3>
    <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">Participate in virtual meetups, keynote webinars, and workshops.</p>
  </div>
  <div style="padding: 24px; border-radius: 14px; background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
    <div style="width: 40px; height: 40px; border-radius: 10px; background: #dcfce7; color: #15803d; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 14px;">03</div>
    <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a;">Growth & Rewards</h3>
    <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">Earn points, unlock badges, and redeem perks as you engage daily.</p>
  </div>
</div>`,
    css: ``,
  },
  {
    id: "resource-center",
    name: "Resource Center",
    category: "Links",
    html: `<div style="padding: 30px; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0;">
  <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 8px 0; color: #1e293b;">Member Resource Center</h2>
  <p style="font-size: 14px; color: #64748b; margin: 0 0 20px 0;">Essential guides, quick links, and featured documentation for all members.</p>
  <div style="display: flex; flex-wrap: wrap; gap: 12px;">
    <a href="/dashboard/events" style="padding: 10px 18px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; font-weight: 600; color: #334155; text-decoration: none;">Upcoming Events &rarr;</a>
    <a href="/dashboard/communities" style="padding: 10px 18px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; font-weight: 600; color: #334155; text-decoration: none;">Browse Communities &rarr;</a>
    <a href="/dashboard/discussions" style="padding: 10px 18px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; font-weight: 600; color: #334155; text-decoration: none;">Discussions & Forum &rarr;</a>
  </div>
</div>`,
    css: ``,
  },
];

interface AlbumItem {
  id: string;
  title: string;
}

interface SortableMediaLinkRowProps {
  link: MediaGalleryFeedLink;
  index: number;
  albums: AlbumItem[];
  onUpdate: (index: number, field: "name" | "albumId" | "icon", value: string) => void;
  onRemoveRequest: (index: number, name: string) => void;
}

function parseFeedLinks(
  raw: unknown,
  fallbackName = "Media Gallery",
  fallbackAlbumId = ""
): MediaGalleryFeedLink[] {
  let list: Array<{ id?: string; name?: string; albumId?: string; icon?: string }> = [];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (typeof raw === "string" && raw.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    } catch {}
  }
  if (list.length > 0) {
    return list.map((item, idx) => ({
      id: typeof item?.id === "string" ? item.id : `link-${idx}`,
      name: typeof item?.name === "string" ? item.name : fallbackName,
      albumId: typeof item?.albumId === "string" ? item.albumId : "",
      icon: typeof item?.icon === "string" ? item.icon : undefined,
    }));
  }
  return [
    {
      id: "link-default",
      name: fallbackName,
      albumId: fallbackAlbumId,
    },
  ];
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
          value={typeof link.icon === "string" ? link.icon : "Images"}
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
            const selectedAlbum = albums.find((a: AlbumItem) => a.id === selectedId);
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
          {albums.map((a: AlbumItem) => (
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
  const { data } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});
  const [updateFeedName, { loading: loadingName }] = useUpdateFeedEntityName({});
  const { data: albumsData } = useGetMediaGalleryAlbums();
  const albums = albumsData?.getMediaGalleryAlbums || [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    index: number;
    name: string;
  } | null>(null);

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

  const initialSettings: FeedVisibilitySettings = {
    allowEntityDiscoverInFeed:
      data?.getEntitySettings?.allowEntityDiscoverInFeed ?? true,
    discoverFeedName: data?.getEntitySettings?.discoverFeedName || "",
    discoverFeedType:
      (data?.getEntitySettings?.discoverFeedType as "normal" | "html") ||
      "normal",
    discoverFeedHtml: data?.getEntitySettings?.discoverFeedHtml || "",
    discoverFeedCss: data?.getEntitySettings?.discoverFeedCss || "",
    discoverFeedHtmlFileName:
      data?.getEntitySettings?.discoverFeedHtmlFileName || "",
    feedTabNames: (data?.getEntitySettings?.feedTabNames as Record<string, string>) || {},
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
    mediaGalleryFeedLinks: parseFeedLinks(
      data?.getEntitySettings?.mediaGalleryFeedLinks,
      data?.getEntitySettings?.mediaGalleryFeedName || "Media Gallery",
      data?.getEntitySettings?.mediaGalleryFeedAlbumId || ""
    ),
    allowMediaGalleryShareToFeed:
      data?.getEntitySettings?.allowMediaGalleryShareToFeed ?? true,
    feedEntityName: data?.getEntitySettings?.feedEntityName || "",
    aiModerationFeed: data?.getEntitySettings?.aiModerationFeed ?? true,
    aiModerationComments:
      data?.getEntitySettings?.aiModerationComments ?? true,
    allowFeedPost: data?.getEntitySettings?.allowFeedPost ?? true,
    allowComment: data?.getEntitySettings?.allowComment ?? true,
    allowReshare: data?.getEntitySettings?.allowReshare ?? true,
    allowStory: data?.getEntitySettings?.allowStory ?? true,
    allowSocialReshare: data?.getEntitySettings?.allowSocialReshare ?? true,
    allowFeedReaction: data?.getEntitySettings?.allowFeedReaction ?? true,
    allowReactionVisibility:
      data?.getEntitySettings?.allowReactionVisibility ?? true,
  };

  const formik = useFormik<FeedVisibilitySettings>({
    initialValues: initialSettings,
    validationSchema: feedVisibilityValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const cleanSettings = {
          allowEntityDiscoverInFeed: values.allowEntityDiscoverInFeed,
          discoverFeedName:
            values.feedTabNames["allowEntityDiscoverInFeed"] ||
            values.discoverFeedName ||
            null,
          discoverFeedType: values.discoverFeedType,
          discoverFeedHtml: values.discoverFeedHtml || null,
          discoverFeedCss: values.discoverFeedCss || null,
          discoverFeedHtmlFileName: values.discoverFeedHtmlFileName || null,
          feedTabNames: values.feedTabNames || {},
          allowEntityCommunityInFeed: values.allowEntityCommunityInFeed,
          allowEntityDiscussionForumInFeed:
            values.allowEntityDiscussionForumInFeed,
          allowEntityPollsInFeed: values.allowEntityPollsInFeed,
          allowEntityMomentsInFeed: values.allowEntityMomentsInFeed,
          allowEntityFeedInFeed: values.allowEntityFeedInFeed,
          allowEntityOpportunitiesInFeed: values.allowEntityOpportunitiesInFeed,
          allowEntityMediaGalleryInFeed: values.allowEntityMediaGalleryInFeed,
          mediaGalleryFeedAlbumId:
            values.mediaGalleryFeedLinks[0]?.albumId || null,
          mediaGalleryFeedName: values.mediaGalleryFeedLinks[0]?.name || null,
          mediaGalleryFeedLinks: values.mediaGalleryFeedLinks || [],
          allowMediaGalleryShareToFeed: values.allowMediaGalleryShareToFeed,
          aiModerationFeed: values.aiModerationFeed,
          aiModerationComments: values.aiModerationComments,
          allowFeedPost: values.allowFeedPost,
          allowComment: values.allowComment,
          allowReshare: values.allowReshare,
          allowStory: values.allowStory,
          allowSocialReshare: values.allowSocialReshare,
          allowFeedReaction: values.allowFeedReaction,
          allowReactionVisibility: values.allowReactionVisibility,
        };

        const promises = [];

        promises.push(
          update({
            variables: { input: cleanSettings },
          }),
        );

        if (
          values.feedEntityName !== data?.getEntitySettings?.feedEntityName
        ) {
          promises.push(
            updateFeedName({
              variables: { name: values.feedEntityName },
            }),
          );
        }

        await Promise.all(promises);
        toast.success("Feed visibility parameters updated successfully.");
      } catch (error: unknown) {
        toast.error((error as Error)?.message || "Failed to update feed parameters.");
        console.error(error);
      }
    },
  });

  const handleToggle = (key: keyof FeedVisibilitySettings) => {
    formik.setFieldValue(key, !formik.values[key]);
  };

  const handleTabNameChange = (key: string, name: string) => {
    formik.setFieldValue("feedTabNames", {
      ...formik.values.feedTabNames,
      [key]: name,
    });
  };

  const handleAddMediaLink = () => {
    const newLink: MediaGalleryFeedLink = {
      id: `link-${Date.now()}`,
      albumId: "",
      name: `Media Gallery ${formik.values.mediaGalleryFeedLinks.length + 1}`,
      icon: "Images",
    };
    formik.setFieldValue("mediaGalleryFeedLinks", [
      ...formik.values.mediaGalleryFeedLinks,
      newLink,
    ]);
  };

  const handleUpdateMediaLink = (
    index: number,
    field: "name" | "albumId" | "icon",
    value: string,
  ) => {
    const nextLinks = [...formik.values.mediaGalleryFeedLinks];
    nextLinks[index] = { ...nextLinks[index], [field]: value };
    formik.setFieldValue("mediaGalleryFeedLinks", nextLinks);
  };

  const handleRemoveMediaLink = (index: number) => {
    const nextLinks = formik.values.mediaGalleryFeedLinks.filter(
      (_, i) => i !== index,
    );
    formik.setFieldValue("mediaGalleryFeedLinks", nextLinks);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = formik.values.mediaGalleryFeedLinks.findIndex(
        (i) => i.id === active.id,
      );
      const newIndex = formik.values.mediaGalleryFeedLinks.findIndex(
        (i) => i.id === over.id,
      );
      if (oldIndex === -1 || newIndex === -1) return;
      const newLinks = arrayMove(
        formik.values.mediaGalleryFeedLinks,
        oldIndex,
        newIndex,
      );
      formik.setFieldValue("mediaGalleryFeedLinks", newLinks);
    }
  };

  const handleHtmlFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = [".html", ".htm", ".txt"];
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() || "");
    if (!validExtensions.includes(ext)) {
      toast.error("Please upload a valid .html, .htm, or .txt file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        formik.setFieldValue("discoverFeedHtml", text);
        formik.setFieldValue("discoverFeedHtmlFileName", file.name);
        formik.setFieldValue("discoverFeedType", "html");
        toast.success(
          `Loaded "${file.name}" (${(file.size / 1024).toFixed(1)} KB) into Custom HTML.`,
        );
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleApplyTemplate = (template: (typeof DISCOVER_STARTER_TEMPLATES)[0]) => {
    formik.setFieldValue("discoverFeedHtml", template.html);
    if (template.css) {
      formik.setFieldValue("discoverFeedCss", template.css);
    }
    formik.setFieldValue("discoverFeedHtmlFileName", `${template.id}.html`);
    toast.success(`Inserted template "${template.name}".`);
  };

  const activeSourcesCount = [
    formik.values.allowEntityDiscoverInFeed,
    formik.values.allowEntityCommunityInFeed,
    formik.values.allowEntityDiscussionForumInFeed,
    formik.values.allowEntityPollsInFeed,
    formik.values.allowEntityMomentsInFeed,
    formik.values.allowEntityFeedInFeed,
    formik.values.allowEntityOpportunitiesInFeed,
    formik.values.allowEntityMediaGalleryInFeed,
  ].filter(Boolean).length;

  const contentSources = [
    {
      key: "allowEntityDiscoverInFeed" as const,
      label: "Show Discover Feed",
      defaultName: "Discover",
      description:
        "Main community stream showcasing personalized updates, trending posts, or custom HTML section.",
      icon: formik.values.discoverFeedType === "html" ? FileCode : Wand2,
      enabled: formik.values.allowEntityDiscoverInFeed,
    },
    {
      key: "allowEntityFeedInFeed" as const,
      label: `Show ${formik.values.feedTabNames["allowEntityFeedInFeed"] || formik.values.feedEntityName || "Admin"} Announcements`,
      defaultName: "By Admin",
      description:
        "Surface official administrative broadcasts, alerts, and pinned entity updates.",
      icon: ShieldAlert,
      enabled: formik.values.allowEntityFeedInFeed,
    },
    {
      key: "allowEntityCommunityInFeed" as const,
      label: "Show Communities in Feed",
      defaultName: "Communities",
      description:
        "Surface community group activities and member announcements in the main feed stream.",
      icon: Users2,
      enabled: formik.values.allowEntityCommunityInFeed,
    },
    {
      key: "allowEntityDiscussionForumInFeed" as const,
      label: "Show Forum Posts in Feed",
      defaultName: "Discussions",
      description:
        "Allow structured discussion forum topics and questions to appear in the stream.",
      icon: MessageSquare,
      enabled: formik.values.allowEntityDiscussionForumInFeed,
    },
    {
      key: "allowEntityPollsInFeed" as const,
      label: "Show Polls & Votes in Feed",
      defaultName: "Polls",
      description:
        "Allow interactive community voting polls and opinion cards directly in member feeds.",
      icon: BarChart2,
      enabled: formik.values.allowEntityPollsInFeed,
    },
    {
      key: "allowEntityMomentsInFeed" as const,
      label: "Show Video Moments in Feed",
      defaultName: "Moments",
      description:
        "Surface short-form vertical video clips and milestone moments in feed cards.",
      icon: Film,
      enabled: formik.values.allowEntityMomentsInFeed,
    },
    {
      key: "allowEntityOpportunitiesInFeed" as const,
      label: "Show Opportunities in Feed",
      defaultName: "Opportunities",
      description:
        "Surface job openings, grants, internships, and partnerships directly in member feed streams.",
      icon: Briefcase,
      enabled: formik.values.allowEntityOpportunitiesInFeed,
    },
    {
      key: "allowEntityMediaGalleryInFeed" as const,
      label: "Show Media Gallery in Feed",
      defaultName: "Media Gallery",
      description:
        "Surface photo albums and curated visual media collections directly in member feed tabs.",
      icon: Images,
      enabled: formik.values.allowEntityMediaGalleryInFeed,
    },
  ];

  const userActionPermissions = [
    {
      key: "allowFeedPost" as const,
      label: "Allow Feed Posts",
      description:
        "Allow members to create and publish new feed posts in the community.",
      icon: PenLine,
      enabled: formik.values.allowFeedPost,
    },
    {
      key: "allowComment" as const,
      label: "Allow Comments",
      description:
        "Allow members to comment and participate in discussions under feed posts.",
      icon: MessageCircle,
      enabled: formik.values.allowComment,
    },
    {
      key: "allowFeedReaction" as const,
      label: "Allow Feed Reactions",
      description:
        "Allow members to react with emojis and like feed posts and updates.",
      icon: Heart,
      enabled: formik.values.allowFeedReaction,
    },
    {
      key: "allowReactionVisibility" as const,
      label: "Show Reaction Visibility",
      description:
        "Display reaction counts and member reaction lists on feed posts.",
      icon: Eye,
      enabled: formik.values.allowReactionVisibility,
    },
    {
      key: "allowReshare" as const,
      label: "Allow Feed Reshare",
      description:
        "Allow members to reshare feed posts internally within the platform.",
      icon: Repeat2,
      enabled: formik.values.allowReshare,
    },
    {
      key: "allowStory" as const,
      label: "Allow Stories",
      description:
        "Allow members to publish short-lived story cards and ephemeral media.",
      icon: BookOpen,
      enabled: formik.values.allowStory,
    },
    {
      key: "allowSocialReshare" as const,
      label: "Allow Social Reshare",
      description:
        "Allow members to share feed posts externally to third-party social networks.",
      icon: Share2,
      enabled: formik.values.allowSocialReshare,
    },
    {
      key: "allowMediaGalleryShareToFeed" as const,
      label: "Allow Media Gallery Share to Feed",
      description:
        "Allow members to repost photos and albums from the media gallery directly into the community feed.",
      icon: Images,
      enabled: formik.values.allowMediaGalleryShareToFeed,
    },
  ];

  return (
    <div className="w-full pb-20">
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
                      {formik.values.feedEntityName || "Community"} Feed
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
                        formik.values.mediaGalleryFeedLinks.length > 0
                      ) {
                        return formik.values.mediaGalleryFeedLinks.map((link, idx) => (
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
                          {source.key === "allowEntityDiscoverInFeed" &&
                            source.enabled && (
                              <span className="text-[9.5px] px-1 py-0 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold ml-0.5">
                                {formik.values.discoverFeedType === "html"
                                  ? "HTML"
                                  : "Stream"}
                              </span>
                            )}
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
                  value={formik.values.feedEntityName || "Default (Admin)"}
                />
                <PolarisSummaryRow
                  label="Discover Tab Mode"
                  value={
                    !formik.values.allowEntityDiscoverInFeed
                      ? "Disabled (Auto-routed)"
                      : formik.values.discoverFeedType === "html"
                        ? "Custom HTML Page"
                        : "Standard Stream"
                  }
                  highlight={formik.values.allowEntityDiscoverInFeed}
                />
                <PolarisSummaryRow
                  label="Enabled Protocols"
                  value={`${activeSourcesCount} of ${contentSources.length} Active`}
                  highlight={activeSourcesCount >= 4}
                />
                <PolarisSummaryRow
                  label="AI Feed Sentinel"
                  value={formik.values.aiModerationFeed ? "Active" : "Disabled"}
                  highlight={formik.values.aiModerationFeed}
                />
                <PolarisSummaryRow
                  label="AI Comment Sentinel"
                  value={formik.values.aiModerationComments ? "Active" : "Disabled"}
                  highlight={formik.values.aiModerationComments}
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
              Configure the Discover tab as an HTML landing page to highlight custom onboarding guides or welcome resources, or leave it as a Dynamic Stream for automated content aggregation. When disabled, users are automatically routed to your first active tab.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                value={formik.values.feedEntityName}
                onChange={formik.handleChange}
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

                  {/* Discover Feed specific options */}
                  {source.key === "allowEntityDiscoverInFeed" && (
                    <>
                      {!source.enabled && (
                        <div className="mt-2.5 pt-2.5 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70 flex items-center gap-2 text-[11px] text-[#616161] dark:text-zinc-400">
                          <Info className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          <span>
                            Discover feed tab is turned off. Visiting /dashboard/feed in the user website will automatically redirect members to your first active tab.
                          </span>
                        </div>
                      )}

                      {source.enabled && (
                        <div className="mt-3.5 pt-3.5 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-3.5">
                          {/* Tab Display Name */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-[#616161] dark:text-zinc-400">
                              <span>Tab Display Name:</span>
                              <span className="text-[10px] text-[#8c9196]">
                                (Default: &quot;{source.defaultName}&quot;)
                              </span>
                            </div>
                            <input
                              type="text"
                              placeholder={source.defaultName}
                              value={
                                formik.values.feedTabNames[source.key] || ""
                              }
                              onChange={(e) =>
                                handleTabNameChange(source.key, e.target.value)
                              }
                              className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full sm:w-[240px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          {/* Mode Selection Tiles: Normal Feed vs Custom HTML */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-semibold text-[#303030] dark:text-zinc-300">
                              Discover Tab Display Mode:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {/* Option 1: Normal Feed Stream */}
                              <div
                                onClick={() =>
                                  formik.setFieldValue(
                                    "discoverFeedType",
                                    "normal",
                                  )
                                }
                                className={cn(
                                  "p-3 rounded-[8px] border cursor-pointer transition-all flex items-start gap-2.5",
                                  formik.values.discoverFeedType === "normal"
                                    ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs ring-1 ring-blue-500/20"
                                    : "border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 hover:border-[#b4b7bb]",
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-7 w-7 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 border",
                                    formik.values.discoverFeedType === "normal"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-white dark:bg-zinc-800 border-[#d2d5d9] text-[#616161]",
                                  )}
                                >
                                  <Wand2 className="h-3.5 w-3.5" />
                                </div>
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                                      Dynamic Feed Stream
                                    </span>
                                    {formik.values.discoverFeedType ===
                                      "normal" && (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                                    Personalized member stream aggregating trending updates and posts.
                                  </p>
                                </div>
                              </div>

                              {/* Option 2: Custom HTML Page */}
                              <div
                                onClick={() =>
                                  formik.setFieldValue(
                                    "discoverFeedType",
                                    "html",
                                  )
                                }
                                className={cn(
                                  "p-3 rounded-[8px] border cursor-pointer transition-all flex items-start gap-2.5",
                                  formik.values.discoverFeedType === "html"
                                    ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs ring-1 ring-blue-500/20"
                                    : "border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 hover:border-[#b4b7bb]",
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-7 w-7 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 border",
                                    formik.values.discoverFeedType === "html"
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-white dark:bg-zinc-800 border-[#d2d5d9] text-[#616161]",
                                  )}
                                >
                                  <FileCode className="h-3.5 w-3.5" />
                                </div>
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                                      Custom HTML Page
                                    </span>
                                    {formik.values.discoverFeedType ===
                                      "html" && (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                                    Upload an HTML file or configure scoped markup/CSS rendered in Shadow DOM.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Custom HTML Configuration Sub-panel */}
                          {formik.values.discoverFeedType === "html" && (
                            <div className="p-3.5 rounded-[8px] border border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10 space-y-3.5">
                              {/* Hidden file input */}
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept=".html,.htm,.txt"
                                onChange={handleHtmlFileSelect}
                                className="hidden"
                              />

                              {/* Upload Bar & Action Buttons */}
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-[6px] bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-colors shadow-xs cursor-pointer"
                                  >
                                    <FileUp className="h-3.5 w-3.5" />
                                    Upload .html File
                                  </button>

                                  {/* Starter Templates Dropdown */}
                                  <div className="flex items-center gap-1">
                                    {DISCOVER_STARTER_TEMPLATES.map((tpl) => (
                                      <button
                                        key={tpl.id}
                                        type="button"
                                        onClick={() => handleApplyTemplate(tpl)}
                                        className="px-2 py-1 text-[10.5px] rounded border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#f6f6f7] dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                                        title={`Insert ${tpl.name}`}
                                      >
                                        + {tpl.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Preview Button */}
                                <button
                                  type="button"
                                  onClick={() => setPreviewModalOpen(true)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 hover:bg-[#f6f6f7] transition-colors cursor-pointer"
                                >
                                  <EyeIcon className="h-3.5 w-3.5 text-blue-600" />
                                  Live Preview
                                </button>
                              </div>

                              {/* Uploaded File Pill */}
                              {formik.values.discoverFeedHtmlFileName && (
                                <div className="flex items-center justify-between p-2 rounded-[6px] bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-800 text-[11.5px]">
                                  <div className="flex items-center gap-2">
                                    <FileCode className="h-4 w-4 text-blue-600" />
                                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                                      {formik.values.discoverFeedHtmlFileName}
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className="text-[9.5px] px-1.5 py-0"
                                    >
                                      Active File
                                    </Badge>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      formik.setFieldValue(
                                        "discoverFeedHtmlFileName",
                                        "",
                                      );
                                    }}
                                    className="p-1 text-[#8c9196] hover:text-red-600 rounded transition-colors cursor-pointer"
                                    title="Clear file tag"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}

                              {/* HTML Code Editor */}
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-[#303030] dark:text-zinc-300 flex items-center justify-between">
                                  <span>HTML Markup (Shadow DOM Isolated):</span>
                                  <span className="text-[10px] text-[#8c9196] font-normal">
                                    HTML5, styles &amp; embeds supported
                                  </span>
                                </label>
                                <textarea
                                  value={formik.values.discoverFeedHtml || ""}
                                  onChange={(e) =>
                                    formik.setFieldValue(
                                      "discoverFeedHtml",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="<div class='hero'>...</div>"
                                  rows={8}
                                  className="w-full text-[11.5px] font-mono p-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-950 text-[#303030] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                                />
                              </div>

                              {/* Scoped CSS Editor */}
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-[#303030] dark:text-zinc-300 flex items-center justify-between">
                                  <span>Custom Scoped CSS (Optional):</span>
                                  <span className="text-[10px] text-[#8c9196] font-normal">
                                    Mapped to :host container automatically
                                  </span>
                                </label>
                                <textarea
                                  value={formik.values.discoverFeedCss || ""}
                                  onChange={(e) =>
                                    formik.setFieldValue(
                                      "discoverFeedCss",
                                      e.target.value,
                                    )
                                  }
                                  placeholder=":host { display: block; } .custom-banner { border-radius: 12px; }"
                                  rows={3}
                                  className="w-full text-[11.5px] font-mono p-2 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-950 text-[#303030] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Standard Tab Name Input for other sources */}
                  {source.key !== "allowEntityDiscoverInFeed" &&
                    source.key !== "allowEntityMediaGalleryInFeed" &&
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
                          value={
                            formik.values.feedTabNames[source.key] || ""
                          }
                          onChange={(e) =>
                            handleTabNameChange(source.key, e.target.value)
                          }
                          className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full sm:w-[220px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}

                  {/* Media Gallery Link Rows */}
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

                        {formik.values.mediaGalleryFeedLinks.length === 0 ? (
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
                              items={formik.values.mediaGalleryFeedLinks.map(
                                (l) => l.id,
                              )}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-2">
                                {formik.values.mediaGalleryFeedLinks.map(
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
                  checked={formik.values.aiModerationFeed}
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
                  checked={formik.values.aiModerationComments}
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

          {/* Floating Save Panel */}
          <FloatingSavePanel
            show={formik.dirty}
            isSaving={loadingBtn || loadingName}
            onSave={formik.handleSubmit}
            onDiscard={() => formik.resetForm()}
          />
        </form>
      </PolarisFormLayout>

      {/* Delete Media Link Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmTarget}
        onOpenChange={(open) => !open && setDeleteConfirmTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media Gallery Tab?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;
              {deleteConfirmTarget?.name}&quot; from the community feed? Members
              will no longer see this media stream in their navigation tabs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmTarget !== null) {
                  handleRemoveMediaLink(deleteConfirmTarget.index);
                  setDeleteConfirmTarget(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Remove Tab
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Discover HTML Live Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileCode className="h-4 w-4 text-blue-600" />
              Discover Tab HTML Live Preview
            </DialogTitle>
            <DialogDescription className="text-xs">
              Simulated preview inside isolated Shadow DOM container with scoped styles.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 min-h-[300px]">
            {formik.values.discoverFeedHtml?.trim() ? (
              <IsolatedHtmlRenderer
                html={formik.values.discoverFeedHtml}
                css={formik.values.discoverFeedCss}
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-[#8c9196] text-xs">
                No HTML content provided. Upload an HTML file or enter markup to preview.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
