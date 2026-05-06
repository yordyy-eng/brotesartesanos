import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { id: 'orfebr', name: 'Orfebrería' },
  { id: 'madera', name: 'Madera' },
  { id: 'cuero', name: 'Cuero' },
  { id: 'textil', name: 'Textil' },
  { id: 'greda', name: 'Greda' },
  { id: 'mimbre', name: 'Mimbre' },
  { id: 'otros', name: 'Otros oficios' },
]

const artisans = [
  { name: 'Juan Carlos Lizana', craft: 'Joyas de Plata', bio: 'Lleva 38 años en la orfebrería. Trabaja con metales nobles y piedras semipreciosas como el lapislázuli de Ovalle, formando a numerosos jóvenes en el oficio.', location: 'La Pintana', categoryId: 'orfebr', instagram: 'juanc.lizana', initials: 'JL' },
  { name: 'Claudina Torres', craft: 'Accesorios y artículos en cuero', bio: 'Trabaja con cuero de sus propios animales, principalmente chivo, desde su origen en Catemu. Un vínculo profundo y respetuoso con la materia prima y el territorio.', location: 'Catemu', categoryId: 'cuero', phone: '+56997370836', initials: 'CT' },
  { name: 'Roberto Vergara', craft: 'Artesanía en madera · Calado', bio: 'Más de 35 años en el calado en madera. Usa maderas nativas como laurel, mañío y coigüe — muchas de manejo sustentable o recicladas — para crear figuras de fauna nativa y casas para aves.', location: 'Hualpén', categoryId: 'madera', instagram: 'caladosvergara', initials: 'RV' },
  { name: 'Cristóbal Morales', craft: 'Marroquinería', bio: 'Más de 10 años en Cañete construyendo marroquinería con identidad propia. Piezas en series limitadas con estética rústica, terminaciones cuidadas y nobleza del material.', location: 'Cañete', categoryId: 'cuero', instagram: 'cristobal_marroquinero', initials: 'CM' },
  { name: 'Ana María Castro', craft: 'Artesanía en greda', bio: 'Greda de color natural, algunas piezas ahumadas para tonos oscuros. Incorpora una línea pintada con técnica de acrílico sobre greda, heredada de Pomaire. Diseños únicos y pintado completamente a mano.', location: 'Antuco', categoryId: 'greda', phone: '+56985198535', initials: 'AC' },
  { name: 'Aladino Cid', craft: 'Tejido en telar', bio: 'Cultiva el tejido tradicional en telar completamente hecho a mano, sin maquinaria. Trabaja con alpaca 60/40 elaborando ponchos y mantas con las marcas auténticas del tejedor.', location: 'La Ligua', categoryId: 'textil', email: 'manosrusticas80@gmail.com', initials: 'AC' },
  { name: 'Nicolás García', craft: 'Orfebre · Piedras naturales', bio: 'Con 27 años, uno de los más jóvenes expositores. Trabaja plata 950, funde y lamina en su taller. Usa ópalo de fuego mexicano y lapislázuli. Demuestra su proceso en vivo durante la feria.', location: 'Angol', categoryId: 'orfebr', instagram: 'topacio.taller', initials: 'NG' },
  { name: 'Pablo Gutiérrez', craft: 'Sombrerería tradicional', bio: '37 años de participación continua en Angol. Tradición familiar de cinco generaciones y ~200 años de historia. Usa tintes naturales como maqui, eucalipto y raulí. Premiado por su trayectoria en la versión 40.', location: 'Chillán', categoryId: 'otros', instagram: 'chupallas_de_trigo', initials: 'PG' },
  { name: 'Pamela Vidal', craft: 'Joyas Nay Nay · Cobre y bronce', bio: 'Trabaja principalmente con cobre, cautivada por sus pátinas. Inspiración ancestral y en la flora y fauna de Chile. Elegida Reina de la Muestra versión 40. Dicta clases presenciales de orfebrería en Rancagua.', location: 'Rancagua', categoryId: 'orfebr', instagram: 'joyasnaynay', initials: 'PV' },
  { name: 'Nabor Agurto', craft: 'Escultura en piedra', bio: 'Crea morteros y esculturas en un proceso autodidacta premiado a nivel regional y nacional. También crea flautas líticas talladas en piedra. Para él, la piedra guía y "habla": la forma se descubre, no se impone.', location: 'Angol', categoryId: 'otros', instagram: 'n3olitico', initials: 'NA' },
  { name: 'Héctor Carrillo', craft: 'Decoración en madera', bio: 'Cinco años en la artesanía constante. Desarrolla torneado, marquesas y tallado. Actualmente crea réplicas de los Viaductos del Malleco como rescate identitario de Collipulli.', location: 'Collipulli', categoryId: 'madera', phone: '+56976572453', initials: 'HC' },
  { name: 'María Teresa Véliz', craft: 'Grabados en vidrio', bio: 'Oficio poco conocido que desarrolla a mano alzada con puntas de diamante. Graba vasos, copas y cuadros con nombres, textos e imágenes. El vidrio resiste incluso espacios exteriores.', location: 'Linares', categoryId: 'otros', instagram: 'grabadosenvidrio', initials: 'MV' },
  { name: 'Jorge Cisterna', craft: 'Artesanía en cuero', bio: 'Oriundo de Angol con trayectoria en muestras nacionales, incluyendo Secretos de la Araucanía en el Palacio de La Moneda. Cinturones, billeteras, porta cortaplumas y mates. También realiza reparaciones en feria.', location: 'Angol', categoryId: 'cuero', instagram: 'jorge_artesanoencuero', initials: 'JC' },
  { name: 'Victor Gutiérrez', craft: 'Orfebrería · Plata y piedras', bio: 'Desde La Serena trabaja con engarces en plata, cincelado y piezas matrizadas, creando anillos, colgantes, pulseras y cadenas. También realiza arreglos y reparaciones de joyas.', location: 'La Serena', categoryId: 'orfebr', initials: 'VG' },
  { name: 'Nelson Salazar', craft: 'Cueros Savel', bio: 'Desde 2005 en la artesanía, dedicado exclusivamente desde 2018. Cinturones, billeteras, carteras y mochilas en cuero natural. Participante en ferias como la Chilenidad en Chillán y la Trilla de Ninhue.', location: 'Tucapel', categoryId: 'cuero', instagram: 'cueros.savel', initials: 'NS' },
  { name: 'Carlos Becerra', craft: 'Platería · Bombillas de mate', bio: 'Aprendió orfebrería en La Plata, Argentina. Tras 40 años viviendo allá, regresa y trabaja en Angol. Sus bombillas en plata alemana son únicas, duran toda la vida y no se oxidan.', location: 'Angol', categoryId: 'orfebr', instagram: 'carlitos_arteydiseno', initials: 'CB' },
  { name: 'Ana Pinto', craft: 'Tejido a dedo · Sin palillos', bio: 'Teje sin palillos: solo sus manos son su herramienta. Descubrió la técnica al olvidar sus palillos en un viaje. Crochet y telar también ejecutados con manos y cuatro dedos. Artesana certificada.', location: 'Concepción', categoryId: 'textil', instagram: 'dedosmagicos.ccp', initials: 'AP' },
  { name: 'Mauricio Borgoño', craft: 'Kulungu · Intarsia', bio: 'Emprendimiento Kulungu de Pelluhue. Técnica de intarsia: madera cortada, ensamblada y quemada para lograr sombras y volúmenes. Aves, mascotas y fauna nativa con relieve y textura únicos.', location: 'Pelluhue', categoryId: 'madera', instagram: 'kulungu.crafts', initials: 'MB' },
  { name: 'Julio Rojas', craft: 'Utensilios de madera', bio: 'Más de 10 años creando utensilios de cocina: cucharas, usleros y objetos funcionales. Incorporó juguetes de madera inspirado por su hijo. Lo que comenzó como hobby se convirtió en su camino.', location: 'Angol', categoryId: 'madera', phone: '+56985388764', initials: 'JR' },
  { name: 'Isabel Alarcón', craft: 'Cuadros en madera teñida', bio: 'Técnica única llamada "madera teñida" — de los únicos en Chile que la trabajan. Su textura se confunde con cuero, pero es madera 100% artesanal. Exporta a Francia, España, Suecia y Argentina.', location: 'Villarrica', categoryId: 'madera', instagram: 'rusti2628', initials: 'IA' },
  { name: 'Manuel Díaz', craft: 'Artesanía en mimbre', bio: 'Más de 55 años dedicados al mimbre desde Chimbarongo, cuna del mimbre en Chile. Empezó a los 12 años. Ha transmitido el oficio a sus hijos, formando un verdadero taller familiar vivo.', location: 'Chimbarongo', categoryId: 'mimbre', phone: '+56996673103', initials: 'MD' },
  { name: 'María Arriagada', craft: 'Asunarte · Corioplastia', bio: 'Comenzó en 2010 en un taller de repujado. Junto a su esposo formaron Asunarte. Capacitados en Chile y Argentina en labrado, repujado y modelado. Reconocidos en el Registro Nacional de Artesanos.', location: 'Pudahuel', categoryId: 'cuero', instagram: 'asunarte_', initials: 'MA' },
  { name: 'Jazna Viveros', craft: 'Arte Textil · Frivolité', bio: 'Proyecto familiar de tres hermanas unidas por el textil. Telar, macramé, palillo y crochet, destacando el frivolité — delicado y poco difundido — como saber que no quieren ver perdido.', location: 'Angol', categoryId: 'textil', instagram: 'artetextil.angol', initials: 'JV' },
  { name: 'Florisondo Martínez', craft: 'Orfebre · Cobre, plata y bronce', bio: 'Nacido en Angol en 1954 y formado recorriendo Perú, Bolivia y Brasil. Más de 4 décadas de oficio. Trabaja cobre, alpaca, plata, oro y bronce, integrando cueros y materiales reutilizados.', location: 'Gultro', categoryId: 'orfebr', instagram: 'petra_bc', initials: 'FM' },
  { name: 'Luis Navarrete', craft: 'Marroquinería', bio: '25 años viviendo del oficio de manera autodidacta. Elabora carteras, bolsos, morrales y billeteras. Ha participado en ferias de diversas regiones, compartiendo el oficio con artesanos de todo Chile.', location: 'Parral', categoryId: 'cuero', phone: '+56962135067', initials: 'LN' },
  { name: 'César Yañez', craft: 'Reutilización de madera · Raíces', bio: 'Rescata raíces enterradas o sumergidas y revela con formones las formas que ocultan. Cada pieza es un diálogo con la tierra. Una invitación a ver que lo perdido puede transformarse en obra con vida.', location: 'Angol', categoryId: 'madera', phone: '+56956835588', initials: 'CY' },
  { name: 'Nicolás Zumelzu', craft: 'Filigrana y alambrismo', bio: 'Bajo el seudónimo Rasta de Cobre, trabaja filigrana, cobre y piedras semipreciosas combinando técnicas de herrería — fuego, golpe y temple — con sello creativo personal. Cada pieza es única.', location: 'Estación Central', categoryId: 'orfebr', instagram: 'rastadecobre', initials: 'NZ' },
  { name: 'Angela Pinto', craft: 'Artesanía en greda', bio: 'Proveniente de Pomaire, cuna de la alfarería chilena. Comenzó a aprender en 2005 y desde 2010 recorre ferias del país. La artesanía es su principal fuente laboral y una práctica que realiza con orgullo.', location: 'Pomaire', categoryId: 'greda', phone: '+56937590117', initials: 'AP' },
  { name: 'Lionel Palma', craft: 'El Mundo de Mussa', bio: 'Más de 23 años en artesanía. Desarrolló su propia técnica de inciensos artesanales con maicena y aceites esenciales. Suma duendes, hongos y árboles modelados en porcelana fría y masilla epóxica.', location: 'San Felipe', categoryId: 'otros', instagram: 'elmundodemussa', initials: 'LP' },
  { name: 'Mauricio Calderón', craft: 'Artesanía en mimbre', bio: 'Nieto e hijo de mimbreros de Chimbarongo. Empezó a tejer a los 6 años, y a los 13 realizó su primer sillón "Jaquiman". Cerca de 52 años de experiencia. Desde 2017 vive y trabaja en Angol.', location: 'Angol', categoryId: 'mimbre', instagram: 'mimbres.calderon', initials: 'MC' },
  { name: 'Julio Sotelo', craft: 'Alfarería en greda', bio: 'Desde Quillón trabaja con greda de Pomaire. El proceso comienza con el amasado, luego el torno da forma a ollas, platos, vasos, tazas y servidos. El horneado sella el carácter definitivo de cada pieza.', location: 'Quillón', categoryId: 'greda', instagram: 'ondejulio_gredasquillon', initials: 'JS' },
  { name: 'Katherine Garrido', craft: 'Artesanía textil · Witral y pita', bio: 'Adquiere lana de vecinos, la tiñe con extractos naturales de la propia tierra y crea piezas witral en fieltro tramado. Incorporó cestería en pita, reintroduciendo esta fibra en la provincia de Malleco mediante cultivo propio.', location: 'Angol', categoryId: 'textil', instagram: 'newen.fuerzayenergia', initials: 'KG' },
  { name: 'Eleazar Silva', craft: 'Artesanía en cuero', bio: 'Heredó el oficio de su padre y lo ejerce por más de seis décadas, desde los 15 años. Trabaja exclusivamente cuero de primera calidad, 100% a mano. Participa en ferias desde 1981.', location: 'San Vicente de T.T.', categoryId: 'cuero', instagram: 'donde_el_joaquin', initials: 'ES' },
  { name: 'Sandra Alarcón', craft: 'Turriart · Cobre y pátina', bio: 'Orfebre de Santiago especializada en cobre con técnica de pátina: tonalidades turquesa y verdes que evocan la montaña. Colección inspirada en arte rupestre del norte con cóndor, Pachamama y llamas.', location: 'Santiago', categoryId: 'orfebr', instagram: 'turriart', initials: 'SA' },
  { name: 'Gustavo Acuña', craft: 'Artesanía en madera · Encastre', bio: 'Desde los 14 años con la madera. Reutiliza maderas de demoliciones y mueblerías. Crea puzzles tridimensionales por encastre y tallados en una sola pieza. Cada obra es memoria transformada en arte.', location: 'Concepción', categoryId: 'madera', instagram: 'licanrayenab', initials: 'GA' },
  { name: 'Pamela Gutiérrez', craft: 'Pintura decorativa y decoupage', bio: 'No trabaja con bosquejos previos: cada creación surge en el instante. Bandejas, cajas de té y joyeros con seda y servilletas mediante delicado empalme. Obras pensadas para embellecer la vida cotidiana.', location: 'Chillán', categoryId: 'otros', instagram: 'pamelagacitua_artemadera', initials: 'PG' },
  { name: 'Mariana Rojas', craft: 'Sietecolores Creaciones', bio: 'Joyas en plata y piedras naturales, todas a mano en su taller. Fundido, laminado, corte, calado, soldado y pulido. Técnica de hilado en plata envolviendo piedras. Inspiración en aves, araucarias y formas del paisaje.', location: 'Angol', categoryId: 'orfebr', instagram: 'sietecolorescreaciones', initials: 'MR' },
  { name: 'Pedro Navarrete', craft: 'Materia Doña Pepita', bio: 'Artesanía en cuero 100% a mano: materos, porta mates, tablas, bolsos y porta bombillas. Sello en colores vivos y combinaciones de costuras que forman patrones originales con identidad propia.', location: 'Parral', categoryId: 'cuero', instagram: 'materia_dona_pepita', initials: 'PN' },
  { name: 'Edio Anabalón', craft: 'Artesanía en madera tallada', bio: 'Creció en el campo aprendiendo junto a su hermano, su mayor maestro. Talla animales, cucharas y llaveros en madera rescatada de ríos y casas antiguas (roble, raulí, ciprés). Observa el trozo y descubre la forma que habita en él.', location: 'Yungay', categoryId: 'madera', instagram: 'yeyo.anabalon', initials: 'EA' },
  { name: 'María Robles', craft: 'Artesana textil · Lana de oveja', bio: 'Más de 15 años desarrollando integralmente el proceso de la lana: vellón, limpieza, escarmenado, hilado, teñido natural y creación en telar. Participante de más de 80 ferias. Para ella, ser artesana es vivir creando.', location: 'Angol', categoryId: 'textil', instagram: 'rustica_telares_nahuelbuta', initials: 'MR' },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Upsert categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: cat,
    })
    console.log(`  ✓ Category: ${cat.name}`)
  }

  // Upsert artisans
  for (const artisan of artisans) {
    const { instagram, phone, email, initials, ...rest } = artisan
    const contact = instagram
      ? `https://instagram.com/${instagram}`
      : phone || email || null

    await prisma.artisan.upsert({
      where: { name: artisan.name },
      update: { ...rest, instagram: contact },
      create: { ...rest, instagram: contact },
    })
    console.log(`  ✓ Artisan: ${artisan.name}`)
  }

  console.log(`\n✅ Seeded ${categories.length} categories and ${artisans.length} artisans.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
