"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@/lib/hooks/use-user"
import {
  LayoutDashboard,
  Grid3x3,
  Download,
  RefreshCw,
  Settings,
  HelpCircle,
  LogOut,
  Coins,
  Shield,
  Users,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Browse Niches", href: "/niches", icon: Grid3x3 },
  { name: "Downloads", href: "/downloads", icon: Download },
  { name: "Subscriptions", href: "/subscriptions", icon: RefreshCw },
  { name: "Buy Credits", href: "/credits", icon: Coins },
  { name: "Affiliate", href: "/affiliate", icon: Users }, // Added affiliate link
]

const bottomNav = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, isAdmin } = useUser()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">LD</span>
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">LeadDrop</span>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        {/* Admin link */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">Admin</p>
            </div>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Shield className="h-5 w-5" />
              Admin Dashboard
            </Link>
          </>
        )}
      </nav>

      {/* Bottom navigation */}
      <div className="px-4 py-4 border-t border-sidebar-border space-y-1">
        {bottomNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </aside>
  )
}
