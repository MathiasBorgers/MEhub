import type {PrismaClient} from '@/generated/prisma/client'
import {Role} from '@/generated/prisma/enums'
import {hashPassword} from '../src/lib/passwordUtils'

export const seedDev = async (prisma: PrismaClient) => {
  console.log('Starting development seed...')

  // Create users with different roles
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@mehub.com',
        username: 'admin',
        password: hashPassword('admin123'),
        role: Role.Admin,
        bio: 'MEhub platform administrator',
        verified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      }
    }),
    prisma.user.create({
      data: {
        email: 'developer@mehub.com',
        username: 'scriptmaster',
        password: hashPassword('dev123'),
        role: Role.Developer,
        bio: 'Experienced RuneScape 3 script developer. Creating quality automation scripts since 2020.',
        verified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev1'
      }
    }),
    prisma.user.create({
      data: {
        email: 'developer2@mehub.com',
        username: 'automate_pro',
        password: hashPassword('dev123'),
        role: Role.Developer,
        bio: 'Professional script developer specializing in combat and skilling scripts.',
        verified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev2'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user@mehub.com',
        username: 'gamer123',
        password: hashPassword('user123'),
        role: Role.User,
        bio: 'Casual RS3 player looking for efficient scripts',
        verified: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1'
      }
    }),
    ...Array.from({length: 6}, (_, i) => prisma.user.create({
      data: {
        email: `user${i + 2}@mehub.com`,
        username: `player${i + 2}`,
        password: hashPassword('user123'),
        role: Role.User,
        bio: `RS3 player #${i + 2}`,
        verified: Math.random() > 0.5,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 2}`
      }
    }))
  ])

  console.log(`Created ${users.length} users`)

  // Create categories
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
        name: 'Questing',
        slug: 'questing',
        description: 'Quest completion automation',
        icon: 'Map',
        color: '#2563eb'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Money Making',
        slug: 'money-making',
        description: 'GP farming and money making scripts',
        icon: 'DollarSign',
        color: '#ca8a04'
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
    }),
    ...Array.from({length: 5}, (_, i) => prisma.category.create({
      data: {
        name: `Category ${i + 6}`,
        slug: `category-${i + 6}`,
        description: `Additional category ${i + 6} for testing`,
        icon: 'Box',
        color: '#6b7280'
      }
    }))
  ])

  console.log(`Created ${categories.length} categories`)

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'AFK', color: '#10b981' }}),
    prisma.tag.create({ data: { name: 'Fast XP', color: '#f59e0b' }}),
    prisma.tag.create({ data: { name: 'Profitable', color: '#eab308' }}),
    prisma.tag.create({ data: { name: 'Beginner Friendly', color: '#3b82f6' }}),
    prisma.tag.create({ data: { name: 'High Level', color: '#dc2626' }}),
    prisma.tag.create({ data: { name: 'PvM', color: '#ef4444' }}),
    prisma.tag.create({ data: { name: 'Skilling', color: '#22c55e' }}),
    prisma.tag.create({ data: { name: 'Safe Spot', color: '#06b6d4' }}),
    prisma.tag.create({ data: { name: 'Banking', color: '#8b5cf6' }}),
    prisma.tag.create({ data: { name: 'Free to Play', color: '#f97316' }}),
    ...Array.from({length: 10}, (_, i) => prisma.tag.create({
      data: { 
        name: `Tag ${i + 11}`,
        color: '#6b7280'
      }
    }))
  ])

  console.log(`Created ${tags.length} tags`)

  // Create scripts
  const scripts = await Promise.all([
    prisma.script.create({
      data: {
        title: 'Ultimate Combat Trainer',
        description: 'Advanced combat training script with multiple monster support and banking.',
        fullDescription: `This comprehensive combat script offers:
        
• Multi-monster support (Goblins, Cows, Guards, etc.)
• Intelligent banking and resupply
• Food and potion management  
• Safe-spotting capabilities
• Experience tracking
• Anti-ban features
• Customizable combat styles

Perfect for training all combat skills efficiently while staying safe. Supports both F2P and P2P monsters.`,
        version: '2.1.4',
        downloads: 15420,
        averageRating: 4.6,
        reviewCount: 127,
        authorId: users[1].id, // scriptmaster
        categoryId: categories[0].id, // Combat
        requirements: ['Java 8+', 'RuneMate Client', 'Combat level 20+'],
        features: ['Multi-monster support', 'Banking', 'Food management', 'Experience tracking'],
        screenshots: [
          'https://example.com/screenshots/combat1.png',
          'https://example.com/screenshots/combat2.png'
        ],
        isActive: true
      }
    }),
    prisma.script.create({
      data: {
        title: 'AFK Fishing Master',
        description: 'Fully AFK fishing script supporting all fishing spots and methods.',
        fullDescription: `The ultimate AFK fishing solution:

• All fishing spots supported
• Barbarian fishing included
• Drop/bank options
• Power fishing modes
• Cooking integration
• Anti-ban randomization
• Profit calculation

Set it and forget it! This script handles everything from lobsters to sharks.`,
        version: '1.8.2',
        downloads: 8934,
        averageRating: 4.3,
        reviewCount: 89,
        authorId: users[1].id, // scriptmaster
        categoryId: categories[1].id, // Skilling
        requirements: ['Fishing level 1+', 'Access to fishing spots'],
        features: ['AFK fishing', 'Banking support', 'Multiple fish types', 'Cooking integration'],
        screenshots: [
          'https://example.com/screenshots/fishing1.png'
        ],
        isActive: true
      }
    }),
    ...Array.from({length: 8}, (_, i) => prisma.script.create({
      data: {
        title: `Script ${i + 3}`,
        description: `Description for script ${i + 3}`,
        fullDescription: `Full description for script ${i + 3}. This is a longer description explaining what the script does in detail.`,
        version: '1.0.0',
        downloads: Math.floor(Math.random() * 5000),
        averageRating: 3 + Math.random() * 2,
        reviewCount: Math.floor(Math.random() * 50),
        authorId: users[Math.floor(Math.random() * 3) + 1].id,
        categoryId: categories[Math.floor(Math.random() * categories.length)].id,
        requirements: ['Basic requirements'],
        features: [`Feature ${i + 1}`, `Feature ${i + 2}`],
        screenshots: [],
        isActive: true
      }
    }))
  ])

  console.log(`Created ${scripts.length} scripts`)

  // Create script-tag relationships
  const scriptTags = []
  for (const script of scripts) {
    // Add 2-4 random tags to each script
    const numTags = 2 + Math.floor(Math.random() * 3)
    const scriptTagIds = new Set<string>()
    
    while (scriptTagIds.size < numTags) {
      const randomTag = tags[Math.floor(Math.random() * tags.length)]
      scriptTagIds.add(randomTag.id)
    }
    
    for (const tagId of scriptTagIds) {
      scriptTags.push(prisma.scriptTag.create({
        data: {
          scriptId: script.id,
          tagId: tagId
        }
      }))
    }
  }
  
  await Promise.all(scriptTags)
  console.log(`Created ${scriptTags.length} script-tag relationships`)

  // Create files for scripts
  const files = []
  for (const script of scripts) {
    files.push(
      prisma.file.create({
        data: {
          name: `${script.title.replace(/\s+/g, '_')}.java`,
          size: BigInt(Math.floor(Math.random() * 50000) + 10000),
          type: 'application/java',
          url: `/files/${script.id}/${script.title.replace(/\s+/g, '_')}.java`,
          scriptId: script.id
        }
      }),
      prisma.file.create({
        data: {
          name: 'README.md',
          size: BigInt(Math.floor(Math.random() * 5000) + 1000),
          type: 'text/markdown',
          url: `/files/${script.id}/README.md`,
          scriptId: script.id
        }
      })
    )
  }
  
  await Promise.all(files)
  console.log(`Created ${files.length} files`)

  // Create reviews
  const reviews = []
  for (const script of scripts.slice(0, 5)) { // Only for first 5 scripts
    for (let j = 0; j < Math.min(script.reviewCount, users.length - 1); j++) {
      const reviewer = users[j + 3] // Skip the authors
      if (reviewer) {
        reviews.push(prisma.review.create({
          data: {
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars mostly
            comment: `Great script! Really helpful for ${script.title.toLowerCase()}. ${Math.random() > 0.5 ? 'Highly recommended!' : 'Works perfectly.'}`,
            userId: reviewer.id,
            scriptId: script.id
          }
        }))
      }
    }
  }
  
  await Promise.all(reviews)
  console.log(`Created ${reviews.length} reviews`)

  // Create downloads
  const downloads = []
  for (const script of scripts) {
    // Create random downloads from users
    const numDownloads = Math.min(script.downloads, users.length - 1)
    for (let j = 0; j < Math.min(numDownloads, 20); j++) { // Limit to prevent too many
      const downloader = users[j % (users.length - 1) + 1] // Skip author
      downloads.push(prisma.download.create({
        data: {
          userId: downloader.id,
          scriptId: script.id,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }))
    }
  }
  
  const downloadResults = await Promise.allSettled(downloads)
  const successfulDownloads = downloadResults.filter(result => result.status === 'fulfilled').length
  console.log(`Created ${successfulDownloads} downloads`)

  console.log('Development seed completed successfully!')
}
