"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/app/actions"

interface MobileMenuProps {
  isLoggedIn: boolean
}

export function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-mehub-text hover:text-orange-500 transition-colors z-50 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-mehub-card border-b border-mehub-border z-50 p-4">
          <nav className="flex flex-col gap-4">
            <Link
              href="/marketplace"
              className="text-mehub-text-secondary hover:text-orange-500 transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/categories"
              className="text-mehub-text-secondary hover:text-orange-500 transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-mehub-text-secondary hover:text-orange-500 transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            <div className="border-t border-mehub-border pt-4 mt-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                      U
                    </div>
                    <div>
                      <p className="font-semibold text-mehub-text">User</p>
                      <p className="text-sm text-mehub-text-secondary">Logged In</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-mehub-primary text-mehub-bg hover:bg-orange-500">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/upload" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-mehub-primary text-mehub-bg hover:bg-orange-500">
                        Upload Script
                      </Button>
                    </Link>
                    <form action={logoutAction} className="w-full">
                      <Button 
                        type="submit" 
                        variant="outline" 
                        className="w-full border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                      >
                        Sign Out
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-mehub-primary text-mehub-bg hover:bg-orange-500">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-mehub-border text-mehub-text hover:bg-orange-500 hover:text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}