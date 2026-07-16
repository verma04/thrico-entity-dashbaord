import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { ColorPicker } from "../color-picker";
import { IconPicker } from "./icon-picker";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";

interface ContainerSettingsProps {
  selectedModule: any;
  updateModuleContent: (moduleId: string, updates: any) => void;
}

export const ContainerSettings = ({
  selectedModule,
  updateModuleContent,
}: ContainerSettingsProps) => {
  return (
    <div className="space-y-3 pb-2">
      <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
        Container
      </Label>

      {/* Container Width Option */}
      <div className="space-y-1.5">
        <Label className="text-[10px] text-muted-foreground">Width</Label>
        <div className="flex gap-1.5">
          <button
            onClick={() =>
              updateModuleContent(selectedModule.id, {
                containerSettings: {
                  ...selectedModule.content.containerSettings,
                  fullWidth: false,
                },
              })
            }
            className={`flex-1 h-7 px-2 rounded border text-[10px] transition-colors ${
              !selectedModule.content.containerSettings?.fullWidth
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            Fixed
          </button>
          <button
            onClick={() =>
              updateModuleContent(selectedModule.id, {
                containerSettings: {
                  ...selectedModule.content.containerSettings,
                  fullWidth: true,
                },
              })
            }
            className={`flex-1 h-7 px-2 rounded border text-[10px] transition-colors ${
              selectedModule.content.containerSettings?.fullWidth
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            Full
          </button>
        </div>
      </div>

      {/* Text Color */}
      <div>
        <ColorPicker
          label="Text Color"
          value={selectedModule.content.containerSettings?.textColor || ""}
          onChange={(color) =>
            updateModuleContent(selectedModule.id, {
              containerSettings: {
                ...selectedModule.content.containerSettings,
                textColor: color,
              },
            })
          }
          compact
        />
      </div>

      {/* Background Selection */}
      <div className="space-y-2">
        <Label className="text-[10px] text-muted-foreground">Background</Label>

        {/* Mode Selector */}
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              const currentBg =
                selectedModule.content.containerSettings?.background ||
                "#ffffff";
              if (currentBg.includes("linear-gradient")) {
                updateModuleContent(selectedModule.id, {
                  containerSettings: {
                    ...selectedModule.content.containerSettings,
                    background: "#ffffff",
                  },
                });
              }
            }}
            className={`flex-1 h-7 rounded border text-[10px] transition-colors ${
              !(
                selectedModule.content.containerSettings?.background || ""
              ).includes("linear-gradient")
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            Solid
          </button>
          <button
            onClick={() => {
              const currentBg =
                selectedModule.content.containerSettings?.background ||
                "#ffffff";
              if (!currentBg.includes("linear-gradient")) {
                updateModuleContent(selectedModule.id, {
                  containerSettings: {
                    ...selectedModule.content.containerSettings,
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  },
                });
              }
            }}
            className={`flex-1 h-7 rounded border text-[10px] transition-colors ${
              (
                selectedModule.content.containerSettings?.background || ""
              ).includes("linear-gradient")
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-background hover:bg-muted text-muted-foreground"
            }`}
          >
            Gradient
          </button>
        </div>

        {/* Gradient Mode Toggle (2 or 3 colors) */}
        {(selectedModule.content.containerSettings?.background || "").includes(
          "linear-gradient"
        ) && (
          <div className="flex items-center gap-2 bg-muted/20 p-1.5 rounded-md border border-dashed">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold flex-1">
              Gradient Stops
            </Label>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  const bg =
                    selectedModule.content.containerSettings?.background || "";
                  const colors = bg.match(/#[a-fA-F0-0]{3,6}/g) || [
                    "#6366f1",
                    "#a855f7",
                  ];
                  const angle = bg.match(/\d+deg/)?.[0] || "135deg";
                  updateModuleContent(selectedModule.id, {
                    containerSettings: {
                      ...selectedModule.content.containerSettings,
                      background: `linear-gradient(${angle}, ${colors[0]}, ${
                        colors[2] || colors[1] || colors[0]
                      })`,
                    },
                  });
                }}
                className={`px-2 py-0.5 rounded text-[10px] transition ${
                  (
                    selectedModule.content.containerSettings?.background?.match(
                      /#[a-fA-F0-0]{3,6}/g
                    ) || []
                  ).length <= 2
                    ? "bg-primary text-white"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                2 Colors
              </button>
              <button
                onClick={() => {
                  const bg =
                    selectedModule.content.containerSettings?.background || "";
                  const colors = bg.match(/#[a-fA-F0-0]{3,6}/g) || [
                    "#6366f1",
                    "#a855f7",
                  ];
                  const angle = bg.match(/\d+deg/)?.[0] || "135deg";
                  const midColor = "#f472b6"; // Default pink-400 as middle color
                  updateModuleContent(selectedModule.id, {
                    containerSettings: {
                      ...selectedModule.content.containerSettings,
                      background: `linear-gradient(${angle}, ${
                        colors[0]
                      }, ${midColor}, ${colors[1] || colors[0]})`,
                    },
                  });
                }}
                className={`px-2 py-0.5 rounded text-[10px] transition ${
                  (
                    selectedModule.content.containerSettings?.background?.match(
                      /#[a-fA-F0-0]{3,6}/g
                    ) || []
                  ).length >= 3
                    ? "bg-primary text-white"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                3 Colors
              </button>
            </div>
          </div>
        )}

        {!(selectedModule.content.containerSettings?.background || "").includes(
          "linear-gradient"
        ) ? (
          /* Solid Color UI */
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="color"
                value={
                  selectedModule.content.containerSettings?.background?.startsWith(
                    "#"
                  )
                    ? selectedModule.content.containerSettings.background
                    : "#ffffff"
                }
                onChange={(e) =>
                  updateModuleContent(selectedModule.id, {
                    containerSettings: {
                      ...selectedModule.content.containerSettings,
                      background: e.target.value,
                    },
                  })
                }
                className="h-8 w-10 rounded border border-input cursor-pointer p-0"
              />
              <Input
                type="text"
                value={
                  selectedModule.content.containerSettings?.background || ""
                }
                onChange={(e) =>
                  updateModuleContent(selectedModule.id, {
                    containerSettings: {
                      ...selectedModule.content.containerSettings,
                      background: e.target.value,
                    },
                  })
                }
                placeholder="#fff or bg-muted/50"
                className="h-8 flex-1 text-xs text-center"
              />
            </div>
          </div>
        ) : (
          /* Gradient UI */
          <div className="space-y-4 p-3 bg-muted/30 rounded-lg border border-dashed">
            <div
              className={`grid ${
                (
                  selectedModule.content.containerSettings?.background?.match(
                    /#[a-fA-F0-0]{3,6}/g
                  ) || []
                ).length >= 3
                  ? "grid-cols-3"
                  : "grid-cols-2"
              } gap-2`}
            >
              {/* Start Color */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase font-bold">
                  Start
                </Label>
                <div className="flex flex-col gap-1.5">
                  <input
                    type="color"
                    value={(() => {
                      const match = (
                        selectedModule.content.containerSettings?.background ||
                        ""
                      ).match(/#[a-fA-F0-0]{3,6}/g);
                      return match?.[0] || "#6366f1";
                    })()}
                    onChange={(e) => {
                      const bg =
                        selectedModule.content.containerSettings?.background ||
                        "";
                      const colors = bg.match(/#[a-fA-F0-0]{3,6}/g) || [
                        "#6366f1",
                        "#a855f7",
                      ];
                      const angle = bg.match(/\d+deg/)?.[0] || "135deg";
                      const rest = colors.slice(1).join(", ");
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          background: `linear-gradient(${angle}, ${e.target.value}, ${rest})`,
                        },
                      });
                    }}
                    className="h-8 w-full rounded border border-input cursor-pointer"
                  />
                  <Input
                    className="h-7 text-[10px] px-1 text-center font-mono"
                    value={(() => {
                      const match = (
                        selectedModule.content.containerSettings?.background ||
                        ""
                      ).match(/#[a-fA-F0-0]{3,6}/g);
                      return match?.[0] || "#6366f1";
                    })()}
                    onChange={(e) => {
                      const bg =
                        selectedModule.content.containerSettings?.background ||
                        "";
                      const colors = bg.match(/#[a-fA-F0-0]{3,6}/g) || [
                        "#6366f1",
                        "#a855f7",
                      ];
                      const angle = bg.match(/\d+deg/)?.[0] || "135deg";
                      const rest = colors.slice(1).join(", ");
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          background: `linear-gradient(${angle}, ${e.target.value}, ${rest})`,
                        },
                      });
                    }}
                  />
                </div>
              </div>

              {/* Middle Color (Conditional) */}
              {(
                selectedModule.content.containerSettings?.background?.match(
                  /#[a-fA-F0-0]{3,6}/g
                ) || []
              ).length >= 3 && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground uppercase font-bold">
                    Middle
                  </Label>
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="color"
                      value={(() => {
                        const match = (
                          selectedModule.content.containerSettings
                            ?.background || ""
                        ).match(/#[a-fA-F0-0]{3,6}/g);
                        return match?.[1] || "#f472b6";
                      })()}
                      onChange={(e) => {
                        const bg =
                          selectedModule.content.containerSettings
                            ?.background || "";
                        const colors = bg.match(/#[a-fA-F0-0]{3,6}/g) || [
                          "#6366f1",
                          "#f472b6",
                          "#a855f7",
                        ];
                        const angle = bg.match(/\d+deg/)?.[0] || "135deg";
                        updateModuleContent(selectedModule.id, {
                          containerSettings: {
                            ...selectedModule.content.containerSettings,
                            background: `linear-gradient(${angle}, ${colors[0]}, ${e.target.value}, ${colors[2]})`,
                          },
                        });
                      }}
                      className="h-8 w-full rounded border border-input cursor-pointer"
                    />
                    <Input
                      className="h-7 text-[10px] px-1 text-center font-mono"
                      value={(() => {
                        const match = (
                          selectedModule.content.containerSettings
                            ?.background || ""
                        ).match(/#[a-fA-F0-0]{3,6}/g);
                        return match?.[1] || "#f472b6";
                      })()}
                      onChange={(e) => {
                        const bg =
                          selectedModule.content.containerSettings
                            ?.background || "";
                        const colors = bg.match(/#[a-fA-F0-0]{3,6}/g) || [
                          "#6366f1",
                          "#f472b6",
                          "#a855f7",
                        ];
                        const angle = bg.match(/\d+deg/)?.[0] || "135deg";
                        updateModuleContent(selectedModule.id, {
                          containerSettings: {
                            ...selectedModule.content.containerSettings,
                            background: `linear-gradient(${angle}, ${colors[0]}, ${e.target.value}, ${colors[2]})`,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {/* End Color */}
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground uppercase font-bold">
                  End
                </Label>
                <div className="flex flex-col gap-1.5">
                  <input
                    type="color"
                    value={(() => {
                      const match = (
                        selectedModule.content.containerSettings?.background ||
                        ""
                      ).match(/#[a-fA-F0-0]{3,6}/g);
                      return match?.[match.length - 1] || "#a855f7";
                    })()}
                    onChange={(e) => {
                      const bg =
                        selectedModule.content.containerSettings?.background ||
                        "";
                      const colors = bg.match(/#[a-fA-F0-0]{3,6}/g) || [
                        "#6366f1",
                        "#a855f7",
                      ];
                      const angle = bg.match(/\d+deg/)?.[0] || "135deg";
                      const others = colors
                        .slice(0, colors.length - 1)
                        .join(", ");
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          background: `linear-gradient(${angle}, ${others}, ${e.target.value})`,
                        },
                      });
                    }}
                    className="h-8 w-full rounded border border-input cursor-pointer"
                  />
                  <Input
                    className="h-7 text-[10px] px-1 text-center font-mono"
                    value={(() => {
                      const match = (
                        selectedModule.content.containerSettings?.background ||
                        ""
                      ).match(/#[a-fA-F0-0]{3,6}/g);
                      return match?.[match.length - 1] || "#a855f7";
                    })()}
                    onChange={(e) => {
                      const bg =
                        selectedModule.content.containerSettings?.background ||
                        "";
                      const colors = bg.match(/#[a-fA-F0-0]{3,6}/g) || [
                        "#6366f1",
                        "#a855f7",
                      ];
                      const angle = bg.match(/\d+deg/)?.[0] || "135deg";
                      const others = colors
                        .slice(0, colors.length - 1)
                        .join(", ");
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          background: `linear-gradient(${angle}, ${others}, ${e.target.value})`,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Angle Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] text-muted-foreground uppercase font-bold">
                  Angle
                </Label>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {(() => {
                    const match = (
                      selectedModule.content.containerSettings?.background || ""
                    ).match(/(\d+)deg/);
                    return match?.[1] || "135";
                  })()}
                  °
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={(() => {
                  const match = (
                    selectedModule.content.containerSettings?.background || ""
                  ).match(/(\d+)deg/);
                  return parseInt(match?.[1] || "135");
                })()}
                onChange={(e) => {
                  const bg =
                    selectedModule.content.containerSettings?.background || "";
                  const colors = bg.match(/#[a-fA-F0-0]{3,6}/g) || [
                    "#6366f1",
                    "#a855f7",
                  ];
                  updateModuleContent(selectedModule.id, {
                    containerSettings: {
                      ...selectedModule.content.containerSettings,
                      background: `linear-gradient(${e.target.value}deg, ${
                        colors[0]
                      }, ${colors[1] || colors[0]})`,
                    },
                  });
                }}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer slider-sm"
              />
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">
                Presets
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-medium">
                    2 Colors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "linear-gradient(135deg, #6366f1, #a855f7)",
                      "linear-gradient(135deg, #3b82f6, #2dd4bf)",
                      "linear-gradient(135deg, #f59e0b, #ef4444)",
                      "linear-gradient(135deg, #10b981, #3b82f6)",
                      "linear-gradient(135deg, #f43f5e, #fb923c)",
                      "linear-gradient(135deg, #22c55e, #10b981)",
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          updateModuleContent(selectedModule.id, {
                            containerSettings: {
                              ...selectedModule.content.containerSettings,
                              background: preset,
                            },
                          })
                        }
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        style={{ background: preset }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-muted-foreground font-medium">
                    3 Colors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "linear-gradient(135deg, #ee9ae5, #5961f9, #7028e4)",
                      "linear-gradient(135deg, #fdc830, #f37335, #e91e63)",
                      "linear-gradient(135deg, #4facfe, #00f2fe, #22c55e)",
                      "linear-gradient(135deg, #fa709a, #fee140, #ff9a9e)",
                      "linear-gradient(135deg, #a18cd1, #fbc2eb, #8fd3f4)",
                      "linear-gradient(135deg, #30cfd0, #330867, #130f40)",
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          updateModuleContent(selectedModule.id, {
                            containerSettings: {
                              ...selectedModule.content.containerSettings,
                              background: preset,
                            },
                          })
                        }
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        style={{ background: preset }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <p className="text-[10px] text-muted-foreground">
          Choose between solid colors or CSS gradients for the module background
        </p>
      </div>

      {/* Background Image Upload */}
      <ImageUploadWithCrop
        currentImage={selectedModule.content.containerSettings?.backgroundImage}
        onImageUpdate={(imageUrl) =>
          updateModuleContent(selectedModule.id, {
            containerSettings: {
              ...selectedModule.content.containerSettings,
              backgroundImage: imageUrl,
            },
          })
        }
        label="Background Image"
        recommendedWidth={1920}
        recommendedHeight={1080}
        aspectRatio={16 / 9}
        maxFileSize={10}
        showDimensions={true}
        className=""
      />

      {/* Opacity */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-muted-foreground">Opacity</Label>
          <span className="text-[10px] text-muted-foreground/80">
            {selectedModule.content.containerSettings?.opacity ?? 100}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={selectedModule.content.containerSettings?.opacity ?? 100}
          onChange={(e) =>
            updateModuleContent(selectedModule.id, {
              containerSettings: {
                ...selectedModule.content.containerSettings,
                opacity: parseInt(e.target.value),
              },
            })
          }
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer slider-sm"
        />
      </div>

      {/* CTA Button Settings */}
      <div className="space-y-2 pt-2 border-t border-border/40">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] text-muted-foreground uppercase font-bold">
            CTA Button
          </Label>
          <button
            onClick={() =>
              updateModuleContent(selectedModule.id, {
                containerSettings: {
                  ...selectedModule.content.containerSettings,
                  button: {
                    ...selectedModule.content.containerSettings?.button,
                    enabled:
                      !selectedModule.content.containerSettings?.button
                        ?.enabled,
                    text:
                      selectedModule.content.containerSettings?.button?.text ||
                      "View All",
                    style:
                      selectedModule.content.containerSettings?.button?.style ||
                      "primary",
                    position:
                      selectedModule.content.containerSettings?.button
                        ?.position || "right",
                  },
                },
              })
            }
            className={`h-4 w-7 rounded-full transition-colors flex items-center px-0.5 ${
              selectedModule.content.containerSettings?.button?.enabled
                ? "bg-primary"
                : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`block h-3 w-3 rounded-full bg-card shadow-sm transform transition-transform ${
                selectedModule.content.containerSettings?.button?.enabled
                  ? "translate-x-3"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {selectedModule.content.containerSettings?.button?.enabled && (
          <div className="space-y-2.5 pl-2 border-l border-primary/30">
            {/* Button Text Selector */}
            <div className="space-y-1.5">
              <Label className="text-[10px] text-muted-foreground">Button Text</Label>
              <select
                value={
                  [
                    "View All",
                    "Explore More",
                    "Learn More",
                    "See More",
                  ].includes(
                    selectedModule.content.containerSettings?.button?.text || ""
                  )
                    ? selectedModule.content.containerSettings?.button?.text
                    : "Custom"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  updateModuleContent(selectedModule.id, {
                    containerSettings: {
                      ...selectedModule.content.containerSettings,
                      button: {
                        ...selectedModule.content.containerSettings?.button,
                        enabled: true,
                        text: value === "Custom" ? "" : value,
                        style:
                          selectedModule.content.containerSettings?.button
                            ?.style || "primary",
                        position:
                          selectedModule.content.containerSettings?.button
                            ?.position || "right",
                      },
                    },
                  });
                }}
                className="w-full h-8 px-2 rounded border border-input bg-background text-xs"
              >
                <option value="View All">View All</option>
                <option value="Explore More">Explore More</option>
                <option value="Learn More">Learn More</option>
                <option value="See More">See More</option>
                <option value="Custom">Custom Text</option>
              </select>
            </div>

            {/* Custom Text Input */}
            {!["View All", "Explore More", "Learn More", "See More"].includes(
              selectedModule.content.containerSettings?.button?.text || ""
            ) && (
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground">
                  Custom Text
                </Label>
                <Input
                  type="text"
                  value={
                    selectedModule.content.containerSettings?.button?.text || ""
                  }
                  onChange={(e) =>
                    updateModuleContent(selectedModule.id, {
                      containerSettings: {
                        ...selectedModule.content.containerSettings,
                        button: {
                          ...selectedModule.content.containerSettings?.button,
                          enabled: true,
                          text: e.target.value,
                          style:
                            selectedModule.content.containerSettings?.button
                              ?.style || "primary",
                          position:
                            selectedModule.content.containerSettings?.button
                              ?.position || "right",
                        },
                      },
                    })
                  }
                  placeholder="Enter button text"
                  className="h-8 text-xs"
                />
              </div>
            )}

            {/* Button Icon (Optional) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-muted-foreground">
                  Button Icon
                </Label>
                {selectedModule.content.containerSettings?.button?.icon && (
                  <button
                    onClick={() =>
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          button: {
                            ...selectedModule.content.containerSettings?.button,
                            icon: undefined,
                            iconPosition: undefined,
                          },
                        },
                      })
                    }
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              <IconPicker
                value={
                  selectedModule.content.containerSettings?.button?.icon || ""
                }
                onChange={(icon) =>
                  updateModuleContent(selectedModule.id, {
                    containerSettings: {
                      ...selectedModule.content.containerSettings,
                      button: {
                        ...selectedModule.content.containerSettings?.button,
                        enabled: true,
                        icon: icon,
                        iconPosition:
                          selectedModule.content.containerSettings?.button
                            ?.iconPosition || "left",
                        text:
                          selectedModule.content.containerSettings?.button
                            ?.text || "View All",
                        style:
                          selectedModule.content.containerSettings?.button
                            ?.style || "primary",
                        position:
                          selectedModule.content.containerSettings?.button
                            ?.position || "right",
                      },
                    },
                  })
                }
              />
            </div>

            {/* Icon Position (only show if icon is selected) */}
            {selectedModule.content.containerSettings?.button?.icon && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Icon Position</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          button: {
                            ...selectedModule.content.containerSettings?.button,
                            iconPosition: "left",
                          },
                        },
                      })
                    }
                    className={`h-9 px-3 rounded-md border text-xs flex items-center justify-center gap-2 transition ${
                      selectedModule.content.containerSettings?.button
                        ?.iconPosition === "left" ||
                      !selectedModule.content.containerSettings?.button
                        ?.iconPosition
                        ? "border-primary bg-primary text-white"
                        : "border-input bg-background hover:bg-muted"
                    }`}
                  >
                    ← Left
                  </button>
                  <button
                    onClick={() =>
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          button: {
                            ...selectedModule.content.containerSettings?.button,
                            iconPosition: "right",
                          },
                        },
                      })
                    }
                    className={`h-9 px-3 rounded-md border text-xs flex items-center justify-center gap-2 transition ${
                      selectedModule.content.containerSettings?.button
                        ?.iconPosition === "right"
                        ? "border-primary bg-primary text-white"
                        : "border-input bg-background hover:bg-muted"
                    }`}
                  >
                    Right →
                  </button>
                </div>
              </div>
            )}

            {/* Button Link Type */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Link Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    updateModuleContent(selectedModule.id, {
                      containerSettings: {
                        ...selectedModule.content.containerSettings,
                        button: {
                          ...selectedModule.content.containerSettings?.button,
                          enabled: true,
                          linkType: "internal",
                          link: "/",
                          target: "_self",
                          text:
                            selectedModule.content.containerSettings?.button
                              ?.text || "View All",
                          style:
                            selectedModule.content.containerSettings?.button
                              ?.style || "primary",
                          position:
                            selectedModule.content.containerSettings?.button
                              ?.position || "right",
                        },
                      },
                    })
                  }
                  className={`h-9 px-3 rounded-md border text-xs flex items-center justify-center gap-2 transition ${
                    selectedModule.content.containerSettings?.button
                      ?.linkType === "internal" ||
                    (!selectedModule.content.containerSettings?.button
                      ?.linkType &&
                      selectedModule.content.containerSettings?.button?.link?.startsWith(
                        "/"
                      ))
                      ? "border-primary bg-primary text-white"
                      : "border-input bg-background hover:bg-muted"
                  }`}
                >
                  <span>📄</span> Internal Page
                </button>
                <button
                  onClick={() =>
                    updateModuleContent(selectedModule.id, {
                      containerSettings: {
                        ...selectedModule.content.containerSettings,
                        button: {
                          ...selectedModule.content.containerSettings?.button,
                          enabled: true,
                          linkType: "external",
                          link: "https://",
                          target: "_blank",
                          text:
                            selectedModule.content.containerSettings?.button
                              ?.text || "View All",
                          style:
                            selectedModule.content.containerSettings?.button
                              ?.style || "primary",
                          position:
                            selectedModule.content.containerSettings?.button
                              ?.position || "right",
                        },
                      },
                    })
                  }
                  className={`h-9 px-3 rounded-md border text-xs flex items-center justify-center gap-2 transition ${
                    selectedModule.content.containerSettings?.button
                      ?.linkType === "external"
                      ? "border-primary bg-primary text-white"
                      : "border-input bg-background hover:bg-muted"
                  }`}
                >
                  <span>🔗</span> External URL
                </button>
              </div>
            </div>

            {/* Button Link - Internal Page Selector */}
            {(selectedModule.content.containerSettings?.button?.linkType ===
              "internal" ||
              (!selectedModule.content.containerSettings?.button?.linkType &&
                selectedModule.content.containerSettings?.button?.link?.startsWith(
                  "/"
                ))) && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Select Page</Label>
                <select
                  value={
                    selectedModule.content.containerSettings?.button?.link ||
                    "/"
                  }
                  onChange={(e) =>
                    updateModuleContent(selectedModule.id, {
                      containerSettings: {
                        ...selectedModule.content.containerSettings,
                        button: {
                          ...selectedModule.content.containerSettings?.button,
                          enabled: true,
                          link: e.target.value,
                          linkType: "internal",
                          target: "_self",
                          text:
                            selectedModule.content.containerSettings?.button
                              ?.text || "View All",
                          style:
                            selectedModule.content.containerSettings?.button
                              ?.style || "primary",
                          position:
                            selectedModule.content.containerSettings?.button
                              ?.position || "right",
                        },
                      },
                    })
                  }
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="/">Home</option>
                  {useWebsiteBuilderStore
                    .getState()
                    .pages.filter((p) => p.isEnabled)
                    .map((page) => (
                      <option key={page.id} value={`/${page.slug}`}>
                        {page.name} (/{page.slug})
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Button Link - External URL Input */}
            {selectedModule.content.containerSettings?.button?.linkType ===
              "external" && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">External URL</Label>
                <Input
                  type="text"
                  value={
                    selectedModule.content.containerSettings?.button?.link || ""
                  }
                  onChange={(e) =>
                    updateModuleContent(selectedModule.id, {
                      containerSettings: {
                        ...selectedModule.content.containerSettings,
                        button: {
                          ...selectedModule.content.containerSettings?.button,
                          enabled: true,
                          link: e.target.value,
                          linkType: "external",
                          text:
                            selectedModule.content.containerSettings?.button
                              ?.text || "View All",
                          style:
                            selectedModule.content.containerSettings?.button
                              ?.style || "primary",
                          position:
                            selectedModule.content.containerSettings?.button
                              ?.position || "right",
                        },
                      },
                    })
                  }
                  placeholder="https://example.com"
                  className="h-9"
                />
              </div>
            )}

            {/* Button Style */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Button Style</Label>
              <div className="grid grid-cols-2 gap-2">
                {["primary", "secondary", "outline", "ghost"].map((style) => (
                  <button
                    key={style}
                    onClick={() =>
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          button: {
                            ...selectedModule.content.containerSettings?.button,
                            enabled: true,
                            style: style as any,
                            text:
                              selectedModule.content.containerSettings?.button
                                ?.text || "View All",
                            position:
                              selectedModule.content.containerSettings?.button
                                ?.position || "right",
                          },
                        },
                      })
                    }
                    className={`h-9 px-3 rounded-md border text-xs capitalize transition ${
                      selectedModule.content.containerSettings?.button
                        ?.style === style
                        ? "border-primary bg-primary text-white"
                        : "border-input bg-background hover:bg-muted"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Button Position */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Button Position</Label>
              <div className="grid grid-cols-3 gap-2">
                {["left", "center", "right"].map((position) => (
                  <button
                    key={position}
                    onClick={() =>
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          button: {
                            ...selectedModule.content.containerSettings?.button,
                            enabled: true,
                            position: position as any,
                            text:
                              selectedModule.content.containerSettings?.button
                                ?.text || "View All",
                            style:
                              selectedModule.content.containerSettings?.button
                                ?.style || "primary",
                          },
                        },
                      })
                    }
                    className={`h-9 px-3 rounded-md border text-xs capitalize transition ${
                      selectedModule.content.containerSettings?.button
                        ?.position === position
                        ? "border-primary bg-primary text-white"
                        : "border-input bg-background hover:bg-muted"
                    }`}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
