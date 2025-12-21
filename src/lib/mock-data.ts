export enum UserRole {
  DEVELOPER = "developer",
  USER = "user",
  ADMIN = "admin"
}

export enum ScriptCategory {
  COMBAT = "Combat",
  SKILLING = "Skilling", 
  QUESTS = "Quests",
  MINING = "Mining",
  WOODCUTTING = "Woodcutting",
  FISHING = "Fishing",
  COOKING = "Cooking",
  FARMING = "Farming",
  CRAFTING = "Crafting",
  SMITHING = "Smithing",
  RUNECRAFTING = "Runecrafting",
  DUNGEONEERING = "Dungeoneering",
  DIVINATION = "Divination",
  INVENTION = "Invention",
  ARCHAEOLOGY = "Archaeology"
}

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  bio: string
  avatar: string
  joinDate: string
  verified: boolean
  stats: {
    scriptsUploaded: number
    totalDownloads: number
    averageRating: number
  }
}

export interface Script {
  id: string
  title: string
  description: string
  fullDescription: string
  version: string
  downloads: number
  rating: number
  reviewCount: number
  author: User
  category: ScriptCategory
  tags: string[]
  screenshots: string[]
  files: {
    name: string
    size: string
    type: string
  }[]
  requirements: string[]
  features: string[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  scriptCount: number
  color: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  author: User
  scriptId: string
  createdAt: string
}

export const mockUsers: Record<string, User> = {
  "user-1": {
    id: "user-1",
    username: "ScriptMaster",
    email: "scriptmaster@rs3.dev",
    role: "developer",
    bio: "Elite RS3 scripter - Combat and Bossing specialist",
    avatar: "/developer-avatar.png",
    joinDate: "2023-01-15",
    verified: true,
    stats: {
      scriptsUploaded: 12,
      totalDownloads: 3240,
      averageRating: 4.8,
    },
  },
  "user-2": {
    id: "user-2",
    username: "SkillerDev",
    email: "skillerdev@rs3.dev",
    role: "developer",
    bio: "Skilling and AFK automation expert",
    avatar: "/developer-avatar.png",
    joinDate: "2023-03-22",
    verified: true,
    stats: {
      scriptsUploaded: 8,
      totalDownloads: 2150,
      averageRating: 4.6,
    },
  },
  "user-3": {
    id: "user-3",
    username: "BossHunter",
    email: "bosshunter@rs3.dev",
    role: "developer",
    bio: "Endgame PVM and dungeon specialist",
    avatar: "/developer-avatar.png",
    joinDate: "2023-05-10",
    verified: true,
    stats: {
      scriptsUploaded: 15,
      totalDownloads: 5620,
      averageRating: 4.9,
    },
  },
  "user-4": {
    id: "user-4",
    username: "ArcaneStrike",
    email: "arcanestrike@rs3.dev",
    role: "developer",
    bio: "Magic combat and Revolution++ expert",
    avatar: "/developer-avatar.png",
    joinDate: "2023-06-18",
    verified: true,
    stats: {
      scriptsUploaded: 9,
      totalDownloads: 1820,
      averageRating: 4.7,
    },
  },
  "user-5": {
    id: "user-5",
    username: "FarmAutomatic",
    email: "farmauto@rs3.dev",
    role: "developer",
    bio: "Farming and passive income specialist",
    avatar: "/developer-avatar.png",
    joinDate: "2023-07-22",
    verified: true,
    stats: {
      scriptsUploaded: 11,
      totalDownloads: 2890,
      averageRating: 4.8,
    },
  },
  "user-6": {
    id: "user-6",
    username: "SlayerBot",
    email: "slayerbot@rs3.dev",
    role: "developer",
    bio: "Slayer and combat efficiency optimizer",
    avatar: "/developer-avatar.png",
    joinDate: "2023-08-05",
    verified: true,
    stats: {
      scriptsUploaded: 14,
      totalDownloads: 4320,
      averageRating: 4.9,
    },
  },
  "user-7": {
    id: "user-7",
    username: "DungeonMaster",
    email: "dungeonmaster@rs3.dev",
    role: "developer",
    bio: "Dungeoneering and token farming expert",
    avatar: "/developer-avatar.png",
    joinDate: "2023-09-11",
    verified: false,
    stats: {
      scriptsUploaded: 6,
      totalDownloads: 1340,
      averageRating: 4.5,
    },
  },
  "user-8": {
    id: "user-8",
    username: "MoneyMaker",
    email: "moneymaker@rs3.dev",
    role: "developer",
    bio: "PVM and flipping automation specialist",
    avatar: "/developer-avatar.png",
    joinDate: "2023-10-03",
    verified: true,
    stats: {
      scriptsUploaded: 10,
      totalDownloads: 3560,
      averageRating: 4.8,
    },
  },
  "user-9": {
    id: "user-9",
    username: "UtilityPro",
    email: "utilitypro@rs3.dev",
    role: "developer",
    bio: "Utility and quality-of-life script creator",
    avatar: "/developer-avatar.png",
    joinDate: "2023-11-09",
    verified: true,
    stats: {
      scriptsUploaded: 7,
      totalDownloads: 1680,
      averageRating: 4.6,
    },
  },
  "user-10": {
    id: "user-10",
    username: "MiniGameMania",
    email: "minigames@rs3.dev",
    role: "developer",
    bio: "Minigame automation and speedrun helper",
    avatar: "/developer-avatar.png",
    joinDate: "2023-12-01",
    verified: true,
    stats: {
      scriptsUploaded: 8,
      totalDownloads: 1450,
      averageRating: 4.4,
    },
  },
  "user-11": {
    id: "user-11",
    username: "RangeAssassin",
    email: "rangeassassin@rs3.dev",
    role: "developer",
    bio: "Range combat and precision targeting expert",
    avatar: "/developer-avatar.png",
    joinDate: "2024-01-08",
    verified: true,
    stats: {
      scriptsUploaded: 13,
      totalDownloads: 3980,
      averageRating: 4.9,
    },
  },
  "user-12": {
    id: "user-12",
    username: "ArchaeologyNerd",
    email: "archaeology@rs3.dev",
    role: "developer",
    bio: "Archaeology and artifact collecting specialist",
    avatar: "/developer-avatar.png",
    joinDate: "2024-02-05",
    verified: true,
    stats: {
      scriptsUploaded: 5,
      totalDownloads: 980,
      averageRating: 4.7,
    },
  },
}

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Combat Scripts",
    slug: "combat",
    description: "Revolution++, Legacy, and Manual combat automation",
    icon: "⚔️",
    scriptCount: 24,
    color: "#00d4ff",
  },
  {
    id: "cat-2",
    name: "Skilling Scripts",
    slug: "skilling",
    description: "Divination, Archaeology, Mining, Smithing, and more",
    icon: "⛏️",
    scriptCount: 28,
    color: "#b794f6",
  },
  {
    id: "cat-3",
    name: "Farming Scripts",
    slug: "farming",
    description: "POF, herb runs, tree runs, and crop automation",
    icon: "🌾",
    scriptCount: 12,
    color: "#10b981",
  },
  {
    id: "cat-4",
    name: "Bossing Scripts",
    slug: "bossing",
    description: "Araxxor, Telos, Raksha, ED, Arch-Glacor automation",
    icon: "👹",
    scriptCount: 16,
    color: "#f59e0b",
  },
  {
    id: "cat-5",
    name: "Slayer Scripts",
    slug: "slayer",
    description: "Task automation and monster farming",
    icon: "💀",
    scriptCount: 18,
    color: "#ec4899",
  },
  {
    id: "cat-6",
    name: "Money Making Scripts",
    slug: "money-making",
    description: "PVM, skilling, and flipping automation",
    icon: "💰",
    scriptCount: 21,
    color: "#00d4ff",
  },
  {
    id: "cat-7",
    name: "Dungeoneering Scripts",
    slug: "dungeoneering",
    description: "Token farming and floor rushing",
    icon: "🏰",
    scriptCount: 14,
    color: "#8b5cf6",
  },
  {
    id: "cat-8",
    name: "Minigames",
    slug: "minigames",
    description: "Cabbage Facepunch, Shattered Worlds, and more",
    icon: "🎮",
    scriptCount: 11,
    color: "#06b6d4",
  },
  {
    id: "cat-9",
    name: "Utility Scripts",
    slug: "utility",
    description: "Banking, presets, invention, and tools",
    icon: "🔧",
    scriptCount: 19,
    color: "#64748b",
  },
]

// Real script names discovered in temp_releases (top-level folders/files).
const releaseNames = [
  "0Nocturnal-luascripts-main",
  "aa_NecroRC",
  "AbbyDemonsSlayerTower",
  "afk.lua",
  "AIO Pick Pocketer",
  "aio runecrafter edited",
  "Amr1x1",
  "animoofps-ME-Alcher-main",
  "animoofps-ME-DGTokenFarmer-main",
  "animoofps-ME-Fungy-Miner-main",
  "animoofps-ME-Ghost-Impling-catcher-main",
  "AnotherTaverlySummoning",
  "api.lua",
  "Archeology Helper",
  "archGlacor",
  "ariascripts",
  "Asoziales-LUA-Scripting-main",
  "Beehive Run",
  "BoneOffering",
  "CerberusED4",
  "CommunitySlayer-master",
  "Deep Sea Fisher",
  "Eternal Chopper",
  "FishingFrenzy",
  "FMK-Script-main",
  "FortForinthryProcessing",
  "GnomeAdvancedAgility",
  "MookMiner",
  "SuperSimpleBaniteMiner",
  "Zuk 2",
  "zukME-main",
]

function guessCategory(name: string) {
  const n = name.toLowerCase()
  if (/(cerberus|telos|araxxor|raksha|zuk|boss)/.test(n)) return 'Bossing Scripts'
  if (/(dungeon|dungeoneering|dg|ed3)/.test(n)) return 'Dungeoneering Scripts'
  if (/(mine|miner|smelter|smith|banite|mining|mook)/.test(n)) return 'Skilling Scripts'
  if (/(fish|fishing|fisher|beehive|pof|farm|farming)/.test(n)) return 'Farming Scripts'
  if (/(slayer|abyssal|slayer)/.test(n)) return 'Slayer Scripts'
  if (/(cabbage|minigame|agility)/.test(n)) return 'Minigames'
  if (/(bank|organizer|dwarf|trader|player|toolkit|tool|fm k|fmk)/.test(n)) return 'Utility Scripts'
  return 'Utility Scripts'
}

function toTitle(name: string) {
  return name
    .replace(/[-_.]/g, ' ')
    .replace(/\b(\w)/g, (m) => m.toUpperCase())
}

export const mockScripts: Script[] = releaseNames.map((raw, i) => {
  const title = toTitle(raw.replace(/(-main|_main)$/i, ''))
  const category = guessCategory(raw)
  const authorId = `user-${(i % Object.keys(mockUsers).length) + 1}`
  const id = `script-${i + 1}`
  return {
    id,
    title,
    description: `${title} — imported from ME_Releases`,
    fullDescription: `${title} automatically generated mock entry based on the ME_Releases repository item '${raw}'.`,
    version: '1.0.0',
    downloads: Math.floor(Math.random() * 2500) + 50,
    rating: Math.round((3.8 + Math.random() * 1.2) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 420),
    author: mockUsers[authorId],
    category,
    tags: raw
      .replace(/[-_]/g, ' ')
      .split(/\s+/)
      .slice(0, 4)
      .map((t) => t.toLowerCase()),
    screenshots: ['/placeholder.jpg'],
    files: [{ name: `${raw.replace(/\s+/g, '-').toLowerCase()}.lua`, size: `${Math.floor(Math.random() * 180) + 20} KB`, type: 'Lua' }],
    requirements: ['RuneLite'],
    features: ['Auto routines', 'Configurable', 'Stable'],
    createdAt: '2024-03-01',
    updatedAt: '2024-04-01',
  }
})

export const mockReviews: Review[] = [
  {
    id: "review-1",
    rating: 5,
    comment: "Best Araxxor script I've tried! Super reliable and smooth runs every time.",
    author: mockUsers["user-2"],
    scriptId: "script-1",
    createdAt: "2024-02-15",
  },
  {
    id: "review-2",
    rating: 4,
    comment: "Great archaeology script, but could use better filter detection. Otherwise solid!",
    author: mockUsers["user-3"],
    scriptId: "script-2",
    createdAt: "2024-02-10",
  },
  {
    id: "review-3",
    rating: 5,
    comment: "ED3 trash runs have never been easier. Highly efficient and dependable.",
    author: mockUsers["user-1"],
    scriptId: "script-3",
    createdAt: "2024-02-18",
  },
  {
    id: "review-4",
    rating: 5,
    comment: "POF automation is incredible. Made so much profit from this script!",
    author: mockUsers["user-4"],
    scriptId: "script-4",
    createdAt: "2024-02-16",
  },
  {
    id: "review-5",
    rating: 4,
    comment: "Great team script but needs some optimization for 4 man groups. Still very useful!",
    author: mockUsers["user-5"],
    scriptId: "script-5",
    createdAt: "2024-02-14",
  },
  {
    id: "review-6",
    rating: 5,
    comment: "AFK Divination is literally the best. Just running in background and gaining XP!",
    author: mockUsers["user-6"],
    scriptId: "script-6",
    createdAt: "2024-02-19",
  },
  {
    id: "review-7",
    rating: 5,
    comment: "Telos automation finally makes the fight manageable. Excellent work!",
    author: mockUsers["user-7"],
    scriptId: "script-7",
    createdAt: "2024-02-17",
  },
  {
    id: "review-8",
    rating: 4,
    comment: "Herb runs are smooth but sometimes misses a patch. 9/10 would recommend!",
    author: mockUsers["user-8"],
    scriptId: "script-8",
    createdAt: "2024-02-13",
  },
  {
    id: "review-9",
    rating: 5,
    comment: "Slayer crusher is phenomenal. Completes tasks faster than manual play!",
    author: mockUsers["user-9"],
    scriptId: "script-9",
    createdAt: "2024-02-20",
  },
  {
    id: "review-10",
    rating: 4,
    comment: "Dungeoneering rusher works well, decent token rates and fast runs.",
    author: mockUsers["user-10"],
    scriptId: "script-10",
    createdAt: "2024-02-12",
  },
  {
    id: "review-11",
    rating: 5,
    comment: "Merching bot made me millions! Price tracking is incredibly accurate.",
    author: mockUsers["user-11"],
    scriptId: "script-11",
    createdAt: "2024-02-21",
  },
  {
    id: "review-12",
    rating: 3,
    comment: "Bank organizer is okay but lacks some customization options I wanted.",
    author: mockUsers["user-12"],
    scriptId: "script-12",
    createdAt: "2024-02-09",
  },
  {
    id: "review-13",
    rating: 4,
    comment: "Cabbage Facepunch bot is fun and competitive. Gets decent scores!",
    author: mockUsers["user-1"],
    scriptId: "script-13",
    createdAt: "2024-02-22",
  },
  {
    id: "review-14",
    rating: 5,
    comment: "Magic combat revolution is so smooth. Best DPS optimization I've seen!",
    author: mockUsers["user-2"],
    scriptId: "script-14",
    createdAt: "2024-02-23",
  },
  {
    id: "review-15",
    rating: 4,
    comment: "Mining and smithing automation is reliable. Great profit rates too!",
    author: mockUsers["user-3"],
    scriptId: "script-15",
    createdAt: "2024-02-18",
  },
  {
    id: "review-16",
    rating: 5,
    comment: "Arch-Glacor script handles mechanics perfectly. Very impressive!",
    author: mockUsers["user-4"],
    scriptId: "script-16",
    createdAt: "2024-02-24",
  },
  {
    id: "review-17",
    rating: 5,
    comment: "Raksha hybrid fighter is incredible. Hybrid switching is flawless!",
    author: mockUsers["user-5"],
    scriptId: "script-17",
    createdAt: "2024-02-25",
  },
  {
    id: "review-18",
    rating: 4,
    comment: "Archaeology reconstruction helper saves so much time on puzzles!",
    author: mockUsers["user-6"],
    scriptId: "script-18",
    createdAt: "2024-02-20",
  },
]
