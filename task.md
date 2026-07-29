# 📋 Scrum Board: Catálogo Digital Brotes de Chile 2026

## 🎯 Sprint 1 Goal
Tener el catálogo funcional, conectado a la base de datos (con los 40 artesanos cargados) y con el diseño premium aplicado para revisión inicial.

## 🟢 Done (Completado)
- [x] Inicializar proyecto Next.js (TypeScript, Tailwind, App Router)
- [x] Configurar Prisma y PostgreSQL (docker-compose)
- [x] Diseñar esquema de base de datos (Artesanos, Obras, Categorías)
- [x] Configurar variables de entorno (.env creado)
- [x] Extraer datos de los 40 artesanos del HTML original
- [x] Crear script de Seed para la base de datos
- [x] Configurar Sistema de Diseño (Colores tierra, Tipografía Serif en globals.css)
- [x] Implementar componente cliente del Catálogo (Filtros, Búsqueda, Grid)
- [x] Implementar API Routes para Artesanos y Categorías
- [x] Configurar ts-node para ejecutar scripts (migrado a `tsx`)
- [x] Extraer assets del CATÁLOGO ARTESANOS 2026.pdf (385 imágenes + 52 páginas renderizadas + 44 links)
- [x] Levantar entorno Docker y Postgres local
- [x] Instalar dependencias e iniciar servidor de desarrollo (`npm run dev`)
- [x] Identificar patrón de mapeo Imagen/Página (Artesano i -> Página i+10)
- [x] Unificación de diseño Editorial Premium en todo el sitio.
- [x] Eliminación de `styled-jsx` y migración total a `globals.css` (Cero errores de hidratación).
- [x] Auditoría completa de datos de artesanos (Nombres, Oficios, Ubicaciones) vs PDF.
- [x] Sincronización automática de retratos desde activos del PDF a perfiles individuales.
- [x] Validación de 40 perfiles de artesanos (Páginas 10-49 del PDF).
- [x] Build de producción exitosa y verificación visual de responsividad.
- [x] Páginas de detalle individual de Artesano con SEO/OpenGraph dinámico (`/artesano/[id]`).
- [x] Animaciones de entrada con Framer Motion en el Grid (stagger + variants).
- [x] Validación de datos con Zod en `/api/artisans` (`src/lib/validations.ts`).
- [x] Recuperar y recortar manualmente los retratos de los 2 artesanos sin imagen fuente en `pdf-assets` (Juan Carlos Lizana p10, María Robles p49), usando el render de página completa.
- [x] Extraer el texto real del PDF con `pdftotext` y las anotaciones de enlace con `pypdf` para obtener el contacto (Instagram/teléfono/email) verdadero de cada uno de los 40 artesanos — cargado en el campo `instagram` del seed.
- [x] Restaurar categorías reales (7 categorías: Orfebrería y Joyería, Trabajo en Madera, Cuero y Marroquinería, Textil y Tejidos, Greda y Cerámica, Mimbre, Otros Oficios) — antes el seed solo creaba una categoría `"general"` y el color-coding por oficio en `catalog-client.tsx` no funcionaba.
- [x] Scrapear huellasdenahuelbuta.cl (historia, misión/visión, listado de artesanos/productores) para complementar el contexto institucional.

## 🟡 In Progress (En Progreso)

## 🔵 To Do (Sprint Backlog - Próximos pasos)
- [ ] Decidir si se reemplazan las bios cortas y genéricas del seed por las bios reales y extensas escritas para el catálogo (ya transcritas desde el PDF, ver nota abajo) — es contenido de mucha mejor calidad pero son ~40 párrafos largos.
- [ ] Conseguir contacto para los 2 artesanos sin Instagram/teléfono impreso en su página: Víctor Gutiérrez (p23) y Pedro Navarrete (p47, solo aparece el nombre del emprendimiento "Materia doña pepita").
- [ ] Evaluar si se agrega una sección "Nuestra Historia" / "Sobre la Agrupación" al sitio con el contenido institucional de Huellas de Nahuelbuta (ver más abajo).

## 🟣 Backlog (Portfolio Senior & DevOps)
- [ ] Configurar GitHub Actions (CI/CD)
- [ ] Implementar Dockerfile para la aplicación Next.js
- [ ] Agregar documentación de API (Swagger/Scalar)
- [ ] Implementar Logging (Pino/Winston)
- [ ] SEO audit (Lighthouse > 90)
- [ ] Despliegue final a producción — el deadline original de este backlog decía "12 Mayo" (2026), que ya pasó a la fecha de hoy (29 jul 2026). Confirmar con el usuario si esto se cumplió o si hay que fijar una fecha nueva.

---

## ⚠️ Nota importante: los enlaces del PDF (tabla original de abajo) NO son confiables

La tabla "Links extraídos (44 total)" de más abajo viene de las anotaciones de hipervínculo embebidas en el PDF (extraídas automáticamente). Al cruzarla con el texto impreso real de cada página, se confirmó que **no corresponde al Instagram de cada artesano** — es un botón/plantilla reutilizada en el diseño que quedó apuntando al mismo enlace en varias páginas (ej. `elmundodemussa` aparece en 9 páginas de artesanos distintos; `grabadoslinares` en 5). El Instagram/teléfono real de cada persona es el que aparece impreso como texto vertical en su propia página, y así es como se cargó en `prisma/seed.ts` (ver artesanos arriba).

## 🏛️ Contexto institucional (de huellasdenahuelbuta.cl y del PDF)

- **Organización:** Agrupación ASAC Huellas de Nahuelbuta — nace en el otoño de 2021 (post-pandemia), se formaliza en enero de 2022 con 15 artesanos/productores fundadores. Colabora con la Municipalidad de Angol.
- **Hitos:** feria inaugural feb-2022 · primera Expo Destino (~80 participantes) dic-2022 · proyecto FNDR 2024 (carpas 6x12m) · proyecto FONDES + Jardín Identitario 2025 · Fondart Nacional 2026 para la **40ª Muestra de Arte Popular Chileno "Brotes de Chile"** (el festival en sí existe desde 1984).
- **Roles clave del catálogo 2026:** Mariana Rojas Román (@sietecolorescreaciones, también artesana #37) = Productora General. María Elisa Robles Rivas (@rustica_telares_nahuelbuta, también artesana #40 "María Robles") = Productora Ejecutiva.
- **Contacto agrupación:** agrupacion.huellasdenahuelbuta@gmail.com · IG/FB @agrupacion_huellasdenahuelbuta.
- El sitio web tiene además una sección `/artesanos/` con **otros** productores locales (papelería, sal gourmet, apicultura, viveros, gastronomía, macramé, etc.) que **no** son parte de los 40 del catálogo PDF "Brotes de Chile 2026" — son parte de la agrupación más amplia. No se han incorporado a la BD; evaluar si tiene sentido como sección aparte.

---

## 📦 Assets Extraídos del PDF

**Fuente:** `CATÁLOGO ARTESANOS 2026.pdf` (171MB, 52 páginas)
**Destino:** `public/pdf-assets/`

### Estructura del PDF
| Páginas | Contenido |
|---------|-----------|
| 1–8 | Portada, índice, galería de recuerdos, historia de Huellas de Nahuelbuta |
| 9–49 | Catálogo artesanos (doble página por artesano) |
| 50 | Agradecimientos + logos de patrocinadores |
| 51–52 | Créditos / cierre |

### Archivos generados
| Carpeta | Contenido | Cantidad |
|---------|-----------|----------|
| `public/pdf-assets/pages/` | Páginas completas renderizadas a JPG (2x, ~150dpi) | 52 |
| `public/pdf-assets/images/` | Imágenes embebidas extraídas (`pXX_imgYY.jpg/png`) | 385 |
| `public/pdf-assets/index.json` | Índice completo: links e imágenes por página | 1 |

### Links extraídos (44 total) — ⚠️ ver nota de confiabilidad arriba, no usar para poblar contactos
Todos son Instagram de artesanos. Los correctos son:

| Instagram URL | Página PDF |
|---------------|-----------|
| instagram.com/grabadoslinares | p10, p24, p25, p39, p42 |
| instagram.com/elmundodemussa | p11, p14, p20, p28, p30, p34, p35, p37, p38 |
| instagram.com/caladosvergara | p12 |
| instagram.com/chupallas_de_trigo | p12, p17 |
| instagram.com/queltehue__ | p15 |
| instagram.com/topacio.taller | p16 |
| instagram.com/joyasnaynay | p18, p46 |
| instagram.com/n3olitico | p19, p26 |
| instagram.com/grabadosenvidrio | p21 |
| instagram.com/jorge_artesanoencuero | p22 |
| instagram.com/rastadecobre | p23, p36, p47 |
| instagram.com/kulungu.crafts | p27 |
| instagram.com/rusti2628 | p29 |
| instagram.com/asunarte__ | p31 |
| instagram.com/artetextil.angol | p32, p33 |
| instagram.com/ondejulio_gredasquillon | p40 |
| instagram.com/newen.fuerzayenergia | p41 |
| instagram.com/turriart | p43 |
| instagram.com/licanrayenab | p44, p48 |
| instagram.com/pamelagacitua_artemadera | p45, p49 |
| sellofronterasur.com/melimapu | p50 |
| instagram.com/sietecolorescreaciones | p50 |
| instagram.com/rustica_telares_nahuelbuta | p50 |
| instagram.com/claudiovisual_ | p51 |

### Próximo paso con imágenes
Las imágenes están nombradas por página (`p09_img01.jpg`, etc.). Para usarlas en el catálogo:
1. Abrir `public/pdf-assets/pages/page_09.jpg` → `page_49.jpg` para identificar manualmente qué artesano es cada doble página
2. Copiar la foto principal de cada artesano a `public/artesanos/<slug>.jpg`
3. Actualizar el seed o crear una migración para guardar el campo `image` en la BD

**Estado:** completo para 38/40 artesanos vía copia automática desde `pdf-assets/images/`. Los 2 restantes (Juan Carlos Lizana, María Robles) no tenían imagen embebida extraída — se recortaron manualmente desde `pdf-assets/pages/page_10.jpg` y `page_49.jpg` con `sharp` y ya están en `public/artesanos/`.
