/**
 * Server actions voor Category CRUD operaties
 * Alleen Admin gebruikers kunnen categories aanmaken, updaten en verwijderen
 */
'use server'

import {revalidatePath} from 'next/cache'
import {
  getCategoryById,
  createCategory as createCategoryDal,
  updateCategory as updateCategoryDal,
  deleteCategory as deleteCategoryDal,
} from '@/dal/categories'
import {protectedFormAction, protectedServerFunction} from '@/lib/serverFunctions'
import {createCategorySchema, updateCategorySchema} from '@/schemas/categorySchemas'
import {Role} from '@prisma/client'

/**
 * Create a new category (Admin only)
 */
export const createCategoryAction = protectedFormAction({
  schema: createCategorySchema,
  requiredRoles: [Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    logger.info(`Admin ${profile.username} creating new category: ${data.name}`)

    const category = await createCategoryDal(data)
    logger.info(`Category created successfully: ${category.id}`)

    revalidatePath('/categories')
    revalidatePath('/admin/categories')

    return {
      success: true,
      data: {categoryId: category.id},
    }
  },
  functionName: 'Create Category Action',
  globalErrorMessage: 'Failed to create category. Please try again.',
})

/**
 * Update an existing category (Admin only)
 */
export const updateCategoryAction = protectedFormAction({
  schema: updateCategorySchema,
  requiredRoles: [Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    const {id, ...updateData} = data
    logger.info(`Admin ${profile.username} updating category: ${id}`)

    // Check if category exists
    const existing = await getCategoryById(id)
    if (!existing) {
      logger.warn(`Category not found: ${id}`)
      return {
        success: false,
        errors: {errors: ['Category not found']},
      }
    }

    const category = await updateCategoryDal(id, updateData)
    logger.info(`Category updated successfully: ${category.id}`)

    revalidatePath('/categories')
    revalidatePath(`/categories/${category.slug}`)
    revalidatePath('/admin/categories')

    return {
      success: true,
      data: {categoryId: category.id},
    }
  },
  functionName: 'Update Category Action',
  globalErrorMessage: 'Failed to update category. Please try again.',
})

/**
 * Delete a category (Admin only)
 */
export const deleteCategoryAction = protectedServerFunction({
  schema: updateCategorySchema.pick({id: true}),
  requiredRoles: [Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    logger.info(`Admin ${profile.username} deleting category: ${data.id}`)

    const category = await deleteCategoryDal(data.id)
    logger.info(`Category deleted successfully: ${category.id}`)

    revalidatePath('/categories')
    revalidatePath('/admin/categories')
  },
  functionName: 'Delete Category Action',
  globalErrorMessage: 'Failed to delete category. This category might be in use by scripts.',
})

