import 'server-only'
import {prismaClient} from './prismaClient'
import type {Prisma, Role, User, Session} from '@/generated/prisma/client'
import {cache} from 'react'
import {hashPassword} from '@/lib/passwordUtils'
import type {Profile, SessionWithProfile} from '@/models/users'
import {profileOmit, sessionWithProfileInclude} from '@/models/users'
import {SessionDuration} from '@/constants'

export type CreateUserParams = Prisma.UserCreateInput

/**
 * Create a new user with the "User" role.
 *
 * @param data The user's profile data.
 */
export async function createUser(data: CreateUserParams): Promise<Profile> {
  return prismaClient.user.create({
    data: {
      ...data,
      password: hashPassword(data.password),
    },
    omit: profileOmit,
  })
}

/**
 * Retrieve a user's information based on their email.
 * DO NOT USE ON THE CLIENT, the response includes the user's hashed password.
 *
 * @param email The email of the user to retrieve.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return prismaClient.user.findFirst({where: {email}})
}

/**
 * Retrieve a user's profile based on their id.
 *
 * @param id The id of the user to retrieve.
 */
export async function getUserById(id: string): Promise<Profile | null> {
  return prismaClient.user.findUnique({
    where: {id},
    omit: profileOmit,
  })
}

/**
 * Retrieve a user's profile based on their username.
 *
 * @param username The username of the user to retrieve.
 */
export async function getUserByUsername(username: string): Promise<Profile | null> {
  return prismaClient.user.findUnique({
    where: {username},
    omit: profileOmit,
  })
}

/**
 * Start a new session.
 *
 * @param userId The id of the user for whom to start a new session.
 * @param role The role of the user for whom to start the session.
 */
export async function startSession(userId: string, role: Role): Promise<SessionWithProfile> {
  return prismaClient.session.create({
    data: {
      userId,
      activeUntil: new Date(Date.now() + SessionDuration[role]),
    },
    include: sessionWithProfileInclude,
  })
}

/**
 * Retrieve a specific session and the corresponding session.
 *
 * @param id The id of the session to retrieve.
 */
export const getSessionProfile = cache((id: string): Promise<SessionWithProfile | null> => {
  return prismaClient.session.findUnique({
    where: {
      id,
      activeUntil: {
        gt: new Date(),
      },
    },
    include: sessionWithProfileInclude,
  })
})

/**
 * Stop a given session by deleting it.
 *
 * @param id The id of the session to stop.
 */
export async function stopSession(id: string): Promise<void> {
  // Delete the session instead of updating - use deleteMany to avoid errors if it doesn't exist
  await prismaClient.session.deleteMany({
    where: {id},
  })
}

export type UpdateUserParams = Prisma.UserUpdateInput & {id: string}

/**
 * Update a user's profile.
 *
 * @param id The id of the user to update.
 * @param data The updated profile data.
 */
export async function updateUser({id, ...data}: UpdateUserParams): Promise<Profile> {
  return prismaClient.user.update({
    where: {id},
    data: {
      ...data,
    },
    omit: profileOmit,
  })
}

/**
 * Update a user's role (Admin only).
 *
 * @param id The id of the user to update.
 * @param role The new role for the user.
 */
export async function updateUserRole(id: string, role: Role): Promise<Profile> {
  return prismaClient.user.update({
    where: {id},
    data: {role},
    omit: profileOmit,
  })
}

/**
 * Delete a user and all associated data (Admin only).
 *
 * @param id The id of the user to delete.
 */
export async function deleteUser(id: string): Promise<Profile> {
  return prismaClient.user.delete({
    where: {id},
    omit: profileOmit,
  })
}

/**
 * Get all sessions for a user (Admin only)
 */
export async function getSessions(filters?: {
  userId?: string
  activeOnly?: boolean
  limit?: number
  offset?: number
}): Promise<SessionWithProfile[]> {
  return prismaClient.session.findMany({
    where: {
      userId: filters?.userId,
      activeUntil: filters?.activeOnly ? {gt: new Date()} : undefined,
    },
    include: sessionWithProfileInclude,
    take: filters?.limit || 20,
    skip: filters?.offset || 0,
    orderBy: {activeFrom: 'desc'},
  })
}

/**
 * Get a session by ID (Admin only)
 */
export async function getSessionById(id: string): Promise<SessionWithProfile | null> {
  return prismaClient.session.findUnique({
    where: {id},
    include: sessionWithProfileInclude,
  })
}

/**
 * Delete a session (revoke)
 */
export async function deleteSession(id: string): Promise<Session> {
  return prismaClient.session.delete({
    where: {id},
  })
}

/**
 * Extend the given session so that is remains active for another 24 hours.
 *
 * @param id The id of the session to extend.
 * @param role The role of the user for whom to start the session.
 */
export async function extendSession(id: string, role: Role): Promise<SessionWithProfile | null> {
  try {
    return await prismaClient.session.update({
      where: {id},
      data: {
        activeUntil: new Date(Date.now() + SessionDuration[role]),
      },
      include: sessionWithProfileInclude,
    })
  } catch (_error) {
    // Session no longer exists in database
    return null
  }
}
