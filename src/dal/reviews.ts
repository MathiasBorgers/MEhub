import 'server-only'
import {prismaClient} from './prismaClient'
import type {Review, Prisma} from '@/generated/prisma/client'

export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: {select: {id: true, username: true, avatar: true}},
    script: {select: {id: true, title: true}}
  }
}>

export async function getReviews(filters?: {
  scriptId?: string
  userId?: string
  minRating?: number
  limit?: number
  offset?: number
}): Promise<ReviewWithUser[]> {
  return prismaClient.review.findMany({
    where: {
      scriptId: filters?.scriptId,
      userId: filters?.userId,
      rating: filters?.minRating ? {gte: filters.minRating} : undefined,
    },
    include: {
      user: {select: {id: true, username: true, avatar: true}},
      script: {select: {id: true, title: true}},
    },
    take: filters?.limit || 20,
    skip: filters?.offset || 0,
    orderBy: {createdAt: 'desc'},
  })
}

export async function getReviewById(id: string): Promise<ReviewWithUser | null> {
  return prismaClient.review.findUnique({
    where: {id},
    include: {
      user: {select: {id: true, username: true, avatar: true}},
      script: {select: {id: true, title: true}},
    },
  })
}

export async function getReviewByUserAndScript(userId: string, scriptId: string): Promise<Review | null> {
  return prismaClient.review.findUnique({
    where: {
      userId_scriptId: {userId, scriptId},
    },
  })
}

export async function createReview(data: {
  rating: number
  comment: string | null
  userId: string
  scriptId: string
}): Promise<Review> {
  const review = await prismaClient.review.create({
    data,
  })

  // Update script average rating
  await updateScriptAverageRating(data.scriptId)

  return review
}

export async function updateReview(id: string, data: {rating?: number; comment?: string | null}): Promise<Review> {
  const review = await prismaClient.review.update({
    where: {id},
    data,
  })

  // Update script average rating
  await updateScriptAverageRating(review.scriptId)

  return review
}

export async function deleteReview(id: string): Promise<Review> {
  const review = await prismaClient.review.delete({
    where: {id},
  })

  // Update script average rating
  await updateScriptAverageRating(review.scriptId)

  return review
}

async function updateScriptAverageRating(scriptId: string): Promise<void> {
  const result = await prismaClient.review.aggregate({
    where: {scriptId},
    _avg: {rating: true},
    _count: true,
  })

  await prismaClient.script.update({
    where: {id: scriptId},
    data: {
      averageRating: result._avg.rating || 0,
      reviewCount: result._count,
    },
  })
}

