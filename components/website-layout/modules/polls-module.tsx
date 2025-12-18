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

        {/* Poll Card Layout */}
        {layout === "poll-card" && polls.length > 0 && (
          <div className="space-y-6">
            {polls.map((poll: any, idx: number) => {
              const totalVotes = poll.totalVotes || poll.options?.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0) || 0;
              
              return (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-blue-900 mb-1">{poll.question || `Poll ${idx + 1}`}</h3>
                      {poll.description && (
                        <p className="text-sm text-blue-700">{poll.description}</p>
                      )}
                    </div>
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {totalVotes} votes
                    </span>
                  </div>
                  <div className="space-y-2">
                    {(poll.options || []).map((option: any, optionIdx: number) => {
                      const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
                      
                      return (
                        <button
                          key={optionIdx}
                          className="w-full p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow transition-all group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-blue-900">{option.text || `Option ${optionIdx + 1}`}</span>
                            <span className="text-sm font-bold text-blue-600">{percentage}%</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {poll.endDate && (
                    <p className="text-xs text-blue-600 text-center mt-4">
                      Ends {new Date(poll.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Live Voting Layout */}
        {layout === "live-voting" && polls.length > 0 && (
          <div className="space-y-6">
            {polls.map((poll: any, idx: number) => {
              const totalVotes = poll.totalVotes || poll.options?.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0) || 0;
              
              return (
                <div key={idx} className="bg-white p-6 rounded-xl border-2 border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs text-red-600 font-bold uppercase">Live</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{poll.question || `Poll ${idx + 1}`}</h3>
                  {poll.description && (
                    <p className="text-sm text-muted-foreground mb-4">{poll.description}</p>
                  )}
                  <div className="grid md:grid-cols-2 gap-3">
                    {(poll.options || []).map((option: any, optionIdx: number) => {
                      const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                      
                      return (
                        <button
                          key={optionIdx}
                          className={`${colors[optionIdx % 4]} text-white p-4 rounded-lg hover:opacity-90 transition-opacity relative overflow-hidden`}
                        >
                          <div className="relative z-10">
                            <p className="font-semibold mb-1">{option.text || `Option ${optionIdx + 1}`}</p>
                            <p className="text-2xl font-bold">{percentage}%</p>
                            <p className="text-xs opacity-90">{option.votes || 0} votes</p>
                          </div>
                          <div 
                            className="absolute inset-0 bg-white opacity-10"
                            style={{ width: `${percentage}%` }}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{totalVotes} total votes</span>
                    {poll.endDate && <span>Ends {new Date(poll.endDate).toLocaleDateString()}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Chart Layout */}
        {layout === "results-chart" && polls.length > 0 && (
          <div className="space-y-8">
            {polls.map((poll: any, idx: number) => {
              const totalVotes = poll.totalVotes || poll.options?.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0) || 0;
              
              return (
                <div key={idx} className="bg-white p-6 rounded-lg border">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{poll.question || `Poll ${idx + 1}`}</h3>
                      {poll.description && (
                        <p className="text-sm text-muted-foreground">{poll.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{totalVotes}</p>
                      <p className="text-xs text-muted-foreground">votes</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {(poll.options || []).map((option: any, optionIdx: number) => {
                      const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
                      
                      return (
                        <div key={optionIdx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{option.text || `Option ${optionIdx + 1}`}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">{option.votes || 0} votes</span>
                              <span className="text-sm font-bold min-w-[3rem] text-right">{percentage}%</span>
                            </div>
                          </div>
                          <div className="relative w-full bg-gray-200 rounded-full h-6">
                            <div 
                              className={`${colors[optionIdx % 5]} h-6 rounded-full transition-all duration-500 flex items-center justify-end px-3`}
                              style={{ width: `${percentage}%` }}
                            >
                              {percentage > 10 && (
                                <span className="text-xs font-bold text-white">{percentage}%</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {poll.endDate && (
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Poll ends {new Date(poll.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Poll Grid Layout */}
        {layout === "poll-grid" && polls.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {polls.map((poll: any, idx: number) => {
              const totalVotes = poll.totalVotes || poll.options?.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0) || 0;
              const topOption = (poll.options || []).reduce((max: any, opt: any) => 
                (opt.votes || 0) > (max.votes || 0) ? opt : max, 
                poll.options?.[0] || {}
              );
              const topPercentage = totalVotes > 0 ? Math.round(((topOption.votes || 0) / totalVotes) * 100) : 0;
              
              return (
                <div key={idx} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-sm mb-3 line-clamp-2">{poll.question || `Poll ${idx + 1}`}</h3>
                  <div className="space-y-2 mb-3">
                    {(poll.options || []).slice(0, 3).map((option: any, optionIdx: number) => {
                      const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
                      
                      return (
                        <div key={optionIdx} className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground min-w-[2rem] text-right">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{totalVotes} votes</span>
                    <span className="font-medium text-blue-600">
                      {topOption.text ? `${topOption.text} leading` : 'Vote now'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Dashboard Layout */}
        {layout === "results-dashboard" && polls.length > 0 && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="text-lg font-bold mb-6">Poll Results Overview</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{polls.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {polls.length === 1 ? 'Poll' : 'Polls'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {polls.reduce((sum: number, poll: any) => sum + (poll.totalVotes || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Votes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {polls.filter((p: any) => p.endDate && new Date(p.endDate) > new Date()).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
            {polls.map((poll: any, idx: number) => {
              const totalVotes = poll.totalVotes || poll.options?.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0) || 0;
              
              return (
                <div key={idx} className="bg-white p-6 rounded-lg border">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold">{poll.question || `Poll Results ${idx + 1}`}</h3>
                    {poll.endDate && (
                      <span className="text-xs text-muted-foreground">
                        Ends {new Date(poll.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {(poll.options || []).map((option: any, optIdx: number) => {
                      const percentage = totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
                      
                      return (
                        <div key={optIdx} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{option.text || `Option ${optIdx + 1}`}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"][optIdx % 4]}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{option.votes || 0} votes</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

    </ModuleContainer>
  );
}
