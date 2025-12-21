'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getUserByEmail, createUser, startSession } from '@/dal/users'
import { verifyPassword } from '@/lib/passwordUtils'
import { createStatefulJwtToken } from '@/lib/jwtUtils'
import { Role } from '@/generated/prisma/enums'

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

// Register schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['Developer', 'User']).optional().default('User')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const validatedData = loginSchema.parse(rawData)

    // Find user by email
    const user = await getUserByEmail(validatedData.email)
    
    if (!user) {
      return { error: 'Invalid email or password' }
    }

    // Verify password
    const isValidPassword = verifyPassword(user.password, validatedData.password)
    
    if (!isValidPassword) {
      return { error: 'Invalid email or password' }
    }

    // Start new session
    const session = await startSession(user.id, user.role)
    
    // Create JWT token
    const token = createStatefulJwtToken(session)
    
    // Set auth cookie (client accessible for navbar)
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: false, // Make it accessible to client for navbar
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })
    
    // Set simple logged-in flag
    cookieStore.set('logged-in', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    redirect('/dashboard')

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.issues }
    }

    // Allow Next.js redirects to work
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    console.error('Login error:', error)
    return { error: 'An error occurred during login' }
  }
}

export async function registerAction(prevState: { error?: string } | null, formData: FormData) {
  try {
    const rawData = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      role: (formData.get('role') as string) || 'User'
    }

    const validatedData = registerSchema.parse(rawData)

    // Check if user already exists
    const existingUser = await getUserByEmail(validatedData.email)
    
    if (existingUser) {
      return { error: 'User with this email already exists' }
    }

    // Create new user
    const userRole = validatedData.role === 'Developer' ? Role.Developer : Role.User
    const newUser = await createUser({
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password, // Will be hashed in createUser
      role: userRole,
      bio: '',
      verified: false
    })

    // Start new session
    const session = await startSession(newUser.id, newUser.role)
    
    // Create JWT token
    const token = createStatefulJwtToken(session)
    
    // Set auth cookie (client accessible for navbar)
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: false, // Make it accessible to client for navbar
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })
    
    // Set simple logged-in flag
    cookieStore.set('logged-in', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    redirect('/dashboard')

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.issues }
    }

    // Allow Next.js redirects to work
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }

    console.error('Register error:', error)
    return { error: 'An error occurred during registration' }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  cookieStore.delete('logged-in')
  redirect('/')
}