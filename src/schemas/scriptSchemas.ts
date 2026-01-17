import {z} from 'zod'

// Base script schema
export const scriptSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, {message: 'Title must be at least 3 characters'}).max(200),
  description: z.string().min(10, {message: 'Description must be at least 10 characters'}).max(500),
  fullDescription: z.string().min(50, {message: 'Full description must be at least 50 characters'}),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, {message: 'Version must be in format X.Y.Z'}),
  downloads: z.number().int().nonnegative().default(0),
  averageRating: z.number().min(0).max(5).nullable().default(0),
  reviewCount: z.number().int().nonnegative().default(0),
  authorId: z.string().uuid(),
  categoryId: z.string().uuid(),
  requirements: z.array(z.string().max(100)).default([]),
  features: z.array(z.string().max(200)).default([]),
  screenshots: z.array(z.string().url().max(500)).default([]),
  isActive: z.boolean().default(true),
  luaContent: z.string().optional(),
})

// Create script (without id, downloads, ratings, review count)
export const createScriptSchema = z.object({
  title: z.string().min(3, {message: 'Title must be at least 3 characters'}).max(200),
  description: z.string().min(10, {message: 'Description must be at least 10 characters'}).max(500),
  fullDescription: z.string().min(50, {message: 'Full description must be at least 50 characters'}),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, {message: 'Version must be in format X.Y.Z'}),
  categoryId: z.string().uuid(),
  requirements: z.array(z.string().max(100)).optional().default([]),
  features: z.array(z.string().max(200)).optional().default([]),
  screenshots: z.array(z.string().url().max(500)).optional().default([]),
  isActive: z.boolean().default(true),
  luaContent: z.string().optional(),
  tagIds: z.array(z.string().uuid()).optional().default([]),
})

// Update script (partial, can't change author) - all fields optional except id
export const updateScriptSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, {message: 'Title must be at least 3 characters'}).max(200).optional(),
  description: z.string().min(10, {message: 'Description must be at least 10 characters'}).max(500).optional(),
  fullDescription: z.string().min(50, {message: 'Full description must be at least 50 characters'}).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, {message: 'Version must be in format X.Y.Z'}).optional(),
  categoryId: z.string().uuid().optional(),
  requirements: z.array(z.string().max(100)).optional(),
  features: z.array(z.string().max(200)).optional(),
  screenshots: z.array(z.string().url().max(500)).optional(),
  isActive: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  luaContent: z.string().optional(),
})

// Script filters
export const scriptFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  search: z.string().optional(),
  tags: z.array(z.string().uuid()).optional(),
  minRating: z.number().min(0).max(5).optional(),
  isActive: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  sortBy: z.enum(['createdAt', 'downloads', 'averageRating', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})
