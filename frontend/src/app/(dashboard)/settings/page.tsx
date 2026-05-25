'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SettingsPage() {
  const [profileName, setProfileName] = useState('Admin User')
  const [profileEmail, setProfileEmail] = useState('admin@tapway.com')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [featureAnnouncements, setFeatureAnnouncements] = useState(false)
  const [marketing, setMarketing] = useState(false)

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleNotificationsSave = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-card max-w-2xl">
            <CardHeader>
              <CardTitle className="text-base">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <Input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-card max-w-2xl">
            <CardHeader>
              <CardTitle className="text-base">Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecuritySave} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-card max-w-2xl">
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
            </CardHeader>
            <form onSubmit={handleNotificationsSave} className="space-y-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={emailAlerts}
                  onCheckedChange={(v) => setEmailAlerts(Boolean(v))}
                />
                Email alerts for critical incidents
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={weeklyReports}
                  onCheckedChange={(v) => setWeeklyReports(Boolean(v))}
                />
                Weekly usage reports
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={featureAnnouncements}
                  onCheckedChange={(v) => setFeatureAnnouncements(Boolean(v))}
                />
                New feature announcements
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={marketing}
                  onCheckedChange={(v) => setMarketing(Boolean(v))}
                />
                Marketing communications
              </label>
              <Button type="submit" className="mt-4">Save Preferences</Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}