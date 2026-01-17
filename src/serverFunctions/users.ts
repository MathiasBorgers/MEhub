/**
 * Het 'use server' directive wordt gebruikt om aan te geven dat de code in dit bestand enkel server actions bevat.
 * Server actions zijn asynchrone functies die enkel op de server uitgevoerd kunnen worden.
 * Een server action wordt automatisch geconverteerd naar HTTP endpoints door Next.js en kunnen dus aangeroepen worden
 * van op de client.
 *
 * Zodra het 'use server' directive toegevoegd wordt, mag het bestand enkel asynchrone functies exporteren.
 */
'use server'

import {revalidatePath} from 'next/cache'
import {
  createUser,
  getUserByEmail,
  startSession,
  stopSession,
  updateUser,
  updateUserRole,
  deleteUser,
} from '@/dal/users'
import {getSalt, hashOptions, verifyPassword, hashPassword} from '@/lib/passwordUtils'
import {clearSessionCookie, getSessionId, setSessionCookie} from '@/lib/sessionUtils'
import {protectedFormAction, protectedServerFunction, publicFormAction, publicServerFunction} from '@/lib/serverFunctions'
import {registerSchema, signInSchema, updateUserSchema, updateRoleSchema, deleteUserSchema, changePasswordSchema} from '@/schemas/userSchemas'
import {Role} from '@prisma/client'

export const registerAction = publicFormAction({
  schema: registerSchema,
  serverFn: async ({data: {passwordConfirmation: _, ...data}, logger}) => {
    // Voeg de default User role toe
    const userData = {
      ...data,
      role: 'User' as const,
      bio: '',
    }

    const user = await createUser(userData)
    logger.info(`New user created: ${user.id}`)

    const session = await startSession(user.id, user.role)
    logger.info(`New session started: ${session.id}, ends at ${session.activeUntil.toISOString()}`)

    await setSessionCookie(session)

    // Return success instead of redirect
    return {
      success: true,
    }
  },
  functionName: 'Register action',
  globalErrorMessage: "We couldn't create an account for you, please try again or log in with an existing account.",
})

export const signInAction = publicFormAction({
  schema: signInSchema,
  serverFn: async ({data, logger}) => {
    try {
      const user = await getUserByEmail(data.email)

      // Als we meteen een unauthorized terug geven nadat een gebruiker niet gevonden is in de database, kan een aanvaller
      // hieruit afleiden dat het e-mailadres niet bestaat.
      // Vervolgens kan de aanvaller overgaan naar andere email adressen, en moet deze geen tijd meer spenderen aan het adres
      // dat niet bestaat.
      // Als oplossing voegen we een alternatief wachtwoord toe dat gebruikt wordt als de gebruiker niet gevonden is in de
      // database.
      // Omdat we nu in alle gevallen een wachtwoord hashen, is het moeilijker om te bepalen of een e-mailadres bestaat of
      // niet op basis van de response tijd.
      const timingSafePassword = `${hashOptions.iterations}$${hashOptions.keyLength}$preventTimingBasedAttacks123$${getSalt()}`
      const isValidPassword = verifyPassword(user?.password ?? timingSafePassword, data.password)

      if (!isValidPassword) {
        logger.warn(`Failed sign in attempt for ${data.email}.`)
        return {
          success: false,
          errors: {
            errors: ['No account found with the given email/password combination.'],
          },
        }
      }

      logger.info(`Successful authentication request for ${user!.id}`)
      const session = await startSession(user!.id, user!.role)
      logger.info(`New session started: ${session.id}, ends at ${session.activeUntil.toISOString()}`)

      await setSessionCookie(session)

      // Return success instead of redirect - client will handle redirect
      return {
        success: true,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.info(`Sign in error for ${data.email}: ${errorMessage}`)
      throw error // Re-throw so the global error handler catches it
    }
  },
  functionName: 'Sign in action',
  globalErrorMessage: 'An error occurred during sign in. Please try again.',
})

/**
 * Pas de profielgegevens van de ingelogde gebruiker aan.
 *
 * @param _prevData De vorige data die ingestuurd werd naar de actie. We maken hier geen gebruik van, de parameter is
 * enkel aanwezig om de signatuur van de functie gelijkt te stellen met wat Next.js/React verwacht.
 * @param formData De data die ingestuurd werd naar de actie.
 */
export const updateProfileAction = protectedFormAction({
  schema: updateUserSchema,
  serverFn: async ({data, profile, logger}) => {
    // Het is belangrij dat het id van de gebruiker opgehaald wordt op basis van de sessie (via de backend) en niet
    // zomaar door de client ingevuld kan worden.
    // Als je de formuliergegevens die de client doorstuurt blindelings vertrouwd, kan een kwaadwillige gebruiker data van
    // andere gebruikers aanpassen.

    // Clean up empty strings to null for optional fields
    const updateData = {
      ...data,
      bio: data.bio || null,
      avatar: data.avatar || null,
      id: profile.id,
    }

    const updatedUser = await updateUser(updateData)

    logger.info(`User profile updated: ${updatedUser.id}, username: ${updatedUser.username}`)

    // Het profiel wordt gebruikt in de Navbar component, aangezien deze component op de homepagina staat moeten we
    // het root path van de applicatie revalideren.
    revalidatePath('/', 'layout')

    // Revalidate old and new profile pages
    revalidatePath(`/profile/${profile.username}`)
    if (data.username !== profile.username) {
      revalidatePath(`/profile/${data.username}`)
    }

    return {
      success: true,
      data: {
        username: updatedUser.username,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      },
    }
  },
  functionName: 'Update profile action',
})

/**
 * Change password (User can change own password)
 */
export const changePasswordAction = protectedFormAction({
  schema: changePasswordSchema,
  serverFn: async ({data, profile, logger}) => {
    const {currentPassword, newPassword} = data

    const user = await getUserByEmail(profile.email)

    if (!user) {
      logger.warn(`User not found for password change: ${profile.email}`)
      return {
        success: false,
        errors: {
          errors: ['User not found.'],
        },
      }
    }

    // Verify current password
    const isValidPassword = verifyPassword(user.password, currentPassword)

    if (!isValidPassword) {
      logger.warn(`Invalid current password for user: ${profile.id}`)
      return {
        success: false,
        errors: {
          errors: ['Current password is incorrect.'],
        },
      }
    }

    // Update password
    const hashedPassword = hashPassword(newPassword)
    await updateUser({
      id: profile.id,
      password: hashedPassword,
    })

    logger.info(`Password changed successfully for user: ${profile.id}`)

    return {
      success: true,
    }
  },
  functionName: 'Change password action',
})

/**
 * Log uit en redirect naar de homepagina.
 */
export const signOutServerFunction = publicServerFunction({
  serverFn: async ({logger}) => {
    // Use public function to avoid session validation errors during logout
    // We manually get the session ID and clear it
    const sessionId = await getSessionId()

    if (sessionId) {
      await stopSession(sessionId)
      logger.info(`Session stopped: ${sessionId}.`)
      await clearSessionCookie()
    } else {
      logger.info('Sign out called but no session found')
    }

    // No redirect here - let client handle navigation after successful logout
  },
  functionName: 'Sign out action',
})

/**
 * Update a user's role (Admin only)
 */
export const updateUserRoleAction = protectedFormAction({
  schema: updateRoleSchema,
  requiredRoles: [Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    const {id, role} = data
    logger.info(`Admin ${profile.username} updating role for user: ${id} to ${role}`)

    const user = await updateUserRole(id, role)
    logger.info(`User role updated successfully: ${user.id}`)

    revalidatePath('/admin/users')
    revalidatePath(`/profile/${user.username}`)

    return {
      success: true,
      data: {userId: user.id},
    }
  },
  functionName: 'Update User Role Action',
  globalErrorMessage: 'Failed to update user role. Please try again.',
})

/**
 * Delete a user (Admin only)
 */
export const deleteUserAction = protectedServerFunction({
  schema: deleteUserSchema,
  requiredRoles: [Role.Admin],
  serverFn: async ({data, logger, profile}) => {
    logger.info(`Admin ${profile.username} deleting user: ${data.id}`)

    // Prevent admin from deleting themselves
    if (data.id === profile.id) {
      logger.warn(`Admin ${profile.username} tried to delete themselves`)
      throw new Error('You cannot delete your own account')
    }

    const user = await deleteUser(data.id)
    logger.info(`User deleted successfully: ${user.id}`)

    revalidatePath('/admin/users')
  },
  functionName: 'Delete User Action',
  globalErrorMessage: 'Failed to delete user. Please try again.',
})

