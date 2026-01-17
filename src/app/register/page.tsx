"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Lock, User } from "lucide-react"
import { registerAction } from "@/serverFunctions/users"
import { useActionState, useEffect, useRef } from "react"

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, { success: false })
  const hasRedirected = useRef(false)

  // Check for successful registration and redirect (only once)
  useEffect(() => {
    if (state?.success === true && !hasRedirected.current && !pending) {
      hasRedirected.current = true
      // Gebruik window.location voor een volledige pagina refresh na registratie
      window.location.href = '/dashboard'
    }
  }, [state, pending])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-mehub-text mb-2">Join MEhub</h1>
            <p className="text-mehub-text-secondary">Create your account and start sharing scripts</p>
          </div>

          {/* Form Card */}
          <Card className="bg-mehub-card border-mehub-border p-8 mb-6">
            <form action={formAction} className="space-y-5">
              {/* Error Message */}
              {state?.errors && !state.success && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {state.errors.errors?.[0] || 'An error occurred'}
                </div>
              )}

              {/* Success Message */}
              {state?.success && (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
                  Account created successfully! Redirecting...
                </div>
              )}

              {/* Username Field */}
              <div>
                <label className="block text-mehub-text font-medium mb-2">Username</label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Your username"
                    required
                    disabled={pending || state?.success}
                    defaultValue={state?.submittedData?.username}
                    className="w-full pl-10 pr-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary focus:ring-1 focus:ring-mehub-primary outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-mehub-text font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-mehub-text-secondary" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    disabled={pending || state?.success}
                    defaultValue={state?.submittedData?.email}
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
                    disabled={pending || state?.success}
                    className="w-full pl-10 pr-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary focus:ring-1 focus:ring-mehub-primary outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-mehub-text font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white" />
                  <input
                    type="password"
                    name="passwordConfirmation"
                    placeholder="••••••••"
                    required
                    disabled={pending || state?.success}
                    className="w-full pl-10 pr-4 py-3 bg-mehub-bg border border-mehub-border rounded-lg text-mehub-text placeholder-mehub-text-secondary focus:border-mehub-primary focus:ring-1 focus:ring-mehub-primary outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={pending || state?.success}
                className="w-full border border-mehub-border bg-mehub-primary text-mehub-bg hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all disabled:opacity-50"
              >
                {pending ? 'Creating Account...' : state?.success ? 'Redirecting...' : 'Create Account'}
              </Button>
            </form>
          </Card>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-mehub-text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="text-mehub-primary hover:text-orange-500 transition-colors font-medium">
                Sign in
              </Link>
            </p>
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
