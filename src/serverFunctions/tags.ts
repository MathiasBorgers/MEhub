/**
 * Create a new tag (Admin only)
 */
'use server'

import {revalidatePath} from 'next/cache'
import {
  getTagById,
  getTagByName,
  createTag as createTagDal,
  updateTag as updateTagDal,
  deleteTag as deleteTagDal,
} from '@/dal/tags'
import {protectedFormAction, protectedServerFunction} from '@/lib/serverFunctions'
import {createTagSchema, updateTagSchema} from '@/schemas/tagSchemas'
import {Role} from '@prisma/client'

export const createTagAction = protectedFormAction({
  schema: createTagSchema,
  requiredRoles: [Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    logger.info(`Admin ${profile.username} creating new tag: ${data.name}`)

    // Check if tag already exists
    const existing = await getTagByName(data.name)
    if (existing) {
      logger.warn(`Tag already exists: ${data.name}`)
      return {
        success: false,
        errors: {errors: ['A tag with this name already exists']},
      }
    }

    const tag = await createTagDal(data)
    logger.info(`Tag created successfully: ${tag.id}`)

    revalidatePath('/admin/tags')
    revalidatePath('/upload')

    return {
      success: true,
      data: {tagId: tag.id},
    }
  },
  functionName: 'Create Tag Action',
  globalErrorMessage: 'Failed to create tag. Please try again.',
})

/**
 * Update an existing tag (Admin only)
 */
export const updateTagAction = protectedFormAction({
  schema: updateTagSchema,
  requiredRoles: [Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    const {id, ...updateData} = data
    logger.info(`Admin ${profile.username} updating tag: ${id}`)

    // Check if tag exists
    const existing = await getTagById(id)
    if (!existing) {
      logger.warn(`Tag not found: ${id}`)
      return {
        success: false,
        errors: {errors: ['Tag not found']},
      }
    }

    const tag = await updateTagDal(id, updateData)
    logger.info(`Tag updated successfully: ${tag.id}`)

    revalidatePath('/admin/tags')
    revalidatePath('/marketplace')

    return {
      success: true,
      data: {tagId: tag.id},
    }
  },
  functionName: 'Update Tag Action',
  globalErrorMessage: 'Failed to update tag. Please try again.',
})

/**
 * Delete a tag (Admin only)
 */
export const deleteTagAction = protectedServerFunction({
  schema: updateTagSchema.pick({id: true}),
  requiredRoles: [Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    logger.info(`Admin ${profile.username} deleting tag: ${data.id}`)

    const tag = await deleteTagDal(data.id)
    logger.info(`Tag deleted successfully: ${tag.id}`)

    revalidatePath('/admin/tags')
    revalidatePath('/marketplace')
  },
  functionName: 'Delete Tag Action',
  globalErrorMessage: 'Failed to delete tag. This tag might be in use by scripts.',
})
/**
 * Server actions voor Tag CRUD operaties
 * Admin users kunnen tags beheren
 * Developers kunnen tags gebruiken voor hun scripts
 */






