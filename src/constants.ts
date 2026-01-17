import {Role} from '@prisma/client'

export const SessionDuration = {
  [Role.User]: 1000 * 60 * 60 * 24, // 24 uur
  [Role.Developer]: 1000 * 60 * 60 * 24 * 7, // 7 dagen
  [Role.Admin]: 1000 * 60 * 60 * 24 * 30, // 30 dagen
} satisfies Record<Role, number>
