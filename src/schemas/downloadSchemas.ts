import {z} from 'zod'

// Base download schema
export const downloadSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  scriptId: z.string().uuid(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
})

// Create download (without id and userId - will be set from session and request)
export const createDownloadSchema = downloadSchema.omit({id: true, userId: true, ipAddress: true, userAgent: true}).extend({
  scriptId: z.string().uuid(),
})

// Download filters
export const downloadFilterSchema = z.object({
  scriptId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
})

