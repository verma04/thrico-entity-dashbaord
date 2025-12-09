"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, FileEdit } from "lucide-react";

type CustomPage = {
  title: string;
  slug: string;
};

const Page = () => {
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedPages = JSON.parse(
      localStorage.getItem("thrico-custom-pages") || "[]"
    );
    setCustomPages(savedPages);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Page Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Standard Pages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Standard Pages</h2>
              <Button
                onClick={() => router.push("/website-pages/pages/standard")}
                variant="default"
                size="sm"
              >
                <FileEdit className="mr-2 h-4 w-4" />
                Manage Standard Pages
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Manage content and variations for standard pages like Home, About
              Us, Contact, and Privacy Policy.
            </p>
          </div>

          <Separator />

          {/* Custom Pages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Custom Pages</h2>
              <Button
                onClick={() => router.push("/website-pages/pages/create")}
                variant="default"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Page
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Create and manage custom pages for your website.
            </p>

            {customPages.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-base font-medium mb-2">
                  Your Custom Pages:
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {customPages.map((page, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <a
                        href={`/pages/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        {page.title}
                      </a>
                      <Button
                        variant="link"
                        size="sm"
                        className="px-1"
                        onClick={() =>
                          router.push(`/website-pages/pages/edit/${page.slug}`)
                        }
                      >
                        Edit
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-muted-foreground italic mt-4">
                No custom pages created yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
