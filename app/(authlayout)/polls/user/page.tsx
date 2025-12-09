"use client";
import Poll from "@/components/polls/polls";
import { By } from "@/components/polls/ts-types";
import React from "react";

const page = () => {
  return <Poll by={By.USER} />;
};

export default page;
