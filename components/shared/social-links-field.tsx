import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { FieldArray } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SocialLinksFieldProps {
  values: any;
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  allowedPlatforms?: { label: string; value: string }[];
  label?: string;
}

export function SocialLinksField({
  values,
  errors,
  touched,
  setFieldValue,
  allowedPlatforms,
  label = "Social Links",
}: SocialLinksFieldProps) {
  return (
    <div className="space-y-3 pt-2 border-t border-border mt-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
      </div>
      <FieldArray name="socialLinks">
        {({ push, remove }) => (
          <div className="space-y-3">
            {values.socialLinks?.map((link: any, index: number) => {
              const linkErrors = (errors.socialLinks as any)?.[index];
              const linkTouched = (touched.socialLinks as any)?.[index];
              
              return (
                <div key={index} className="flex items-start gap-2">
                  <div className="space-y-1 flex-1">
                    {allowedPlatforms ? (
                      <Select
                        value={link.platform}
                        onValueChange={(val) =>
                          setFieldValue(`socialLinks.${index}.platform`, val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {allowedPlatforms.map((platform) => (
                            <SelectItem key={platform.value} value={platform.value}>
                              {platform.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={link.platform}
                        onChange={(e) =>
                          setFieldValue(
                            `socialLinks.${index}.platform`,
                            e.target.value
                          )
                        }
                        placeholder="Platform (e.g. LinkedIn, Twitter)"
                      />
                    )}
                  </div>
                  <div className="space-y-1 flex-[2]">
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        setFieldValue(`socialLinks.${index}.url`, e.target.value)
                      }
                      placeholder="https://..."
                      className={
                        linkErrors?.url && linkTouched?.url
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
                    />
                    {linkErrors?.url && linkTouched?.url && (
                      <p className="text-xs text-red-500">{linkErrors.url}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() =>
                push({
                  platform: allowedPlatforms ? allowedPlatforms[0].value : "",
                  url: "",
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}
