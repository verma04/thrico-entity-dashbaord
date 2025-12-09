"use client"

import type { userStatus } from "@/types/user-types"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "BLOCKED":
      return "bg-red-100 text-red-800"
    case "REJECTED":
      return "bg-purple-100 text-purple-800"
    case "DISABLED":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function UserDetailsDrawer({
  open,
  onOpenChange,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: userStatus | null
}) {
  if (!user) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription>Complete information about the user</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* User Header */}
          <div className="space-y-4 text-center">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={`https://cdn.thrico.network/${user.user?.avatar}`} alt={user.user?.firstName} />
              <AvatarFallback>
                {user.user?.firstName?.[0]}
                {user.user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {user.user?.firstName} {user.user?.lastName}
              </h3>
              <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
            </div>
            {user.verification?.isVerified && <Badge variant="default">Verified</Badge>}
          </div>

          <Separator />

          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{user.user?.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">
                  +{user.user?.profile?.phone?.countryCode}-{user.user?.profile?.phone?.phoneNumber}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {user.user?.profile?.DOB && (
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{new Date(user.user.profile.DOB).toLocaleDateString()}</p>
                </div>
              )}
              {user.user?.profile?.gender && (
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{user.user.profile.gender}</p>
                </div>
              )}
              {user.user?.about?.pronouns && (
                <div>
                  <p className="text-muted-foreground">Pronouns</p>
                  <p className="font-medium">{user.user.about.pronouns}</p>
                </div>
              )}
              {user.user?.location?.name && (
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{user.user.location.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Information */}
          {(user.user?.about?.currentPosition || user.user?.about?.about) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {user.user?.about?.currentPosition && (
                  <div>
                    <p className="text-muted-foreground">Current Position</p>
                    <p className="font-medium">{user.user.about.currentPosition}</p>
                  </div>
                )}
                {user.user?.about?.about && (
                  <div>
                    <p className="text-muted-foreground">About</p>
                    <p className="font-medium">{user.user.about.about}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {user.user?.profile?.education?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.user.profile.education.map((edu, idx) => (
                  <div key={idx} className="text-sm border-l-2 border-muted pl-3">
                    <p className="font-medium">{edu.school.name}</p>
                    <p className="text-muted-foreground">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground">{edu.duration?.[0]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          {user.user?.profile?.experience?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.user.profile.experience.map((exp, idx) => (
                  <div key={idx} className="text-sm border-l-2 border-muted pl-3">
                    <p className="font-medium">{exp.company.name}</p>
                    <p className="text-muted-foreground">{exp.title}</p>
                    <p className="text-xs text-muted-foreground">{exp.startDate}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* KYC Details */}
          {user.userKyc && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">KYC Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {user.userKyc.affliction && (
                  <div>
                    <p className="text-muted-foreground">Affliction</p>
                    <p className="font-medium">{user.userKyc.affliction}</p>
                  </div>
                )}
                {user.userKyc.referralSource && (
                  <div>
                    <p className="text-muted-foreground">Referral Source</p>
                    <p className="font-medium">{user.userKyc.referralSource}</p>
                  </div>
                )}
                {user.userKyc.comment && (
                  <div>
                    <p className="text-muted-foreground">Comment</p>
                    <p className="font-medium">{user.userKyc.comment}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
