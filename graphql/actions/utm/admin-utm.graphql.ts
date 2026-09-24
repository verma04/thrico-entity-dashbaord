import { gql, useQuery, useMutation } from "@apollo/client";
import {
  UtmCampaignItem,
  UtmCampaign360Stats,
  AttributedMemberProfile,
  UtmCampaignStatus,
  TimeRange,
  DateRangeInput,
  CreateUtmCampaignInput,
  UpdateUtmCampaignInput,
} from "@/types/utm";

// ===================================================
// 1. MAIN UTM MANAGER TABLE & SUMMARY
// ===================================================
export const ADMIN_GET_UTM_CAMPAIGNS = gql`
  query AdminGetUtmCampaigns(
    $status: UtmCampaignStatus
    $search: String
  ) {
    getUtmCampaigns(status: $status, search: $search) {
      id
      entityId
      name
      destinationType
      destinationUrl
      utmSource
      utmMedium
      utmCampaign
      utmTerm
      utmContent
      generatedUrl
      shortCode
      status
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// ===================================================
// 2. GET UTM CAMPAIGN BY ID
// ===================================================
export const ADMIN_GET_UTM_CAMPAIGN_BY_ID = gql`
  query AdminGetUtmCampaignById($id: ID!) {
    getUtmCampaignById(id: $id) {
      id
      entityId
      name
      destinationType
      destinationUrl
      utmSource
      utmMedium
      utmCampaign
      utmTerm
      utmContent
      generatedUrl
      shortCode
      status
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// ===================================================
// 3. 360 CAMPAIGN PERFORMANCE METRICS (Top Cards & Chart)
// ===================================================
export const ADMIN_GET_CAMPAIGN_360_STATS = gql`
  query AdminGetCampaign360Stats(
    $campaign: String!
    $timeRange: TimeRange
    $dateRange: DateRangeInput
  ) {
    getUtmCampaign360Stats(
      campaign: $campaign
      timeRange: $timeRange
      dateRange: $dateRange
    ) {
      campaign
      visits
      signupPageVisits
      signups
      loginClicks
      successfulLogins
      conversionRate
      sources {
        source
        visits
        signups
        conversionRate
        mediums {
          medium
          visits
          signups
          contents {
            content
            visits
            signups
            conversionRate
          }
        }
      }
    }
  }
`;

// ===================================================
// 4. CAMPAIGN ATTRIBUTED MEMBERS (Audit / Member List)
// ===================================================
export const ADMIN_GET_CAMPAIGN_MEMBERS = gql`
  query AdminGetCampaignMembers(
    $campaign: String!
    $source: String
    $limit: Int
    $offset: Int
  ) {
    getUtmCampaignMembers(
      campaign: $campaign
      source: $source
      limit: $limit
      offset: $offset
    ) {
      userId
      firstName
      lastName
      email
      avatar
      loginCount
      firstTouch {
        source
        medium
        campaign
        term
        content
        landingPage
        seenAt
      }
      lastTouch {
        source
        medium
        campaign
        term
        content
        landingPage
        seenAt
      }
    }
  }
`;

// ===================================================
// 5. CREATE NEW TRACKING LINK
// ===================================================
export const ADMIN_CREATE_UTM_CAMPAIGN = gql`
  mutation AdminCreateUtmCampaign($input: CreateUtmCampaignInput!) {
    createUtmCampaign(input: $input) {
      id
      entityId
      name
      destinationType
      destinationUrl
      utmSource
      utmMedium
      utmCampaign
      utmTerm
      utmContent
      generatedUrl
      shortCode
      status
      createdBy
      createdAt
      updatedAt
    }
  }
`;

// ===================================================
// 6. UPDATE CAMPAIGN STATUS / METADATA
// ===================================================
export const ADMIN_UPDATE_UTM_CAMPAIGN = gql`
  mutation AdminUpdateUtmCampaign($input: UpdateUtmCampaignInput!) {
    updateUtmCampaign(input: $input) {
      id
      entityId
      name
      destinationType
      destinationUrl
      utmSource
      utmMedium
      utmCampaign
      utmTerm
      utmContent
      generatedUrl
      shortCode
      status
      updatedAt
    }
  }
`;

// ===================================================
// 7. DELETE / ARCHIVE CAMPAIGN
// ===================================================
export const ADMIN_DELETE_UTM_CAMPAIGN = gql`
  mutation AdminDeleteUtmCampaign($id: ID!) {
    deleteUtmCampaign(id: $id)
  }
`;

// ===================================================
// Realistic Mock Data for Preview / Offline Fallback
// ===================================================
export const MOCK_UTM_CAMPAIGNS: UtmCampaignItem[] = [
  {
    id: "utm-1",
    name: "Summer 2026 Growth Drop",
    destinationType: "SIGNUP",
    destinationUrl: "https://thrico.app/auth/signup",
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "summer_growth_2026",
    utmTerm: "community software",
    utmContent: "search_ad_v1",
    generatedUrl: "https://thrico.app/auth/signup?utm_source=google&utm_medium=cpc&utm_campaign=summer_growth_2026&utm_term=community+software&utm_content=search_ad_v1",
    shortCode: "thrc.io/s26-g",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "utm-2",
    name: "Founder Weekly Newsletter Sponsor",
    destinationType: "SIGNUP",
    destinationUrl: "https://thrico.app/auth/signup",
    utmSource: "newsletter",
    utmMedium: "email",
    utmCampaign: "founder_weekly_sponsor",
    utmTerm: "vip_invite",
    utmContent: "issue_142_top_banner",
    generatedUrl: "https://thrico.app/auth/signup?utm_source=newsletter&utm_medium=email&utm_campaign=founder_weekly_sponsor&utm_content=issue_142_top_banner",
    shortCode: "thrc.io/fw-142",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "utm-3",
    name: "LinkedIn B2B Leadership Summit",
    destinationType: "CUSTOM",
    destinationUrl: "https://thrico.app/events/leadership-summit-2026",
    utmSource: "linkedin",
    utmMedium: "social",
    utmCampaign: "linkedin_summit_promo",
    utmTerm: "community_leaders",
    utmContent: "carousel_deck_case_study",
    generatedUrl: "https://thrico.app/events/leadership-summit-2026?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin_summit_promo&utm_content=carousel_deck_case_study",
    shortCode: "thrc.io/li-summit",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "utm-4",
    name: "Product Hunt Q2 Launch",
    destinationType: "LOGIN",
    destinationUrl: "https://thrico.app/auth/login",
    utmSource: "producthunt",
    utmMedium: "referral",
    utmCampaign: "ph_q2_launch",
    utmTerm: "ph_community",
    utmContent: "first_comment_cta",
    generatedUrl: "https://thrico.app/auth/login?utm_source=producthunt&utm_medium=referral&utm_campaign=ph_q2_launch&utm_content=first_comment_cta",
    shortCode: "thrc.io/ph-q2",
    status: "PAUSED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "utm-5",
    name: "Twitter / X Alpha Announcement",
    destinationType: "SIGNUP",
    destinationUrl: "https://thrico.app/auth/signup",
    utmSource: "twitter",
    utmMedium: "social",
    utmCampaign: "twitter_alpha_drop",
    utmTerm: "early_access",
    utmContent: "pinned_thread_hero",
    generatedUrl: "https://thrico.app/auth/signup?utm_source=twitter&utm_medium=social&utm_campaign=twitter_alpha_drop&utm_content=pinned_thread_hero",
    shortCode: "thrc.io/x-alpha",
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "utm-6",
    name: "Legacy Partner Backlink Campaign",
    destinationType: "CUSTOM",
    destinationUrl: "https://thrico.app/partners",
    utmSource: "partner",
    utmMedium: "affiliate",
    utmCampaign: "partner_co_marketing_2025",
    generatedUrl: "https://thrico.app/partners?utm_source=partner&utm_medium=affiliate&utm_campaign=partner_co_marketing_2025",
    shortCode: "thrc.io/ptnr-25",
    status: "ARCHIVED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
  },
];

export const MOCK_360_STATS: Record<string, UtmCampaign360Stats> = {
  default: {
    campaign: "summer_growth_2026",
    visits: 14820,
    signupPageVisits: 9340,
    signups: 2154,
    loginClicks: 4120,
    successfulLogins: 3890,
    conversionRate: 23.1,
    sources: [
      {
        source: "google",
        visits: 8420,
        signups: 1390,
        conversionRate: 24.8,
        mediums: [
          {
            medium: "cpc",
            visits: 6200,
            signups: 1040,
            contents: [
              { content: "search_ad_v1", visits: 3800, signups: 680, conversionRate: 26.1 },
              { content: "search_ad_brand_kw", visits: 2400, signups: 360, conversionRate: 22.8 },
            ],
          },
          {
            medium: "organic",
            visits: 2220,
            signups: 350,
            contents: [
              { content: "blog_community_playbook", visits: 2220, signups: 350, conversionRate: 15.8 },
            ],
          },
        ],
      },
      {
        source: "twitter",
        visits: 3840,
        signups: 490,
        conversionRate: 18.2,
        mediums: [
          {
            medium: "social",
            visits: 3840,
            signups: 490,
            contents: [
              { content: "pinned_thread_hero", visits: 2540, signups: 340, conversionRate: 19.4 },
              { content: "founder_quote_retweet", visits: 1300, signups: 150, conversionRate: 15.9 },
            ],
          },
        ],
      },
      {
        source: "newsletter",
        visits: 2560,
        signups: 274,
        conversionRate: 21.4,
        mediums: [
          {
            medium: "email",
            visits: 2560,
            signups: 274,
            contents: [
              { content: "issue_142_top_banner", visits: 1840, signups: 210, conversionRate: 22.8 },
              { content: "issue_142_footer_sponsor", visits: 720, signups: 64, conversionRate: 17.8 },
            ],
          },
        ],
      },
    ],
  },
};

export const MOCK_ATTRIBUTED_MEMBERS: AttributedMemberProfile[] = [
  {
    userId: "usr_101",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@growthcraft.io",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    loginCount: 14,
    firstTouch: {
      source: "google",
      medium: "cpc",
      campaign: "summer_growth_2026",
      term: "community software",
      content: "search_ad_v1",
      landingPage: "/auth/signup",
      seenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    },
    lastTouch: {
      source: "google",
      medium: "cpc",
      campaign: "summer_growth_2026",
      term: "community software",
      content: "search_ad_v1",
      landingPage: "/auth/signup",
      seenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    },
  },
  {
    userId: "usr_102",
    firstName: "Alexander",
    lastName: "Vance",
    email: "alexander@novaventure.co",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    loginCount: 28,
    firstTouch: {
      source: "twitter",
      medium: "social",
      campaign: "summer_growth_2026",
      term: "early_access",
      content: "pinned_thread_hero",
      landingPage: "/auth/signup",
      seenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    lastTouch: {
      source: "newsletter",
      medium: "email",
      campaign: "founder_weekly_sponsor",
      landingPage: "/auth/login",
      seenAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  },
  {
    userId: "usr_103",
    firstName: "Priya",
    lastName: "Mehta",
    email: "priya.mehta@scalepeak.dev",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    loginCount: 9,
    firstTouch: {
      source: "google",
      medium: "cpc",
      campaign: "summer_growth_2026",
      term: "creator community platform",
      content: "search_ad_brand_kw",
      landingPage: "/auth/signup",
      seenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    lastTouch: {
      source: "google",
      medium: "cpc",
      campaign: "summer_growth_2026",
      term: "creator community platform",
      content: "search_ad_brand_kw",
      landingPage: "/auth/signup",
      seenAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  },
  {
    userId: "usr_104",
    firstName: "Liam",
    lastName: "O'Connor",
    email: "liam@kineticlabs.org",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    loginCount: 3,
    firstTouch: {
      source: "newsletter",
      medium: "email",
      campaign: "founder_weekly_sponsor",
      content: "issue_142_top_banner",
      landingPage: "/auth/signup",
      seenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    lastTouch: {
      source: "newsletter",
      medium: "email",
      campaign: "founder_weekly_sponsor",
      content: "issue_142_top_banner",
      landingPage: "/auth/signup",
      seenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
  },
];

// ===================================================
// 5. VISITOR INTELLIGENCE QUERIES
// ===================================================

export const ADMIN_GET_VISITOR_INTELLIGENCE_SUMMARY = gql`
  query AdminGetVisitorIntelligenceSummary(
    $timeRange: TimeRange
    $dateRange: DateRangeInput
  ) {
    getVisitorIntelligenceSummary(timeRange: $timeRange, dateRange: $dateRange) {
      totalVisitors
      anonymousCount
      identifiedCount
      connectedCount
      recentlyActiveCount
      activeCount
      dormantCount
      atRiskCount
      churnedCount
      utmAttributedCount
      convertedCount
      identityResolutionRate
      utmAttributionRate
      conversionRate
    }
  }
`;

export const ADMIN_GET_VISITOR_INTELLIGENCE_PROFILES = gql`
  query AdminGetVisitorIntelligenceProfiles($input: VisitorIntelligenceFilterInput) {
    getVisitorIntelligenceProfiles(input: $input) {
      total
      page
      pageSize
      totalPages
      profiles {
        id
        type
        anonymousId
        customerId
        status
        statusLabel
        user {
          id
          firstName
          lastName
          email
          avatar
          role
          status
        }
        firstSeenAt
        lastSeenAt
        daysSinceLastActive
        totalSessions
        totalPageViews
        totalEvents
        campaignName
        source
        medium
        device
        browser
        country
        isConverted
        linkedIdentitiesCount
        firstTouch {
          source
          medium
          campaign
          landingPage
          seenAt
        }
        lastTouch {
          source
          medium
          campaign
          landingPage
          seenAt
        }
      }
    }
  }
`;

export const ADMIN_GET_VISITOR_360_DETAIL = gql`
  query AdminGetVisitor360Detail($visitorId: String!, $isAnonymous: Boolean) {
    getVisitor360Detail(visitorId: $visitorId, isAnonymous: $isAnonymous) {
      profile {
        id
        type
        anonymousId
        customerId
        status
        statusLabel
        firstSeenAt
        lastSeenAt
        daysSinceLastActive
        totalSessions
        totalPageViews
        totalEvents
        campaignName
        source
        medium
        device
        browser
        country
        isConverted
        linkedIdentitiesCount
        user {
          id
          firstName
          lastName
          email
          avatar
          role
        }
        firstTouch {
          source
          medium
          campaign
          landingPage
          seenAt
        }
        lastTouch {
          source
          medium
          campaign
          landingPage
          seenAt
        }
      }
      linkedAnonymousIds
      journeyTouchpoints {
        source
        medium
        campaign
        landingPage
        seenAt
      }
      topPages {
        url
        title
        views
      }
      activityStats {
        totalEvents
        pageViews
        clicks
        formStarts
        formSubmits
        logins
        signups
      }
      recentTimeline {
        eventId
        eventType
        category
        title
        description
        timestamp
      }
    }
  }
`;

// ===================================================
// 6. ATTRIBUTION REPORTS QUERIES
// ===================================================

export const ADMIN_GET_ATTRIBUTION_OVERVIEW_REPORT = gql`
  query AdminGetAttributionOverviewReport(
    $model: AttributionModel
    $timeRange: TimeRange
    $dateRange: DateRangeInput
    $campaign: String
  ) {
    getAttributionOverviewReport(
      model: $model
      timeRange: $timeRange
      dateRange: $dateRange
      campaign: $campaign
    ) {
      summary {
        totalAttributedVisitors
        totalSignups
        totalLogins
        totalConversions
        overallConversionRate
        topCampaign
        topSource
        topMedium
      }
      channelPerformance {
        channel
        visits
        signups
        conversions
        conversionRate
        shareOfTraffic
        shareOfConversions
      }
      campaignPerformance {
        campaign
        source
        medium
        visits
        signups
        logins
        conversions
        conversionRate
        firstTouchCount
        lastTouchCount
      }
      timeSeries {
        date
        visits
        signups
        conversions
      }
      topJourneys {
        path
        conversions
        percentage
      }
    }
  }
`;

