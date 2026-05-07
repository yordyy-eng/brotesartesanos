import fs from 'fs'
import path from 'path'

const artisans = [
  'Juan Carlos Lizana', 'Claudina Torres', 'Roberto Vergara', 'Cristóbal Morales',
  'Ana María Castro', 'Aladino Cid', 'Nicolás García', 'Pablo Gutiérrez',
  'Pamela Vidal', 'Nabor Agurto', 'Héctor Carrillo', 'María Teresa Véliz',
  'Jorge Cisterna', 'Victor Gutiérrez', 'Nelson Salazar', 'Carlos Becerra',
  'Ana Pinto', 'Mauricio Borgoño', 'Julio Rojas', 'Isabel Alarcón',
  'Manuel Díaz', 'María Arriagada', 'Jazna Viveros', 'Florisondo Martínez',
  'Luis Navarrete', 'César Yañez', 'Nicolás Zumelzu', 'Angela Pinto',
  'Lionel Palma', 'Mauricio Calderón', 'Julio Sotelo', 'Katherine Garrido',
  'Eleazar Silva', 'Sandra Alarcón', 'Gustavo Acuña', 'Pamela Gutiérrez',
  'Mariana Rojas', 'Pedro Navarrete', 'Edio Anabalón', 'María Robles'
]

const slugify = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

const SRC_DIR = 'public/pdf-assets/images'
const DEST_DIR = 'public/artesanos'

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true })
}

console.log('🚀 Starting image mapping...')

artisans.forEach((name, index) => {
  const page = index + 10
  const slug = slugify(name)
  const fileName = `p${page}_img01.jpg`
  const srcPath = path.join(SRC_DIR, fileName)
  const destPath = path.join(DEST_DIR, `${slug}.jpg`)

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath)
    console.log(`✅ Copied: ${name} (Page ${page}) -> ${slug}.jpg`)
  } else {
    console.warn(`⚠️  Missing: ${name} (Page ${page}) - Expected ${fileName}`)
  }
})

console.log('✨ Image mapping finished.')
