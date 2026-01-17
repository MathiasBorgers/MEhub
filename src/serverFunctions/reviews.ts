/**
 * Server actions voor Review CRUD operaties
 * Users kunnen reviews aanmaken voor scripts die ze hebben gedownload
 * Users kunnen alleen hun eigen reviews bewerken/verwijderen
 */
'use server'

import {revalidatePath} from 'next/cache'
import {
  getReviewByUserAndScript,
  getReviewById,
  createReview as createReviewDal,
  updateReview as updateReviewDal,
  deleteReview as deleteReviewDal,
} from '@/dal/reviews'
import {getScriptById} from '@/dal/scripts'
import {protectedFormAction, protectedServerFunction} from '@/lib/serverFunctions'
import {createReviewSchema, updateReviewSchema} from '@/schemas/reviewSchemas'
import {Role} from '@/generated/prisma/enums'

/**
 * Create a new review for a script
 */
export const createReviewAction = protectedFormAction({
  schema: createReviewSchema,
  requiredRoles: [Role.User, Role.Developer, Role.Admin], // All authenticated users can review
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} creating review for script: ${data.scriptId}`)

    // Check if script exists
    const script = await getScriptById(data.scriptId)
    if (!script) {
      logger.warn(`Script not found: ${data.scriptId}`)
      return {
        success: false,
        errors: {errors: ['Script not found']},
      }
    }

    // Check if user already reviewed this script
    const existingReview = await getReviewByUserAndScript(profile.id, data.scriptId)
    if (existingReview) {
      logger.warn(`User ${profile.username} already reviewed script ${data.scriptId}`)
      return {
        success: false,
        errors: {errors: ['You have already reviewed this script. Please update your existing review instead.']},
      }
    }

    const review = await createReviewDal({
      rating: data.rating,
      scriptId: data.scriptId,
      userId: profile.id, // Set user from session
      comment: data.comment ?? null, // Convert undefined to null
    })
    logger.info(`Review created successfully: ${review.id}`)

    revalidatePath(`/script/${data.scriptId}`)
    revalidatePath('/marketplace')

    return {
      success: true,
      data: {reviewId: review.id},
    }
  },
  functionName: 'Create Review Action',
  globalErrorMessage: 'Failed to create review. Please try again.',
})

/**
 * Update an existing review (Owner or Admin only)
 */
export const updateReviewAction = protectedFormAction({
  schema: updateReviewSchema,
  requiredRoles: [Role.User, Role.Developer, Role.Admin], // All authenticated users can update their own reviews
  serverFn: async ({data, logger, profile}) => {
    const {id, ...updateData} = data
    logger.info(`User ${profile.username} updating review: ${id}`)

    // Check if review exists
    const existing = await getReviewById(id)
    if (!existing) {
      logger.warn(`Review not found: ${id}`)
      return {
        success: false,
        errors: {errors: ['Review not found']},
      }
    }

    // Check authorization: must be owner or admin
    if (existing.userId !== profile.id && profile.role !== Role.Admin) {
      logger.warn(`User ${profile.username} tried to update review ${id} without permission`)
      return {
        success: false,
        errors: {errors: ['You do not have permission to edit this review']},
      }
    }

    const review = await updateReviewDal(id, updateData)
    logger.info(`Review updated successfully: ${review.id}`)

    revalidatePath(`/script/${review.scriptId}`)
    revalidatePath('/marketplace')

    return {
      success: true,
      data: {reviewId: review.id},
    }
  },
  functionName: 'Update Review Action',
  globalErrorMessage: 'Failed to update review. Please try again.',
})

/**
 * Delete a review (Owner or Admin only)
 */
export const deleteReviewAction = protectedServerFunction({
  schema: updateReviewSchema.pick({id: true}),
  requiredRoles: [Role.User, Role.Developer, Role.Admin], // All authenticated users can delete their own reviews
  serverFn: async ({data, logger, profile}) => {
    logger.info(`User ${profile.username} deleting review: ${data.id}`)

    // Check if review exists
    const existing = await getReviewById(data.id)
    if (!existing) {
      logger.warn(`Review not found: ${data.id}`)
      throw new Error('Review not found')
    }

    // Check authorization: must be owner or admin
    if (existing.userId !== profile.id && profile.role !== Role.Admin) {
      logger.warn(`User ${profile.username} tried to delete review ${data.id} without permission`)
      throw new Error('You do not have permission to delete this review')
    }

    const review = await deleteReviewDal(data.id)
    logger.info(`Review deleted successfully: ${review.id}`)

    revalidatePath(`/script/${review.scriptId}`)
    revalidatePath('/marketplace')
  },
  functionName: 'Delete Review Action',
  globalErrorMessage: 'Failed to delete review. Please try again.',
})

