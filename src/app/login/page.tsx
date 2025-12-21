"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import { loginAction } from "@/app/actions"
import { useActionState } from "react"

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-mehub-text mb-2">Welcome Back</h1>
            <p className="text-mehub-text-secondary">Sign in to your MEhub account</p>
          </div>

          {/* Form Card */}
          <Card className="bg-mehub-card border-mehub-border p-8 mb-6">
            <form action={formAction} className="space-y-6">
              {/* Error Message */}
              {state?.error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {state.error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-mehub-text font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    disabled={pending}
                    className="w-full pl-10 pr-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary focus:ring-1 focus:ring-mehub-primary outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-mehub-text font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    disabled={pending}
                    className="w-full pl-10 pr-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary focus:ring-1 focus:ring-mehub-primary outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={pending}
                className="w-full border border-mehub-border bg-mehub-primary text-mehub-bg hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all disabled:opacity-50"
              >
                {pending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Card>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-mehub-text-secondary">
              Don't have an account?{" "}
              <Link href="/register" className="text-mehub-primary hover:text-orange-500 transition-colors font-medium">
                Create one
              </Link>
            </p>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-2">📚</div>
              <p className="text-mehub-text-secondary text-sm">Explore Scripts</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📤</div>
              <p className="text-mehub-text-secondary text-sm">Share Your Work</p>
            </div>
            <div>
              <div className="text-2xl mb-2">⭐</div>
              <p className="text-mehub-text-secondary text-sm">Get Ratings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-mehub-border bg-mehub-card/50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-mehub-text-secondary text-sm">
          <p>&copy; 2025 MEhub. Made for developers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}
