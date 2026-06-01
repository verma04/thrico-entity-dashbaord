"use client";
import Poll from "@/components/polls/polls";
import { By } from "@/components/polls/ts-types";
import React from "react";

const PollsUserPage = () => {
  return <Poll by={By.USER} />;
};

export default PollsUserPage;
