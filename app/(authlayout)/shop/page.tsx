"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Plus,
  ArrowRight,
  Eye,
  Image as ImageIcon,
  Layers,
  AlertCircle,
} from "lucide-react";

export default function ShopDashboardPage() {
  // Mock data for initial version
  const stats = [
    {
      title: "Total Views",
      value: "1,234",
      change: "+12% from last week",
      icon: <Eye className="h-4 w-4 text-blue-500" />,
      className: "border-blue-100 bg-blue-50/30",
    },
    {
      title: "Total Products",
      value: "156",
      change: "12 low stock",
      icon: <Package className="h-4 w-4 text-orange-500" />,
      className: "border-orange-100 bg-orange-50/30",
    },
    {
      title: "Active Banners",
      value: "5",
      change: "Currently live",
      icon: <ImageIcon className="h-4 w-4 text-purple-500" />,
      className: "border-purple-100 bg-purple-50/30",
    },
    {
      title: "Categories",
      value: "8",
      change: "Active categories",
      icon: <Layers className="h-4 w-4 text-green-500" />,
      className: "border-green-100 bg-green-50/30",
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shop Overview</h1>
          <p className="text-muted-foreground">
            Monitor your catalog performance and manage products.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/shop/all">
            <Button variant="outline">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Products
            </Button>
          </Link>
          <Link href="/shop/all?action=create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className={stat.className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Engagement Overview Chart Placeholder */}
        <Card className="col-span-4 lg:col-span-7">
          <CardHeader>
            <CardTitle>Catalog Engagement</CardTitle>
            <CardDescription>
              User interaction with your products over the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center bg-muted/20 border border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>Views & Engagement Chart Visualization</p>
                <p className="text-xs">(Coming Soon)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions / Tips */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-none">
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              Inventory Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              12 products are running low on stock. Restock them to ensure they
              remain visible in your store.
            </p>
            <Link href="/shop/all?filter=low-stock">
              <Button variant="secondary" size="sm" className="w-full">
                View Low Stock Items
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-md">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/shop/banners">
                <Button variant="outline" size="sm">
                  Manage Banners
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                Manage Categories
              </Button>
              <Button variant="outline" size="sm">
                Product Tags
              </Button>
              <Button variant="outline" size="sm">
                Collections
              </Button>
              <Button variant="outline" size="sm">
                SEO Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
