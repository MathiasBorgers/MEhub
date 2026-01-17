import 'dotenv/config'
import {PrismaClient} from '@/generated/prisma/client'
import {pbkdf2Sync} from 'crypto'

const prisma = new PrismaClient()

function verifyPassword(storedPassword: string, providedPassword: string): boolean {
  const [iterations, keyLength, hash, salt] = storedPassword.split('$')
  const derivedHash = pbkdf2Sync(
    providedPassword,
    salt,
    parseInt(iterations),
    parseInt(keyLength),
    'sha512',
  ).toString('hex')

  return hash === derivedHash
}

async function checkUsers() {
  console.log('Checking test users...\n')

  const testAccounts = [
    { email: 'admin@mehub.com', password: 'admin123', username: 'admin' },
    { email: 'developer@mehub.com', password: 'developer123', username: 'scriptmaster' },
    { email: 'developer2@mehub.com', password: 'developer123', username: 'automate_pro' },
    { email: 'user@mehub.com', password: 'password123', username: 'gamer123' },
    { email: 'user2@mehub.com', password: 'password123', username: 'player2' },
    { email: 'user3@mehub.com', password: 'password123', username: 'player3' },
    { email: 'user4@mehub.com', password: 'password123', username: 'player4' },
    { email: 'user5@mehub.com', password: 'password123', username: 'player5' },
    { email: 'user6@mehub.com', password: 'password123', username: 'player6' },
    { email: 'user7@mehub.com', password: 'password123', username: 'player7' },
  ]

  for (const account of testAccounts) {
    const user = await prisma.user.findUnique({
      where: { email: account.email }
    })

    if (!user) {
      console.log(`❌ User NOT FOUND: ${account.email}`)
      continue
    }

    const passwordValid = verifyPassword(user.password, account.password)

    if (passwordValid) {
      console.log(`✅ ${account.email} (${account.username}) - Password OK`)
    } else {
      console.log(`❌ ${account.email} (${account.username}) - Password INVALID`)
      console.log(`   Expected password: ${account.password}`)
      console.log(`   Stored hash: ${user.password.substring(0, 50)}...`)
    }
  }

  await prisma.$disconnect()
}

checkUsers().catch(console.error)

