import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { FormSettings, UpdateFormSettingFn } from "@/store/ts-types";

type SettingsProps = {
  formSettings: FormSettings;
  updateFormSetting: UpdateFormSettingFn;
  previewType?: "MULTI_STEP" | "SCROLL_LONG" | string;
};

const Settings = ({
  formSettings,
  updateFormSetting,
  previewType = "SCROLL_LONG",
}: SettingsProps) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Form Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="form-view-type">Form View Type</Label>
            <Select
              value={previewType}
              onValueChange={(value) => updateFormSetting("previewType", value)}
            >
              <SelectTrigger id="form-view-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MULTI_STEP">
                  MULTI_STEP (one question per page)
                </SelectItem>
                <SelectItem value="SCROLL_LONG">
                  Scroll Long (all questions on one page)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose how respondents will view your form
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={formSettings.primaryColor}
                    onChange={(e) =>
                      updateFormSetting("primaryColor", e.target.value)
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={formSettings.primaryColor}
                    onChange={(e) =>
                      updateFormSetting("primaryColor", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={formSettings.secondaryColor}
                    onChange={(e) =>
                      updateFormSetting("secondaryColor", e.target.value)
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={formSettings.secondaryColor}
                    onChange={(e) =>
                      updateFormSetting("secondaryColor", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="background-color">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="background-color"
                    type="color"
                    value={formSettings.backgroundColor}
                    onChange={(e) =>
                      updateFormSetting("backgroundColor", e.target.value)
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={formSettings.backgroundColor}
                    onChange={(e) =>
                      updateFormSetting("backgroundColor", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text-color">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="text-color"
                    type="color"
                    value={formSettings.textColor || "#2c3e50"}
                    onChange={(e) =>
                      updateFormSetting("textColor", e.target.value)
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={formSettings.textColor || "#2c3e50"}
                    onChange={(e) =>
                      updateFormSetting("textColor", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="button-color">Button Color</Label>
              <div className="flex gap-2">
                <Input
                  id="button-color"
                  type="color"
                  value={formSettings.buttonColor || formSettings.primaryColor}
                  onChange={(e) =>
                    updateFormSetting("buttonColor", e.target.value)
                  }
                  className="h-10 w-20"
                />
                <Input
                  value={formSettings.buttonColor || formSettings.primaryColor}
                  onChange={(e) =>
                    updateFormSetting("buttonColor", e.target.value)
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Border Settings</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="border-color">Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="border-color"
                    type="color"
                    value={formSettings.borderColor}
                    onChange={(e) =>
                      updateFormSetting("borderColor", e.target.value)
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={formSettings.borderColor}
                    onChange={(e) =>
                      updateFormSetting("borderColor", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="border-style">Border Style</Label>
                <Select
                  value={formSettings.borderStyle}
                  onValueChange={(value) =>
                    updateFormSetting("borderStyle", value)
                  }
                >
                  <SelectTrigger id="border-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="groove">Groove</SelectItem>
                    <SelectItem value="ridge">Ridge</SelectItem>
                    <SelectItem value="inset">Inset</SelectItem>
                    <SelectItem value="outset">Outset</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <Label>Border Width: {formSettings.borderWidth}px</Label>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[formSettings.borderWidth]}
                  onValueChange={([value]) =>
                    updateFormSetting("borderWidth", value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Border Radius: {formSettings.borderRadius}px</Label>
                <Slider
                  min={0}
                  max={30}
                  step={1}
                  value={[formSettings.borderRadius]}
                  onValueChange={([value]) =>
                    updateFormSetting("borderRadius", value)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Input Field Settings</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="input-background">Input Background</Label>
                <div className="flex gap-2">
                  <Input
                    id="input-background"
                    type="color"
                    value={formSettings.inputBackground || "#ffffff"}
                    onChange={(e) =>
                      updateFormSetting("inputBackground", e.target.value)
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={formSettings.inputBackground || "#ffffff"}
                    onChange={(e) =>
                      updateFormSetting("inputBackground", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="input-border-color">Input Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="input-border-color"
                    type="color"
                    value={
                      formSettings.inputBorderColor || formSettings.borderColor
                    }
                    onChange={(e) =>
                      updateFormSetting("inputBorderColor", e.target.value)
                    }
                    className="h-10 w-20"
                  />
                  <Input
                    value={
                      formSettings.inputBorderColor || formSettings.borderColor
                    }
                    onChange={(e) =>
                      updateFormSetting("inputBorderColor", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Themes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button
                onClick={() => {
                  updateFormSetting("primaryColor", "#667eea");
                  updateFormSetting("secondaryColor", "#764ba2");
                  updateFormSetting("backgroundColor", "#f8f9fa");
                  updateFormSetting("borderColor", "#e1e8ed");
                  updateFormSetting("textColor", "#2c3e50");
                  updateFormSetting("buttonColor", "#667eea");
                }}
                className="h-16"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                Default
              </Button>
              <Button
                onClick={() => {
                  updateFormSetting("primaryColor", "#28a745");
                  updateFormSetting("secondaryColor", "#20c997");
                  updateFormSetting("backgroundColor", "#f8fff9");
                  updateFormSetting("borderColor", "#c3e6cb");
                  updateFormSetting("textColor", "#155724");
                  updateFormSetting("buttonColor", "#28a745");
                }}
                className="h-16"
                style={{
                  background:
                    "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                }}
              >
                Nature
              </Button>
              <Button
                onClick={() => {
                  updateFormSetting("primaryColor", "#007bff");
                  updateFormSetting("secondaryColor", "#17a2b8");
                  updateFormSetting("backgroundColor", "#f8f9ff");
                  updateFormSetting("borderColor", "#b8daff");
                  updateFormSetting("textColor", "#004085");
                  updateFormSetting("buttonColor", "#007bff");
                }}
                className="h-16"
                style={{
                  background:
                    "linear-gradient(135deg, #007bff 0%, #17a2b8 100%)",
                }}
              >
                Ocean
              </Button>
              <Button
                onClick={() => {
                  updateFormSetting("primaryColor", "#e83e8c");
                  updateFormSetting("secondaryColor", "#fd7e14");
                  updateFormSetting("backgroundColor", "#fff8f9");
                  updateFormSetting("borderColor", "#f1aeb5");
                  updateFormSetting("textColor", "#721c24");
                  updateFormSetting("buttonColor", "#e83e8c");
                }}
                className="h-16"
                style={{
                  background:
                    "linear-gradient(135deg, #e83e8c 0%, #fd7e14 100%)",
                }}
              >
                Sunset
              </Button>
              <Button
                onClick={() => {
                  updateFormSetting("primaryColor", "#6f42c1");
                  updateFormSetting("secondaryColor", "#e83e8c");
                  updateFormSetting("backgroundColor", "#faf9ff");
                  updateFormSetting("borderColor", "#c7a2ea");
                  updateFormSetting("textColor", "#3d1a78");
                  updateFormSetting("buttonColor", "#6f42c1");
                }}
                className="h-16"
                style={{
                  background:
                    "linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)",
                }}
              >
                Purple
              </Button>
              <Button
                onClick={() => {
                  updateFormSetting("primaryColor", "#343a40");
                  updateFormSetting("secondaryColor", "#6c757d");
                  updateFormSetting("backgroundColor", "#ffffff");
                  updateFormSetting("borderColor", "#dee2e6");
                  updateFormSetting("textColor", "#212529");
                  updateFormSetting("buttonColor", "#343a40");
                }}
                className="h-16"
                style={{
                  background:
                    "linear-gradient(135deg, #343a40 0%, #6c757d 100%)",
                }}
              >
                Dark
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Typography</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Font Size: {formSettings.fontSize}px</Label>
                <Slider
                  min={12}
                  max={24}
                  step={1}
                  value={[formSettings.fontSize]}
                  onValueChange={([value]) =>
                    updateFormSetting("fontSize", value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-weight">Font Weight</Label>
                <Select
                  value={formSettings.fontWeight || "400"}
                  onValueChange={(value) =>
                    updateFormSetting("fontWeight", value)
                  }
                >
                  <SelectTrigger id="font-weight">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi Bold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Shadow & Effects</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="box-shadow">Box Shadow</Label>
                <Select
                  value={formSettings.boxShadow || "none"}
                  onValueChange={(value) =>
                    updateFormSetting("boxShadow", value)
                  }
                >
                  <SelectTrigger id="box-shadow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="0 1px 3px rgba(0,0,0,0.12)">
                      Light
                    </SelectItem>
                    <SelectItem value="0 4px 6px rgba(0,0,0,0.1)">
                      Medium
                    </SelectItem>
                    <SelectItem value="0 10px 25px rgba(0,0,0,0.15)">
                      Heavy
                    </SelectItem>
                    <SelectItem value="0 20px 40px rgba(0,0,0,0.2)">
                      Extra Heavy
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hover-effect">Hover Effect</Label>
                <Select
                  value={formSettings.hoverEffect || "none"}
                  onValueChange={(value) =>
                    updateFormSetting("hoverEffect", value)
                  }
                >
                  <SelectTrigger id="hover-effect">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="lift">Lift</SelectItem>
                    <SelectItem value="glow">Glow</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                    <SelectItem value="border">Border Highlight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
