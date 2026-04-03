// Shared types, constants, and data for the Automation Campaign Builder
import React from "react";
import {
  Users, Calendar, Briefcase, ShoppingBag, ClipboardList,
  Mail, Bell, Tag, Clock, GitBranch, Play, Plus, Check,
  Send, UserCheck, LogIn, LogOut, Star, ListChecks, Zap, Store,
  Cake, UserPlus, Trophy, UserX, Activity,
} from "lucide-react";

// ─── Core Types ──────────────────────────────────────────────────────────────
export type NodeType = "trigger" | "condition" | "action" | "delay";

export type CampaignStatus = "draft" | "released" | "finished";
export type CampaignFrequency = "one-time" | "recurring";
export type CronType = "weekly" | "monthly" | "custom";
export type ChannelType = "email";
export type CampaignModule = "Communities" | "Events" | "Shop" | "Jobs" | "Listings" | "Users";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  blockKey: string;
  label: string;
  x: number;
  y: number;
  config: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
}

export interface ConditionRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface ConditionGroup {
  id: string;
  logic: "AND" | "OR";
  rules: ConditionRule[];
}

export interface DragBlock {
  key: string;
  label: string;
  type: NodeType;
}

// Campaign settings (the form data before entering the canvas)
export interface CampaignSettings {
  name: string;
  status: CampaignStatus;
  frequency: CampaignFrequency;
  cronType?: CronType;
  cronDay?: string;    // For weekly: "MON" | "TUE" | ...
  cronDate?: number;   // For monthly: 1-31
  cronMonths?: string[]; // For custom month selection
  module: CampaignModule | "";
  channelType: ChannelType;
  targetUsers: string; // "all" | "segment"
  description?: string;
}

// ─── UID generator ────────────────────────────────────────────────────────────
let _counter = 100;
export const uid = () => `node_${++_counter}`;

// ─── Module Colors ────────────────────────────────────────────────────────────
export const MODULE_COLORS: Record<string, string> = {
  Communities: "#3B82F6",
  Events:      "#8B5CF6",
  Shop:        "#10B981",
  Jobs:        "#F59E0B",
  Listings:    "#EF4444",
  Users:       "#EC4899",  // pink — birthdays, onboarding, lifecycle
};

// ─── Node Styles ──────────────────────────────────────────────────────────────
export const NODE_STYLES: Record<NodeType, {
  bg: string; border: string; headerBg: string;
  badgeBg: string; badgeText: string; badgeLabel: string;
  iconBg: string; iconColor: string;
}> = {
  trigger: {
    bg: "bg-white", border: "border-blue-200", headerBg: "bg-blue-50",
    badgeBg: "bg-blue-100", badgeText: "text-blue-700", badgeLabel: "TRIGGER",
    iconBg: "bg-blue-100", iconColor: "text-blue-600",
  },
  condition: {
    bg: "bg-white", border: "border-amber-200", headerBg: "bg-amber-50",
    badgeBg: "bg-amber-100", badgeText: "text-amber-700", badgeLabel: "CONDITION",
    iconBg: "bg-amber-100", iconColor: "text-amber-600",
  },
  action: {
    bg: "bg-white", border: "border-emerald-200", headerBg: "bg-emerald-50",
    badgeBg: "bg-emerald-100", badgeText: "text-emerald-700", badgeLabel: "ACTION",
    iconBg: "bg-emerald-100", iconColor: "text-emerald-600",
  },
  delay: {
    bg: "bg-white", border: "border-purple-200", headerBg: "bg-purple-50",
    badgeBg: "bg-purple-100", badgeText: "text-purple-700", badgeLabel: "DELAY",
    iconBg: "bg-purple-100", iconColor: "text-purple-600",
  },
};

export const NODE_ICONS: Record<NodeType, React.ReactNode> = {
  trigger:   <Play size={13} />,
  condition: <GitBranch size={13} />,
  action:    <Zap size={13} />,
  delay:     <Clock size={13} />,
};

// ─── Block type ───────────────────────────────────────────────────────────────
export interface Block {
  key: string;
  label: string;
  icon: React.ReactNode;
  type: NodeType;
  group: string; // sub-group label within the module panel
}

// ─── Generic module sections (used when no specific module is active) ─────────
export const BLOCK_MODULES = [
  {
    key: "communities", label: "Communities", color: "#3B82F6",
    icon: <Users size={14} />,
    blocks: [
      { key: "user-joined-community", label: "User Joined Community", icon: <LogIn size={13} />,  type: "trigger" as NodeType, group: "Triggers" },
      { key: "user-left-community",   label: "Left Community",        icon: <LogOut size={13} />, type: "trigger" as NodeType, group: "Triggers" },
    ],
  },
  {
    key: "events", label: "Events", color: "#8B5CF6",
    icon: <Calendar size={14} />,
    blocks: [
      { key: "event-registered", label: "Event Registered", icon: <UserCheck size={13} />, type: "trigger" as NodeType, group: "Triggers" },
      { key: "event-attended",   label: "Event Attended",   icon: <Check size={13} />,     type: "trigger" as NodeType, group: "Triggers" },
    ],
  },
  {
    key: "jobs", label: "Jobs", color: "#F59E0B",
    icon: <Briefcase size={14} />,
    blocks: [
      { key: "job-posted",  label: "Job Posted",  icon: <ListChecks size={13} />, type: "trigger" as NodeType, group: "Triggers" },
      { key: "job-applied", label: "Job Applied", icon: <Send size={13} />,       type: "trigger" as NodeType, group: "Triggers" },
    ],
  },
  {
    key: "shop", label: "Shop", color: "#10B981",
    icon: <Store size={14} />,
    blocks: [
      { key: "product-purchased", label: "Product Purchased", icon: <ShoppingBag size={13} />, type: "trigger" as NodeType, group: "Triggers" },
      { key: "shop-visited",      label: "Shop Visited",      icon: <Plus size={13} />,        type: "trigger" as NodeType, group: "Triggers" },
    ],
  },
  {
    key: "listings", label: "Listings", color: "#EF4444",
    icon: <ShoppingBag size={14} />,
    blocks: [
      { key: "listing-created", label: "Listing Created", icon: <Plus size={13} />,      type: "trigger" as NodeType, group: "Triggers" },
      { key: "listing-viewed",  label: "Listing Viewed",  icon: <UserCheck size={13} />, type: "trigger" as NodeType, group: "Triggers" },
    ],
  },
  {
    key: "surveys", label: "Surveys", color: "#6366F1",
    icon: <ClipboardList size={14} />,
    blocks: [
      { key: "survey-submitted", label: "Survey Submitted", icon: <Check size={13} />, type: "trigger" as NodeType, group: "Triggers" },
      { key: "low-rating",       label: "Low Rating Given",  icon: <Star size={13} />, type: "trigger" as NodeType, group: "Triggers" },
    ],
  },
  {
    key: "users", label: "Users", color: "#EC4899",
    icon: <UserPlus size={14} />,
    blocks: [
      { key: "user-birthday",     label: "Member Birthday",     icon: <Cake size={13} />,     type: "trigger" as NodeType, group: "Triggers" },
      { key: "user-registered",   label: "New Member Joined",   icon: <UserPlus size={13} />, type: "trigger" as NodeType, group: "Triggers" },
      { key: "user-inactive",     label: "Member Inactive",     icon: <UserX size={13} />,    type: "trigger" as NodeType, group: "Triggers" },
      { key: "badge-earned",      label: "Badge / Achievement", icon: <Trophy size={13} />,   type: "trigger" as NodeType, group: "Triggers" },
      { key: "user-profile-updated", label: "Profile Updated", icon: <UserCheck size={13} />, type: "trigger" as NodeType, group: "Triggers" },
    ],
  },
];

// ─── Per-module full block palette (triggers + module-specific actions) ────────
export const MODULE_BLOCKS: Record<string, Block[]> = {
  Communities: [
    // Triggers
    { key: "user-joined-community",  label: "User Joined Community",  icon: <LogIn size={13} />,    type: "trigger",   group: "Triggers" },
    { key: "user-left-community",    label: "Left Community",          icon: <LogOut size={13} />,   type: "trigger",   group: "Triggers" },
    { key: "member-milestone",       label: "Member Milestone",         icon: <Star size={13} />,    type: "trigger",   group: "Triggers" },
    { key: "community-post-created", label: "Post Created",             icon: <Plus size={13} />,    type: "trigger",   group: "Triggers" },
    // Actions
    { key: "send-welcome-email",     label: "Send Welcome Email",       icon: <Mail size={13} />,    type: "action",    group: "Actions" },
    { key: "add-to-community",       label: "Add to Community",         icon: <UserCheck size={13} />, type: "action", group: "Actions" },
    { key: "send-community-digest",  label: "Send Community Digest",    icon: <Send size={13} />,    type: "action",    group: "Actions" },
    { key: "send-notification",      label: "Send Notification",        icon: <Bell size={13} />,    type: "action",    group: "Actions" },
    { key: "add-tag",                label: "Add Tag",                  icon: <Tag size={13} />,     type: "action",    group: "Actions" },
  ],
  Events: [
    // Triggers
    { key: "event-registered",       label: "Event Registered",         icon: <UserCheck size={13} />, type: "trigger", group: "Triggers" },
    { key: "event-attended",         label: "Event Attended",           icon: <Check size={13} />,     type: "trigger", group: "Triggers" },
    { key: "event-cancelled",        label: "Event Cancelled",          icon: <LogOut size={13} />,    type: "trigger", group: "Triggers" },
    { key: "waitlist-opened",        label: "Spot Available (Waitlist)", icon: <Plus size={13} />,    type: "trigger", group: "Triggers" },
    // Actions
    { key: "send-event-reminder",    label: "Send Event Reminder",      icon: <Bell size={13} />,      type: "action",  group: "Actions" },
    { key: "send-event-confirmation",label: "Send Confirmation Email",   icon: <Mail size={13} />,      type: "action",  group: "Actions" },
    { key: "send-post-event-survey", label: "Send Post-Event Survey",   icon: <Send size={13} />,      type: "action",  group: "Actions" },
    { key: "add-to-waitlist",        label: "Add to Waitlist",          icon: <ListChecks size={13} />,type: "action",  group: "Actions" },
    { key: "add-tag",                label: "Add Tag",                  icon: <Tag size={13} />,       type: "action",  group: "Actions" },
  ],
  Shop: [
    // Triggers
    { key: "product-purchased",      label: "Product Purchased",        icon: <ShoppingBag size={13} />, type: "trigger", group: "Triggers" },
    { key: "shop-visited",           label: "Shop Visited",             icon: <UserCheck size={13} />,   type: "trigger", group: "Triggers" },
    { key: "cart-abandoned",         label: "Cart Abandoned",           icon: <LogOut size={13} />,      type: "trigger", group: "Triggers" },
    { key: "product-reviewed",       label: "Product Reviewed",         icon: <Star size={13} />,        type: "trigger", group: "Triggers" },
    // Actions
    { key: "send-order-confirmation",label: "Send Order Confirmation",  icon: <Mail size={13} />,        type: "action",  group: "Actions" },
    { key: "send-shipping-update",   label: "Send Shipping Update",     icon: <Send size={13} />,        type: "action",  group: "Actions" },
    { key: "send-review-request",    label: "Request a Review",         icon: <Star size={13} />,        type: "action",  group: "Actions" },
    { key: "send-upsell-email",      label: "Send Upsell Email",        icon: <Zap size={13} />,         type: "action",  group: "Actions" },
    { key: "add-tag",                label: "Add Tag",                  icon: <Tag size={13} />,         type: "action",  group: "Actions" },
  ],
  Jobs: [
    // Triggers
    { key: "job-posted",             label: "Job Posted",               icon: <ListChecks size={13} />,  type: "trigger", group: "Triggers" },
    { key: "job-applied",            label: "Job Applied",              icon: <Send size={13} />,        type: "trigger", group: "Triggers" },
    { key: "application-shortlisted",label: "Application Shortlisted",  icon: <Check size={13} />,       type: "trigger", group: "Triggers" },
    { key: "job-expired",            label: "Job Expired",              icon: <LogOut size={13} />,      type: "trigger", group: "Triggers" },
    // Actions
    { key: "send-application-confirmation", label: "Send Application Confirmation", icon: <Mail size={13} />, type: "action", group: "Actions" },
    { key: "send-job-match-alert",   label: "Send Job Match Alert",     icon: <Bell size={13} />,        type: "action",  group: "Actions" },
    { key: "notify-recruiter",       label: "Notify Recruiter",         icon: <Send size={13} />,        type: "action",  group: "Actions" },
    { key: "send-interview-invite",  label: "Send Interview Invite",    icon: <Calendar size={13} />,    type: "action",  group: "Actions" },
    { key: "add-tag",                label: "Add Tag",                  icon: <Tag size={13} />,         type: "action",  group: "Actions" },
  ],
  Listings: [
    // Triggers
    { key: "listing-created",        label: "Listing Created",          icon: <Plus size={13} />,        type: "trigger", group: "Triggers" },
    { key: "listing-viewed",         label: "Listing Viewed",           icon: <UserCheck size={13} />,   type: "trigger", group: "Triggers" },
    { key: "listing-inquiry",        label: "New Inquiry Received",      icon: <Send size={13} />,       type: "trigger", group: "Triggers" },
    { key: "listing-expired",        label: "Listing Expired",          icon: <LogOut size={13} />,      type: "trigger", group: "Triggers" },
    // Actions
    { key: "send-listing-approved",  label: "Send Approval Email",      icon: <Mail size={13} />,        type: "action",  group: "Actions" },
    { key: "notify-seller-views",    label: "Notify Seller on 10 Views", icon: <Bell size={13} />,      type: "action",  group: "Actions" },
    { key: "send-price-drop-alert",  label: "Send Price Drop Alert",    icon: <Zap size={13} />,         type: "action",  group: "Actions" },
    { key: "send-inquiry-reply",     label: "Auto-Reply to Inquiry",    icon: <Send size={13} />,        type: "action",  group: "Actions" },
    { key: "add-tag",                label: "Add Tag",                  icon: <Tag size={13} />,         type: "action",  group: "Actions" },
  ],
  // ── Users module ───────────────────────────────────────────────────────
  Users: [
    // Triggers — member lifecycle events
    { key: "user-birthday",          label: "Member Birthday",           icon: <Cake size={13} />,        type: "trigger", group: "Triggers" },
    { key: "user-registered",        label: "New Member Joined",         icon: <UserPlus size={13} />,    type: "trigger", group: "Triggers" },
    { key: "user-inactive",          label: "Member Inactive (30d)",     icon: <UserX size={13} />,       type: "trigger", group: "Triggers" },
    { key: "badge-earned",           label: "Badge / Achievement",       icon: <Trophy size={13} />,      type: "trigger", group: "Triggers" },
    { key: "points-milestone",       label: "Points Milestone Hit",      icon: <Star size={13} />,        type: "trigger", group: "Triggers" },
    { key: "user-level-up",          label: "Member Levelled Up",        icon: <Activity size={13} />,    type: "trigger", group: "Triggers" },
    { key: "user-profile-updated",   label: "Profile Updated",           icon: <UserCheck size={13} />,   type: "trigger", group: "Triggers" },
    // Actions
    { key: "send-birthday-email",    label: "Send Birthday Email",       icon: <Cake size={13} />,        type: "action",  group: "Actions" },
    { key: "send-welcome-series",    label: "Send Welcome Series",       icon: <Mail size={13} />,        type: "action",  group: "Actions" },
    { key: "send-achievement-email", label: "Send Achievement Email",    icon: <Trophy size={13} />,      type: "action",  group: "Actions" },
    { key: "send-winback-email",     label: "Send Win-back Email",       icon: <Zap size={13} />,         type: "action",  group: "Actions" },
    { key: "award-badge",            label: "Award Badge",               icon: <Star size={13} />,        type: "action",  group: "Actions" },
    { key: "add-tag",                label: "Add Tag",                   icon: <Tag size={13} />,         type: "action",  group: "Actions" },
    { key: "send-notification",      label: "Send Notification",         icon: <Bell size={13} />,        type: "action",  group: "Actions" },
  ],
};

export const COMMON_BLOCKS = [
  { key: "condition",          label: "Condition",          icon: <GitBranch size={13} />, type: "condition" as NodeType },
  { key: "delay",              label: "Delay (Wait)",       icon: <Clock size={13} />,     type: "delay" as NodeType },
  { key: "send-email-action",  label: "Send Email",         icon: <Mail size={13} />,      type: "action" as NodeType },
  { key: "send-notification",  label: "Send Notification",  icon: <Bell size={13} />,      type: "action" as NodeType },
  { key: "add-tag",            label: "Add Tag",            icon: <Tag size={13} />,       type: "action" as NodeType },
];

export const SMART_SUGGESTIONS = [
  { label: "Send reminder 1 day before event",   trigger: "event-registered" },
  { label: "Re-engage dormant members",          trigger: "user-left-community" },
  { label: "Notify on job match",                trigger: "job-posted" },
  { label: "Follow up after survey submission",  trigger: "survey-submitted" },
];

// ─── Condition fields (shared / fallback) ────────────────────────────────────
export const CONDITION_FIELDS = [
  { value: "user.city",    label: "User · City" },
  { value: "user.skills",  label: "User · Skills" },
  { value: "user.age",     label: "User · Age" },
];

// ─── Per-module condition fields ─────────────────────────────────────────────
export const MODULE_CONDITION_FIELDS: Record<string, { value: string; label: string; group: string }[]> = {
  Communities: [
    // User context
    { value: "user.city",               label: "User · City",               group: "User" },
    { value: "user.age",                label: "User · Age",                group: "User" },
    { value: "user.skills",             label: "User · Skills",             group: "User" },
    { value: "user.joined_days_ago",    label: "User · Days since joined",  group: "User" },
    // Community context
    { value: "community.type",          label: "Community · Type",          group: "Community" },
    { value: "community.category",      label: "Community · Category",      group: "Community" },
    { value: "community.member_count",  label: "Community · Member count",  group: "Community" },
    { value: "community.visibility",    label: "Community · Visibility",    group: "Community" },
  ],
  Events: [
    { value: "user.city",               label: "User · City",               group: "User" },
    { value: "user.skills",             label: "User · Skills",             group: "User" },
    { value: "user.age",                label: "User · Age",                group: "User" },
    { value: "event.category",          label: "Event · Category",          group: "Event" },
    { value: "event.location",          label: "Event · Location",          group: "Event" },
    { value: "event.mode",              label: "Event · Mode (online/offline)", group: "Event" },
    { value: "event.capacity",          label: "Event · Capacity",          group: "Event" },
    { value: "event.days_until",        label: "Event · Days until event",  group: "Event" },
    { value: "registration.ticket_type", label: "Registration · Ticket type", group: "Registration" },
  ],
  Shop: [
    { value: "user.city",               label: "User · City",               group: "User" },
    { value: "user.age",                label: "User · Age",                group: "User" },
    { value: "product.category",        label: "Product · Category",        group: "Product" },
    { value: "product.price",           label: "Product · Price",           group: "Product" },
    { value: "order.total",             label: "Order · Total amount",      group: "Order" },
    { value: "order.item_count",        label: "Order · Item count",        group: "Order" },
    { value: "order.payment_method",    label: "Order · Payment method",    group: "Order" },
  ],
  Jobs: [
    { value: "user.city",               label: "User · City",               group: "User" },
    { value: "user.skills",             label: "User · Skills",             group: "User" },
    { value: "user.experience_years",   label: "User · Years of experience", group: "User" },
    { value: "job.role",                label: "Job · Role / Title",        group: "Job" },
    { value: "job.company",             label: "Job · Company",             group: "Job" },
    { value: "job.location",            label: "Job · Location",            group: "Job" },
    { value: "job.type",                label: "Job · Type (full/part/remote)", group: "Job" },
    { value: "job.salary_range",        label: "Job · Salary range",        group: "Job" },
    { value: "application.status",      label: "Application · Status",      group: "Application" },
  ],
  Listings: [
    { value: "user.city",               label: "User · City",               group: "User" },
    { value: "user.age",                label: "User · Age",                group: "User" },
    { value: "listing.category",        label: "Listing · Category",        group: "Listing" },
    { value: "listing.price",           label: "Listing · Price",           group: "Listing" },
    { value: "listing.location",        label: "Listing · Location",        group: "Listing" },
    { value: "listing.views",           label: "Listing · View count",      group: "Listing" },
    { value: "listing.condition",       label: "Listing · Condition (new/used)", group: "Listing" },
    { value: "listing.days_active",     label: "Listing · Days active",     group: "Listing" },
  ],
  // Users module — member lifecycle conditions
  Users: [
    { value: "user.age",                label: "User · Age",                 group: "User" },
    { value: "user.city",               label: "User · City",                group: "User" },
    { value: "user.joined_days_ago",    label: "User · Days since joined",   group: "User" },
    { value: "user.last_login_days_ago",label: "User · Days since last login", group: "User" },
    { value: "user.total_points",       label: "User · Total points",        group: "User" },
    { value: "user.current_level",      label: "User · Current level",       group: "User" },
    { value: "user.badges_count",       label: "User · Badge count",         group: "User" },
    { value: "user.birthday_month",     label: "User · Birthday month",      group: "User" },
    { value: "user.profile_complete",   label: "User · Profile % complete",  group: "User" },
    { value: "gamification.streak",     label: "Gamification · Login streak",group: "Gamification" },
    { value: "gamification.rank",       label: "Gamification · Rank",        group: "Gamification" },
    { value: "gamification.badge_name", label: "Gamification · Badge earned",group: "Gamification" },
  ],
};

export const OPERATORS = ["equals", "not equals", "contains", "not contains", "greater than", "less than"];

// ─── Campaign Modules options ─────────────────────────────────────────────────
export const CAMPAIGN_MODULES: { value: CampaignModule; label: string; color: string; icon: React.ReactNode; isMobileOnly?: boolean }[] = [
  { value: "Communities", label: "Communities", color: "#3B82F6", icon: <Users size={16} />, isMobileOnly: true },
  { value: "Events",      label: "Events",      color: "#8B5CF6", icon: <Calendar size={16} /> },
  { value: "Shop",        label: "Shop",        color: "#10B981", icon: <Store size={16} /> },
  { value: "Jobs",        label: "Jobs",        color: "#F59E0B", icon: <Briefcase size={16} />, isMobileOnly: true },
  { value: "Listings",    label: "Listings",    color: "#EF4444", icon: <ShoppingBag size={16} />, isMobileOnly: true },
  { value: "Users",       label: "Users",       color: "#EC4899", icon: <UserPlus size={16} />, isMobileOnly: true },
];

// ─── Mock Campaigns ───────────────────────────────────────────────────────────
export const MOCK_CAMPAIGNS: {
  id: string;
  name: string;
  status: CampaignStatus;
  frequency: CampaignFrequency;
  cronLabel?: string;
  cronType?: string;
  module: CampaignModule;
  channelType: ChannelType;
  trigger: string;
  nodes: number;
  audience: number;
  lastEdited: string;
  canvasNodes?: string;
  updatedAt?: string;
}[] = [
  {
    id: "c1",
    name: "Welcome New Members",
    status: "released",
    frequency: "one-time",
    module: "Communities",
    channelType: "email",
    trigger: "User Joined Community",
    nodes: 4,
    audience: 2340,
    lastEdited: "2 days ago",
    canvasNodes: JSON.stringify([{}, {}, {}, {}]),
  },
  {
    id: "c2",
    name: "Weekly Event Reminder",
    status: "draft",
    frequency: "recurring",
    cronLabel: "Every Monday",
    cronType: "weekly",
    module: "Events",
    channelType: "email",
    trigger: "Event Registered",
    nodes: 3,
    audience: 890,
    lastEdited: "5 days ago",
    canvasNodes: JSON.stringify([{}, {}, {}]),
  },
  {
    id: "c3",
    name: "Job Application Follow-up",
    status: "finished",
    frequency: "one-time",
    module: "Jobs",
    channelType: "email",
    trigger: "Job Applied",
    nodes: 5,
    audience: 445,
    lastEdited: "12 days ago",
    canvasNodes: JSON.stringify([{}, {}, {}, {}, {}]),
  },
  {
    id: "c4",
    name: "Happy Birthday members",
    status: "released",
    frequency: "recurring",
    cronLabel: "Every Day",
    cronType: "daily",
    module: "Users",
    channelType: "email",
    trigger: "Member Birthday",
    nodes: 3,
    audience: 120,
    lastEdited: "Just now",
    canvasNodes: JSON.stringify([{}, {}, {}]),
  },
];
