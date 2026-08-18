"use client";

import React from "react";
import FeedManage, { FeedManageProps } from "./feed-manage";

export default function AdminFeed(props: FeedManageProps) {
  return <FeedManage feedType="all" {...props} />;
}
