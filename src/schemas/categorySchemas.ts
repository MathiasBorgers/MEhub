import {z} from 'zod'

// Base category schema
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, {message: 'Category name must be at least 2 characters'}).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, {message: 'Slug must be lowercase alphanumeric with hyphens'}),
  description: z.string().min(10, {message: 'Description must be at least 10 characters'}),
  icon: z.string().max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, {message: 'Color must be a valid hex color'}),
})

// Create category (without id)
export const createCategorySchema = categorySchema.omit({id: true})

// Update category (partial) - all fields optional except id
export const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, {message: 'Category name must be at least 2 characters'}).max(100).optional(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, {message: 'Slug must be lowercase alphanumeric with hyphens'}).optional(),
  description: z.string().min(10, {message: 'Description must be at least 10 characters'}).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, {message: 'Color must be a valid hex color'}).optional(),
})

// Category list filters
export const categoryFilterSchema = z.object({
  search: z.string().optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
})

