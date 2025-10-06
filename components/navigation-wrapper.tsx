"use client"

import { Home, Trophy, Calendar, User, LayoutDashboard, GitBranch } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function NavigationWrapper() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is logged in and their role
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check")
        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(data.isLoggedIn)
          setIsAdmin(data.role === "admin")
        } else {
          setIsLoggedIn(false)
          setIsAdmin(false)
        }
      } catch (error) {
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    }

    checkAuth()
    const interval = setInterval(checkAuth, 5000)
    return () => clearInterval(interval)
  }, [pathname])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  // Mobile navigation items
  const mobileNavItems = isLoggedIn
    ? [
        { href: "/", icon: Home, label: "Home" },
        { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
        { href: "/bracket", icon: GitBranch, label: "Bracket" },
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      ]
    : [
        { href: "/", icon: Home, label: "Home" },
        { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
        { href: "/matches", icon: Calendar, label: "Matches" },
        { href: "/login", icon: User, label: "Login" },
      ]

  // Desktop navigation items
  const desktopNavItems = [
    { href: "/", label: "Home" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/matches", label: "Matches" },
    { href: "/teams", label: "Teams" },
    { href: "/bracket", label: "Bracket" },
  ]

  if (isAdmin) {
    desktopNavItems.push({ href: "/admin", label: "Admin" })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            GameVerse '25
          </Link>
          <div className="flex items-center gap-4">
            {desktopNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
