import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Apple,
  ArrowRight,
  Download,
  Users,
  AlertTriangle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

export default function MobileAppIndexPage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Smartphone className="w-16 h-16 text-muted-foreground opacity-50" />
        <h1 className="text-3xl font-bold">Coming Soon</h1>
        <p className="text-muted-foreground text-center max-w-md">
          We are currently working on bringing the custom mobile app experience
          to you. Stay tuned!
        </p>
      </div>
    );
  } else {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6 w-full">
        <PageHeader
          title="Custom Mobile App"
          description="Create and manage your branded mobile applications for Android and iOS."
          icon={Smartphone}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Installs
              </CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,214</div>
              <p className="text-xs text-muted-foreground">
                +7% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crash Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.4%</div>
              <p className="text-xs text-muted-foreground text-green-500">
                -0.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">
                Based on 1.2k reviews
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <CardTitle>Android Application</CardTitle>
              <CardDescription>
                Manage your app for the Google Play Store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Configure your package name, upload Android screenshots, and
                manage your Play Store listing.
              </p>
              <Link href="/mobile-app/android">
                <Button className="w-full">
                  Manage Android <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <Apple className="w-6 h-6" />
              </div>
              <CardTitle>iOS Application</CardTitle>
              <CardDescription>
                Manage your app for the Apple App Store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Configure your bundle identifier, upload Apple Developer
                credentials, and manage your App Store listing.
              </p>
              <Link href="/mobile-app/ios">
                <Button className="w-full">
                  Manage iOS <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
