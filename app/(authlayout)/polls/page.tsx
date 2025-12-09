import Poll from "@/components/polls/polls";
import { By } from "@/components/polls/ts-types";
import React from "react";

const page = () => {
  return <Poll by={By.ALL} />;
};

export default page;
