export type BlockType =
  | "text"
  | "heading"
  | "image"
  | "button"
  | "divider"
  | "spacer"
  | "header"
  | "navbar"
  | "footer";

export type TextAlign = "left" | "center" | "right";
export type SpacerSize = "sm" | "md" | "lg" | "xl";

export interface BuilderBlock {
  id: string;
  type: BlockType;
  content: string;
  align: TextAlign;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: number;
  color: string;
  bgColor: string;
  href: string;
  spacerSize: SpacerSize;
  imageAlt: string;
  logoUrl?: string;
  secondaryContent?: string;
}

export const defaultBlock = (type: BlockType, id: string): BuilderBlock => ({
  id,
  type,
  content:
    type === "text"
      ? "Write your message here..."
      : type === "heading"
        ? "Your Heading"
        : type === "button"
          ? "Click Here"
          : type === "navbar"
            ? JSON.stringify([
                { label: "Home", url: "#" },
                { label: "Products", url: "#" },
                { label: "Contact", url: "#" },
              ])
            : type === "footer"
              ? "© 2026 Thrico. All rights reserved. 123 Innovation Way, San Francisco, CA"
              : "",
  align:
    type === "header" || type === "navbar" || type === "footer"
      ? "center"
      : "left",
  bold: type === "heading" || type === "button",
  italic: false,
  underline: false,
  fontSize:
    type === "heading" ? 24 : type === "button" || type === "navbar" ? 14 : 14,
  color: type === "button" ? "#ffffff" : "#1e293b",
  bgColor: type === "button" ? "#0f172a" : "transparent",
  href: "",
  spacerSize: "md",
  imageAlt: "",
  logoUrl: type === "header" ? "https://cdn.thrico.network/thrico.png" : "",
  secondaryContent: type === "header" ? "Premium Ecosystem Dashboard" : "",
});

export const STARTER_TEMPLATES = {
  WELCOME: {
    name: "Welcome Email",
    subject: "Welcome to our community! 🎉",
    blocks: [
      {
        ...defaultBlock("header", "h1"),
        secondaryContent: "Welcome to the future",
      },
      {
        ...defaultBlock("heading", "he1"),
        content: "We're so glad you're here!",
        align: "center" as TextAlign,
        fontSize: 32,
      },
      {
        ...defaultBlock("image", "i1"),
        content: "https://images.unsplash.com/photo-1549439602-43bbcb45f612?q=80&w=1200",
      },
      {
        ...defaultBlock("text", "t1"),
        content: "Welcome to Thrico! We're excited to have you join our growing community of innovators. Your journey starts today, and we're here to support you every step of the way.",
        align: "center" as TextAlign,
      },
      {
        ...defaultBlock("button", "b1"),
        content: "Explore Dashboard",
        align: "center" as TextAlign,
        href: "https://thrico.network",
      },
      { ...defaultBlock("spacer", "s1"), spacerSize: "lg" as SpacerSize },
      { ...defaultBlock("footer", "f1") },
    ],
  },
  NEWSLETTER: {
    name: "Monthly Newsletter",
    subject: "The Thrico Monthly Update - March 2026 🗞️",
    blocks: [
      {
        ...defaultBlock("header", "h1"),
        secondaryContent: "March 2026 Edition",
      },
      {
        ...defaultBlock("navbar", "n1"),
        content: JSON.stringify([
          { label: "Updates", url: "#" },
          { label: "Stories", url: "#" },
          { label: "Community", url: "#" },
        ]),
      },
      {
        ...defaultBlock("heading", "he1"),
        content: "What's New This Month",
        align: "left" as TextAlign,
      },
      {
        ...defaultBlock("image", "i1"),
        content: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
      },
      {
        ...defaultBlock("text", "t1"),
        content: "It's been a busy month for the team! We've launched several new features including gRPC integration, advanced usage tracking, and a brand new email builder.",
      },
      {
        ...defaultBlock("button", "b1"),
        content: "Read Full Update",
        align: "left" as TextAlign,
      },
      { ...defaultBlock("divider", "d1") },
      {
        ...defaultBlock("heading", "he2"),
        content: "Community Spotlight",
        fontSize: 20,
      },
      {
        ...defaultBlock("text", "t2"),
        content: "Meet our user of the month, Alex, who has used Thrico to scale their local business by 300% in just 60 days.",
      },
      { ...defaultBlock("footer", "f1") },
    ],
  },
  EVENT: {
    name: "Event Invitation",
    subject: "You're Invited: Thrico Connect 2026 🎟️",
    blocks: [
      { ...defaultBlock("header", "h1") },
      {
        ...defaultBlock("heading", "he1"),
        content: "Thrico Connect 2026",
        align: "center" as TextAlign,
        fontSize: 36,
      },
      {
        ...defaultBlock("image", "i1"),
        content: "https://images.unsplash.com/photo-1540575861501-7ad05823c21b?q=80&w=1200",
      },
      {
        ...defaultBlock("text", "t1"),
        content: "Join us for an exclusive evening of networking, innovation, and insights into the future of digital ecosystems.",
        align: "center" as TextAlign,
        bold: true,
      },
      {
        ...defaultBlock("text", "t2"),
        content: "🗓️ April 15th, 2026 | 📍 San Francisco, CA | 🕕 6:00 PM PST",
        align: "center" as TextAlign,
      },
      {
        ...defaultBlock("button", "b1"),
        content: "RSVP Now",
        align: "center" as TextAlign,
        bgColor: "#6366f1",
      },
      { ...defaultBlock("spacer", "s1"), spacerSize: "md" as SpacerSize },
      { ...defaultBlock("footer", "f1") },
    ],
  },
  ANNOUNCEMENT: {
    name: "Big Announcement",
    subject: "Big changes are coming to Thrico! 🚀",
    blocks: [
      { ...defaultBlock("header", "h1") },
      {
        ...defaultBlock("heading", "he1"),
        content: "New Infrastructure Launch",
        align: "center" as TextAlign,
        color: "#6366f1",
      },
      {
        ...defaultBlock("image", "i1"),
        content: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
      },
      {
        ...defaultBlock("text", "t1"),
        content: "We're excited to announce that we've completely overhauled our backend infrastructure to provide 10x faster response times and improved reliability across the board.",
        align: "center" as TextAlign,
      },
      {
        ...defaultBlock("button", "b1"),
        content: "Read the Technical Docs",
        align: "center" as TextAlign,
      },
      { ...defaultBlock("footer", "f1") },
    ],
  },
};
