import 'server-only'
import {prismaClient} from './prismaClient'
import type {Category} from '@prisma/client'

export type CategoryWithScriptCount = Category & { scriptCount: number }

export async function getCategories(filters?: {search?: string; limit?: number; offset?: number}): Promise<Category[]> {
  return prismaClient.category.findMany({
    where: filters?.search ? {
      OR: [
        {name: {contains: filters.search, mode: 'insensitive'}},
        {description: {contains: filters.search, mode: 'insensitive'}},
      ],
    } : undefined,
    take: filters?.limit,
    skip: filters?.offset,
    orderBy: {createdAt: 'desc'},
  })
}

export async function getCategoriesWithScriptCount(filters?: {search?: string; limit?: number; offset?: number}): Promise<CategoryWithScriptCount[]> {
  const categories = await prismaClient.category.findMany({
    where: filters?.search ? {
      OR: [
        {name: {contains: filters.search, mode: 'insensitive'}},
        {description: {contains: filters.search, mode: 'insensitive'}},
      ],
    } : undefined,
    take: filters?.limit,
    skip: filters?.offset,
    orderBy: {createdAt: 'desc'},
    include: {
      _count: {
        select: { scripts: true }
      }
    }
  })

  return categories.map(cat => ({
    ...cat,
    scriptCount: cat._count.scripts
  }))
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return prismaClient.category.findUnique({
    where: {id},
  })
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return prismaClient.category.findUnique({
    where: {slug},
  })
}

export async function createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
  return prismaClient.category.create({
    data,
  })
}

export async function updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category> {
  return prismaClient.category.update({
    where: {id},
    data,
  })
}

export async function deleteCategory(id: string): Promise<Category> {
  return prismaClient.category.delete({
    where: {id},
  })
}

