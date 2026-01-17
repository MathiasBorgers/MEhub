"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, Upload, ChevronDown, User, Shield, LayoutDashboard, Lock } from "lucide-react"
import { MobileMenu } from "./mobile-menu"
import { signOutServerFunction } from "@/serverFunctions/users"

interface UserInfo {
  username: string
  email: string
  role: string
}

export function ClientHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  const handleLogout = async () => {
    try {
      await signOutServerFunction()
      // Client-side redirect after successful logout
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  useEffect(() => {
    const checkLoginStatus = () => {
      const cookies = document.cookie.split(';')
      
      // Lees de nieuwe session-user cookie (deze is niet httpOnly en kan door JavaScript gelezen worden)
      const sessionUserCookie = cookies.find(cookie =>
        cookie.trim().startsWith('session-user=')
      )
      
      if (sessionUserCookie) {
        try {
          const cookieValue = sessionUserCookie.split('=')[1]
          const decoded = decodeURIComponent(cookieValue)
          const userInfo = JSON.parse(decoded) as UserInfo
          setUserInfo(userInfo)
          setIsLoggedIn(true)
        } catch (error) {
          console.error('Failed to parse session cookie:', error)
          setUserInfo(null)
          setIsLoggedIn(false)
        }
      } else {
        setUserInfo(null)
        setIsLoggedIn(false)
      }
    }

    // Initial check - ALLEEN bij mount
    checkLoginStatus()

    // VERWIJDER de interval - dit zorgt voor constant re-renders
    // De cookie wordt automatisch bijgewerkt bij login/logout via window.location.href

  }, []) // Lege dependency array - run alleen bij mount

  return (
    <header className="sticky top-0 z-50 border-b border-mehub-border bg-mehub-card/95 backdrop-blur-sm hover:border-orange-500/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 font-bold text-xl">
            <div className="bg-orange-500 text-white px-2 py-1 rounded font-bold text-lg">ME</div>
            <span className="text-mehub-text">hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/marketplace"
              className="text-mehub-text-secondary hover:text-orange-500 transition-colors font-medium"
            >
              Marketplace
            </Link>
            <Link
              href="/categories"
              className="text-mehub-text-secondary hover:text-orange-500 transition-colors font-medium"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-mehub-text-secondary hover:text-orange-500 transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-mehub-card border border-mehub-border transition-colors"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {userInfo?.username ? userInfo.username[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:block text-mehub-text font-medium">
                    {userInfo?.username || 'User'}
                  </span>
                  <ChevronDown size={16} className="text-mehub-text" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 py-2">
                      <div className="px-4 py-3 border-b border-slate-700 bg-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {userInfo?.username ? userInfo.username[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{userInfo?.username || 'User'}</p>
                            <p className="text-sm text-slate-300">{userInfo?.email || 'user@example.com'}</p>
                            <p className="text-xs text-orange-500 font-medium">{userInfo?.role || 'User'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2 bg-slate-900">
                        <Link
                          href={`/profile/${userInfo?.username || ''}`}
                          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-slate-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User size={16} />
                          Profile
                        </Link>

                        <Link
                          href="/profile/edit"
                          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-slate-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings size={16} />
                          Edit Profile
                        </Link>

                        <Link
                          href="/profile/change-password"
                          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-slate-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Lock size={16} />
                          Change Password
                        </Link>

                        {(userInfo?.role === 'Developer' || userInfo?.role === 'Admin') && (
                          <Link
                            href="/upload"
                            className="flex items-center gap-3 px-4 py-2 text-white hover:bg-slate-700 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Upload size={16} />
                            Upload Script
                          </Link>
                        )}

                        {(userInfo?.role === 'Developer' || userInfo?.role === 'Admin') && (
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-2 text-white hover:bg-slate-700 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </Link>
                        )}

                        {userInfo?.role === 'Admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2 text-orange-500 hover:bg-slate-700 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Shield size={16} />
                            Admin Panel
                          </Link>
                        )}

                        <div className="border-t border-slate-700 my-2" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-slate-700 transition-colors w-full text-left"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex gap-4">
                <Link href="/login">
                  <Button className="border border-mehub-border bg-mehub-primary text-mehub-bg hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="border border-mehub-border bg-transparent text-mehub-text hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            
            <MobileMenu isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
    </header>
  )
}
