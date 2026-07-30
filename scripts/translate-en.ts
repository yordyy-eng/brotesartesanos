import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const CRAFT_EN: Record<string, string> = {
  'Textil': 'Textiles',
  'Artesanía en Greda': 'Clay Craft',
  'Platería Fina': 'Fine Silverware',
  'Accesorios en Cuero': 'Leather Accessories',
  'Marroquinería': 'Leatherwork',
  'Reutilización de Madera': 'Reclaimed Wood',
  'Artesanía en Madera': 'Woodcraft',
  'Artesanía en Cuero': 'Leather Craft',
  'Orfebrería': 'Silversmithing',
  'Decoración en Madera': 'Wood Decor',
  'Cuadros en Madera': 'Wood Wall Art',
  'Tejidos': 'Weaving',
  'Joyas de Plata': 'Silver Jewelry',
  'Utensilios de Madera': 'Wooden Utensils',
  'Artesanía Textil': 'Textile Craft',
  'Inciensos y Porcelana': 'Incense & Porcelain',
  'Mimbre': 'Wicker',
  'Cuadros Decorativos': 'Decorative Wall Art',
  'Artesanía en Piedra': 'Stone Craft',
  'Filigrana y Alambrismo': 'Filigree & Wirework',
  'Chupallas de Trigo': 'Wheat-Straw Hats',
  'Pintura Decorativa y Decoupage': 'Decorative Painting & Decoupage',
  'Cuero y Madera': 'Leather & Wood',
  'Calado en Madera': 'Wood Fretwork',
  'Grabados en Vidrio': 'Glass Engraving',
}

const CATEGORY_EN: Record<string, string> = {
  orfebr: 'Silverwork & Jewelry',
  madera: 'Woodwork',
  cuero: 'Leather & Leatherworking',
  textil: 'Textiles & Weaving',
  greda: 'Clay & Ceramics',
  mimbre: 'Wicker',
  otros: 'Other Crafts',
}

function toLexical(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text, version: 1 }],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// Array fields with localized sub-fields are NOT themselves marked `localized`
// (only specific text fields inside them are). Payload treats array updates as a
// full replace of the row set, so translating them by sending brand-new objects
// (no `id`) deletes the existing rows and silently wipes the other locale's data
// for that field. The fix: reuse the exact same row `id`s from the current
// (Spanish) document, zipped by index, so the update targets the same rows.
function withIds<T extends Record<string, unknown>>(
  existing: Array<{ id?: string | null }>,
  translated: T[],
): (T & { id?: string })[] {
  return translated.map((item, i) => ({ ...item, id: existing[i]?.id ?? undefined }))
}

async function main() {
  const payload = await getPayload({ config })

  console.log('Traduciendo categorías...')
  const { docs: categories } = await payload.find({ collection: 'categories', locale: 'es', limit: 50, depth: 0 })
  for (const cat of categories) {
    const name = CATEGORY_EN[cat.id]
    if (!name) {
      console.warn(`! Sin traducción para categoría ${cat.id}`)
      continue
    }
    await payload.update({ collection: 'categories', id: cat.id, locale: 'en', data: { name } })
  }

  console.log('Traduciendo artesanos...')
  const { docs: artisans } = await payload.find({ collection: 'artisans', locale: 'es', limit: 60, depth: 0 })
  for (const artisan of artisans) {
    const craftEn = artisan.craft ? CRAFT_EN[artisan.craft] : undefined
    if (artisan.craft && !craftEn) {
      console.warn(`! Sin traducción para oficio "${artisan.craft}" (${artisan.id})`)
    }
    const bioEn = `${artisan.name} is a distinguished artisan from ${artisan.location}, specializing in ${craftEn ?? artisan.craft}. Their work is part of the Brotes de Chile 2026 Popular Art Exhibition catalog.`
    await payload.update({
      collection: 'artisans',
      id: artisan.id,
      locale: 'en',
      data: {
        name: artisan.name,
        craft: craftEn ?? artisan.craft,
        bio: toLexical(bioEn),
      },
    })
  }

  console.log('Traduciendo global: home-hero...')
  const homeHeroEs = await payload.findGlobal({ slug: 'home-hero', locale: 'es' })
  await payload.updateGlobal({
    slug: 'home-hero',
    locale: 'en',
    data: {
      tag: 'Chilean Popular Art Exhibition · 40th Edition',
      titlePrefix: 'Brotes de',
      titleEmphasis: 'Chile',
      subtitle: 'A living territory where hands, memory, and the identity of a country woven from its roots reside.',
      stats: withIds(homeHeroEs.stats ?? [], [
        { value: '40', label: 'Artisans' },
        { value: '1984', label: 'Origin' },
        { value: 'Angol', label: 'Territory' },
      ]),
      memoriasTag: 'Cultural Legacy',
      memoriasTitle: 'Memories of the Exhibition',
      memoriasLead: 'Since its origin in 1984, the Popular Art Exhibition has been a living territory where the hands and memory of Chile reside.',
      memoriasParagraphs: withIds(homeHeroEs.memoriasParagraphs ?? [], [
        {
          text: "In its 40th edition, the exhibition once again becomes a space of meaning: to walk through it is to encounter knowing gazes, hands that speak without words, and materials that hold the pulse of the earth.",
        },
        {
          text: 'Today, wonder returns. Quantity yields to quality; immediacy, to the patient time of creation. Because craftsmanship does not survive by inertia, but by care.',
        },
      ]),
    },
  })

  console.log('Traduciendo global: agrupacion-home...')
  const agrupacionHomeEs = await payload.findGlobal({ slug: 'agrupacion-home', locale: 'es' })
  await payload.updateGlobal({
    slug: 'agrupacion-home',
    locale: 'en',
    data: {
      tag: 'Angol, Malleco, Chile',
      titlePrefix: 'Huellas de',
      titleEmphasis: 'Nahuelbuta',
      subtitle:
        'An association of artisans and producers from the Nahuelbuta territory. We drive fairs, traditional crafts, and the Brotes de Chile Popular Art Exhibition.',
      stats: withIds(agrupacionHomeEs.stats ?? [], [
        { value: '2021', label: 'Founded' },
        { value: '15', label: 'Founding Members' },
        { value: '40', label: 'Brotes 2026 Exhibition' },
      ]),
      cards: withIds(agrupacionHomeEs.cards ?? [], [
        {
          title: 'Our History',
          description: "The association's journey from 2021 to the 40th Chilean Popular Art Exhibition.",
          href: '/historia',
        },
        {
          title: 'About Us',
          description: 'Our mission, vision, and the values that guide our collaborative work.',
          href: '/sobre-nosotros',
        },
        {
          title: 'Brotes de Chile',
          description: 'The digital catalog of the 40 artisans of the 2026 Popular Art Exhibition.',
          href: '/brotes-de-chile',
        },
        {
          title: 'Contact',
          description: 'Write to us to join a fair or propose a collaboration.',
          href: '/contacto',
        },
      ]),
    },
  })

  console.log('Traduciendo global: historia...')
  const historiaEs = await payload.findGlobal({ slug: 'historia', locale: 'es' })
  await payload.updateGlobal({
    slug: 'historia',
    locale: 'en',
    data: {
      heroTitle: 'Our History',
      heroIntro: "The journey of the Huellas de Nahuelbuta association, told through its own milestones.",
      timeline: withIds(historiaEs.timeline ?? [], [
        {
          date: 'Autumn, 2021',
          title: 'Beginnings',
          body: 'The Huellas de Nahuelbuta Association was born in the autumn of 2021, amid the challenges of the post-pandemic period. At that time, a group of artisans and producers from the territory began reflecting on the need to create better spaces to exhibit and sell their work, as well as to strengthen the representation of local craft and productive trades.',
        },
        {
          date: 'Autumn, 2021',
          title: 'Coordination',
          body: 'From this concern came the idea of forming an organization that would allow working collaboratively and communally, creating a platform to support the work of its members while also enabling proposals and requests to be presented in an organized way.',
        },
        {
          date: 'January, 2022',
          title: 'Formalization',
          body: 'After several meetings and gatherings, in January 2022 the Huellas de Nahuelbuta Association was officially formed, initially made up of 15 artisans and producers from the territory, working in wool craft, traditional weaving, macramé, glass fusion, woodwork, leatherworking and silversmithing, as well as processed-food production, beekeeping, and traditional wheat-coffee making.',
        },
        {
          date: '2022',
          title: 'Production',
          body: 'During 2022, the association began developing a calendar of activities coordinated with the municipality, holding monthly themed fairs in the Plaza de Armas of Angol, with live music included. The association held its inaugural fair in February 2022, marking the start of steady work promoting and strengthening local art and production.',
        },
        {
          date: 'December, 2022',
          title: 'Local landmark',
          body: 'At the end of that year, the first Expo Destino Huellas de Nahuelbuta took place, with support from the Tourism Department and the Municipality of Angol, gathering around 80 artisans and producers from the Province of Malleco, from communes such as Angol, Los Sauces, Lumaco, Purén, and Traiguén.',
        },
        {
          date: '2023',
          title: 'Continuity',
          body: 'The association continued strengthening its monthly work, broadening the focus of its activities and sharing knowledge and crafts with the community. In December 2023, the second edition of Expo Destino Huellas de Nahuelbuta was held, this time with support from Universidad Autónoma de Temuco, consolidating the event as an important showcase for the Nahuelbuta destination.',
        },
        {
          date: '2024',
          title: '1st project awarded',
          body: '2024 marked a stage of greater consolidation. The association was awarded an FNDR project from the Regional Government, "Linking art and culture with the community of Angol and its residents," which allowed the purchase of two large-format tents (6 x 12 meters) to hold activities year-round.',
        },
        {
          date: '2024',
          title: 'Learning',
          body: 'Also in 2024, the association applied for the first time to a Regional Fondart grant for the 39th Chilean Popular Art Exhibition. The project was not awarded, but the feedback received helped improve the proposal. Due to park renovations, the third edition of Expo Destino could not be held that year.',
        },
        {
          date: '2025',
          title: '2nd project awarded',
          body: 'The association was awarded a FONDES project that funded the purchase of canopies and furniture for each artisan and producer. In addition, working together, members carried out a community project to improve a public space, the Jardín Identitario de Nahuelbuta, in front of the Provincial Delegation of Malleco.',
        },
        {
          date: '2026',
          title: 'National Fondart: Chilean Popular Art Exhibition',
          body: 'The association once again applied to the National Fondart, this time to fund the 40th Chilean Popular Art Exhibition, a project that was awarded and carried out in January 2026, cementing the Exhibition as a well-established event.',
        },
      ]),
      closingQuote:
        "Throughout its journey, the association has strengthened not only collective work but also the individual growth of each of its members. Today, Huellas de Nahuelbuta stands as a solid organization, deeply connected to its territory, committed to promoting art, craft, culture, and local production in the Nahuelbuta territory.",
    },
  })

  console.log('Traduciendo global: sobre-nosotros...')
  const sobreNosotrosEs = await payload.findGlobal({ slug: 'sobre-nosotros', locale: 'es' })
  await payload.updateGlobal({
    slug: 'sobre-nosotros',
    locale: 'en',
    data: {
      heroTitle: 'About Us',
      mision:
        'To strengthen, promote, and give value to the work of artisans and producers of the territory, championing craft, culture, and local knowledge as a fundamental part of the identity of the Nahuelbuta territory. Through collaborative work, the association drives spaces for community encounter through fairs, exhibitions, and cultural activities that showcase traditional trades, foster local economic development, and create opportunities for learning, exchange, and connection with the territory.',
      vision:
        'To be a leading association in southern Chile for its contribution to the cultural, artisanal, and productive development of the Nahuelbuta territory, standing out for the quality of its creations, the organization of community gathering spaces, and the promotion of local heritage. The association seeks to position itself as an active force in preserving and promoting traditional trades, strengthening the work of its members and contributing to the sustainable development of the community and the territory.',
      valores: withIds(sobreNosotrosEs.valores ?? [], [
        {
          icon: '✸',
          title: 'Territorial Identity',
          body: 'We deeply value the Nahuelbuta territory and its cultural, natural, and human richness. Our work seeks to reflect local identity, rescuing the knowledge, traditions, and products of the Province of Malleco.',
        },
        {
          icon: '༜',
          title: 'Collaborative Work',
          body: 'We believe in the strength of community work. The association is built on cooperation, respect, and mutual support among artisans and producers, strengthening both collective growth and the individual development of each member.',
        },
        {
          icon: '◉',
          title: 'Rescuing and Passing On Trades',
          body: 'We promote the preservation of artisanal trades and traditional knowledge, sharing know-how with the community and new generations to keep local culture alive.',
        },
        {
          icon: '✔︎',
          title: 'Quality and Authenticity',
          body: 'We are committed to excellence in crafting our pieces and products, prioritizing careful processes, noble materials, and the authenticity of each creation.',
        },
        {
          icon: '☄︎',
          title: 'Community Engagement',
          body: 'Our work seeks to create open spaces for cultural encounter, where the community can get to know, value, and connect with local craft, art, and production.',
        },
        {
          icon: '𖠁',
          title: 'Respect for Nature',
          body: "We recognize the importance of Nahuelbuta's natural surroundings and promote responsible practices that value the territory's resources and biodiversity.",
        },
      ]),
    },
  })

  console.log('Traduciendo global: contacto...')
  await payload.updateGlobal({
    slug: 'contacto',
    locale: 'en',
    data: {
      heroTitle: 'Contact',
      intro: 'Want to know more about our work, join a fair, or propose a collaboration? Write to us.',
    },
  })

  console.log('--- Traducción completa ---')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
