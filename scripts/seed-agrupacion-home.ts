import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function main() {
  const payload = await getPayload({ config })

  console.log('Actualizando global: agrupacion-home...')
  await payload.updateGlobal({
    slug: 'agrupacion-home',
    locale: 'es',
    data: {
      tag: 'Angol, Malleco, Chile',
      titlePrefix: 'Huellas de',
      titleEmphasis: 'Nahuelbuta',
      subtitle:
        'Agrupación de artesanas, artesanos y productores del territorio Nahuelbuta. Impulsamos ferias, oficios tradicionales y la Muestra de Arte Popular Brotes de Chile.',
      stats: [
        { value: '2021', label: 'Fundación' },
        { value: '15', label: 'Fundadores' },
        { value: '40', label: 'Muestra Brotes 2026' },
      ],
      cards: [
        {
          title: 'Nuestra Historia',
          description: 'El camino de la agrupación desde 2021 hasta la 40ª Muestra de Arte Popular Chileno.',
          href: '/historia',
        },
        {
          title: 'Sobre Nosotros',
          description: 'Misión, visión y los valores que guían nuestro trabajo colaborativo.',
          href: '/sobre-nosotros',
        },
        {
          title: 'Brotes de Chile',
          description: 'El catálogo digital de los 40 artesanos de la Muestra de Arte Popular 2026.',
          href: '/brotes-de-chile',
        },
        {
          title: 'Contacto',
          description: 'Escríbenos para sumarte a una feria o proponer una colaboración.',
          href: '/contacto',
        },
      ],
    },
  })

  console.log('--- Listo ---')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
