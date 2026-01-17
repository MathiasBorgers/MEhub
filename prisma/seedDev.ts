import type {PrismaClient} from '@/generated/prisma/client'
import {Role} from '@/generated/prisma/enums'
import {hashPassword} from '../src/lib/passwordUtils'

// Helper function to generate generic Lua content
const generateLuaContent = (title: string, version: string, description: string, features: string[]) => {
  return `-- ${title}
-- Version: ${version}
-- ${description}

local API = require("api")

-- Configuration
local CONFIG = {
    maxRunTime = 180, -- minutes
    checkInterval = 1000
}

-- Statistics
local stats = {
    startTime = os.time(),
    actionsPerformed = 0,
    itemsProcessed = 0
}

-- Features:
${features.map(f => `-- • ${f}`).join('\n')}

-- Helper functions
function printStats()
    local elapsed = (os.time() - stats.startTime) / 60
    print("=== ${title} Stats ===")
    print("Actions performed: " .. stats.actionsPerformed)
    print("Items processed: " .. stats.itemsProcessed)
    print("Runtime: " .. math.floor(elapsed) .. " minutes")
end

function checkRuntime()
    local elapsed = (os.time() - stats.startTime) / 60
    if elapsed >= CONFIG.maxRunTime then
        print("Max runtime reached. Stopping...")
        return false
    end
    return true
end

-- Main loop
print("Starting ${title}...")
print("Version: ${version}")

while API.Read_LoopyLoop() and checkRuntime() do
    -- Main script logic here
    stats.actionsPerformed = stats.actionsPerformed + 1
    
    -- Print stats periodically
    if math.random(1, 100) <= 2 then
        printStats()
    end
    
    API.RandomSleep2(CONFIG.checkInterval, 200, 500)
end

printStats()
print("Script stopped!")
`
}

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
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      }
    }),
    prisma.user.create({
      data: {
        email: 'developer@mehub.com',
        username: 'scriptmaster',
        password: hashPassword('developer123'),
        role: Role.Developer,
        bio: 'Experienced RuneScape 3 script developer. Creating quality automation scripts since 2020.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev1'
      }
    }),
    prisma.user.create({
      data: {
        email: 'developer2@mehub.com',
        username: 'automate_pro',
        password: hashPassword('developer123'),
        role: Role.Developer,
        bio: 'Professional script developer specializing in combat and skilling scripts.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev2'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user@mehub.com',
        username: 'gamer123',
        password: hashPassword('password123'),
        role: Role.User,
        bio: 'Casual RS3 player looking for efficient scripts',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1'
      }
    }),
    ...Array.from({length: 6}, (_, i) => prisma.user.create({
      data: {
        email: `user${i + 2}@mehub.com`,
        username: `player${i + 2}`,
        password: hashPassword('password123'),
        role: Role.User,
        bio: `RS3 player #${i + 2}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 2}`
      }
    }))
  ])

  console.log(`Created ${users.length} users`)

  // Create categories matching the about page
  const categories = await Promise.all([
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

  console.log(`Created ${categories.length} categories`)

  // Create meaningful tags for RS3 scripts
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
    prisma.tag.create({ data: { name: 'Combat', color: '#dc2626' }}),
    prisma.tag.create({ data: { name: 'Bossing', color: '#b91c1c' }}),
    prisma.tag.create({ data: { name: 'Automation', color: '#6366f1' }}),
    prisma.tag.create({ data: { name: 'World Hopping', color: '#ec4899' }}),
    prisma.tag.create({ data: { name: 'Anti-Ban', color: '#10b981' }}),
    prisma.tag.create({ data: { name: 'GUI', color: '#a855f7' }}),
    prisma.tag.create({ data: { name: 'Quest Helper', color: '#3b82f6' }}),
    prisma.tag.create({ data: { name: 'Dungeoneering', color: '#7c3aed' }}),
    prisma.tag.create({ data: { name: 'Minigame', color: '#2563eb' }}),
    prisma.tag.create({ data: { name: 'Resource Gathering', color: '#059669' }})
  ])

  console.log(`Created ${tags.length} tags`)

  // Create scripts based on real Lua examples
  const scripts = await Promise.all([
    prisma.script.create({
      data: {
        title: 'Croesus Hunter',
        description: 'Automated Croesus boss hunting script with resource gathering and statue repair.',
        fullDescription: `Advanced Croesus boss automation:
        
• Automatic resource gathering (Hunter nodes)
• Fungal algae collection
• Statue repair automation
• Energy management
• Multi-room support
• Performance tracking
• Smart pathfinding

Perfect for farming Croesus with minimal interaction. Handles all phases of the encounter automatically.`,
        version: '1.0.0',
        downloads: 3420,
        averageRating: 4.7,
        reviewCount: 38,
        authorId: users[1].id, // scriptmaster
        categoryId: categories[3].id, // Bossing
        requirements: ['Hunter level 60+', 'Access to Croesus'],
        features: ['Resource gathering', 'Statue repair', 'Energy management', 'Performance tracking'],
        screenshots: [
          '/rs3-croesus-team-fight-showing-multiple-players-an.jpg',
          '/runescape-3-croesus-boss-arena-with-wooden-crates-.jpg'
        ],
        isActive: true,
        luaContent: `-- Croesus Hunter Script
-- Version: 1.0.0
-- Author: scriptmaster

local API = require("api")

-- Configuration
local CONFIG = {
    huntingNode = "Hunter Node",
    statue = "Croesus Statue",
    energyThreshold = 30,
    maxRunTime = 180 -- minutes
}

-- State tracking
local state = {
    startTime = os.time(),
    resourcesGathered = 0,
    statuesRepaired = 0
}

-- Main loop
function mainLoop()
    if not API.Read_LoopyLoop() then
        return false
    end
    
    -- Check energy level
    local energy = API.GetEnergy()
    if energy < CONFIG.energyThreshold then
        API.DoAction_Object1(0x29, API.OFF_ACT_GeneralObject_route0, {"Rest"}, 50)
        API.RandomSleep2(2000, 1000, 1500)
        return true
    end
    
    -- Gather resources
    if not API.InvFull_() then
        API.DoAction_Object1(0x29, API.OFF_ACT_GeneralObject_route0, {CONFIG.huntingNode}, 50)
        API.RandomSleep2(3000, 1000, 2000)
        state.resourcesGathered = state.resourcesGathered + 1
    else
        -- Repair statue
        API.DoAction_Object1(0x29, API.OFF_ACT_GeneralObject_route0, {CONFIG.statue}, 50)
        API.RandomSleep2(2000, 500, 1000)
        state.statuesRepaired = state.statuesRepaired + 1
    end
    
    -- Check runtime
    local elapsed = (os.time() - state.startTime) / 60
    if elapsed >= CONFIG.maxRunTime then
        print("Max runtime reached. Stopping...")
        return false
    end
    
    return true
end

-- Start script
print("Starting Croesus Hunter...")
print("Max runtime: " .. CONFIG.maxRunTime .. " minutes")

while mainLoop() do
    API.RandomSleep2(100, 50, 100)
end

-- Print statistics
print("Script finished!")
print("Resources gathered: " .. state.resourcesGathered)
print("Statues repaired: " .. state.statuesRepaired)
print("Runtime: " .. math.floor((os.time() - state.startTime) / 60) .. " minutes")
`
      }
    }),
    prisma.script.create({
      data: {
        title: 'UmFisher',
        description: 'Complete fishing automation with multiple fishing spot support and banking.',
        fullDescription: `Professional fishing automation:

• All fishing spots supported
• Automatic banking
• Drop/bank modes
• Multiple fishing methods
• Anti-AFK detection
• Progress tracking
• Profit calculator

Efficient fishing script that handles everything from basic spots to advanced fishing methods.`,
        version: '1.2.0',
        downloads: 5834,
        averageRating: 4.4,
        reviewCount: 67,
        authorId: users[1].id, // scriptmaster
        categoryId: categories[1].id, // Skilling
        requirements: ['Fishing level 1+', 'Access to fishing spots'],
        features: ['Auto banking', 'Multiple spots', 'Progress tracking', 'Profit calculation'],
        screenshots: [],
        isActive: true,
        luaContent: `-- UmFisher - Advanced Fishing Script
-- Version: 1.2.0
-- Author: scriptmaster

local API = require("api")

-- Configuration
local CONFIG = {
    fishingSpot = "Fishing spot",
    bankChest = "Bank chest",
    dropMode = false,
    fishToKeep = {"Raw lobster", "Raw swordfish", "Raw shark"}
}

-- Statistics
local stats = {
    fishCaught = 0,
    bankTrips = 0,
    startTime = os.time(),
    startExp = API.GetSkillXP("FISHING")
}

-- Helper functions
function isFishing()
    return API.ReadPlayerAnim() == 622 or API.ReadPlayerAnim() == 623
end

function isInventoryFull()
    return API.InvFull_()
end

function bankItems()
    print("Banking items...")
    
    -- Walk to bank
    API.DoAction_Object1(0x5, API.OFF_ACT_GeneralObject_route0, {CONFIG.bankChest}, 50)
    API.WaitUntilMovingEnds()
    
    -- Open bank
    API.DoAction_Object1(0x2e, API.OFF_ACT_GeneralObject_route0, {CONFIG.bankChest}, 50)
    API.RandomSleep2(2000, 500, 1000)
    
    -- Deposit all
    API.DoAction_Interface(0xffffffff, 0xffffffff, 1, 517, 39, -1, API.OFF_ACT_GeneralInterface_route)
    API.RandomSleep2(1000, 300, 500)
    
    stats.bankTrips = stats.bankTrips + 1
end

function startFishing()
    if not isFishing() then
        API.DoAction_NPC(0x29, API.OFF_ACT_InteractNPC_route, {CONFIG.fishingSpot}, 50)
        API.RandomSleep2(2000, 500, 1000)
    end
end

function printStats()
    local elapsed = (os.time() - stats.startTime) / 3600
    local expGained = API.GetSkillXP("FISHING") - stats.startExp
    local expPerHour = math.floor(expGained / elapsed)
    
    print("=== Fishing Stats ===")
    print("Fish caught: " .. stats.fishCaught)
    print("Bank trips: " .. stats.bankTrips)
    print("XP gained: " .. expGained)
    print("XP/hour: " .. expPerHour)
    print("Runtime: " .. math.floor(elapsed * 60) .. " minutes")
end

-- Main loop
print("Starting UmFisher...")
print("Drop mode: " .. tostring(CONFIG.dropMode))

while API.Read_LoopyLoop() do
    -- Check if inventory is full
    if isInventoryFull() then
        if CONFIG.dropMode then
            API.DoAction_Inventory1(0xffffffff, 0, 1, API.OFF_ACT_GeneralInterface_route)
            API.RandomSleep2(600, 100, 200)
        else
            bankItems()
        end
    end
    
    -- Start fishing
    startFishing()
    
    -- Update stats
    if math.random(1, 100) <= 5 then
        printStats()
    end
    
    API.RandomSleep2(1000, 200, 500)
end

printStats()
print("Script stopped!")
`
      }
    }),
    prisma.script.create({
      data: {
        title: 'Necro Rituals',
        description: 'Automated Necromancy ritual script for efficient training and profit.',
        fullDescription: `Complete Necromancy ritual automation:

• Multiple ritual support
• Glyph placement automation
• Ingredient management
• Banking and resupply
• Experience tracking
• Profit calculation
• Focus management

Automates the tedious ritual process for maximum efficiency.`,
        version: '1.5.3',
        downloads: 4521,
        averageRating: 4.8,
        reviewCount: 52,
        authorId: users[2].id, // automate_pro
        categoryId: categories[1].id, // Skilling
        requirements: ['Necromancy unlocked', 'Ritual site access'],
        features: ['Ritual automation', 'Glyph placement', 'Banking', 'XP tracking'],
        screenshots: [],
        isActive: true,
        luaContent: generateLuaContent('Necro Rituals', '1.5.3', 'Automated Necromancy ritual script for efficient training and profit.', ['Ritual automation', 'Glyph placement', 'Banking', 'XP tracking'])
      }
    }),
    prisma.script.create({
      data: {
        title: 'Shop Runner',
        description: 'Advanced shop buying script with world hopping and stock monitoring.',
        fullDescription: `Professional shop runner:

• Multi-shop support
• World hopping
• Stock monitoring
• Profit tracking
• Banking automation
• Buy limits handling
• Price checking

Perfect for shop running money making methods. Maximizes profit per hour.`,
        version: '2.0.1',
        downloads: 7234,
        averageRating: 4.6,
        reviewCount: 89,
        authorId: users[2].id, // automate_pro
        categoryId: categories[5].id, // Money Making
        requirements: ['Access to shops', 'Banking access'],
        features: ['World hopping', 'Stock monitoring', 'Profit tracking', 'Multi-shop'],
        screenshots: [],
        isActive: true,
        luaContent: generateLuaContent('Shop Runner', '2.0.1', 'Advanced shop buying script with world hopping and stock monitoring.', ['World hopping', 'Stock monitoring', 'Profit tracking', 'Multi-shop'])
      }
    }),
    prisma.script.create({
      data: {
        title: 'Spectre\'s Agility AIO',
        description: 'All-in-one agility training script supporting all agility courses.',
        fullDescription: `Complete agility training solution:

• All agility courses
• Obstacle failure handling
• Mark of grace collection
• Progress tracking
• Level requirements check
• Anti-ban features
• Course optimization

Train agility on any course with full automation and safety features.`,
        version: '3.1.2',
        downloads: 12450,
        averageRating: 4.9,
        reviewCount: 156,
        authorId: users[1].id, // scriptmaster
        categoryId: categories[1].id, // Skilling
        requirements: ['Agility level 1+'],
        features: ['All courses', 'Mark collection', 'Failure handling', 'Progress tracking'],
        screenshots: [],
        isActive: true,
        luaContent: generateLuaContent('Spectre\'s Agility AIO', '3.1.2', 'All-in-one agility training script supporting all agility courses.', ['All courses', 'Mark collection', 'Failure handling', 'Progress tracking'])
      }
    }),
    prisma.script.create({
      data: {
        title: 'AIO Headless Arrows',
        description: 'Efficient headless arrow making script with banking and inventory management.',
        fullDescription: `Headless arrow maker:

• Automatic shaft and feather combination
• Smart banking
• Inventory optimization
• XP and profit tracking
• AFK friendly
• Production counter

Simple but efficient script for making headless arrows for profit or Fletching XP.`,
        version: '1.1.0',
        downloads: 2834,
        averageRating: 4.2,
        reviewCount: 31,
        authorId: users[2].id, // automate_pro
        categoryId: categories[1].id, // Skilling
        requirements: ['Fletching level 1+', 'Arrow shafts and feathers'],
        features: ['Auto banking', 'XP tracking', 'Profit tracking', 'AFK friendly'],
        screenshots: [],
        isActive: true,
        luaContent: generateLuaContent('AIO Headless Arrows', '1.1.0', 'Efficient headless arrow making script with banking and inventory management.', ['Auto banking', 'XP tracking', 'Profit tracking', 'AFK friendly'])
      }
    }),
    prisma.script.create({
      data: {
        title: 'Mook Miner',
        description: 'Mining automation script with ore detection and banking.',
        fullDescription: `Professional mining script:

• Multiple ore support
• Rock respawn detection
• Banking automation
• Inventory management
• XP tracking
• Anti-ban features

Efficient mining script for all your ore gathering needs.`,
        version: '1.4.5',
        downloads: 6123,
        averageRating: 4.5,
        reviewCount: 73,
        authorId: users[1].id, // scriptmaster
        categoryId: categories[1].id, // Skilling
        requirements: ['Mining level 1+', 'Pickaxe'],
        features: ['Multi-ore', 'Auto banking', 'Respawn detection', 'XP tracking'],
        screenshots: [],
        isActive: true,
        luaContent: generateLuaContent('Mook Miner', '1.4.5', 'Mining automation script with ore detection and banking.', ['Multi-ore', 'Auto banking', 'Respawn detection', 'XP tracking'])
      }
    }),
    prisma.script.create({
      data: {
        title: 'Herb Cleaner',
        description: 'Simple but effective grimy herb cleaning script for Herblore training.',
        fullDescription: `Herb cleaning automation:

• All herb types
• Fast cleaning speed
• Banking support
• XP and profit tracking
• Minimal requirements

Quick and reliable herb cleaning for easy Herblore XP and profit.`,
        version: '1.0.2',
        downloads: 3456,
        averageRating: 4.3,
        reviewCount: 42,
        authorId: users[2].id, // automate_pro
        categoryId: categories[1].id, // Skilling
        requirements: ['Herblore level 1+', 'Grimy herbs'],
        features: ['All herbs', 'Fast cleaning', 'Banking', 'Profit tracking'],
        screenshots: [],
        isActive: true,
        luaContent: generateLuaContent('Herb Cleaner', '1.0.2', 'Simple but effective grimy herb cleaning script for Herblore training.', ['All herbs', 'Fast cleaning', 'Banking', 'Profit tracking'])
      }
    }),
    prisma.script.create({
      data: {
        title: 'Summoning Pouch Maker',
        description: 'Automated summoning pouch creation with banking and shard management.',
        fullDescription: `Summoning automation:

• Multiple pouch types
• Spirit shard management
• Banking automation
• Ingredient tracking
• XP calculation
• Profit tracking

Efficiently create summoning pouches with full automation.`,
        version: '1.3.0',
        downloads: 4234,
        averageRating: 4.6,
        reviewCount: 58,
        authorId: users[1].id, // scriptmaster
        categoryId: categories[1].id, // Skilling
        requirements: ['Summoning level 1+', 'Access to obelisk'],
        features: ['Multi-pouch', 'Shard management', 'Banking', 'XP tracking'],
        screenshots: [],
        isActive: true,
        luaContent: generateLuaContent('Summoning Pouch Maker', '1.3.0', 'Automated summoning pouch creation with banking and shard management.', ['Multi-pouch', 'Shard management', 'Banking', 'XP tracking'])
      }
    }),
    prisma.script.create({
      data: {
        title: 'Clue Planks Processing',
        description: 'Plank processing script for Construction training or profit.',
        fullDescription: `Plank making automation:

• All plank types
• Sawmill automation
• Banking support
• Cost calculation
• Profit tracking
• AFK friendly

Convert logs to planks efficiently for Construction or profit.`,
        version: '1.2.1',
        downloads: 2156,
        averageRating: 4.1,
        reviewCount: 28,
        authorId: users[2].id, // automate_pro
        categoryId: categories[5].id, // Money Making
        requirements: ['Access to sawmill', 'Logs and coins'],
        features: ['All planks', 'Sawmill automation', 'Banking', 'Profit calculation'],
        screenshots: [],
        isActive: true,
        luaContent: generateLuaContent('Clue Planks Processing', '1.2.1', 'Plank processing script for Construction training or profit.', ['All planks', 'Sawmill automation', 'Banking', 'Profit calculation'])
      }
    })
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

  // Files are not needed - luaContent is stored in the Script model
  // Users can download the script directly via the main Download button


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
