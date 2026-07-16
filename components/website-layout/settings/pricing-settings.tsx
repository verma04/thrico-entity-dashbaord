import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2, Plus } from "lucide-react";

interface PricingSettingsProps {
  content: {
    plans?: Array<{
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      popular: boolean;
      buttonText: string;
      buttonLink?: string;
    }>;
    title?: string;
    description?: string;
  };
  onChange: (updates: any) => void;
}

const PricingSettings: React.FC<PricingSettingsProps> = ({
  content,
  onChange,
}) => {
  const [openPopover, setOpenPopover] = useState<number | null>(null);

  const {
    plans = [
      {
        name: "Starter",
        price: "$9",
        period: "month",
        description: "Perfect for small projects",
        features: ["5 Projects", "10GB Storage", "Email Support"],
        popular: false,
        buttonText: "Get Started",
        buttonLink: "",
      },
      {
        name: "Professional",
        price: "$29",
        period: "month",
        description: "Best for growing teams",
        features: [
          "Unlimited Projects",
          "100GB Storage",
          "Priority Support",
          "Advanced Analytics",
        ],
        popular: true,
        buttonText: "Choose Professional",
        buttonLink: "",
      },
      {
        name: "Enterprise",
        price: "$99",
        period: "month",
        description: "For large organizations",
        features: [
          "Unlimited Everything",
          "Custom Integrations",
          "24/7 Support",
          "SLA Guarantee",
        ],
        popular: false,
        buttonText: "Contact Sales",
        buttonLink: "",
      },
    ],
    title = "Choose Your Plan",
    description = "Select the perfect plan for your needs",
  } = content;

  const addPlan = () => {
    const newPlans = [
      ...plans,
      {
        name: "New Plan",
        price: "$19",
        period: "month",
        description: "Plan description",
        features: ["Feature 1", "Feature 2"],
        popular: false,
        buttonText: "Get Started",
        buttonLink: "",
      },
    ];
    onChange({ plans: newPlans });
  };

  const updatePlan = (index: number, updates: Partial<(typeof plans)[0]>) => {
    const newPlans = plans.map((plan, i) =>
      i === index ? { ...plan, ...updates } : plan
    );
    onChange({ plans: newPlans });
  };

  const removePlan = (index: number) => {
    const newPlans = plans.filter((_, i) => i !== index);
    onChange({ plans: newPlans });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newPlans = Array.from(plans);
    const [reorderedPlan] = newPlans.splice(result.source.index, 1);
    newPlans.splice(result.destination.index, 0, reorderedPlan);

    onChange({ plans: newPlans });
  };

  const updateFeature = (
    planIndex: number,
    featureIndex: number,
    value: string
  ) => {
    const newPlans = [...plans];
    const newFeatures = [...newPlans[planIndex].features];
    newFeatures[featureIndex] = value;
    newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures };
    onChange({ plans: newPlans });
  };

  const addFeature = (planIndex: number) => {
    const newPlans = [...plans];
    newPlans[planIndex] = {
      ...newPlans[planIndex],
      features: [...newPlans[planIndex].features, "New Feature"],
    };
    onChange({ plans: newPlans });
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...plans];
    const newFeatures = newPlans[planIndex].features.filter(
      (_, i) => i !== featureIndex
    );
    newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures };
    onChange({ plans: newPlans });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Pricing Plans</Label>
          <Button
            onClick={addPlan}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Plan
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="pricing-plans">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {plans.map((plan, index) => (
                  <Draggable
                    key={`plan-${index}`}
                    draggableId={`plan-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 border rounded-lg space-y-3 bg-card ${
                          snapshot.isDragging ? "shadow-lg" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:cursor-grabbing"
                            >
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium">
                              {plan.name} Plan
                            </span>
                            {plan.popular && (
                              <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                                Popular
                              </span>
                            )}
                          </div>
                          <Popover
                            open={openPopover === index}
                            onOpenChange={(open) =>
                              setOpenPopover(open ? index : null)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64" align="end">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-medium text-sm">
                                    Delete Plan
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    Are you sure you want to delete "{plan.name}
                                    "? This action cannot be undone.
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setOpenPopover(null)}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      removePlan(index);
                                      setOpenPopover(null);
                                    }}
                                    className="flex-1"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600">
                              Plan Name
                            </Label>
                            <Input
                              value={plan.name}
                              onChange={(e) =>
                                updatePlan(index, { name: e.target.value })
                              }
                              placeholder="Plan Name"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Price
                            </Label>
                            <Input
                              value={plan.price}
                              onChange={(e) =>
                                updatePlan(index, { price: e.target.value })
                              }
                              placeholder="$29"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Period
                            </Label>
                            <Input
                              value={plan.period}
                              onChange={(e) =>
                                updatePlan(index, { period: e.target.value })
                              }
                              placeholder="month"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Button Text
                            </Label>
                            <Input
                              value={plan.buttonText}
                              onChange={(e) =>
                                updatePlan(index, {
                                  buttonText: e.target.value,
                                })
                              }
                              placeholder="Get Started"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Button Link
                            </Label>
                            <Input
                              value={plan.buttonLink || ""}
                              onChange={(e) =>
                                updatePlan(index, {
                                  buttonLink: e.target.value,
                                })
                              }
                              placeholder="/signup"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-600">
                            Description
                          </Label>
                          <Textarea
                            value={plan.description}
                            onChange={(e) =>
                              updatePlan(index, { description: e.target.value })
                            }
                            placeholder="Plan description..."
                            rows={2}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={plan.popular}
                            onChange={(e) =>
                              updatePlan(index, { popular: e.target.checked })
                            }
                            className="rounded"
                          />
                          <Label className="text-xs text-gray-600">
                            Mark as Popular
                          </Label>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-xs text-gray-600">
                              Features
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addFeature(index)}
                              className="h-6 text-xs"
                            >
                              Add Feature
                            </Button>
                          </div>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {plan.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex gap-2">
                                <Input
                                  value={feature}
                                  onChange={(e) =>
                                    updateFeature(
                                      index,
                                      featureIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Feature name"
                                  className="text-xs h-8"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeFeature(index, featureIndex)
                                  }
                                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default PricingSettings;
