"use client"

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { User, Mail, Image as ImageIcon, FileText, Lock } from "lucide-react"
import { updateProfileAction } from "@/serverFunctions/users"
import Image from "next/image"

interface UserInfo {
  username: string
  email: string
  role: string
  bio?: string
  avatar?: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [formState, formAction, isPending] = useActionState(updateProfileAction, { success: false })

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatar: "",
  })

  useEffect(() => {
    // Check if user is logged in
    const cookies = document.cookie.split(';')
    const sessionUserCookie = cookies.find(cookie =>
      cookie.trim().startsWith('session-user=')
    )

    if (sessionUserCookie) {
      try {
        const cookieValue = sessionUserCookie.split('=')[1]
        const decoded = decodeURIComponent(cookieValue)
        const userData = JSON.parse(decoded) as UserInfo

        // Batch state updates to avoid multiple re-renders
        setUserInfo(userData)
        setFormData({
          username: userData.username,
          bio: userData.bio || "",
          avatar: userData.avatar || "",
        })
      } catch (error) {
        console.error('Failed to parse session cookie:', error)
        router.push('/login')
      }
    } else {
      router.push('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Handle successful form submission
    if (formState.success && formState.data) {
      console.log('Profile update successful, new data:', formState.data)

      // Update the session cookie with new data from server
      const updatedUserInfo = {
        ...userInfo!,
        username: formState.data.username,
        bio: formState.data.bio || "",
        avatar: formState.data.avatar || "",
      }
      document.cookie = `session-user=${encodeURIComponent(JSON.stringify(updatedUserInfo))}; path=/; max-age=${60 * 60 * 24 * 7}`

      // Redirect to profile after 1 second
      setTimeout(() => {
        if (formState.data) {
          router.push(`/profile/${formState.data.username}`)
          router.refresh() // Force a refresh to update the UI
        }
      }, 1000)
    } else if (formState.errors) {
      console.error('Profile update failed:', formState.errors)
    }
  }, [formState.success, formState.data, formState.errors, userInfo, router])


  if (!userInfo) {
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

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-mehub-card border border-mehub-border rounded-lg p-8">
          <h1 className="text-3xl font-bold text-mehub-text mb-2">Edit Profile</h1>
          <p className="text-mehub-text-secondary mb-6">Update your profile information</p>

          {formState.errors?.errors && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-500">{formState.errors.errors.join(', ')}</p>
            </div>
          )}

          {formState.success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6">
              <p className="text-green-500">Profile updated successfully! Redirecting...</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-mehub-text flex items-center gap-2 mb-2">
                <Mail size={18} />
                Email (Read-only)
              </Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                disabled
                className="bg-mehub-bg border-mehub-border text-mehub-text-secondary cursor-not-allowed"
              />
              <p className="text-sm text-mehub-text-secondary mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <Label htmlFor="username" className="text-mehub-text flex items-center gap-2 mb-2">
                <User size={18} />
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-mehub-bg border-mehub-border text-mehub-text"
                required
                minLength={3}
              />
            </div>

            <div>
              <Label htmlFor="avatar" className="text-mehub-text flex items-center gap-2 mb-2">
                <ImageIcon size={18} />
                Avatar URL
              </Label>
              <Input
                id="avatar"
                name="avatar"
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                className="bg-mehub-bg border-mehub-border text-mehub-text"
              />
              {formData.avatar && (
                <div className="mt-3">
                  <p className="text-sm text-mehub-text-secondary mb-2">Preview:</p>
                  <Image
                    src={formData.avatar}
                    alt="Avatar preview"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full border-2 border-mehub-border object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="bio" className="text-mehub-text flex items-center gap-2 mb-2">
                <FileText size={18} />
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="bg-mehub-bg border-mehub-border text-mehub-text min-h-[120px]"
                maxLength={500}
              />
              <p className="text-sm text-mehub-text-secondary mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            <div className="border-t border-mehub-border pt-6">
              <h3 className="text-lg font-semibold text-mehub-text mb-3 flex items-center gap-2">
                <Lock size={18} />
                Security
              </h3>
              <Button
                type="button"
                onClick={() => router.push('/profile/change-password')}
                variant="outline"
                className="w-full border-mehub-border text-mehub-text hover:bg-mehub-bg"
              >
                Change Password
              </Button>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                {isPending ? "Saving..." : "Save Changes"}
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

