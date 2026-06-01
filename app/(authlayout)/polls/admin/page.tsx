"use client";
import React from "react";
import Poll from "@/components/polls/polls";
import { By } from "@/components/polls/ts-types";

const PollsAdminPage = () => {
  return <Poll by={By.ENTITY} />;
};

export default PollsAdminPage;
