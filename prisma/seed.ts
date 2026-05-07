import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Brotes de Chile 2026: Production Data Sync ---')

  // 0. Cleanup
  console.log('Cleaning up existing data...')
  await prisma.work.deleteMany({})
  await prisma.artisan.deleteMany({})
  await prisma.category.upsert({
    where: { id: 'general' },
    update: {},
    create: {
      id: 'general',
      name: 'General'
    }
  })

  // 2. Verified Artisan Data from PDF
  const artisans = [
    { name: "Juan Carlos Lizana", craft: "Joyas de Plata", location: "La Pintana", page: 10 },
    { name: "Claudina Torres", craft: "Accesorios en Cuero", location: "Catemu", page: 11 },
    { name: "Roberto Vergara", craft: "Calado en Madera", location: "Hualpén", page: 12 },
    { name: "Cristóbal Morales", craft: "Marroquinería", location: "Cañete", page: 13 },
    { name: "Ana María Castro", craft: "Artesanía en Greda", location: "Antuco", page: 14 },
    { name: "Aladino Cid", craft: "Textil", location: "La Ligua", page: 15 },
    { name: "Nicolás García", craft: "Orfebrería", location: "Angol", page: 16 },
    { name: "Pablo Gutiérrez", craft: "Chupallas de Trigo", location: "Chillán", page: 17 },
    { name: "Pamela Vidal", craft: "Orfebrería", location: "Rancagua", page: 18 },
    { name: "Nabor Agurto", craft: "Artesanía en Piedra", location: "Angol", page: 19 },
    { name: "Héctor Carrillo", craft: "Decoración en Madera", location: "Collipulli", page: 20 },
    { name: "María Teresa Véliz", craft: "Grabados en Vidrio", location: "Linares", page: 21 },
    { name: "Jorge Cisterna", craft: "Artesanía en Cuero", location: "Angol", page: 22 },
    { name: "Víctor Gutiérrez", craft: "Orfebrería", location: "La Serena", page: 23 },
    { name: "Nelson Salazar", craft: "Artesanía en Cuero", location: "Tucapel", page: 24 },
    { name: "Carlos Becerra", craft: "Platería Fina", location: "Angol", page: 25 },
    { name: "Ana Pinto", craft: "Textil", location: "Concepción", page: 26 },
    { name: "Mauricio Borgoño", craft: "Cuadros Decorativos", location: "Pelluhue", page: 27 },
    { name: "Julio Rojas", craft: "Utensilios de Madera", location: "Angol", page: 28 },
    { name: "Isabel Alarcón", craft: "Cuadros en Madera", location: "Villarrica", page: 29 },
    { name: "Manuel Díaz", craft: "Mimbre", location: "Chimbarongo", page: 30 },
    { name: "María Arriagada", craft: "Artesanía en Cuero", location: "Pudahuel", page: 31 },
    { name: "Jazna Viveros", craft: "Tejidos", location: "Angol", page: 32 },
    { name: "Florisondo Martínez", craft: "Orfebrería", location: "Gultro", page: 33 },
    { name: "Luis Navarrete", craft: "Marroquinería", location: "Parral", page: 34 },
    { name: "César Yañez", craft: "Reutilización de Madera", location: "Angol", page: 35 },
    { name: "Nicolás Zumelzu", craft: "Filigrana y Alambrismo", location: "Estación Central", page: 36 },
    { name: "Angela Pinto", craft: "Artesanía en Greda", location: "Pomaire", page: 37 },
    { name: "Lionel Palma", craft: "Inciensos y Porcelana", location: "San Felipe", page: 38 },
    { name: "Mauricio Calderón", craft: "Mimbre", location: "Angol", page: 39 },
    { name: "Julio Sotelo", craft: "Artesanía en Greda", location: "Quillón", page: 40 },
    { name: "Katherine Garrido", craft: "Artesanía Textil", location: "Angol", page: 41 },
    { name: "Eleazar Silva", craft: "Artesanía en Cuero", location: "San Vicente", page: 42 },
    { name: "Sandra Alarcón", craft: "Orfebrería", location: "Santiago", page: 43 },
    { name: "Gustavo Acuña", craft: "Artesanía en Madera", location: "Concepción", page: 44 },
    { name: "Pamela Gutiérrez", craft: "Pintura Decorativa", location: "Chillán", page: 45 },
    { name: "Mariana Rojas", craft: "Orfebrería", location: "Angol", page: 46 },
    { name: "Pedro Navarrete", craft: "Cuero y Madera", location: "Parral", page: 47 },
    { name: "Edio Anabalón", craft: "Artesanía en Madera", location: "Yungay", page: 48 },
    { name: "María Robles", craft: "Artesanía Textil", location: "Angol", page: 49 }
  ];

  // 3. Ensure Output Directory
  const outputDir = path.join(process.cwd(), 'public', 'artesanos')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 4. Sync Each Artisan
  for (const artisan of artisans) {
    const slug = artisan.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    const targetImagePath = `/artesanos/${slug}.jpg`
    const fullTargetImagePath = path.join(process.cwd(), 'public', 'artesanos', `${slug}.jpg`)
    
    // Attempt to copy image from pdf-assets if it doesn't exist
    const sourceImagePath = path.join(process.cwd(), 'public', 'pdf-assets', 'images', `p${artisan.page}_img01.jpg`)
    
    if (fs.existsSync(sourceImagePath)) {
      fs.copyFileSync(sourceImagePath, fullTargetImagePath)
      console.log(`✓ Image synced: ${artisan.name} (Page ${artisan.page})`)
    } else {
      console.warn(`! Missing source image for ${artisan.name} at ${sourceImagePath}`)
    }

    await prisma.artisan.upsert({
      where: { id: slug },
      update: {
        name: artisan.name,
        craft: artisan.craft,
        location: artisan.location,
        image: fs.existsSync(fullTargetImagePath) ? targetImagePath : null,
      },
      create: {
        id: slug,
        name: artisan.name,
        craft: artisan.craft,
        location: artisan.location,
        bio: `${artisan.name} es un destacado artesano de ${artisan.location}, especialista en ${artisan.craft}. Su trabajo forma parte de la Muestra de Arte Popular Brotes de Chile 2026.`,
        image: fs.existsSync(fullTargetImagePath) ? targetImagePath : null,
        categoryId: 'general'
      },
    })
  }

  console.log('--- Sync Completed ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
