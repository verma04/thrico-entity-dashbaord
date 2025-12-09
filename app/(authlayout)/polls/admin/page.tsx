"use client";
import React from "react";
import Poll from "@/components/polls/polls";
import { By } from "@/components/polls/ts-types";

const page = () => {
  return <Poll by={By.ENTITY} />;
};

export default page;
