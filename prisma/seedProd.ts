import type {PrismaClient} from '@/generated/prisma/client'
import {Role} from '@/generated/prisma/enums'
import {hashPassword} from '../src/lib/passwordUtils'

export const seedProd = async (prisma: PrismaClient) => {
  console.log('Starting production seed...')

  // Create minimal data for production
  const admin = await prisma.user.create({
    data: {
      email: 'admin@mehub.com',
      username: 'admin',
      password: hashPassword('SecureAdmin2024!'),
      role: Role.Admin,
      bio: 'MEhub platform administrator',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    }
  })

  // Create basic categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Combat',
        slug: 'combat',
        description: 'Combat and PvM automation scripts',
        icon: 'Sword',
        color: '#dc2626'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Skilling',
        slug: 'skilling',
        description: 'Skill training automation scripts',
        icon: 'Hammer',
        color: '#16a34a'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Utilities',
        slug: 'utilities',
        description: 'Helper scripts and utilities',
        icon: 'Settings',
        color: '#7c3aed'
      }
    })
  ])

  // Create basic tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'AFK', color: '#10b981' }}),
    prisma.tag.create({ data: { name: 'Beginner Friendly', color: '#3b82f6' }}),
    prisma.tag.create({ data: { name: 'Profitable', color: '#eab308' }})
  ])

  console.log('Production seed completed successfully!')
}
