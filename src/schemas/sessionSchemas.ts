import {z} from 'zod'

// Base session schema
export const sessionSchema = z.object({
  id: z.string().uuid(),
  activeFrom: z.date(),
  activeUntil: z.date(),
  userId: z.string().uuid(),
})

// Session filters for admin
export const sessionFilterSchema = z.object({
  userId: z.string().uuid().optional(),
  activeOnly: z.boolean().default(true),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
})

// Delete session (revoke/logout)
export const deleteSessionSchema = sessionSchema.pick({id: true})

// Extend session
export const extendSessionSchema = sessionSchema.pick({id: true})

