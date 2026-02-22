"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Coins, Search, Bell } from "lucide-react"
import { useUser } from "@/lib/hooks/use-user"

export function AppTopBar() {
  const { profile, logout } = useUser()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search niches, downloads..."
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </Button>

        {/* Credit balance */}
        <Link href="/credits">
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {profile?.credits?.toLocaleString() || 0} Credits
            </span>
          </div>
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-3 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">{profile?.full_name || "User"}</span>
                <span className="text-xs text-muted-foreground">{profile?.email || ""}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
            <DropdownMenuLabel className="text-popover-foreground">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground">{profile?.email || ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="text-popover-foreground cursor-pointer">
              <Link href="/settings">Account Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-popover-foreground cursor-pointer">
              <Link href="/credits">Buy Credits</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
