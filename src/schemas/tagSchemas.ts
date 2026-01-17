import {z} from 'zod'

// Base tag schema
export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, {message: 'Tag name must be at least 2 characters'}).max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, {message: 'Color must be a valid hex color'}).nullable(),
})

// Create tag
export const createTagSchema = tagSchema.omit({id: true})

// Update tag - all fields optional except id
export const updateTagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, {message: 'Tag name must be at least 2 characters'}).max(50).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, {message: 'Color must be a valid hex color'}).nullable().optional(),
})

// Tag filters
export const tagFilterSchema = z.object({
  search: z.string().optional(),
  limit: z.number().int().positive().max(100).optional(),
})

