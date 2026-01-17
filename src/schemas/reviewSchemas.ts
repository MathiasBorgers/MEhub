import {z} from 'zod'

// Base review schema
export const reviewSchema = z.object({
  id: z.string().uuid(),
  rating: z.coerce.number().int().min(1, {message: 'Rating must be at least 1'}).max(5, {message: 'Rating must be at most 5'}),
  comment: z.union([
    z.string().min(10, {message: 'Comment must be at least 10 characters'}).max(1000),
    z.null(),
    z.literal('')
  ]).optional(),
  userId: z.string().uuid(),
  scriptId: z.string().uuid(),
})

// Create review (without id and userId - will be set from session)
export const createReviewSchema = reviewSchema.omit({id: true, userId: true})

// Update review (can only update rating and comment) - all fields optional except id
export const updateReviewSchema = z.object({
  id: z.string().uuid(),
  rating: z.coerce.number().int().min(1, {message: 'Rating must be at least 1'}).max(5, {message: 'Rating must be at most 5'}).optional(),
  comment: z.union([
    z.string().min(10, {message: 'Comment must be at least 10 characters'}).max(1000),
    z.null(),
    z.literal('')
  ]).optional(),
})

// Review filters
export const reviewFilterSchema = z.object({
  scriptId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  minRating: z.number().int().min(1).max(5).optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
})

