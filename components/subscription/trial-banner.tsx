"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Check, Sparkles, Clock } from "lucide-react";
import moment from "moment";
import { useCheckEntitySubscription } from "@/graphql/actions";
import Link from "next/link";

export default function TrialBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const items = [
    "Unlimited team members",
    "All features unlocked",
    "Priority support",
  ];

  const { data } = useCheckEntitySubscription();
  const subscription = data?.checkEntitySubscription;

  const daysLeft =
    subscription?.endDate && !isNaN(new Date(subscription?.endDate).getTime())
      ? Math.max(
          0,
          Math.ceil(
            (new Date(subscription?.endDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : "N/A";

  if (subscription?.subscriptionType !== "trial") return null;

  return (
    <div className="fixed bottom-5 right-5 w-full max-w-sm z-[20]">
      <Card
        className={`overflow-hidden bg-white border border-gray-200 shadow-xl transition-all duration-300 ${
          isExpanded ? "shadow-gray-300/50" : "shadow-gray-200/50"
        }`}
      >
        <div
          className="relative bg-gradient-to-r from-sky-50 via-indigo-50 to-violet-50 border-b border-gray-100 p-4 cursor-pointer group"
          onClick={toggleExpand}
        >
          {/* Decorative hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-100/50 to-violet-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-indigo-600/80 text-xs font-medium uppercase tracking-wide">
                  Trial Period
                </p>
                <p className="text-gray-900 text-md font-semibold">
                  {daysLeft} days remaining
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200">
              {isExpanded ? (
                <ChevronDown className="text-gray-600 w-5 h-5" />
              ) : (
                <ChevronUp className="text-gray-600 w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <div
          className={`bg-white overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-5">
            {/* End Date Notice */}
            <div className="flex items-center gap-2 mb-5 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                Trial ends on{" "}
                <span className="font-semibold">
                  {moment(subscription?.endDate).format("MMMM DD, YYYY")}
                </span>
              </p>
            </div>

            {/* Features List */}
            <p className="text-gray-900 font-medium mb-3">
              Upgrade and unlock:
            </p>
            <ul className="space-y-2.5 mb-5">
              {items.map((content, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-gray-600 text-sm">{content}</span>
                </li>
              ))}
            </ul>

            <Link href={"/settings/subscription"}>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-5 rounded-lg shadow-md shadow-indigo-200 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-300">
                Choose Your Plan
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
