import {z} from 'zod'

// Base file schema
export const fileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  size: z.bigint().positive(),
  type: z.string().max(100),
  url: z.string().url().max(500),
  scriptId: z.string().uuid(),
})

// Create file (without id)
export const createFileSchema = fileSchema.omit({id: true})

// Update file (only name and url can be updated) - all fields optional except id
export const updateFileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  url: z.string().url().max(500).optional(),
})

// File filters
export const fileFilterSchema = z.object({
  scriptId: z.string().uuid().optional(),
  type: z.string().optional(),
})

