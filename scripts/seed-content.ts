import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

// Contenido institucional migrado desde huellasdenahuelbuta.cl (ver scripts/huellas_scrape.json)
// hacia los globals de Payload. Solo español por ahora — inglés se completa desde el admin,
// apoyado en `fallback: true` mientras tanto.

async function main() {
  const payload = await getPayload({ config })

  console.log('Actualizando global: home-hero...')
  await payload.updateGlobal({
    slug: 'home-hero',
    locale: 'es',
    data: {
      tag: 'Muestra de Arte Popular Chileno · 40ª Versión',
      titlePrefix: 'Brotes de',
      titleEmphasis: 'Chile',
      subtitle:
        'Un territorio vivo donde habitan las manos, la memoria y la identidad de un país tejido desde sus raíces.',
      stats: [
        { value: '40', label: 'Artesanos' },
        { value: '1984', label: 'Origen' },
        { value: 'Angol', label: 'Territorio' },
      ],
      memoriasTag: 'Legado Cultural',
      memoriasTitle: 'Memorias de la muestra',
      memoriasLead:
        'Desde su origen en 1984, la Muestra de Arte Popular ha sido un territorio vivo donde habitan las manos y la memoria de Chile.',
      memoriasParagraphs: [
        {
          text: 'En su versión número 40, la muestra vuelve a posicionarse como un espacio de sentido: caminarlo es encontrarse con miradas que saben, manos que narran sin palabras, materiales que conservan el pulso de la tierra.',
        },
        {
          text: 'Hoy el asombro regresa. La cantidad cede ante la calidad; la inmediatez, ante el tiempo paciente de la creación. Porque la artesanía no sobrevive por inercia, sino por cuidado.',
        },
      ],
    },
  })

  console.log('Actualizando global: historia...')
  await payload.updateGlobal({
    slug: 'historia',
    locale: 'es',
    data: {
      heroTitle: 'Nuestra Historia',
      heroIntro: 'El camino de la Agrupación Huellas de Nahuelbuta, contado en sus propios hitos.',
      timeline: [
        {
          date: 'Otoño, 2021',
          title: 'Inicio',
          body: 'La Agrupación Huellas de Nahuelbuta nace en el otoño del año 2021, en un contexto marcado por los desafíos del periodo post pandemia. En ese momento, un grupo de artesanas y productores del territorio comenzó a reflexionar sobre la necesidad de generar mejores espacios para exhibir y comercializar su trabajo, así como fortalecer la representación del oficio artesanal y productivo local.',
        },
        {
          date: 'Otoño, 2021',
          title: 'Coordinación',
          body: 'De esta inquietud surgió la idea de formar una organización que permitiera trabajar de manera colaborativa y comunitaria, generando una plataforma que respaldara el trabajo de sus integrantes y que, al mismo tiempo, permitiera presentar propuestas y solicitudes de forma organizada.',
        },
        {
          date: 'Enero, 2022',
          title: 'Formalización',
          body: 'Fue así como, tras diversas reuniones y convocatorias, en enero del año 2022 se conformó oficialmente la Agrupación Huellas de Nahuelbuta, integrada inicialmente por 15 artesanos y productores del territorio. Entre sus miembros se encontraban cultores de diversos oficios y áreas productivas, como artesanía en lana, tejidos tradicionales, macramé, vitrofusión, trabajo en madera, talabartería y orfebrería, además de productores de agro elaborados, apicultores y elaboradores de productos tradicionales como el café de trigo.',
        },
        {
          date: '2022',
          title: 'Producción',
          body: 'Durante el año 2022, la agrupación comenzó a desarrollar un calendario de actividades coordinado con el municipio, realizando ferias temáticas mensuales en la Plaza de Armas de Angol, integrando música en vivo. En febrero de 2022 se realizó la feria inaugural de la agrupación, marcando el inicio de un trabajo constante de difusión y fortalecimiento del arte y la producción local.',
        },
        {
          date: 'Diciembre, 2022',
          title: 'Referente local',
          body: 'A finales de ese mismo año se realizó la primera Expo Destino Huellas de Nahuelbuta, con apoyo del Departamento de Turismo y la Municipalidad de Angol, reuniendo a alrededor de 80 artesanas, artesanos y productores de la Provincia de Malleco, de comunas como Angol, Los Sauces, Lumaco, Purén y Traiguén.',
        },
        {
          date: '2023',
          title: 'Continuidad',
          body: 'La agrupación continuó fortaleciendo su trabajo mensual, ampliando el enfoque de sus actividades y compartiendo conocimientos y oficios con la comunidad. En diciembre de 2023 se realizó la segunda versión de la Expo Destino Huellas de Nahuelbuta, esta vez con el apoyo de la Universidad Autónoma de Temuco, consolidando el evento como una importante vitrina para el destino Nahuelbuta.',
        },
        {
          date: '2024',
          title: '1er proyecto adjudicado',
          body: 'El año 2024 marcó una etapa de mayor consolidación. La agrupación se adjudicó un proyecto FNDR del Gobierno Regional, "Vinculando el arte y la cultura con la comunidad de Angol y sus habitantes", que permitió adquirir dos carpas de gran formato (6 x 12 metros) para realizar actividades durante todo el año.',
        },
        {
          date: '2024',
          title: 'Aprendizaje',
          body: 'También en 2024 la agrupación postuló por primera vez a un Fondart Regional en la 39ª Muestra de Arte Popular Chileno. El proyecto no fue adjudicado, pero la retroalimentación permitió mejorar la propuesta. Por la remodelación del parque no fue posible realizar ese año la tercera Expo Destino.',
        },
        {
          date: '2025',
          title: '2do proyecto adjudicado',
          body: 'Se adjudicó un proyecto FONDES que permitió comprar toldos y mobiliario para cada artesano y productor. Además, con trabajo conjunto de sus integrantes, se desarrolló el Jardín Identitario de Nahuelbuta, frente a la Delegación Provincial de Malleco, con plantación de árboles y especies nativas.',
        },
        {
          date: '2026',
          title: 'Fondart nacional: Muestra de arte popular chileno',
          body: 'La agrupación volvió a postular al Fondart Nacional, esta vez para financiar la 40ª Muestra de Arte Popular Chileno, proyecto que fue adjudicado y ejecutado en enero de 2026, posicionando la Muestra como un evento consagrado.',
        },
      ],
      closingQuote:
        'A lo largo de su trayectoria, la agrupación ha logrado fortalecer no solo el trabajo colectivo, sino también el desarrollo individual de cada uno de sus integrantes. Hoy, Huellas de Nahuelbuta se proyecta como una organización sólida, profundamente vinculada con el territorio, comprometida con la difusión del arte, la artesanía, la cultura y la producción local del territorio Nahuelbuta.',
    },
  })

  console.log('Actualizando global: sobre-nosotros...')
  await payload.updateGlobal({
    slug: 'sobre-nosotros',
    locale: 'es',
    data: {
      heroTitle: 'Sobre Nosotros',
      mision:
        'Fortalecer, difundir y poner en valor el trabajo de artesanos y productores del territorio, promoviendo la artesanía, la cultura y los saberes locales como parte fundamental de la identidad del territorio Nahuelbuta. A través del trabajo colaborativo, la organización impulsa espacios de encuentro con la comunidad mediante ferias, exposiciones y actividades culturales que permiten visibilizar los oficios tradicionales, fomentar el desarrollo económico local y generar instancias de aprendizaje, intercambio y vínculo con el territorio.',
      vision:
        'Ser una agrupación referente en el sur de Chile por su aporte al desarrollo cultural, artesanal y productivo del territorio Nahuelbuta, destacándose por la calidad de sus creaciones, la organización de espacios de encuentro comunitario y la promoción del patrimonio local. La agrupación busca proyectarse como un actor activo en la preservación y difusión de los oficios tradicionales, fortaleciendo el trabajo de sus integrantes y contribuyendo al desarrollo sustentable de la comunidad y del territorio.',
      valores: [
        {
          icon: '✸',
          title: 'Identidad territorial',
          body: 'Valoramos profundamente el territorio de Nahuelbuta y su riqueza cultural, natural y humana. Nuestro trabajo busca reflejar la identidad local, rescatando saberes, tradiciones y productos propios de la provincia de Malleco.',
        },
        {
          icon: '༜',
          title: 'Trabajo colaborativo',
          body: 'Creemos en la fuerza del trabajo comunitario. La agrupación se construye a partir de la cooperación, el respeto y el apoyo mutuo entre artesanos y productores, fortaleciendo tanto el crecimiento colectivo como el desarrollo individual de cada integrante.',
        },
        {
          icon: '◉',
          title: 'Rescate y transmisión de oficios',
          body: 'Promovemos la preservación de los oficios artesanales y los conocimientos tradicionales, compartiendo saberes con la comunidad y las nuevas generaciones para mantener viva la cultura local.',
        },
        {
          icon: '✔︎',
          title: 'Calidad y autenticidad',
          body: 'Nos comprometemos con la excelencia en la elaboración de nuestras piezas y productos, priorizando procesos cuidadosos, materiales nobles y la autenticidad de cada creación.',
        },
        {
          icon: '☄︎',
          title: 'Vinculación con la comunidad',
          body: 'Nuestro trabajo busca generar espacios abiertos de encuentro cultural, donde la comunidad pueda conocer, valorar y conectarse con la artesanía, el arte y la producción local.',
        },
        {
          icon: '𖠁',
          title: 'Respeto por la naturaleza',
          body: 'Reconocemos la importancia del entorno natural de Nahuelbuta y promovemos prácticas responsables que valoren los recursos del territorio y su biodiversidad.',
        },
      ],
    },
  })

  console.log('Actualizando global: contacto...')
  await payload.updateGlobal({
    slug: 'contacto',
    locale: 'es',
    data: {
      heroTitle: 'Contacto',
      intro:
        '¿Quieres saber más de nuestro trabajo, sumarte a una feria o proponer una colaboración? Escríbenos.',
      email: 'agrupacion.huellasdenahuelbuta@gmail.com',
      address: 'Angol, Malleco, Chile',
      instagramUrl: 'https://www.instagram.com/agrupacion_huellasdenahuelbuta/',
      facebookUrl: 'https://www.facebook.com/profile.php?id=100083646092733',
      orgName: 'Agrupación ASAC Huellas de Nahuelbuta',
    },
  })

  console.log('--- Contenido institucional cargado ---')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
