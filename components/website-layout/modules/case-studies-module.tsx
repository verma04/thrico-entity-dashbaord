"use client";

import Image from "next/image";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface CaseStudiesModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const CaseStudiesModule = ({
  module,
  previewDevice,
}: CaseStudiesModuleProps) => {
  const { content, layout } = module;
  const caseStudies = content.caseStudies || [];

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white border-y"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

      {caseStudies.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-muted-foreground">
            No case studies added yet. Add case studies in the settings panel.
          </p>
        </div>
      )}

      {/* Success Stories Layout */}
      {layout === "success-stories" && caseStudies.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((caseStudy: any, idx: number) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg border overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                <Image
                  src={caseStudy.image}
                  alt={caseStudy.title || "Case Study"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-3">
                  {caseStudy.title || `Case Study ${idx + 1}`}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {caseStudy.description ||
                    "Detailed analysis of implementation and results achieved."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {caseStudy.readTime || "5 min read"}
                  </span>
                  {caseStudy.url ? (
                    <a
                      href={caseStudy.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Read Case Study →
                    </a>
                  ) : (
                    <span className="text-blue-600 text-sm font-medium">
                      Read Case Study →
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Case Layout */}
      {layout === "detailed-case" && caseStudies.length > 0 && (
        <div className="space-y-8">
          {caseStudies.map((caseStudy: any, idx: number) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border"
            >
              <div className="flex items-start gap-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center text-white text-2xl overflow-hidden">
                  {caseStudy.image ? (
                    <img
                      src={caseStudy.image}
                      alt={caseStudy.title || "Case Study"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary">🏆</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">
                    {caseStudy.title || `Success Story ${idx + 1}`}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {caseStudy.description ||
                      "Complete transformation journey with measurable outcomes and strategic insights."}
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {caseStudy.growthPercentage || `${25 + idx * 10}%`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Growth Increase
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {caseStudy.duration || `${6 + idx}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Months Duration
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {caseStudy.revenue || `$${100 + idx * 50}K`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Revenue Impact
                      </div>
                    </div>
                  </div>
                  {caseStudy.url ? (
                    <a
                      href={caseStudy.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Full Case Study
                    </a>
                  ) : (
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      View Full Case Study
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Industry Focus Layout */}
      {layout === "industry-focus" && caseStudies.length > 0 && (
        <div className="space-y-8">
          {["Technology", "Healthcare", "Finance"].map(
            (industry, industryIdx) => (
              <div key={industry} className="bg-white border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 text-blue-600">
                  {industry} Success Stories
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {caseStudies
                    .slice(industryIdx * 2, (industryIdx + 1) * 2)
                    .map((caseStudy: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                          {caseStudy.image ? (
                            <img
                              src={caseStudy.image}
                              alt={caseStudy.title || "Case Study"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">📊</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">
                            {caseStudy.title || `${industry} Case ${idx + 1}`}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {caseStudy.description ||
                              `Transformation in ${industry.toLowerCase()} sector`}
                          </p>
                          {caseStudy.url ? (
                            <a
                              href={caseStudy.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 text-xs font-medium hover:underline"
                            >
                              Read Story →
                            </a>
                          ) : (
                            <span className="text-blue-600 text-xs font-medium">
                              Read Story →
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Impact Metrics Layout */}
      {layout === "impact-metrics" && caseStudies.length > 0 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Our Collective Impact</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-green-100">Cases Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="text-green-100">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">$50M+</div>
                <div className="text-green-100">Value Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100+</div>
                <div className="text-green-100">Industries Served</div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((caseStudy: any, idx: number) => (
              <div
                key={idx}
                className="bg-card rounded-lg border overflow-hidden"
              >
                {/* Image */}
                {caseStudy.image && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={caseStudy.image}
                      alt={caseStudy.title || "Case Study"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-semibold mb-2">
                    {caseStudy.title || `Impact Story ${idx + 1}`}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {caseStudy.results ||
                      caseStudy.solution ||
                      "Real-world results and transformations achieved through our methodologies."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Verified Results
                    </span>
                    {caseStudy.url ? (
                      <a
                        href={caseStudy.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        View Details
                      </a>
                    ) : (
                      <span className="text-primary text-sm font-medium">
                        View Details
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};
