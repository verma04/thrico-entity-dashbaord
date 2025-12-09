"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { Edit2Icon } from "lucide-react"

interface SeoData {
  key: string
  path: string
  name: string
  title: string
  description: string
  keywords: string
  isCustomPage?: boolean
  slug?: string
}

export default function SeoManager() {
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [seoData, setSeoData] = useState<SeoData[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState<SeoData | null>(null)
  const { toast } = useToast()
  const form = useForm()

  useEffect(() => {
    setTimeout(() => {
      const homeSeo = JSON.parse(
        localStorage.getItem("thrico-seo-home") ||
          '{"title":"Thrico - Connect with Your Community","description":"Join events, groups, and meet like-minded people in your area","keywords":"community, events, groups, networking"}',
      )
      const aboutSeo = JSON.parse(
        localStorage.getItem("thrico-seo-about") ||
          '{"title":"About Us - Thrico","description":"Learn more about Thrico and our mission to connect communities","keywords":"about, mission, team, community platform"}',
      )
      const contactSeo = JSON.parse(
        localStorage.getItem("thrico-seo-contact") ||
          '{"title":"Contact Us - Thrico","description":"Get in touch with the Thrico team for support, feedback, or partnership inquiries","keywords":"contact, support, help, feedback, inquiries"}',
      )
      const privacySeo = JSON.parse(
        localStorage.getItem("thrico-seo-privacy") ||
          '{"title":"Privacy Policy - Thrico","description":"Learn about how Thrico collects, uses, and protects your personal information","keywords":"privacy policy, data protection, personal information, cookies, GDPR"}',
      )

      const customPages = JSON.parse(localStorage.getItem("thrico-custom-pages") || "[]")

      const allSeoData = [
        { key: "home", path: "/", name: "Home", ...homeSeo },
        { key: "about", path: "/about", name: "About Us", ...aboutSeo },
        { key: "contact", path: "/contact", name: "Contact Us", ...contactSeo },
        {
          key: "privacy",
          path: "/privacy",
          name: "Privacy Policy",
          ...privacySeo,
        },
        ...customPages.map((page: any) => ({
          key: `page-${page.slug}`,
          path: `/pages/${page.slug}`,
          name: page.title,
          title: page.title,
          description: page.description || "",
          keywords: page.keywords || "",
          isCustomPage: true,
          slug: page.slug,
        })),
      ]

      setSeoData(allSeoData)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleEdit = (record: SeoData) => {
    setCurrentPage(record)
    form.reset({
      title: record.title,
      description: record.description,
      keywords: record.keywords,
    })
    setIsModalVisible(true)
  }

  const handleSave = form.handleSubmit((values) => {
    if (!currentPage) return
    setLoading(true)

    setTimeout(() => {
      if (currentPage.isCustomPage) {
        const customPages = JSON.parse(localStorage.getItem("thrico-custom-pages") || "[]")
        const updatedPages = customPages.map((page: any) => {
          if (page.slug === currentPage.slug) {
            return {
              ...page,
              title: values.title,
              description: values.description,
              keywords: values.keywords,
            }
          }
          return page
        })
        localStorage.setItem("thrico-custom-pages", JSON.stringify(updatedPages))
      } else {
        localStorage.setItem(
          `thrico-seo-${currentPage.key}`,
          JSON.stringify({
            title: values.title,
            description: values.description,
            keywords: values.keywords,
          }),
        )
      }

      setSeoData((prevData) => prevData.map((item) => (item.key === currentPage.key ? { ...item, ...values } : item)))

      toast({
        title: "Success",
        description: "SEO settings updated successfully!",
      })
      setLoading(false)
      setIsModalVisible(false)
    }, 1000)
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SEO Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Manager</CardTitle>
          <CardDescription>
            Manage SEO settings for all pages on your website. Optimize your meta titles, descriptions, and keywords to
            improve search engine visibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="font-semibold">Page</TableHead>
                  <TableHead className="font-semibold">Meta Title</TableHead>
                  <TableHead className="font-semibold">Meta Description</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seoData.map((item) => (
                  <TableRow key={item.key} className="border-border">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.path}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground line-clamp-1">{item.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground line-clamp-1">{item.description}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="gap-2">
                        <Edit2Icon className="h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit SEO for {currentPage?.name || ""}</DialogTitle>
            <DialogDescription>Update meta information to improve search engine visibility</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSave} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Meta title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter meta title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: "Meta description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter meta description" rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                rules={{ required: "Keywords are required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Keywords</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter keywords separated by commas" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
