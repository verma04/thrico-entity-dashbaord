"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { Plus, Trash2, SaveIcon } from "lucide-react"

interface FooterConfig {
  companyInfo?: { name: string; logo?: string; description?: string }
  contactInfo?: { phone?: string; email?: string; address?: string }
  socialMedia?: Array<{ platform: string; url: string }>
  footerSections?: Array<{ title: string; links: Array<{ label: string; href: string }> }>
  newsletter?: { enabled: boolean; title?: string; description?: string }
  copyright?: { text: string; showYear?: boolean }
}

const socialMediaOptions = [
  { label: "Facebook", value: "facebook" },
  { label: "Twitter", value: "twitter" },
  { label: "Instagram", value: "instagram" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "YouTube", value: "youtube" },
  { label: "TikTok", value: "tiktok" },
  { label: "Discord", value: "discord" },
]

export default function FooterManager() {
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const form = useForm<FooterConfig>()

  useEffect(() => {
    setTimeout(() => {
      const defaultConfig: FooterConfig = {
        companyInfo: {
          name: "Your Company Name",
          logo: "https://example.com/logo.png",
          description: "Brief description about your company",
        },
        contactInfo: {
          phone: "+1 (555) 123-4567",
          email: "info@yourcompany.com",
          address: "123 Main Street, City, State",
        },
        socialMedia: [
          { platform: "facebook", url: "https://facebook.com/yourcompany" },
          { platform: "twitter", url: "https://twitter.com/yourcompany" },
        ],
        newsletter: {
          enabled: true,
          title: "Subscribe to our Newsletter",
          description: "Get the latest updates and news",
        },
        copyright: {
          text: "© 2025 Your Company Name. All rights reserved.",
          showYear: true,
        },
      }
      form.reset(defaultConfig)
      setIsLoading(false)
    }, 500)
  }, [form])

  const onSubmit = form.handleSubmit((values) => {
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("footer-config", JSON.stringify(values))
      toast({
        title: "Success",
        description: "Footer configuration saved successfully!",
      })
      setLoading(false)
    }, 1000)
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Footer Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Configure your company details and branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="companyInfo.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Company Name" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyInfo.logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/logo.png" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyInfo.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Brief description about your company" rows={3} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Add contact details for your company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="contactInfo.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+1 (555) 123-4567" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="info@yourcompany.com" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123 Main Street, City, State" />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Add your social media profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => {
                  const current = form.getValues("socialMedia") || []
                  form.setValue("socialMedia", [...current, { platform: "", url: "" }])
                }}
              >
                <Plus className="h-4 w-4" />
                Add Social Media
              </Button>

              {form.watch("socialMedia")?.map((_, index) => (
                <div key={index} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Social Media {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const current = form.getValues("socialMedia") || []
                        form.setValue(
                          "socialMedia",
                          current.filter((_, i) => i !== index),
                        )
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`socialMedia.${index}.platform`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {socialMediaOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`socialMedia.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://facebook.com/yourcompany" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Copyright Information</CardTitle>
            <CardDescription>Set your copyright text and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="copyright.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Copyright Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="© 2025 Your Company Name. All rights reserved." />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="copyright.showYear"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <FormLabel>Auto Update Year</FormLabel>
                    <p className="text-sm text-muted-foreground">Automatically update the year in the copyright text</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" loading={loading} className="gap-2">
            <SaveIcon className="h-4 w-4" />
            Save Footer Configuration
          </Button>
        </div>
      </form>
    </div>
  )
}
