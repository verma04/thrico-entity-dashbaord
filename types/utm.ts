export type UtmDestinationType = "SIGNUP" | "LOGIN" | "CUSTOM";
export type UtmCampaignStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";

export interface UtmCampaignItem {
  id: string;
  entityId?: string;
  name: string;
  destinationType: UtmDestinationType;
  destinationUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm?: string;
  utmContent?: string;
  generatedUrl: string;
  shortCode?: string;
  status: UtmCampaignStatus;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  userCount?: number;
  users?: AttributedMemberProfile[];
}

export interface UtmUsersPayload {
  totalCount: number;
  users: AttributedMemberProfile[];
}

export interface UtmContentBreakdown {
  content: string;
  visits: number;
  signups: number;
  conversionRate: number;
}

export interface UtmMediumBreakdown {
  medium: string;
  visits: number;
  signups: number;
  contents: UtmContentBreakdown[];
}

export interface UtmSourceBreakdown {
  source: string;
  visits: number;
  signups: number;
  conversionRate: number;
  mediums: UtmMediumBreakdown[];
}

export interface UtmCampaign360Stats {
  campaign: string;
  visits: number;
  signupPageVisits: number;
  signups: number;
  loginClicks: number;
  successfulLogins: number;
  conversionRate: number;
  sources: UtmSourceBreakdown[];
}

export interface TouchDetails {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  landingPage?: string;
  seenAt?: string;
}

export interface AttributedMemberProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  loginCount: number;
  firstTouch: TouchDetails;
  lastTouch: TouchDetails;
}

export interface CreateUtmCampaignInput {
  name: string;
  destinationType: UtmDestinationType;
  destinationUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface UpdateUtmCampaignInput {
  id: string;
  name?: string;
  status?: UtmCampaignStatus;
  utmTerm?: string;
  utmContent?: string;
}

export interface DateRangeInput {
  startDate?: string;
  endDate?: string;
}

export type TimeRange =
  | "LAST_24_HOURS"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "LAST_90_DAYS"
  | "THIS_MONTH"
  | "LAST_MONTH";

// ========================================================
// Visitor Intelligence Types
// ========================================================

export type VisitorIntelligenceStatus =
  | "ALL"
  | "ANONYMOUS"
  | "IDENTIFIED"
  | "CONNECTED"
  | "RECENTLY_ACTIVE"
  | "ACTIVE"
  | "DORMANT"
  | "AT_RISK"
  | "CHURNED"
  | "UTM_ATTRIBUTED"
  | "CONVERTED";

export interface VisitorUserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  role?: string;
  status?: string;
  createdAt?: string;
}

export interface VisitorIntelligenceProfile {
  id: string;
  type: string;
  anonymousId?: string;
  customerId?: string;
  status: VisitorIntelligenceStatus;
  statusLabel: string;
  user?: VisitorUserProfile;
  firstSeenAt: string;
  lastSeenAt: string;
  daysSinceLastActive: number;
  totalSessions: number;
  totalPageViews: number;
  totalEvents: number;
  firstTouch?: TouchDetails;
  lastTouch?: TouchDetails;
  campaignName?: string;
  source?: string;
  medium?: string;
  device?: string;
  browser?: string;
  country?: string;
  isConverted: boolean;
  linkedIdentitiesCount: number;
}

export interface VisitorIntelligenceSummary {
  totalVisitors: number;
  anonymousCount: number;
  identifiedCount: number;
  connectedCount: number;
  recentlyActiveCount: number;
  activeCount: number;
  dormantCount: number;
  atRiskCount: number;
  churnedCount: number;
  utmAttributedCount: number;
  convertedCount: number;
  identityResolutionRate: number;
  utmAttributionRate: number;
  conversionRate: number;
}

export interface VisitorIntelligenceProfilesResponse {
  profiles: VisitorIntelligenceProfile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface VisitorIntelligenceFilterInput {
  status?: VisitorIntelligenceStatus;
  search?: string;
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  timeRange?: TimeRange;
  dateRange?: DateRangeInput;
  page?: number;
  limit?: number;
}

export interface VisitorTopPage {
  url: string;
  title?: string;
  views: number;
}

export interface VisitorActivityStats {
  totalEvents: number;
  pageViews: number;
  clicks: number;
  formStarts: number;
  formSubmits: number;
  logins: number;
  signups: number;
}

export interface Customer360TimelineItem {
  eventId: string;
  eventType: string;
  category: string;
  title: string;
  description?: string;
  timestamp: string;
  metadata?: any;
}

export interface Visitor360DetailResponse {
  profile: VisitorIntelligenceProfile;
  linkedAnonymousIds: string[];
  journeyTouchpoints: TouchDetails[];
  topPages: VisitorTopPage[];
  recentTimeline: Customer360TimelineItem[];
  activityStats: VisitorActivityStats;
}

// ========================================================
// Attribution Reports Types
// ========================================================

export type AttributionModel = "FIRST_TOUCH" | "LAST_TOUCH" | "LINEAR";

export interface AttributionSummaryKPIs {
  totalAttributedVisitors: number;
  totalSignups: number;
  totalLogins: number;
  totalConversions: number;
  overallConversionRate: number;
  topCampaign?: string;
  topSource?: string;
  topMedium?: string;
}

export interface AttributionChannelBreakdown {
  channel: string;
  visits: number;
  signups: number;
  conversions: number;
  conversionRate: number;
  shareOfTraffic: number;
  shareOfConversions: number;
}

export interface AttributionCampaignBreakdown {
  campaign: string;
  source: string;
  medium: string;
  visits: number;
  signups: number;
  logins: number;
  conversions: number;
  conversionRate: number;
  firstTouchCount: number;
  lastTouchCount: number;
}

export interface AttributionTimeSeriesPoint {
  date: string;
  visits: number;
  signups: number;
  conversions: number;
}

export interface AttributionJourneyPath {
  path: string[];
  conversions: number;
  percentage: number;
}

export interface AttributionOverviewReport {
  summary: AttributionSummaryKPIs;
  channelPerformance: AttributionChannelBreakdown[];
  campaignPerformance: AttributionCampaignBreakdown[];
  timeSeries: AttributionTimeSeriesPoint[];
  topJourneys: AttributionJourneyPath[];
}

