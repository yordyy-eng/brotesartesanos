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
  await prisma.category.deleteMany({})

  // 1. Categories (matches the color buckets used by CAT_COLORS in catalog-client.tsx)
  const categories = [
    { id: 'orfebr', name: 'Orfebrería y Joyería' },
    { id: 'madera', name: 'Trabajo en Madera' },
    { id: 'cuero', name: 'Cuero y Marroquinería' },
    { id: 'textil', name: 'Textil y Tejidos' },
    { id: 'greda', name: 'Greda y Cerámica' },
    { id: 'mimbre', name: 'Mimbre' },
    { id: 'otros', name: 'Otros Oficios' },
  ]
  for (const cat of categories) {
    await prisma.category.upsert({ where: { id: cat.id }, update: {}, create: cat })
  }

  // 2. Verified Artisan Data from PDF (bio/craft/location audited against source PDF;
  // instagram/phone/email extracted from each page's printed text — NOT from the PDF's
  // embedded hyperlink annotations, which turned out to be a reused template link and
  // point to the wrong artisan on most pages, e.g. page 10's link goes to @grabadoslinares
  // while the page itself prints @juanc.lizana).
  const artisans = [
    { name: "Juan Carlos Lizana", craft: "Joyas de Plata", location: "La Pintana", page: 10, category: "orfebr", instagram: "https://www.instagram.com/juanc.lizana/" },
    { name: "Claudina Torres", craft: "Accesorios en Cuero", location: "Catemu", page: 11, category: "cuero", instagram: "+56 9 9737 0836" },
    { name: "Roberto Vergara", craft: "Calado en Madera", location: "Hualpén", page: 12, category: "madera", instagram: "https://www.instagram.com/caladosvergara/" },
    { name: "Cristóbal Morales", craft: "Marroquinería", location: "Cañete", page: 13, category: "cuero", instagram: "https://www.instagram.com/cristobal_marroquinero/" },
    { name: "Ana María Castro", craft: "Artesanía en Greda", location: "Antuco", page: 14, category: "greda", instagram: "+56 9 8519 8535" },
    { name: "Aladino Cid", craft: "Textil", location: "La Ligua", page: 15, category: "textil", instagram: "manosrusticas80@gmail.com" },
    { name: "Nicolás García", craft: "Orfebrería", location: "Angol", page: 16, category: "orfebr", instagram: "https://www.instagram.com/topacio.taller/" },
    { name: "Pablo Gutiérrez", craft: "Chupallas de Trigo", location: "Chillán", page: 17, category: "otros", instagram: "https://www.instagram.com/chupallas_de_trigo/" },
    { name: "Pamela Vidal", craft: "Orfebrería", location: "Rancagua", page: 18, category: "orfebr", instagram: "https://www.instagram.com/joyasnaynay/" },
    { name: "Nabor Agurto", craft: "Artesanía en Piedra", location: "Angol", page: 19, category: "otros", instagram: "https://www.instagram.com/n3olitico/" },
    { name: "Héctor Carrillo", craft: "Decoración en Madera", location: "Collipulli", page: 20, category: "madera", instagram: "+56 9 7657 2453" },
    { name: "María Teresa Véliz", craft: "Grabados en Vidrio", location: "Linares", page: 21, category: "otros", instagram: "https://www.instagram.com/grabadosenvidrio/" },
    { name: "Jorge Cisterna", craft: "Artesanía en Cuero", location: "Angol", page: 22, category: "cuero", instagram: "https://www.instagram.com/jorge_artesanoencuero/" },
    { name: "Víctor Gutiérrez", craft: "Orfebrería", location: "La Serena", page: 23, category: "orfebr", instagram: null },
    { name: "Nelson Salazar", craft: "Artesanía en Cuero", location: "Tucapel", page: 24, category: "cuero", instagram: "https://www.instagram.com/cueros.savel/" },
    { name: "Carlos Becerra", craft: "Platería Fina", location: "Angol", page: 25, category: "orfebr", instagram: "https://www.instagram.com/carlitos_arteydiseno/" },
    { name: "Ana Pinto", craft: "Textil", location: "Concepción", page: 26, category: "textil", instagram: "https://www.instagram.com/dedosmagicos.ccp/" },
    { name: "Mauricio Borgoño", craft: "Cuadros Decorativos", location: "Pelluhue", page: 27, category: "madera", instagram: "https://www.instagram.com/kulungu.crafts/" },
    { name: "Julio Rojas", craft: "Utensilios de Madera", location: "Angol", page: 28, category: "madera", instagram: "+56 9 8538 8764" },
    { name: "Isabel Alarcón", craft: "Cuadros en Madera", location: "Villarrica", page: 29, category: "madera", instagram: "https://www.instagram.com/rusti2628/" },
    { name: "Manuel Díaz", craft: "Mimbre", location: "Chimbarongo", page: 30, category: "mimbre", instagram: "+56 9 9667 3103" },
    { name: "María Arriagada", craft: "Artesanía en Cuero", location: "Pudahuel", page: 31, category: "cuero", instagram: "https://www.instagram.com/asunarte__/" },
    { name: "Jazna Viveros", craft: "Tejidos", location: "Angol", page: 32, category: "textil", instagram: "https://www.instagram.com/artetextil.angol/" },
    { name: "Florisondo Martínez", craft: "Orfebrería", location: "Gultro", page: 33, category: "orfebr", instagram: "https://www.instagram.com/petra_bc/" },
    { name: "Luis Navarrete", craft: "Marroquinería", location: "Parral", page: 34, category: "cuero", instagram: "+56 9 6213 5067" },
    { name: "César Yañez", craft: "Reutilización de Madera", location: "Angol", page: 35, category: "madera", instagram: "+56 9 5683 5588" },
    { name: "Nicolás Zumelzu", craft: "Filigrana y Alambrismo", location: "Estación Central", page: 36, category: "orfebr", instagram: "https://www.instagram.com/rastadecobre/" },
    { name: "Angela Pinto", craft: "Artesanía en Greda", location: "Pomaire", page: 37, category: "greda", instagram: "+56 9 3759 0117" },
    { name: "Lionel Palma", craft: "Inciensos y Porcelana", location: "San Felipe", page: 38, category: "otros", instagram: "https://www.instagram.com/elmundodemussa/" },
    { name: "Mauricio Calderón", craft: "Mimbre", location: "Angol", page: 39, category: "mimbre", instagram: "https://www.instagram.com/mimbres.calderon/" },
    { name: "Julio Sotelo", craft: "Artesanía en Greda", location: "Quillón", page: 40, category: "greda", instagram: "https://www.instagram.com/ondejulio_gredasquillon/" },
    { name: "Katherine Garrido", craft: "Artesanía Textil", location: "Angol", page: 41, category: "textil", instagram: "https://www.instagram.com/newen.fuerzayenergia/" },
    { name: "Eleazar Silva", craft: "Artesanía en Cuero", location: "San Vicente de Tagua Tagua", page: 42, category: "cuero", instagram: "https://www.instagram.com/donde_el_joaquin/" },
    { name: "Sandra Alarcón", craft: "Orfebrería", location: "Santiago", page: 43, category: "orfebr", instagram: "https://www.instagram.com/turriart/" },
    { name: "Gustavo Acuña", craft: "Artesanía en Madera", location: "Concepción", page: 44, category: "madera", instagram: "https://www.instagram.com/licanrayenab/" },
    { name: "Pamela Gutiérrez", craft: "Pintura Decorativa y Decoupage", location: "Chillán", page: 45, category: "otros", instagram: "https://www.instagram.com/pamelagacitua_artemadera/" },
    { name: "Mariana Rojas", craft: "Orfebrería", location: "Angol", page: 46, category: "orfebr", instagram: "https://www.instagram.com/sietecolorescreaciones/" },
    { name: "Pedro Navarrete", craft: "Cuero y Madera", location: "Parral", page: 47, category: "cuero", instagram: null },
    { name: "Edio Anabalón", craft: "Artesanía en Madera", location: "Yungay", page: 48, category: "madera", instagram: "https://www.instagram.com/yeyo.anabalon/" },
    { name: "María Robles", craft: "Artesanía Textil", location: "Angol", page: 49, category: "textil", instagram: "https://www.instagram.com/rustica_telares_nahuelbuta/" }
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
        instagram: artisan.instagram,
        categoryId: artisan.category,
      },
      create: {
        id: slug,
        name: artisan.name,
        craft: artisan.craft,
        location: artisan.location,
        bio: `${artisan.name} es un destacado artesano de ${artisan.location}, especialista en ${artisan.craft}. Su trabajo forma parte de la Muestra de Arte Popular Brotes de Chile 2026.`,
        image: fs.existsSync(fullTargetImagePath) ? targetImagePath : null,
        instagram: artisan.instagram,
        categoryId: artisan.category,
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
