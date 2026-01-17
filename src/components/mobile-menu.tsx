"use client"

import { useState, useEffect } from "react"
import { Menu, X, User, Settings, Upload, LayoutDashboard, Shield, Lock, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOutServerFunction } from "@/serverFunctions/users"

interface MobileMenuProps {
  isLoggedIn: boolean
}

interface UserInfo {
  username: string
  email: string
  role: string
}

export function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserInfo = () => {
        const cookies = document.cookie.split(';')
        const sessionUserCookie = cookies.find(cookie =>
          cookie.trim().startsWith('session-user=')
        )

        if (sessionUserCookie) {
          try {
            const cookieValue = sessionUserCookie.split('=')[1]
            const decoded = decodeURIComponent(cookieValue)
            const parsedUserInfo = JSON.parse(decoded) as UserInfo
            setUserInfo(parsedUserInfo)
          } catch (error) {
            console.error('Failed to parse session cookie:', error)
          }
        }
      }

      fetchUserInfo()
    }
  }, [isLoggedIn])

  const handleLogout = async () => {
    try {
      await signOutServerFunction()
      // Client-side redirect after successful logout
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-mehub-text hover:text-orange-500 transition-colors z-50 relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-mehub-card border-b border-mehub-border z-50 shadow-xl">
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* User Info Section - Only show when logged in */}
            {isLoggedIn && userInfo && (
              <div className="px-4 py-4 border-b border-mehub-border bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {userInfo.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{userInfo.username}</p>
                    <p className="text-sm text-slate-300 truncate">{userInfo.email}</p>
                    <p className="text-xs text-orange-500 font-medium">{userInfo.role}</p>
                  </div>
                </div>
              </div>
            )}

            <nav className="flex flex-col p-4 gap-1">
              <Link
                href="/marketplace"
                className="text-mehub-text-secondary hover:text-orange-500 hover:bg-mehub-hover transition-all font-medium py-3 px-3 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/categories"
                className="text-mehub-text-secondary hover:text-orange-500 hover:bg-mehub-hover transition-all font-medium py-3 px-3 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="text-mehub-text-secondary hover:text-orange-500 hover:bg-mehub-hover transition-all font-medium py-3 px-3 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>

              <div className="pt-2 mt-2 border-t border-mehub-border flex flex-col gap-1">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={`/profile/${userInfo?.username || ''}`}
                      className="flex items-center gap-3 text-mehub-text hover:text-orange-500 hover:bg-mehub-hover transition-all py-3 px-3 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={18} />
                      <span className="font-medium">Profile</span>
                    </Link>

                    <Link
                      href="/profile/edit"
                      className="flex items-center gap-3 text-mehub-text hover:text-orange-500 hover:bg-mehub-hover transition-all py-3 px-3 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings size={18} />
                      <span className="font-medium">Edit Profile</span>
                    </Link>

                    <Link
                      href="/profile/change-password"
                      className="flex items-center gap-3 text-mehub-text hover:text-orange-500 hover:bg-mehub-hover transition-all py-3 px-3 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <Lock size={18} />
                      <span className="font-medium">Change Password</span>
                    </Link>

                    {(userInfo?.role === 'Developer' || userInfo?.role === 'Admin') && (
                      <Link
                        href="/upload"
                        className="flex items-center gap-3 text-mehub-text hover:text-orange-500 hover:bg-mehub-hover transition-all py-3 px-3 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        <Upload size={18} />
                        <span className="font-medium">Upload Script</span>
                      </Link>
                    )}

                    {(userInfo?.role === 'Developer' || userInfo?.role === 'Admin') && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 text-mehub-text hover:text-orange-500 hover:bg-mehub-hover transition-all py-3 px-3 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard size={18} />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    )}

                    {userInfo?.role === 'Admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 text-orange-500 hover:bg-orange-500/10 transition-all py-3 px-3 rounded-lg font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        <Shield size={18} />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <div className="border-t border-mehub-border my-2" />

                    <button
                      onClick={() => {
                        setIsOpen(false)
                        void handleLogout()
                      }}
                      className="flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-all py-3 px-3 rounded-lg w-full text-left font-medium"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-mehub-primary text-mehub-bg hover:bg-orange-500 font-medium">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full mt-2 border-mehub-border text-mehub-text hover:bg-mehub-hover font-medium"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
