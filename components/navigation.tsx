"use client"

import { Button } from "@/components/ui/button"
import { Gamepad2, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GameVerse '25</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/leaderboard">
              <Button variant="ghost">Leaderboard</Button>
            </Link>
            <Link href="/matches">
              <Button variant="ghost">Matches</Button>
            </Link>
            <Link href="/register">
              <Button>Register Team</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-2">
            <Link href="/leaderboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Leaderboard
              </Button>
            </Link>
            <Link href="/matches" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Matches
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Register Team</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
