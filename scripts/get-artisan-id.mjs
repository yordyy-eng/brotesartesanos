import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const artisan = await prisma.artisan.findFirst()
  console.log(artisan.id)
  await prisma.$disconnect()
}
main()
