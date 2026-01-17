import type {PrismaClient} from '@/generated/prisma/client'
import {Role} from '@/generated/prisma/enums'
import {hashPassword} from '../src/lib/passwordUtils'

export const seedProd = async (prisma: PrismaClient) => {
  console.log('Starting production seed...')

  // Create minimal data for production
  await prisma.user.create({
    data: {
      email: 'admin@mehub.com',
      username: 'admin',
      password: hashPassword('SecureAdmin2024!'),
      role: Role.Admin,
      bio: 'MEhub platform administrator',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
    }
  })

  // Create categories matching the about page
  await Promise.all([
    prisma.category.create({
      data: {
        name: 'Combat',
        slug: 'combat',
        description: 'Revolution++, Legacy, manual combat automation',
        icon: 'Sword',
        color: '#dc2626'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Skilling',
        slug: 'skilling',
        description: 'Mining, smithing, archaeology, divination & more',
        icon: 'Hammer',
        color: '#16a34a'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Farming',
        slug: 'farming',
        description: 'Player-owned farm, herb runs, tree runs',
        icon: 'Sprout',
        color: '#22c55e'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Bossing',
        slug: 'bossing',
        description: 'Araxxor, Telos, Raksha, ED1/2/3, Arch-Glacor',
        icon: 'Skull',
        color: '#dc2626'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Slayer',
        slug: 'slayer',
        description: 'Task automation and efficient monster farming',
        icon: 'Target',
        color: '#ef4444'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Money Making',
        slug: 'money-making',
        description: 'PVM methods, skilling-based income',
        icon: 'DollarSign',
        color: '#ca8a04'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Dungeoneering',
        slug: 'dungeoneering',
        description: 'Token farming and efficient floor rushing',
        icon: 'Castle',
        color: '#7c3aed'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Minigames',
        slug: 'minigames',
        description: 'Cabbage Facepunch, Shattered Worlds & others',
        icon: 'Gamepad2',
        color: '#3b82f6'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Utilities',
        slug: 'utilities',
        description: 'Banking, presets, invention helpers',
        icon: 'Settings',
        color: '#6b7280'
      }
    })
  ])

  // Create meaningful tags for RS3 scripts
  await Promise.all([
    prisma.tag.create({ data: { name: 'AFK', color: '#10b981' }}),
    prisma.tag.create({ data: { name: 'Beginner Friendly', color: '#3b82f6' }}),
    prisma.tag.create({ data: { name: 'Profitable', color: '#eab308' }}),
    prisma.tag.create({ data: { name: 'Fast XP', color: '#f59e0b' }}),
    prisma.tag.create({ data: { name: 'High Level', color: '#dc2626' }}),
    prisma.tag.create({ data: { name: 'PvM', color: '#ef4444' }}),
    prisma.tag.create({ data: { name: 'Banking', color: '#8b5cf6' }}),
    prisma.tag.create({ data: { name: 'Combat', color: '#dc2626' }}),
    prisma.tag.create({ data: { name: 'Bossing', color: '#b91c1c' }}),
    prisma.tag.create({ data: { name: 'Anti-Ban', color: '#10b981' }})
  ])

  console.log('Production seed completed successfully!')
}
