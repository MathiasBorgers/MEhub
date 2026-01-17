import {z} from 'zod'
import {Role} from '@prisma/client'

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  password: z
    .string()
    .min(8, {message: 'The password must be at least 8 characters long.'})
    .max(100, {message: "The password can't be longer than 100 characters."}),
  username: z.string().min(3, {message: 'The username must be at least 3 characters long.'}),
  role: z.enum(Role),
})

export const signInSchema = userSchema.omit({id: true, role: true, username: true})

export const registerSchema = userSchema
  .omit({id: true, role: true})
  // Via extend kunnen we een bestaand schema uitbreiden met extra velden.
  .extend({
    passwordConfirmation: z.string(),
  })
  // De refine methode, die beschikbaar is op properties en het schema zelf, kan gebruikt worden om extra validatie toe
  // te voegen die niet standaard aanwezig is in Zod.
  .refine(data => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'The password and confirmation do not match.',
  })

export const updateUserSchema = userSchema.pick({username: true}).extend({
  bio: z.string().max(500, {message: "The bio can't be longer than 500 characters."}).optional().nullable(),
  avatar: z.string().optional().nullable().refine(
    (val) => !val || val === '' || z.string().url().safeParse(val).success,
    {message: 'The avatar must be a valid URL or empty.'}
  ),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, {message: 'Current password is required.'}),
  newPassword: z
    .string()
    .min(8, {message: 'The password must be at least 8 characters long.'})
    .max(100, {message: "The password can't be longer than 100 characters."}),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'The passwords do not match.',
})

export const updateRoleSchema = userSchema.pick({role: true, id: true})

// User filters (Admin only)
export const userFilterSchema = z.object({
  role: z.enum(Role).optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
})

// Delete user (Admin only)
export const deleteUserSchema = userSchema.pick({id: true})

