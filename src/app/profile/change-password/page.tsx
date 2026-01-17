"use client"

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"
import { changePasswordAction } from "@/serverFunctions/users"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [formState, formAction, isPending] = useActionState(changePasswordAction, { success: false })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  useEffect(() => {
    // Check if user is logged in
    const cookies = document.cookie.split(';')
    const sessionUserCookie = cookies.find(cookie =>
      cookie.trim().startsWith('session-user=')
    )

    if (sessionUserCookie) {
      setIsLoggedIn(true)
    } else {
      router.push('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Handle successful password change
    if (formState.success) {
      // Redirect to profile edit after 2 seconds
      setTimeout(() => {
        router.push('/profile/edit')
      }, 2000)
    }
  }, [formState.success, router])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-mehub-text">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-mehub-card border border-mehub-border rounded-lg p-8">
          <h1 className="text-3xl font-bold text-mehub-text mb-2">Change Password</h1>
          <p className="text-mehub-text-secondary mb-6">Update your account password</p>

          {formState.errors?.errors && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-500">{formState.errors.errors.join(', ')}</p>
            </div>
          )}

          {formState.success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6">
              <p className="text-green-500">Password changed successfully! Redirecting...</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="currentPassword" className="text-mehub-text flex items-center gap-2 mb-2">
                <Lock size={18} />
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  className="bg-mehub-bg border-mehub-border text-mehub-text pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mehub-text-secondary hover:text-mehub-text"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-mehub-text flex items-center gap-2 mb-2">
                <Lock size={18} />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  className="bg-mehub-bg border-mehub-border text-mehub-text pr-10"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mehub-text-secondary hover:text-mehub-text"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-sm text-mehub-text-secondary mt-1">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-mehub-text flex items-center gap-2 mb-2">
                <Lock size={18} />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  className="bg-mehub-bg border-mehub-border text-mehub-text pr-10"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mehub-text-secondary hover:text-mehub-text"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                {isPending ? "Changing Password..." : "Change Password"}
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 border-mehub-border text-mehub-text hover:bg-mehub-bg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-mehub-border bg-mehub-card/50 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-mehub-text-secondary text-sm">
          <p>&copy; 2025 MEhub. Made for developers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}

