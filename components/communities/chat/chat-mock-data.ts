// ─── Types ────────────────────────────────────────────────────
export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
}

export interface Reaction {
  emoji: string;
  users: string[]; // user IDs
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: number; // ms
  edited?: boolean;
  reactions: Reaction[];
  threadCount?: number;
  threadMessages?: ChatMessage[];
  isDeleted?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  unreadCount: number;
  memberCount: number;
}

// ─── Mock Users ───────────────────────────────────────────────
export const MOCK_USERS: Record<string, ChatUser> = {
  u1: {
    id: "u1",
    name: "Ananya Sharma",
    avatar: "",
    status: "online",
  },
  u2: {
    id: "u2",
    name: "Vikram Patel",
    avatar: "",
    status: "online",
  },
  u3: {
    id: "u3",
    name: "Priya Nair",
    avatar: "",
    status: "away",
  },
  u4: {
    id: "u4",
    name: "Rahul Gupta",
    avatar: "",
    status: "offline",
  },
  u5: {
    id: "u5",
    name: "Meera Iyer",
    avatar: "",
    status: "online",
  },
  u6: {
    id: "u6",
    name: "Arjun Desai",
    avatar: "",
    status: "away",
  },
};

export const CURRENT_USER_ID = "u1";

// ─── Mock Channels ────────────────────────────────────────────
export const MOCK_CHANNELS: Channel[] = [
  {
    id: "ch-general",
    name: "general",
    description: "General discussion for the community",
    isPrivate: false,
    unreadCount: 3,
    memberCount: 128,
  },
  {
    id: "ch-announcements",
    name: "announcements",
    description: "Important updates and announcements",
    isPrivate: false,
    unreadCount: 1,
    memberCount: 128,
  },
  {
    id: "ch-introductions",
    name: "introductions",
    description: "Introduce yourself to the community",
    isPrivate: false,
    unreadCount: 0,
    memberCount: 96,
  },
  {
    id: "ch-random",
    name: "random",
    description: "Off-topic conversations and fun stuff",
    isPrivate: false,
    unreadCount: 7,
    memberCount: 102,
  },
  {
    id: "ch-help",
    name: "help-and-feedback",
    description: "Get help or share feedback",
    isPrivate: false,
    unreadCount: 0,
    memberCount: 85,
  },
  {
    id: "ch-events",
    name: "events",
    description: "Upcoming events and meetups",
    isPrivate: false,
    unreadCount: 2,
    memberCount: 74,
  },
  {
    id: "ch-admin",
    name: "admin-only",
    description: "Private admin discussions",
    isPrivate: true,
    unreadCount: 0,
    memberCount: 5,
  },
];

// ─── Helper ───────────────────────────────────────────────────
function ts(hoursAgo: number): number {
  return Date.now() - hoursAgo * 3600 * 1000;
}

// ─── Mock Messages by Channel ─────────────────────────────────
export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "ch-general": [
    {
      id: "m1",
      userId: "u2",
      content: "Hey everyone! 👋 Just wanted to check in — how's the new onboarding flow working for your teams?",
      timestamp: ts(48),
      reactions: [
        { emoji: "👋", users: ["u1", "u3", "u5"] },
        { emoji: "🎉", users: ["u4"] },
      ],
      threadCount: 3,
      threadMessages: [
        {
          id: "m1-t1",
          userId: "u1",
          content: "Working great so far! The step-by-step wizard is much clearer than before.",
          timestamp: ts(47),
          reactions: [{ emoji: "👍", users: ["u2"] }],
        },
        {
          id: "m1-t2",
          userId: "u3",
          content: "Agreed — though I noticed the email verification step could use a loading indicator.",
          timestamp: ts(46.5),
          reactions: [],
        },
        {
          id: "m1-t3",
          userId: "u2",
          content: "Good catch @Priya, I'll file that as a quick fix!",
          timestamp: ts(46),
          reactions: [{ emoji: "🙌", users: ["u3"] }],
        },
      ],
    },
    {
      id: "m2",
      userId: "u3",
      content: "Quick reminder — the community guidelines have been updated. Please take a moment to review them in the #announcements channel.",
      timestamp: ts(24),
      reactions: [{ emoji: "✅", users: ["u1", "u2", "u4", "u5"] }],
    },
    {
      id: "m3",
      userId: "u5",
      content: "Has anyone tried the new analytics dashboard? The real-time charts are incredible 📊",
      timestamp: ts(12),
      reactions: [
        { emoji: "🔥", users: ["u1", "u2", "u3"] },
        { emoji: "📊", users: ["u4", "u6"] },
      ],
      threadCount: 2,
      threadMessages: [
        {
          id: "m3-t1",
          userId: "u6",
          content: "Yes! The latency graphs are super useful for debugging. Big improvement over the old static reports.",
          timestamp: ts(11),
          reactions: [],
        },
        {
          id: "m3-t2",
          userId: "u1",
          content: "I love the export feature too — makes it easy to share with stakeholders.",
          timestamp: ts(10),
          reactions: [{ emoji: "💯", users: ["u5"] }],
        },
      ],
    },
    {
      id: "m4",
      userId: "u4",
      content: "Just deployed the latest build to staging. Everything looks stable — no regressions detected.",
      timestamp: ts(6),
      reactions: [{ emoji: "🚀", users: ["u1", "u2", "u3", "u5", "u6"] }],
    },
    {
      id: "m5",
      userId: "u1",
      content: "Great work team! Let's aim to get this to production by end of week. 💪",
      timestamp: ts(5),
      reactions: [
        { emoji: "💪", users: ["u2", "u3", "u4", "u5"] },
        { emoji: "🎯", users: ["u6"] },
      ],
    },
    {
      id: "m6",
      userId: "u6",
      content: "I've updated the API docs with the new endpoints. Let me know if anything needs clarification.",
      timestamp: ts(3),
      reactions: [{ emoji: "📝", users: ["u1"] }],
      threadCount: 1,
      threadMessages: [
        {
          id: "m6-t1",
          userId: "u2",
          content: "Looks comprehensive! One minor thing — the rate limiting section could use examples.",
          timestamp: ts(2.5),
          reactions: [],
        },
      ],
    },
    {
      id: "m7",
      userId: "u2",
      content: "Anyone up for a quick sync at 3 PM? Want to walk through the migration plan.",
      timestamp: ts(1),
      reactions: [
        { emoji: "👍", users: ["u1", "u3"] },
        { emoji: "🕐", users: ["u5"] },
      ],
    },
    {
      id: "m8",
      userId: "u3",
      content: "Just shared the meeting notes from yesterday's standup in the shared drive. Key takeaway: we're on track for the Q3 milestones! 🎯",
      timestamp: ts(0.5),
      reactions: [],
    },
  ],
  "ch-announcements": [
    {
      id: "a1",
      userId: "u1",
      content: "📢 **Important Update**: We're migrating to the new authentication system starting next Monday. Please review the migration guide linked in the docs section. Downtime expected: ~30 minutes during off-peak hours.",
      timestamp: ts(72),
      reactions: [
        { emoji: "👀", users: ["u2", "u3", "u4", "u5", "u6"] },
        { emoji: "📌", users: ["u2", "u3"] },
      ],
    },
    {
      id: "a2",
      userId: "u1",
      content: "🎉 We've hit 10,000 community members! Thank you all for being part of this journey. Special shoutout to our most active contributors this month!",
      timestamp: ts(24),
      reactions: [
        { emoji: "🎉", users: ["u2", "u3", "u4", "u5", "u6"] },
        { emoji: "❤️", users: ["u2", "u3", "u5"] },
        { emoji: "🥳", users: ["u4", "u6"] },
      ],
    },
  ],
  "ch-random": [
    {
      id: "r1",
      userId: "u4",
      content: "What's everyone's favorite productivity tool? I've been trying Obsidian and it's changed my workflow completely.",
      timestamp: ts(8),
      reactions: [{ emoji: "🤔", users: ["u1", "u3"] }],
      threadCount: 4,
      threadMessages: [
        {
          id: "r1-t1",
          userId: "u5",
          content: "Notion all the way! The database views are unmatched.",
          timestamp: ts(7.5),
          reactions: [{ emoji: "💯", users: ["u6"] }],
        },
        {
          id: "r1-t2",
          userId: "u3",
          content: "I'm a Linear + Raycast combo person. Keyboard-first everything!",
          timestamp: ts(7),
          reactions: [{ emoji: "⌨️", users: ["u2"] }],
        },
        {
          id: "r1-t3",
          userId: "u2",
          content: "Honestly just VSCode + terminal. Keep it simple 😅",
          timestamp: ts(6.5),
          reactions: [
            { emoji: "😅", users: ["u1", "u4"] },
            { emoji: "🔥", users: ["u3"] },
          ],
        },
        {
          id: "r1-t4",
          userId: "u1",
          content: "Arc browser has been a game-changer for me. Spaces + split views = 🧠",
          timestamp: ts(6),
          reactions: [],
        },
      ],
    },
    {
      id: "r2",
      userId: "u6",
      content: "Friday vibes ☕️ — anyone else working from a café today?",
      timestamp: ts(4),
      reactions: [
        { emoji: "☕️", users: ["u1", "u3", "u5"] },
        { emoji: "🏖️", users: ["u2"] },
      ],
    },
    {
      id: "r3",
      userId: "u5",
      content: "TIL: You can use `Cmd+K` in Slack to quickly jump to any channel or DM. Been using Slack for years and just discovered this 😂",
      timestamp: ts(2),
      reactions: [
        { emoji: "😂", users: ["u1", "u2", "u3", "u4", "u6"] },
        { emoji: "🤯", users: ["u4"] },
      ],
    },
  ],
};

// Fill empty channels with a default message
MOCK_CHANNELS.forEach((ch) => {
  if (!MOCK_MESSAGES[ch.id]) {
    MOCK_MESSAGES[ch.id] = [
      {
        id: `${ch.id}-welcome`,
        userId: "u1",
        content: `Welcome to #${ch.name}! ${ch.description}`,
        timestamp: ts(168),
        reactions: [],
      },
    ];
  }
});
