import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface PollsModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function PollsModule({ module, previewDevice }: PollsModuleProps) {
  const { layout, content } = module;
  const polls = content.polls || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-slate-50 border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

        {polls.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-muted-foreground">
              No polls added yet. Add polls in the settings panel.
            </p>
          </div>
        )}

        {/* Interactive Polls Layout */}
        {layout === "interactive-polls" && polls.length > 0 && (
          <div className="space-y-6">
            {polls.map((poll: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold mb-4">{poll.question || `Poll Question ${idx + 1}?`}</h3>
                <div className="space-y-3">
                  {(poll.options || []).map((option: any, optionIdx: number) => (
                    <div
                      key={optionIdx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                      <span className="text-sm">{option.text || `Option ${optionIdx + 1}`}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {option.percentage || 0}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  {poll.votes || 120} votes{poll.endsIn && ` • Poll ends in ${poll.endsIn}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Vote Layout */}
        {layout === "quick-vote" && polls.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {polls.map((poll: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-lg border">
                <div className="text-center mb-4">
                  <h3 className="font-semibold mb-2">{poll.question || `Quick Poll ${idx + 1}`}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {poll.description || "What do you think about this topic?"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors">
                    👍 Yes ({poll.yesPercentage || 65}%)
                  </button>
                  <button className="flex-1 py-2 px-4 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors">
                    👎 No ({poll.noPercentage || 35}%)
                  </button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {poll.votes || 85} votes total
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Results Dashboard Layout */}
        {layout === "results-dashboard" && polls.length > 0 && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-lg font-bold mb-6">Poll Results Overview</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-muted-foreground">
                    Active Polls
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">2.4k</div>
                  <div className="text-sm text-muted-foreground">
                    Total Votes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">89%</div>
                  <div className="text-sm text-muted-foreground">
                    Participation
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
            {polls.map((poll: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-lg border">
                <h3 className="font-semibold mb-4">{poll.question || `Poll Results ${idx + 1}`}</h3>
                <div className="space-y-3">
                  {(poll.options || []).map((option: any, optIdx: number) => (
                    <div key={optIdx} className="flex items-center gap-4">
                      <span className="text-sm w-20">{option.text || `Option ${optIdx + 1}`}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${["bg-blue-500", "bg-green-500", "bg-purple-500"][optIdx % 3]}`}
                          style={{ width: `${option.percentage || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">
                        {option.percentage || 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* Trending Topics Layout */}
        {layout === "trending-topics" && polls.length > 0 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-white">
              <h3 className="text-xl font-bold mb-2">🔥 Trending Poll</h3>
              <p className="text-blue-100 mb-4">
                The most popular discussion topic this week
              </p>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">
                  Should we implement new community guidelines?
                </h4>
                <div className="space-y-2">
                  {["Strongly Agree", "Agree", "Neutral", "Disagree"].map(
                    (option, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{option}</span>
                        <span className="font-medium">
                          {[45, 30, 15, 10][idx]}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Community Events",
                "Feature Requests",
                "Policy Changes",
                "General Feedback",
              ].map((topic, idx) => (
                <div key={topic} className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2">{topic}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Quick poll about upcoming {topic.toLowerCase()}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1 px-2 bg-blue-100 text-blue-700 rounded text-xs">
                      Vote
                    </button>
                    <span className="text-xs text-muted-foreground self-center">
                      {50 + idx * 15} votes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </ModuleContainer>
  );
}
