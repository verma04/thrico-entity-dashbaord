import { createLucideIcon } from "lucide-react";
import type { IconNode } from "lucide-react";

const githubIconNode: IconNode = [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef",
    },
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }],
];

const linkedinIconNode: IconNode = [
  [
    "path",
    {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
      key: "c2jq9f",
    },
  ],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }],
];

const twitterIconNode: IconNode = [
  [
    "path",
    {
      d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
      key: "pff0z6",
    },
  ],
];

const slackIconNode: IconNode = [
  ["rect", { width: "3", height: "8", x: "13", y: "2", rx: "1.5", key: "diqz80" }],
  ["path", { d: "M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5", key: "183iwg" }],
  ["rect", { width: "3", height: "8", x: "8", y: "14", rx: "1.5", key: "hqg7r1" }],
  ["path", { d: "M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5", key: "76g71w" }],
  ["rect", { width: "8", height: "3", x: "14", y: "13", rx: "1.5", key: "1kmz0a" }],
  ["path", { d: "M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5", key: "jc4sz0" }],
  ["rect", { width: "8", height: "3", x: "2", y: "8", rx: "1.5", key: "1omvl4" }],
  ["path", { d: "M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5", key: "16f3cl" }],
];

const facebookIconNode: IconNode = [
  [
    "path",
    {
      d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
      key: "1jg4f8",
    },
  ],
];

const instagramIconNode: IconNode = [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "2e1cvw" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "9exkf1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "r4j83e" }],
];

const youtubeIconNode: IconNode = [
  [
    "path",
    {
      d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
      key: "1q2vi4",
    },
  ],
  ["path", { d: "m10 15 5-3-5-3z", key: "1jp15x" }],
];

const whatsappIconNode: IconNode = [
  [
    "path",
    {
      d: "M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21",
      key: "wa_bubble",
    },
  ],
  [
    "path",
    {
      d: "M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1",
      key: "wa_phone",
    },
  ],
];

const tiktokIconNode: IconNode = [
  [
    "path",
    {
      d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5",
      key: "tt_1",
    },
  ],
];

const discordIconNode: IconNode = [
  [
    "path",
    {
      d: "M18 6a15.8 15.8 0 0 0-4.1-1.3c-.2.4-.4.8-.5 1.3-1.5-.2-3.1-.2-4.7 0-.2-.5-.4-.9-.6-1.3A15.8 15.8 0 0 0 4 6C1.5 9.7 1 13.8 1.4 17.8a16 16 0 0 0 4.8 2.4c.4-.5.7-1.1 1-1.7-1.1-.4-1.7-1-2.2-1.7.1.1.2.1.3.2 2.2 1 4.7 1.6 7.2 1.6s5-.6 7.2-1.6c.1-.1.2-.1.3-.2-.5.7-1.1 1.3-2.2 1.7.3.6.6 1.2 1 1.7a16 16 0 0 0 4.8-2.4C22.2 13.4 21.3 9.4 18 6z",
      key: "dc_body",
    },
  ],
  ["circle", { cx: "8.5", cy: "12", r: "1.5", key: "dc_eye_l" }],
  ["circle", { cx: "15.5", cy: "12", r: "1.5", key: "dc_eye_r" }],
];

const pinterestIconNode: IconNode = [
  ["line", { x1: "12", x2: "9.5", y1: "12", y2: "22", key: "pt_pin" }],
  [
    "path",
    {
      d: "M8 14.5c-.7-1-.9-2.2-.6-3.4.6-2.5 3-4.1 5.6-3.8 2.5.3 4.4 2.5 4.3 5-.1 2.3-1.5 4.2-3.7 4.5-1.4.2-2.7-.4-3.4-1.4",
      key: "pt_curl",
    },
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "pt_circ" }],
];

const spotifyIconNode: IconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "sp_circle" }],
  [
    "path",
    {
      d: "M8 11.5c2.5-.7 5.5-.5 8 .8",
      key: "sp_wave1",
    },
  ],
  [
    "path",
    {
      d: "M8.5 14c2-.5 4.5-.4 6.5.7",
      key: "sp_wave2",
    },
  ],
  [
    "path",
    {
      d: "M9 16.5c1.7-.4 3.7-.3 5.2.5",
      key: "sp_wave3",
    },
  ],
];

const vimeoIconNode: IconNode = [
  [
    "path",
    {
      d: "M2.5 8.5c1.2.4 2.5 2.5 3 4.5 1.5-4 3.5-9 7.5-9 4 0 5 3.5 4.5 7.5-.5 4-3 9-6 9-2.5 0-3.5-3-4-5.5l-1-4.5",
      key: "vm_path",
    },
  ],
];

const threadsIconNode: IconNode = [
  [
    "path",
    {
      d: "M16 12a4 4 0 1 1-6.5-3.1C11.5 7 14 8 15 10c1.5 3 .5 6.5-2 8-3.5 2.1-7.5.5-8.5-3.5-1-4 .5-8.5 4.5-10.5 4-2 9-.5 10 3.5",
      key: "th_path",
    },
  ],
];

const redditIconNode: IconNode = [
  ["circle", { cx: "12", cy: "14", r: "7", key: "rd_head" }],
  ["circle", { cx: "9.5", cy: "13.5", r: "1", key: "rd_eye_l" }],
  ["circle", { cx: "14.5", cy: "13.5", r: "1", key: "rd_eye_r" }],
  ["path", { d: "M10 16.5c1 .5 3 .5 4 0", key: "rd_mouth" }],
  ["path", { d: "M12 7v3m0-3 3-1", key: "rd_ant" }],
  ["circle", { cx: "16.5", cy: "5.5", r: "1", key: "rd_ant_tip" }],
];

const dribbbleIconNode: IconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94", key: "hpej1" }],
  ["path", { d: "M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32", key: "1tr44o" }],
  ["path", { d: "M8.56 2.75c4.37 6 6 9.42 8 17.72", key: "kbh691" }],
];

const gitlabIconNode: IconNode = [
  [
    "path",
    {
      d: "m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z",
      key: "148pdi",
    },
  ],
];

const chromeIconNode: IconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["line", { x1: "21.17", x2: "12", y1: "8", y2: "8", key: "a0cw5f" }],
  ["line", { x1: "3.95", x2: "8.54", y1: "6.06", y2: "14", key: "1kftof" }],
  ["line", { x1: "10.88", x2: "15.46", y1: "21.94", y2: "14", key: "1ymyh8" }],
];

const twitchIconNode: IconNode = [
  ["path", { d: "M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7", key: "c0yzno" }],
];

const figmaIconNode: IconNode = [
  ["path", { d: "M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z", key: "1340ok" }],
  ["path", { d: "M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z", key: "1hz3m3" }],
  ["path", { d: "M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z", key: "1oz8n2" }],
  ["path", { d: "M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z", key: "1ff65i" }],
  ["path", { d: "M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z", key: "pdip6e" }],
];

export const Github = createLucideIcon("Github", githubIconNode);
export const Linkedin = createLucideIcon("Linkedin", linkedinIconNode);
export const Twitter = createLucideIcon("Twitter", twitterIconNode);
export const Slack = createLucideIcon("Slack", slackIconNode);
export const Facebook = createLucideIcon("Facebook", facebookIconNode);
export const Instagram = createLucideIcon("Instagram", instagramIconNode);
export const Youtube = createLucideIcon("Youtube", youtubeIconNode);
export const YouTube = Youtube;
export const Whatsapp = createLucideIcon("Whatsapp", whatsappIconNode);
export const WhatsApp = Whatsapp;
export const Tiktok = createLucideIcon("Tiktok", tiktokIconNode);
export const TikTok = Tiktok;
export const Discord = createLucideIcon("Discord", discordIconNode);
export const Pinterest = createLucideIcon("Pinterest", pinterestIconNode);
export const Spotify = createLucideIcon("Spotify", spotifyIconNode);
export const Vimeo = createLucideIcon("Vimeo", vimeoIconNode);
export const Threads = createLucideIcon("Threads", threadsIconNode);
export const Reddit = createLucideIcon("Reddit", redditIconNode);
export const Dribbble = createLucideIcon("Dribbble", dribbbleIconNode);
export const Gitlab = createLucideIcon("Gitlab", gitlabIconNode);
export const Chrome = createLucideIcon("Chrome", chromeIconNode);
export const Twitch = createLucideIcon("Twitch", twitchIconNode);
export const Figma = createLucideIcon("Figma", figmaIconNode);
