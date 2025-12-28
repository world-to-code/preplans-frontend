"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  Users,
  FileText,
  Bell,
  LayoutDashboard,
  Settings,
  FolderKanban,
  Shield,
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const isSurveyBuilder = pathname?.includes("/surveys/builder") || pathname?.includes("/surveys/create")

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Projects", icon: FolderKanban, href: "/admin/projects" },
    { label: "Events", icon: Calendar, href: "/admin/events" },
    { label: "Bookings", icon: CheckCircle2, href: "/admin/bookings" },
    { label: "Surveys", icon: ClipboardList, href: "/admin/surveys" },
    {
      label: "Users & Groups",
      icon: Users,
      href: "/admin/users",
      subItems: [{ label: "Security & Access", icon: Shield, href: "/admin/users/security" }],
    },
    { label: "Reports", icon: FileText, href: "/admin/reports" },
    { label: "Notifications", icon: Bell, href: "/admin/notifications" },
  ]

  if (isSurveyBuilder) {
    return <div className="h-screen overflow-auto bg-background">{children}</div>
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 border-r border-border bg-card lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-border p-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Admin Portal</h1>
                <p className="text-xs text-muted-foreground">Campus Booking</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              if ("subItems" in item && item.subItems) {
                const isActive = pathname?.startsWith(item.href)
                return (
                  <div key={item.href} className="space-y-1">
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3"
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href
                      return (
                        <Button
                          key={subItem.href}
                          variant={isSubActive ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3 pl-12 text-sm"
                          onClick={() => router.push(subItem.href)}
                        >
                          {subItem.icon && <subItem.icon className="h-4 w-4" />}
                          {subItem.label}
                        </Button>
                      )
                    })}
                  </div>
                )
              }

              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          {/* Settings */}
          <div className="border-t border-border p-4">
            <Button
              variant={pathname === "/admin/settings" ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => router.push("/admin/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
