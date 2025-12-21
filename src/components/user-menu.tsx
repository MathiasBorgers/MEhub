"use client"

import { useState } from "react"
import { User, LogOut, Settings, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/app/actions"
import Link from "next/link"
import type { Profile } from "@/models/users"

interface UserMenuProps {
  user: Profile
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-mehub-card border border-mehub-border transition-colors"
      >
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {user.username[0].toUpperCase()}
        </div>
        <span className="hidden md:block text-mehub-text font-medium">{user.username}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-mehub-card border border-mehub-border rounded-lg shadow-lg z-50 py-2">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-mehub-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-mehub-text">{user.username}</p>
                  <p className="text-sm text-mehub-text-secondary">{user.email}</p>
                  <p className="text-xs text-orange-500 font-medium">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href={`/profile/${user.username}`}
                className="flex items-center gap-3 px-4 py-2 text-mehub-text hover:bg-mehub-bg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User size={16} />
                Profile
              </Link>
              
              <Link
                href="/upload"
                className="flex items-center gap-3 px-4 py-2 text-mehub-text hover:bg-mehub-bg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Upload size={16} />
                Upload Script
              </Link>
              
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-2 text-mehub-text hover:bg-mehub-bg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={16} />
                Dashboard
              </Link>

              <div className="border-t border-mehub-border my-2" />
              
              <form action={logoutAction} className="w-full">
                <button
                  type="submit"
                  className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-mehub-bg transition-colors w-full text-left"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}